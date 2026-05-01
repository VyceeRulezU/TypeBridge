import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import styles from '../styles/Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <motion.div 
          animate={{ 
            rotate: [0, 5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className={styles.shape1}
        ></motion.div>
        <motion.div 
          animate={{ 
            rotate: [0, -5, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className={styles.shape2}
        ></motion.div>
        <div className={styles.shape3}></div>
      </div>
      <div className={`container ${styles.content}`}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.title}
        >
          Inject copy directly <br />
          into your web builder
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.subtitle}
        >
          TypeBridge eliminates the friction between content and design. 
          Stop manual copy-pasting and start shipping your sites in record time.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={styles.ctaGroup}
        >
          <button className={styles.mainCta}>
            Get the Extension <FiArrowRight />
          </button>
          <div className={styles.stats}>
            <FiCheckCircle className={styles.checkIcon} />
            <span className={styles.statLabel}>No technical setup required</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
