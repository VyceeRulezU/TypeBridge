import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiLayout, FiCpu, FiFastForward } from 'react-icons/fi';
import styles from '../styles/ValueProp.module.css';

const ValueProp = () => {
  return (
    <section className={styles.section} id="features">
      <div className="container">
        <div className={styles.content}>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className={styles.largeText}
          >
            We help design teams 
            <span className={styles.highlightBlue}> <FiZap /> speed up </span> deployment, 
            <span className={styles.highlightOrange}> <FiLayout /> automate </span> copy workflows, 
            and <span className={styles.highlightCyan}> <FiCpu /> detect </span> active fields instantly so they can 
            <span className={styles.highlightPink}> <FiFastForward /> ship sites </span> without the manual copy-paste grind.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
