import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={`${styles.hero} hero-section`} id="hero">

      {/* Abstract geometric background — CSS shapes */}
      <div className={styles.bg} aria-hidden="true">
        <div className={`${styles.panel} ${styles.panelA}`} />
        <div className={`${styles.panel} ${styles.panelB}`} />
        <div className={`${styles.panel} ${styles.panelC}`} />
        <div className={`${styles.panel} ${styles.panelD}`} />
        <div className={`${styles.panel} ${styles.panelE}`} />
        <div className={`${styles.panel} ${styles.panelF}`} />
      </div>

      {/* Bottom-aligned content */}
      <div className={`container ${styles.content}`}>

        {/* Headline */}
        <motion.h1
          className={styles.headline}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Deploy your copy.<br />Ship your site faster.
        </motion.h1>

        {/* Bottom row — desc left, desc right, rating far right */}
        <motion.div
          className={styles.bottomRow}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          <div className={styles.descCol}>
            <p>Upload your document and TypeBridge parses it into structured sections ready for one-click deployment.</p>
            <button className={`btn btn-primary ${styles.ctaBtn}`}>
              Get the Extension <FiArrowRight />
            </button>
          </div>

          <div className={styles.descColRight}>
            <FiArrowRight className={styles.arrowDivider} />
            <p>All without leaving your Webflow, Framer, or Elementor canvas.</p>
          </div>

          <div className={styles.rating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <FiStar key={i} />)}
            </div>
            <div className={styles.ratingLabel}>
              <strong>5,000+</strong> designers worldwide
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
