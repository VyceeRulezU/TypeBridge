import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './Navbar.module.css';
import logo from '../assets/typebridge-purple-text-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
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
            <li><a href="/#bento-features">Features</a></li>
            <li><a href="/#how-it-works">How it Works</a></li>
            {/* <li><a href="/#pricing">Pricing</a></li> */}
          </ul>
          <div className={styles.actions}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
            >
              Download Extension
            </motion.button>
          </div>
          <button 
            className={styles.mobileToggle} 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.mobileMenu}
          >
            <ul className={styles.mobileLinks}>
              <li><a href="/#bento-features" onClick={() => setIsOpen(false)}>Features</a></li>
              <li><a href="/#how-it-works" onClick={() => setIsOpen(false)}>How it Works</a></li>
              {/* <li><a href="/#pricing" onClick={() => setIsOpen(false)}>Pricing</a></li> */}
            </ul>
            <div className={styles.mobileBottom}>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Download Extension
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
