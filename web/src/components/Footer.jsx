import React from 'react';
import logo from '../assets/typebridge-all-white-logo.png';
import footerBg from '../assets/footer-image.png';
import styles from './Footer.module.css';
import { FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className={`${styles.footer} footer-section`} id="footer">
      <div className={styles.overlay} style={{ backgroundImage: `url(${footerBg})` }} aria-hidden="true" />
      <div className={styles.top}>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <a href="/">
              <img src={logo} alt="TypeBridge" className={styles.logo} />
            </a>
            <p className={styles.tagline}>
              The extension that bridges the gap between content strategy and web building. Built for designers who ship fast.
            </p>
            <div className={styles.socials}>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="GitHub"><FiGithub /></a>
              <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#partners">Supported Builders</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/changelog">Changelog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4>Legal</h4>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/license">License</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.inner}>
          <span>© 2026 TypeBridge. All rights reserved.</span>
          <span>Built for designers who ship.</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
