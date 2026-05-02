import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import styles from './InnerPage.module.css';

const License = () => (
  <PageLayout>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.pageTitle}>License</h1>
          <p className={styles.pageMeta}>TypeBridge Proprietary License — May 2026</p>
        </motion.div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <div className={styles.section}>
          <h2>Proprietary License</h2>
          <p>Copyright © 2026 TypeBridge. All rights reserved.</p>
          <p>This software and its associated documentation ("TypeBridge") are proprietary and confidential. The source code, design, and all associated assets are the exclusive property of TypeBridge.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>Permitted Use</h2>
          <p>The free tier of TypeBridge may be installed and used for personal and commercial productivity purposes without charge, subject to these terms.</p>
          <ul>
            <li>You may install the extension on up to 3 browser profiles.</li>
            <li>You may use the extension to inject copy into web builder projects you own or work on professionally.</li>
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>Prohibited Use</h2>
          <ul>
            <li>You may not decompile, reverse-engineer, or disassemble the Extension.</li>
            <li>You may not resell, sublicense, or redistribute TypeBridge in any form.</li>
            <li>You may not remove or obscure any copyright or proprietary notices.</li>
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>Pro License</h2>
          <p>A Pro license grants access to premium features including PDF parsing, unlimited document sessions, and priority support. Pro licenses are personal and non-transferable.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>Contact</h2>
          <p>Licensing enquiries: <a href="mailto:legal@typebridge.io">legal@typebridge.io</a></p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default License;
