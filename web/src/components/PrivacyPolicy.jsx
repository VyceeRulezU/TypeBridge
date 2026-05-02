import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import styles from './InnerPage.module.css';

const PrivacyPolicy = () => (
  <PageLayout>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.pageMeta}>Last updated: May 2, 2026</p>
        </motion.div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <div className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>TypeBridge is a browser extension that operates entirely locally on your device. We do <strong>not</strong> collect, store, or transmit any personal data, document content, or usage information to external servers.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>2. How Your Data Is Used</h2>
          <p>All document parsing, section management, and field detection happens within your browser. Your content never leaves your device. Session data is stored using the browser's built-in <code>chrome.storage.session</code> API and is cleared when you close the browser.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>3. Third-Party Services</h2>
          <p>TypeBridge does not integrate with any third-party analytics, advertising, or tracking services. No cookies are set. No beacons are fired.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>4. Permissions</h2>
          <p>The extension requests the following permissions:</p>
          <ul>
            <li><strong>activeTab</strong> — to detect the active text element in the current tab.</li>
            <li><strong>storage</strong> — to persist your session data locally.</li>
            <li><strong>sidePanel</strong> — to display the TypeBridge interface as a browser side panel.</li>
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>5. Children's Privacy</h2>
          <p>TypeBridge is not directed at children under the age of 13 and we do not knowingly collect information from minors.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>6. Contact</h2>
          <p>Questions? Reach us at <a href="mailto:legal@typebridge.io">legal@typebridge.io</a>.</p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default PrivacyPolicy;
