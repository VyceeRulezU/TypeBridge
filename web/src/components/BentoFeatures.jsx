import React from 'react';
import { motion } from 'framer-motion';
import {
  RiScan2Line,
  RiCursorLine,
  RiFileTextLine,
  RiHistoryLine,
  RiWifiOffLine,
  RiLoopLeftLine,
} from 'react-icons/ri';
import styles from './BentoFeatures.module.css';
import favicon from '../assets/typebridge-favicon.png';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.5, ease: 'easeOut' },
  }),
};

const BentoFeatures = () => {
  return (
    <section className={`${styles.section} bento-section`} id="bento-features">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <h2 className={styles.title}>What TypeBridge Does Best</h2>
          <p className={styles.subtitle}>
            From detection to deployment, every feature is built to eliminate friction
            between your content and your web builder.
          </p>
        </motion.div>

        <div className={styles.grid}>

          {/* Card 1 — Icon only (top-left, small square) */}
          <motion.div custom={0} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.iconCard}`}>
            <RiScan2Line className={styles.bigIcon} />
          </motion.div>

          {/* Card 2 — Text + big icon right (top-center, wide) */}
          <motion.div custom={1} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.wideCard}`}>
            <div className={styles.textBlock}>
              <h3>Smart Field Detection</h3>
              <p>Automatically detects the active text element inside any web builder canvas — even inside Shadow DOM and iframes.</p>
            </div>
            <RiCursorLine className={styles.floatIcon} />
          </motion.div>

          {/* Card 3 — Icon only (top-right, small square) */}
          <motion.div custom={2} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.iconCard}`}>
            <RiFileTextLine className={styles.bigIcon} />
          </motion.div>

          {/* Card 4 — Tall text card (middle-left, spans 2 rows) */}
          <motion.div custom={3} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.tallCard}`}>
            <div className={styles.tallText}>
              <h3>Instant Field Injection</h3>
              <p>Click a field in Webflow, Framer, or Elementor — TypeBridge injects your parsed copy directly. No clipboard. No drag-and-drop. No tab switching.</p>
            </div>
          </motion.div>

          {/* Card 5 — Icon center (middle-center) */}
          <motion.div custom={4} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.iconCard}`}>
            <RiHistoryLine className={styles.bigIcon} />
          </motion.div>

          {/* Card 6 — Text card (middle-right) */}
          <motion.div custom={5} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.textCard}`}>
            <h3>Works Offline</h3>
            <p>All parsing and processing is local. No server, no tracking, no data ever leaves your machine.</p>
            <RiWifiOffLine className={styles.cornerIcon} />
          </motion.div>

          {/* Card 7 — Text card (bottom-left) */}
          <motion.div custom={6} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.textCard}`}>
            <h3>Structured Parsing</h3>
            <p>Upload .docx or .pdf and TypeBridge splits your document into structured heading + body section pairs ready to deploy.</p>
            <RiLoopLeftLine className={styles.cornerIcon} />
          </motion.div>

          {/* Card 8 — Icon center (bottom-center) */}
          <motion.div custom={7} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.iconCard}`}>
            <RiWifiOffLine className={styles.bigIcon} />
          </motion.div>

          {/* Card 9 — Text (bottom-right) */}
          <motion.div custom={8} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.textCard}`}>
            <h3>Re-apply Anytime</h3>
            <p>Edit and re-inject any already-applied section back into your builder in one click.</p>
            <RiLoopLeftLine className={styles.cornerIcon} />
          </motion.div>

          {/* Card 10 — Favicon brand card */}
          <motion.div custom={9} initial="hidden" whileInView="visible" variants={cardVariants} viewport={{ once: true }}
            className={`${styles.card} ${styles.iconCard}`}>
            <img src={favicon} alt="TypeBridge" className={styles.faviconImg} />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
