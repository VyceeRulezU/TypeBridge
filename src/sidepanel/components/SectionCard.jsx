import React from 'react';
import { FiCheck, FiEdit2 } from 'react-icons/fi';
import DiffPreview from './DiffPreview.jsx';
import styles from './SectionCard.module.css';

export default function SectionCard({ section, isFocused, onApply, onSkip, onRestore, onUpdateSection }) {
  const { id, level, heading, body, status, appliedAt, originalText } = section;
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(body || '');

  const isApplied = status === 'applied';
  const isSkipped = status === 'skipped';
  const isPending = status === 'pending';

  const handleSave = () => {
    onUpdateSection(id, editValue);
    setIsEditing(false);
  };

  return (
    <div className={`${styles.root} ${isFocused ? styles.focused : ''} ${isApplied ? styles.appliedCard : ''} ${isSkipped ? styles.skippedCard : ''} ${isEditing ? styles.editing : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.levelBadge}>{level.toUpperCase()}</span>
          <h3 className={`${styles.heading} ${isApplied ? styles.strikethrough : ''}`}>
            {heading || '(No Heading)'}
          </h3>
        </div>
        <div className={styles.headerActions}>
          {!isEditing && (
            <button className={styles.editIconBtn} onClick={() => setIsEditing(true)} title="Edit Text">
              <FiEdit2 />
            </button>
          )}
          {isApplied && (
            <div className={styles.successIconWrap}>
              <FiCheck className={styles.checkIcon} />
            </div>
          )}
          {isSkipped && <span className={styles.statusBadgeWarning}>Skipped</span>}
        </div>
      </div>
      
      <div className={styles.bodyWrap}>
        {isEditing ? (
          <div className={styles.editMode}>
            <textarea 
              className={styles.editArea}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={Math.max(3, editValue.split('\n').length)}
            />
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={handleSave}>Save</button>
              <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {isPending && (
              <>
                {body && <div className={styles.text}>{body}</div>}
                {isFocused && <DiffPreview currentText={originalText} newText={body || heading} />}
                <div className={styles.actions}>
                  <button className={styles.applyBtn} onClick={() => onApply(id)}>Apply</button>
                  <button className={styles.skipBtn} onClick={() => onSkip(id)}>Skip</button>
                </div>
              </>
            )}

            {isApplied && (
              <div className={styles.appliedContent}>
                {body && <div className={`${styles.text} ${styles.strikethrough}`}>{body}</div>}
                <div className={styles.actions}>
                  <button className={styles.reapplyBtn} onClick={() => onApply(id)}>Re-apply</button>
                  {appliedAt && (
                    <div className={styles.timestamp}>
                      {new Date(appliedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSkipped && (
              <div className={styles.actions}>
                <button className={styles.restoreBtn} onClick={() => onRestore(id)}>Undo Skip</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
