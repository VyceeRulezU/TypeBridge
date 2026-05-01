import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiTarget, FiMousePointer, FiArrowRight } from 'react-icons/fi';
import styles from '../styles/Outcomes.module.css';

const steps = [
  { 
    id: '01', 
    title: 'PASTE OR UPLOAD', 
    icon: <FiFileText />,
    color: '#fbbf24', 
    desc: 'Paste your raw copy or upload a .docx/.pdf file. TypeBridge automatically parses headings and body sections for you.' 
  },
  { 
    id: '02', 
    title: 'AUTO-FOCUS DETECT', 
    icon: <FiTarget />,
    color: '#60a5fa', 
    desc: 'Our engine detects the active text field in your web builder (Webflow, Elementor, Gutenberg) instantly.' 
  },
  { 
    id: '03', 
    title: 'ONE-CLICK INJECT', 
    icon: <FiMousePointer />,
    color: '#a78bfa', 
    desc: 'Review the diff and hit Apply. Your text is injected directly into the CMS or canvas without tab-switching.' 
  }
];

const HowItWorks = () => {
  return (
    <section className={styles.section} id="how-it-works">
      <div className="container">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={styles.title}
        >
          How it works
        </motion.h2>
        <div className={styles.list}>
          {steps.map((step, index) => (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={styles.item} 
              style={{ borderLeft: `8px solid ${step.color}` }}
            >
              <div className={styles.header}>
                <span className={styles.iconWrapper}>{step.icon}</span>
                <h3 className={styles.itemTitle}>{step.title}</h3>
                <FiArrowRight className={styles.arrow} />
              </div>
              <p className={styles.desc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
