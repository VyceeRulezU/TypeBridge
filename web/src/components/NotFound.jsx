import React from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import Navbar from './Navbar';
import Footer from './Footer';
import styles from './NotFound.module.css';

const NotFound = () => (
  <div className={styles.page}>
    <Navbar />
    <main className={styles.main}>

      {/* Animated background glows */}
      <div className={styles.glow1} aria-hidden="true" />
      <div className={styles.glow2} aria-hidden="true" />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={styles.code}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={styles.title}
        >
          This page doesn't exist
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.subtitle}
        >
          Looks like you've ventured outside the canvas. The page you're looking for has moved, been deleted, or never existed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={styles.actions}
        >
          <a href="/" className="btn btn-primary">
            <FiHome /> Back to Home
          </a>
          <button className="btn btn-outline" onClick={() => window.history.back()}>
            <FiArrowLeft /> Go Back
          </button>
        </motion.div>

        {/* Floating code decoration */}
        <motion.div
          className={styles.decoration}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={styles.codeBlock}>
            <span className={styles.comment}>{'// Page not found'}</span>
            <span><span className={styles.kw}>const</span> page = <span className={styles.str}>"404"</span></span>
            <span><span className={styles.kw}>throw new</span> <span className={styles.fn}>Error</span>(<span className={styles.str}>"Route missing"</span>)</span>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
