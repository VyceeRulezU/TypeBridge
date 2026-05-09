import React, { useState, useEffect } from 'react';
import { parseDocument } from '../parser/docParser.js';
import PasteArea from './components/PasteArea.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import SectionCard from './components/SectionCard.jsx';
import SessionSummary from './components/SessionSummary.jsx';
import Toast from './components/Toast.jsx';
import styles from './SidePanel.module.css';
import logo from '../asset/typebridge-all-white-logo.png';
import HowToUse from './components/HowToUse.jsx';

export default function SidePanel() {
  const [sections, setSections] = useState([]);
  const [view, setView] = useState('empty'); // 'empty' | 'loaded' | 'complete'
  const [focusedSection, setFocusedSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [targetConnected, setTargetConnected] = useState(false);
  const [rawText, setRawText] = useState('');

  // Handle similarity matching for focus detection
  function findBestMatch(previewText, currentSections) {
    if (!previewText || !Array.isArray(currentSections)) return null;
    const previewWords = previewText.toLowerCase().split(/\s+/).filter(Boolean);
    if (previewWords.length === 0) return null;

    let bestMatch = null;
    let maxOverlap = 0;

    for (const sec of currentSections) {
      if (sec.status !== 'pending') continue;
      const targetText = (sec.heading + ' ' + (sec.body || '')).toLowerCase();
      const targetWords = targetText.split(/\s+/).filter(Boolean);
      let overlap = 0;
      for (const w of previewWords) {
        if (targetWords.includes(w)) overlap++;
      }
      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        bestMatch = sec.id;
      }
    }
    return maxOverlap >= 2 ? bestMatch : null;
  }

  // Chrome Message Listener
  useEffect(() => {
    const handler = (message) => {
      console.log('TypeBridge Panel: Received', message.type);
      
      if (message.type === 'FOCUS_DETECTED') {
        setTargetConnected(true);
        const matchedId = findBestMatch(message.payload?.previewText, sections);
        setFocusedSection(matchedId);
      }
      
      if (message.type === 'APPLY_SUCCESS') {
        setSections(prev => {
          const next = prev.map(s => s.id === message.payload?.sectionId ? { ...s, status: 'applied' } : s);
          if (next.length > 0 && next.every(s => s.status !== 'pending')) setView('complete');
          return next;
        });
        setToast({ message: 'Applied successfully!', type: 'success' });
      }

      if (message.type === 'APPLY_ERROR') {
        setToast({ message: message.payload?.reason || 'Failed to apply text.', type: 'error' });
      }

      if (message.type === 'SESSION_RESTORE') {
        if (message.payload?.sections?.length > 0) {
          setSections(message.payload.sections);
          setView('loaded');
        }
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    
    // Connect port for state persistence
    const port = chrome.runtime.connect({ name: 'sidepanel' });
    port.onMessage.addListener(handler);

    return () => {
      chrome.runtime.onMessage.removeListener(handler);
      port.disconnect();
    };
  }, [sections]);

  // Handlers
  const handlePaste = (text) => {
    try {
      const parsed = parseDocument(text);
      if (parsed.length > 0) {
        setSections(parsed);
        setView('loaded');
        setRawText(text);
        // Save to background session
        chrome.runtime.sendMessage({ type: 'START_SESSION', payload: { sections: parsed, rawText: text } });
      } else {
        setToast({ message: 'No sections found in pasted text.', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Failed to parse document.', type: 'error' });
    }
  };

  const handleApply = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      chrome.runtime.sendMessage({
        type: 'APPLY_COPY',
        payload: { sectionId, newText: section.body || section.heading }
      });
    }
  };

  const handleSkip = (sectionId) => {
    setSections(prev => {
      const next = prev.map(s => s.id === sectionId ? { ...s, status: 'skipped' } : s);
      if (next.every(s => s.status !== 'pending')) setView('complete');
      return next;
    });
  };

  const handleRestore = (sectionId) => {
    setSections(prev => {
      const next = prev.map(s => s.id === sectionId ? { ...s, status: 'pending' } : s);
      if (view === 'complete' && next.some(s => s.status === 'pending')) setView('loaded');
      return next;
    });
  };

  const handleReset = () => {
    setSections([]);
    setView('empty');
    setRawText('');
    chrome.runtime.sendMessage({ type: 'RESET_SESSION' });
  };

  const handleExport = () => {
    const log = { exportedAt: new Date().toISOString(), sections };
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typebridge-export.json`;
    a.click();
  };

  const handleUpdateSection = (sectionId, newBody) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, body: newBody } : s));
  };

  const appliedCount = sections.filter(s => s.status === 'applied').length;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <img src={logo} alt="Typebridge" className={styles.logoImg} />
        </div>
        {sections.length > 0 && (
          <button className={styles.resetBtn} onClick={handleReset} title="Start Over">↺</button>
        )}
      </header>

      {view === 'loaded' && sections.length > 0 && (
        <div className={`${styles.targetStatus} ${targetConnected ? styles.connected : styles.disconnected}`}>
          {targetConnected ? 'Target Connected' : (
            <div className={styles.reconnectWrapper}>
              <span>No Element Selected</span>
              <button className={styles.reconnectBtn} onClick={() => chrome.runtime.sendMessage({ type: 'FORCE_INJECT' })}>
                Force Reconnect
              </button>
            </div>
          )}
        </div>
      )}

      <div className={styles.body}>
        {view === 'empty' && (
          <>
            <HowToUse />
            <PasteArea onPaste={handlePaste} initialText={rawText} />
          </>
        )}
        
        {view === 'loaded' && (
          <>
            <ProgressBar current={appliedCount} total={sections.length} />
            <div className={styles.cardList}>
              {sections.map(sec => (
                <SectionCard 
                  key={sec.id}
                  section={sec}
                  isFocused={focusedSection === sec.id}
                  onApply={handleApply}
                  onSkip={handleSkip}
                  onRestore={handleRestore}
                  onUpdateSection={handleUpdateSection}
                />
              ))}
            </div>
          </>
        )}

        {view === 'complete' && (
          <SessionSummary sections={sections} onExport={handleExport} onReset={handleReset} />
        )}
      </div>

      {toast && (
        <div className={styles.toastWrap}>
          <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
