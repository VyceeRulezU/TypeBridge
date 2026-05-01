import React from 'react';
import styles from '../styles/Footer.module.css';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src={logo} alt="TypeBridge Logo" className={styles.logoImg} />
              <span className={styles.text}>TypeBridge</span>
            </div>
            <p className={styles.tagline}>The extension that bridges the gap between content strategy and web building.</p>
          </div>
          <div className={styles.links}>
            <div className={styles.group}>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How it Works</a></li>
                <li><a href="#platforms">Supported Builders</a></li>
              </ul>
            </div>
            <div className={styles.group}>
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">License</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; 2026 TypeBridge. Proprietary Software. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
