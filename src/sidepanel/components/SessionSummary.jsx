import React from 'react';
import styles from './SessionSummary.module.css';

export default function SessionSummary({ sections, onExport, onReset }) {
  const applied = sections.filter(s => s.status === 'applied').length;
  const skipped = sections.filter(s => s.status === 'skipped').length;
  const total = sections.length;

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Session Complete</h2>
      <p className={styles.reminder}>Save your changes in the builder to publish them.</p>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.value}>{applied}</span>
          <span className={styles.label}>Applied</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.value}>{skipped}</span>
          <span className={styles.label}>Skipped</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.value}>{total}</span>
          <span className={styles.label}>Total</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnExport} onClick={onExport}>Export Log</button>
        <button className={styles.btnReset} onClick={onReset}>Reset Session</button>
      </div>
    </div>
  );
}
