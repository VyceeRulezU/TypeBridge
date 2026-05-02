import React from 'react';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import logo from '../assets/typebridge-purple-text-logo.png';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.navbar} nav-section`}
      id="navbar"
    >
      <div className={`container ${styles.content}`}>
        <div className={styles.logo}>
          <a href="/">
            <img src={logo} alt="TypeBridge" className={styles.logoImg} />
          </a>
        </div>
        <ul className={styles.links}>
          <li><a href="#features">Features</a></li>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-primary"
        >
          Download Extension
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
