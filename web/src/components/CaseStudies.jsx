import React from 'react';
import { motion } from 'framer-motion';
import { SiWebflow, SiElementor, SiWordpress, SiFramer, SiSquarespace, SiWix } from 'react-icons/si';
import styles from '../styles/CaseStudies.module.css';

const platforms = [
  { name: 'Webflow', icon: <SiWebflow />, status: 'Native' },
  { name: 'Elementor', icon: <SiElementor />, status: 'Native' },
  { name: 'Gutenberg', icon: <SiWordpress />, status: 'Native' },
  { name: 'Framer', icon: <SiFramer />, status: 'Native' },
  { name: 'Squarespace', icon: <SiSquarespace />, status: 'v2' },
  { name: 'Wix', icon: <SiWix />, status: 'v2' }
];

const SupportedPlatforms = () => {
  return (
    <section className={styles.section} id="platforms">
      <div className="container">
        <div className={styles.header}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.title}
          >
            Works where <br /> you build
          </motion.h2>
        </div>
        <div className={styles.platformsGrid}>
          {platforms.map((p, i) => (
            <motion.div 
              key={p.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className={styles.platformCard}
            >
              <span className={styles.platformIcon}>{p.icon}</span>
              <h3 className={styles.platformName}>{p.name}</h3>
              <span className={styles.platformStatus}>{p.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedPlatforms;
