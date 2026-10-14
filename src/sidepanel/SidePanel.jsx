import React, { useState, useEffect, useRef, useCallback } from 'react';
import { parseDocument } from '../parser/docParser.js';
import PasteArea from './components/PasteArea.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import SectionCard from './components/SectionCard.jsx';
import SessionSummary from './components/SessionSummary.jsx';
import Toast from './components/Toast.jsx';
import styles from './SidePanel.module.css';
import logo from '../asset/typebridge-all-white-logo.png';
import HowToUse from './components/HowToUse.jsx';

function sendToBackground(message) {
  chrome.runtime.sendMessage(message).catch(() => {});
}

function viewFor(sections) {
  if (sections.length === 0) return 'empty';
  return sections.some(s => s.status === 'pending') ? 'loaded' : 'complete';
}

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

export default function SidePanel() {
  const [sections, setSections] = useState([]);
  const [focusedSection, setFocusedSection] = useState(null);
  const [focusPreview, setFocusPreview] = useState('');
  const [toast, setToast] = useState(null);
  const [targetConnected, setTargetConnected] = useState(false);
  const [rawText, setRawText] = useState('');

  // Latest sections for use inside the long-lived message handler
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const sessionActive = useRef(false);

  // Chrome Message Listener (port to the background worker, reconnected if the worker restarts)
  useEffect(() => {
    let port = null;
    let closed = false;

    const handler = (message) => {
      if (message.type === 'FOCUS_DETECTED') {
        setTargetConnected(true);
        setFocusPreview(message.payload?.previewText || '');
        setFocusedSection(findBestMatch(message.payload?.previewText, sectionsRef.current));
      }

      if (message.type === 'APPLY_SUCCESS') {
        const { sectionId, part, appliedAt, originalText, targetSelector } = message.payload || {};
        const section = sectionsRef.current.find(s => s.id === sectionId);
        const headingOnly = part === 'heading' && section?.body;

        if (!headingOnly) {
          setSections(prev => prev.map(s => s.id === sectionId
            ? { ...s, status: 'applied', appliedAt, originalText, targetSelector }
            : s));
        }
        setFocusedSection(null);
        setToast({ id: Date.now(), message: headingOnly ? 'Heading applied!' : 'Applied successfully!', type: 'success' });
      }

      if (message.type === 'APPLY_ERROR') {
        setToast({ id: Date.now(), message: message.payload?.reason || 'Failed to apply text.', type: 'error' });
      }

      if (message.type === 'SESSION_RESTORE') {
        const restored = message.payload?.sections;
        // Only restore into an empty panel — never overwrite progress made in this panel
        if (restored?.length > 0 && sectionsRef.current.length === 0) {
          sessionActive.current = true;
          setSections(restored);
        }
      }
    };

    const connect = () => {
      port = chrome.runtime.connect({ name: 'sidepanel' });
      port.onMessage.addListener(handler);
      port.onDisconnect.addListener(() => {
        if (!closed) setTimeout(connect, 500);
      });
    };
    connect();

    return () => {
      closed = true;
      port?.disconnect();
    };
  }, []);

  // Keep the background's copy of the session in sync so it survives panel reloads
  useEffect(() => {
    if (sessionActive.current) {
      sendToBackground({ type: 'SESSION_UPDATE', payload: { sections } });
    }
  }, [sections]);

  // Handlers
  const handlePaste = (text) => {
    try {
      const parsed = parseDocument(text);
      if (parsed.length > 0) {
        sessionActive.current = true;
        setSections(parsed);
        setRawText(text);
        sendToBackground({ type: 'START_SESSION', payload: { sections: parsed } });
      } else {
        setToast({ id: Date.now(), message: 'No sections found in pasted text.', type: 'error' });
      }
    } catch (err) {
      setToast({ id: Date.now(), message: 'Failed to parse document.', type: 'error' });
    }
  };

  const handleApply = (sectionId, part = 'main') => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const newText = part === 'heading' ? section.heading : (section.body || section.heading);
    sendToBackground({ type: 'APPLY_COPY', payload: { sectionId, part, newText } });
  };

  const handleSkip = (sectionId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, status: 'skipped' } : s));
  };

  const handleRestore = (sectionId) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, status: 'pending' } : s));
  };

  const handleReset = () => {
    sessionActive.current = false;
    setSections([]);
    setRawText('');
    setFocusedSection(null);
    sendToBackground({ type: 'RESET_SESSION' });
  };

  const handleExport = () => {
    const log = { exportedAt: new Date().toISOString(), sections };
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typebridge-export.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleUpdateSection = (sectionId, newBody) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, body: newBody } : s));
  };

  const dismissToast = useCallback(() => setToast(null), []);

  const view = viewFor(sections); // 'empty' | 'loaded' | 'complete'
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
              <button className={styles.reconnectBtn} onClick={() => sendToBackground({ type: 'FORCE_INJECT' })}>
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
                  focusPreview={focusPreview}
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
          <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={dismissToast} />
        </div>
      )}
    </div>
  );
}
