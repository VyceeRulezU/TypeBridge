import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiTarget, FiCheck, FiArrowRight } from 'react-icons/fi';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '01',
    icon: FiUpload,
    title: 'Paste or Upload',
    description: 'Drop your raw copy or upload a .docx/.pdf. TypeBridge automatically parses headings and body sections into structured blocks.',
  },
  {
    number: '02',
    icon: FiTarget,
    title: 'Auto-Detect Field',
    description: 'Our engine detects the active text field inside Webflow, Elementor, or Framer canvas in real-time — no configuration needed.',
  },
  {
    number: '03',
    icon: FiCheck,
    title: 'One-Click Inject',
    description: 'Review the diff, hit Apply. Your text injects directly into the selected element — no tab-switching, no clipboard mess.',
  },
];

const HowItWorks = () => {
  return (
    <section className="outcomes-section" id="how-it-works" style={{ padding: '6rem 0', background: 'white' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.title}>Three steps to deploy<br />your copy, instantly</h2>
          <p className={styles.subtitle}>No friction. No switching tabs. Just seamless content deployment.</p>
        </motion.div>

        <div className={styles.stepsGrid}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={styles.stepCard}
            >
              <div className={styles.stepTop}>
                <span className={styles.stepNumber}>{step.number}</span>
                <div className={styles.iconWrap}>
                  <step.icon />
                </div>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.description}</p>
              {i < steps.length - 1 && (
                <div className={styles.connector}>
                  <FiArrowRight />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
