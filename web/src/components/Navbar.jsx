import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={styles.navbar}
    >
      <div className={`container ${styles.content}`}>
        <div className={styles.logo}>
          <img src={logo} alt="TypeBridge Logo" className={styles.logoImg} />
          <span className={styles.text}>TypeBridge</span>
        </div>
        <ul className={styles.links}>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={styles.cta}
        >
          Download Extension
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
