import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import styles from './Changelog.module.css';

const entries = [
  {
    version: 'v1.0.0',
    date: 'May 2, 2026',
    type: 'Major',
    changes: [
      'Initial public release of TypeBridge',
      'Native support for Webflow, Framer, Elementor, and Gutenberg',
      'Structured document parsing for .docx and .pdf files',
      'One-click section injection into active web builder fields',
      'Shadow DOM traversal for deep field detection',
      'Session memory — resume your last document on reopen',
    ],
  },
  {
    version: 'v0.9.1',
    date: 'April 18, 2026',
    type: 'Beta',
    changes: [
      'Added Re-apply button for already-applied sections',
      'Inline section editing before injection',
      'Improved port-based communication with long-lived background service worker',
      'Fixed field detection in Webflow Designer canvas v2',
    ],
  },
  {
    version: 'v0.8.0',
    date: 'April 5, 2026',
    type: 'Beta',
    changes: [
      'Introduced How to Use guide (auto-hides when document loaded)',
      'Added TypeBridge favicon and white logo to side panel header',
      'Added Re-paste (✎) button to re-edit previously pasted documents',
    ],
  },
];

const typeColor = { Major: '#6C3BAA', Beta: '#3b82f6', Patch: '#10b981' };

const Changelog = () => (
  <PageLayout>
    <div className={styles.hero}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className={styles.eyebrow}>Changelog</span>
          <h1 className={styles.title}>What's new in TypeBridge</h1>
          <p className={styles.subtitle}>Every release, every fix, every improvement — documented here.</p>
        </motion.div>
      </div>
    </div>

    <section className={styles.entries}>
      <div className="container">
        <div className={styles.timeline}>
          {entries.map((entry, i) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={styles.entry}
            >
              <div className={styles.entryMeta}>
                <span className={styles.version}>{entry.version}</span>
                <span className={styles.badge} style={{ background: `${typeColor[entry.type]}18`, color: typeColor[entry.type] }}>{entry.type}</span>
                <span className={styles.date}>{entry.date}</span>
              </div>
              <ul className={styles.changes}>
                {entry.changes.map((c, j) => (
                  <li key={j}>{c}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Changelog;
