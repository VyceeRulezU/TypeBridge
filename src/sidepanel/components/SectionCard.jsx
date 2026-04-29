import React from 'react';
import DiffPreview from './DiffPreview.jsx';
import styles from './SectionCard.module.css';

export default function SectionCard({ section, isFocused, onApply, onSkip, onRestore }) {
  const { id, level, heading, body, status, appliedAt, originalText } = section;
  
  const isApplied = status === 'applied';
  const isSkipped = status === 'skipped';
  const isPending = status === 'pending';

  return (
    <div className={`${styles.root} ${isFocused ? styles.focused : ''} ${isApplied ? styles.appliedCard : ''} ${isSkipped ? styles.skippedCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.levelBadge}>{level.toUpperCase()}</span>
          <h3 className={`${styles.heading} ${!isPending ? styles.strikethrough : ''}`}>
            {heading || '(No Heading)'}
          </h3>
        </div>
        {isApplied && <span className={styles.statusBadgeSuccess}>Applied</span>}
        {isSkipped && <span className={styles.statusBadgeWarning}>Skipped</span>}
      </div>
      
      {isPending && (
        <div className={styles.bodyWrap}>
          {body && <div className={styles.text}>{body}</div>}
          {isFocused && <DiffPreview currentText={originalText} newText={body || heading} />}
          <div className={styles.actions}>
            <button className={styles.applyBtn} onClick={() => onApply(id)}>Apply</button>
            <button className={styles.skipBtn} onClick={() => onSkip(id)}>Skip</button>
          </div>
        </div>
      )}

      {isSkipped && (
        <div className={styles.bodyWrap}>
          <div className={styles.actions}>
            <button className={styles.restoreBtn} onClick={() => onRestore(id)}>Undo Skip</button>
          </div>
        </div>
      )}

      {isApplied && appliedAt && (
        <div className={styles.timestamp}>
          {new Date(appliedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
