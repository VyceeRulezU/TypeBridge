import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/LogoGrid.module.css';

const logos = [
  'Webflow', 'Wix', 'Framer', 'WordPress', 'Squarespace', 'Elementor'
];

const LogoGrid = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={styles.label}
        >
          TRUSTED BY MODERN CONTENT TEAMS
        </motion.p>
        <div className={styles.grid}>
          {logos.map((logo, i) => (
            <motion.div 
              key={logo} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              className={styles.logoItem}
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoGrid;
