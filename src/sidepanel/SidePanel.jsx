import React, { useState, useEffect } from 'react';
import { parseDocument } from '../parser/docParser.js';
import PasteArea from './components/PasteArea.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import SectionCard from './components/SectionCard.jsx';
import SessionSummary from './components/SessionSummary.jsx';
import Toast from './components/Toast.jsx';
import styles from './SidePanel.module.css';

export default function SidePanel() {
  const [sections, setSections] = useState([]);
  const [view, setView] = useState('empty'); // 'empty' | 'loaded' | 'complete'
  const [focusedSection, setFocusedSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [theme, setTheme] = useState('light');

  // Load session from storage on mount
  useEffect(() => {
    chrome.storage.local.get('theme', (data) => {
      const storedTheme = data.theme || 'light';
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    });

    chrome.storage.session.get('sessionData', (data) => {
      if (data.sessionData && data.sessionData.sections) {
        setSections(data.sessionData.sections);
        setSessionStartedAt(data.sessionData.sessionStartedAt);
        const allDone = data.sessionData.sections.every(s => s.status !== 'pending');
        setView(allDone ? 'complete' : 'loaded');
      }
    });
  }, []);

  useEffect(() => {
    const handler = (message) => {
      if (message.type === 'FOCUS_DETECTED') {
        const previewText = message.payload.previewText;
        const matchedId = findBestMatch(previewText, sections);
        setFocusedSection(matchedId);
      }
      
      if (message.type === 'APPLY_SUCCESS') {
        const updatedSection = message.payload.section;
        setSections(prev => {
          const next = prev.map(s => s.id === updatedSection.id ? updatedSection : s);
          
          // Check if all done
          if (next.every(s => s.status !== 'pending')) {
            setView('complete');
          }
          return next;
        });
        setToast({ message: 'Applied successfully!', type: 'success' });
      }

      if (message.type === 'APPLY_ERROR') {
        setToast({ message: `Error: ${message.payload.reason}`, type: 'error' });
      }
    };

    chrome.runtime.onMessage.addListener(handler);
    return () => chrome.runtime.onMessage.removeListener(handler);
  }, [sections]);

  function findBestMatch(previewText, currentSections) {
    if (!previewText) return null;
    const previewWords = previewText.toLowerCase().split(/\s+/).filter(Boolean);
    if (previewWords.length === 0) return null;

    let bestMatch = null;
    let maxOverlap = 0;

    for (const sec of currentSections) {
      if (sec.status !== 'pending') continue;
      
      const targetText = (sec.heading + ' ' + sec.body).toLowerCase();
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

    return maxOverlap >= Math.min(3, previewWords.length) ? bestMatch : null;
  }

  const handlePaste = (rawText) => {
    const parsed = parseDocument(rawText);
    if (parsed.length > 0) {
      setSections(parsed);
      setView('loaded');
      setSessionStartedAt(Date.now());
      
      chrome.storage.session.set({
        sessionData: {
          sections: parsed,
          sessionStartedAt: Date.now(),
          appliedCount: 0,
          skippedCount: 0,
          totalCount: parsed.length
        }
      });
    } else {
      setToast({ message: 'No content found in paste.', type: 'error' });
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
      
      chrome.storage.session.get('sessionData', (data) => {
        if (data.sessionData) {
          data.sessionData.sections = next;
          data.sessionData.skippedCount = (data.sessionData.skippedCount || 0) + 1;
          chrome.storage.session.set({ sessionData: data.sessionData });
        }
      });

      if (next.every(s => s.status !== 'pending')) {
        setView('complete');
      }
      return next;
    });
  };

  const handleRestore = (sectionId) => {
    setSections(prev => {
      const next = prev.map(s => s.id === sectionId ? { ...s, status: 'pending' } : s);
      
      chrome.storage.session.get('sessionData', (data) => {
        if (data.sessionData) {
          data.sessionData.sections = next;
          data.sessionData.skippedCount = Math.max(0, (data.sessionData.skippedCount || 1) - 1);
          chrome.storage.session.set({ sessionData: data.sessionData });
        }
      });

      if (view === 'complete' && next.some(s => s.status === 'pending')) {
        setView('loaded');
      }
      return next;
    });
  };

  const handleReset = () => {
    chrome.runtime.sendMessage({ type: 'RESET_SESSION' }, () => {
      setSections([]);
      setView('empty');
      setFocusedSection(null);
      setSessionStartedAt(null);
      chrome.runtime.sendMessage({ type: 'EXIT_SELECT_MODE' }).catch(() => {});
    });
  };

  const handleExport = () => {
    const applied = sections.filter(s => s.status === 'applied').length;
    const skipped = sections.filter(s => s.status === 'skipped').length;
    const total = sections.length;

    const log = {
      exportedAt: new Date().toISOString(),
      sessionDuration: sessionStartedAt ? Date.now() - sessionStartedAt : 0,
      summary: { total, applied, skipped },
      sections: sections.map(s => ({
        heading: s.heading,
        status: s.status,
        originalText: s.originalText,
        newText: s.body,
        targetSelector: s.targetSelector,
        appliedAt: s.appliedAt ? new Date(s.appliedAt).toISOString() : null
      }))
    };

    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typebridge-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    chrome.storage.local.set({ theme: newTheme });
  };

  const appliedCount = sections.filter(s => s.status === 'applied').length;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brand}>Typebridge</div>
        <div className={styles.headerControls}>
          {sections.length > 0 && (
            <div className={styles.count}>{appliedCount} / {sections.length}</div>
          )}
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className={styles.body}>
        {view === 'empty' && <PasteArea onPaste={handlePaste} />}
        
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
                />
              ))}
            </div>
          </>
        )}

        {view === 'complete' && (
          <SessionSummary 
            sections={sections}
            onExport={handleExport}
            onReset={handleReset}
          />
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
