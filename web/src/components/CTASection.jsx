import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import footerBg from '../assets/footer-image.png';
import styles from './CTASection.module.css';

const CTASection = () => {
  return (
    <section className="cta-section" id="cta" style={{ padding: '6rem 0', background: 'white' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={styles.card}
        >
          <div className={styles.overlay} style={{ backgroundImage: `url(${footerBg})` }} aria-hidden="true" />
          <div className={styles.glow} />
          <span className={styles.eyebrow}>Get Started — It's Free</span>
          <h2 className={styles.title}>Stop copy-pasting.<br />Start shipping.</h2>
          <p className={styles.subtitle}>
            Install TypeBridge in 30 seconds and deploy your first document in minutes.
            No credit card. No setup. Just faster builds.
          </p>
          <div className={styles.actions}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
            >
              <FiDownload /> Download Free Extension
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-outline"
            >
              See How It Works <FiArrowRight />
            </motion.button>
          </div>
          <p className={styles.footnote}>Available on Chrome · Firefox support coming Q3 2026</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
