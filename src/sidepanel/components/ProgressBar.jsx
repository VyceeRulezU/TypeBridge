import React from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, total }) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);
  
  return (
    <div className={styles.root}>
      <div className={styles.labels}>
        <span className={styles.label}>Progress</span>
        <span className={styles.label}>{current} / {total} sections</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
