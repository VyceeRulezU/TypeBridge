import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiUpload, FiTarget, FiCheck } from 'react-icons/fi';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: 'Step 01',
    icon: FiUpload,
    title: 'Paste or Upload',
    description: 'Drop your raw copy or upload a .docx/.pdf. TypeBridge automatically parses headings and body sections into structured blocks.',
  },
  {
    number: 'Step 02',
    icon: FiTarget,
    title: 'Auto-Detect Field',
    description: 'Our engine detects the active text field inside Webflow, Elementor, or Framer canvas in real-time — no configuration needed.',
  },
  {
    number: 'Step 03',
    icon: FiCheck,
    title: 'One-Click Inject',
    description: 'Review the diff, hit Apply. Your text injects directly into the selected element — no tab-switching, no clipboard mess.',
  },
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

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

        <div className={styles.timelineContainer} ref={containerRef}>
          {/* Vertical Lines */}
          <div className={styles.lineBg} />
          <motion.div 
            className={styles.lineProgress} 
            style={{ height: lineHeight }} 
          />

          {steps.map((step, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div key={step.number} className={`${styles.stepRow} ${isEven ? styles.stepEven : ''}`}>
                
                <div className={styles.stepContent}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className={styles.stepCard}
                  >
                    <div className={styles.stepTop}>
                      <span className={styles.stepBadge}>{step.number}</span>
                      <div className={styles.iconWrap}>
                        <step.icon />
                      </div>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </motion.div>
                </div>

                <div className={styles.stepCenter}>
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className={styles.dot} 
                  />
                </div>

                <div className={styles.stepEmpty}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
