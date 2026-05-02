import React from 'react';
import { FiCheck } from 'react-icons/fi';
import styles from './HowToUse.module.css';

export default function HowToUse() {
  const steps = [
    { title: 'Paste or Upload', desc: 'Add your structured document or file.' },
    { title: 'Parse Document', desc: 'Break the text into sections.' },
    { title: 'Double-Click in Builder', desc: 'Ensure the cursor is flashing in Webflow/Framer.' },
    { title: 'Click Apply', desc: 'Instantly sync the text to the page.' }
  ];

  return (
    <div className={styles.root}>
      <h3 className={styles.title}>How to use TypeBridge:</h3>
      <div className={styles.stepsList}>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepItem}>
            <div className={styles.iconWrap}>
              <FiCheck />
            </div>
            <div className={styles.stepContent}>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
