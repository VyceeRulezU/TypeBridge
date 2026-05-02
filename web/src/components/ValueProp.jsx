import React from 'react';
import { motion } from 'framer-motion';
import styles from './ValueProp.module.css';

const words = [
  { text: 'We help design teams', muted: true },
  { text: 'speed up', accent: '#6C3BAA' },
  { text: 'deployment,', muted: true },
  { text: 'automate', accent: '#3b82f6' },
  { text: 'copy workflows, and', muted: true },
  { text: 'detect', accent: '#10b981' },
  { text: 'active fields instantly — so they can', muted: true },
  { text: 'ship faster.', accent: '#6C3BAA', bold: true },
];

const ValueProp = () => {
  return (
    <section className={`${styles.section} features-section`} id="features">
      <div className="container">
        <div className={`${styles.innerContainer} valueprop-feature-container`}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={styles.largeText}
          >
            {words.map((w, i) => (
              <span
                key={i}
                className={w.muted ? styles.muted : styles.highlight}
                style={w.accent ? { color: w.accent, fontWeight: w.bold ? 800 : 700 } : {}}
              >
                {w.text}{' '}
              </span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
