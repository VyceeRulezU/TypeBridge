import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import styles from './InnerPage.module.css';

const TermsOfService = () => (
  <PageLayout>
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className={styles.eyebrow}>Legal</span>
          <h1 className={styles.pageTitle}>Terms of Service</h1>
          <p className={styles.pageMeta}>Last updated: May 2, 2026</p>
        </motion.div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.bodyInner}>
        <div className={styles.section}>
          <h2>1. Acceptance of Terms</h2>
          <p>By installing or using TypeBridge ("the Extension"), you agree to be bound by these Terms of Service. If you do not agree, please uninstall the Extension.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>2. Description of Service</h2>
          <p>TypeBridge is a browser extension that parses structured documents and injects copy directly into web builder text fields. The service is provided "as is" for productivity purposes.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>3. Acceptable Use</h2>
          <p>You agree not to use TypeBridge to:</p>
          <ul>
            <li>Inject malicious, illegal, or harmful content into any platform.</li>
            <li>Circumvent the security mechanisms of any third-party web builder.</li>
            <li>Reverse-engineer or redistribute the Extension without written permission.</li>
          </ul>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>4. Intellectual Property</h2>
          <p>All code, branding, and design elements of TypeBridge are the proprietary property of TypeBridge and its creators. Unauthorised copying, modification, or distribution is prohibited.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>TypeBridge is not liable for any damages resulting from the use or inability to use the Extension, including but not limited to data loss, content errors, or platform-level conflicts.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>6. Changes to Terms</h2>
          <p>We reserve the right to update these Terms at any time. Continued use of the Extension after changes constitutes acceptance of the revised Terms.</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.section}>
          <h2>7. Contact</h2>
          <p>Legal enquiries: <a href="mailto:legal@typebridge.io">legal@typebridge.io</a></p>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default TermsOfService;
