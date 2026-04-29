import React from 'react';
import styles from './DiffPreview.module.css';

export default function DiffPreview({ currentText, newText }) {
  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <span className={styles.badgeOld}>OLD</span>
        <code className={styles.text}>{currentText || '(empty)'}</code>
      </div>
      <div className={styles.row}>
        <span className={styles.badgeNew}>NEW</span>
        <code className={styles.text}>{newText}</code>
      </div>
    </div>
  );
}
