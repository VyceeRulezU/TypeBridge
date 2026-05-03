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
          <p className={styles.pageMeta}>Effective date: May 1, 2026<br />Last updated: May 1, 2026</p>
        </motion.div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.bodyInner}>
        
        <div className={styles.section}>
          <p>
            <strong>Product:</strong> Typebridge<br />
            <strong>Publisher:</strong> NaliTech Consults<br />
            <strong>Contact:</strong> <a href="mailto:typebridgeapp@gmail.com">typebridgeapp@gmail.com</a>
          </p>
          <p>
            Typebridge is a browser extension. It runs entirely in your browser. It has no backend server, no user accounts, and no analytics. It does not collect, transmit, or store your data anywhere outside your own device.
          </p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>1. Who we are</h2>
          <p>Typebridge is a Chrome extension developed and published by NaliTech Consults, operated by Victor Ironali. This Privacy Policy explains how Typebridge handles your information when you use the extension.</p>
          <p>If you have questions about this policy, contact us at <a href="mailto:typebridgeapp@gmail.com">typebridgeapp@gmail.com</a>.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>2. What data Typebridge accesses</h2>
          <p>Typebridge requires access to certain browser capabilities to function. Here is exactly what it accesses and why:</p>
          
          <h3>2.1 Content of the active tab</h3>
          <p>Typebridge reads and modifies text elements on the webpage you are actively editing inside a visual web builder. This access is limited to the tab you are using at the time of interaction. Typebridge does not read any other tabs, does not run in the background on pages you are browsing, and does not monitor your browsing history.</p>

          <h3>2.2 Text you paste into the extension panel</h3>
          <p>When you paste a copy document into the Typebridge side panel, that text is stored locally in your browser session storage (<code>chrome.storage.session</code>). Session storage is cleared automatically when you close the browser. This text is never transmitted to any external server.</p>

          <h3>2.3 Focus and click events on the active tab</h3>
          <p>Typebridge listens for focus events on editable elements in the active builder tab so it can detect which field you are editing. This detection happens entirely within your browser. No click data, no browsing data, and no keystrokes are recorded or transmitted.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>3. What data Typebridge does NOT collect</h2>
          <p>To be explicit:</p>
          <ul>
            <li>Typebridge does not collect your name, email address, or any personal identifiers</li>
            <li>Typebridge does not track your browsing history or the websites you visit</li>
            <li>Typebridge does not record keystrokes or clipboard contents</li>
            <li>Typebridge does not send any data to external servers — there are no servers</li>
            <li>Typebridge does not use cookies</li>
            <li>Typebridge does not use analytics tools (no Google Analytics, no Mixpanel, no Amplitude)</li>
            <li>Typebridge does not sell, share, or license any data to third parties</li>
            <li>Typebridge does not store data beyond your active browser session</li>
          </ul>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>4. Local storage</h2>
          <p>Typebridge uses two local browser storage mechanisms:</p>
          
          <h3>chrome.storage.session</h3>
          <p>Used to store your current copy document sections, session progress (applied, skipped, pending status per section), and session metadata (start time, counts). This data is scoped to your browser session and is automatically erased when you close Chrome. It is never synced across devices.</p>

          <h3>chrome.storage.local</h3>
          <p>Used to store your preferences — panel position, settings toggles. This data lives on your device only and is never transmitted externally. You can clear it at any time via Chrome Settings &gt; Extensions &gt; Typebridge &gt; Clear storage.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>5. Permissions we request and why</h2>
          <p>Typebridge requests only the permissions necessary to function. Here is the justification for each:</p>
          <ul>
            <li><strong>sidePanel</strong> — required to display the Typebridge panel alongside your builder tab</li>
            <li><strong>activeTab</strong> — required to read and modify text elements on the tab you are currently editing. This permission activates only when you click the Typebridge icon, not while browsing passively</li>
            <li><strong>scripting</strong> — required to inject the content script that detects focused fields and applies copy text. The script runs only on the active tab and only when triggered by you</li>
            <li><strong>storage</strong> — required to save session state and preferences locally on your device</li>
          </ul>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>6. Third-party services</h2>
          <p>Typebridge v1 does not integrate with any third-party services. The extension loads the Manrope font from Google Fonts via a CDN link in the side panel interface. This request is subject to Google's own privacy policy. No user data is included in this request.</p>
          <p>Future Pro versions of Typebridge may integrate optional services such as Supabase for cloud storage of team copy vaults. These integrations will be opt-in and will be covered by an updated privacy policy at that time.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>7. Children's privacy</h2>
          <p>Typebridge is not directed at children under the age of 13. We do not knowingly collect any information from children. If you are a parent or guardian and believe your child has used this extension, contact us at the email below and we will address your concerns promptly.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>8. Changes to this policy</h2>
          <p>We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this document and publish the updated version at the Typebridge website. For material changes, we will provide notice via the Chrome Web Store listing or the extension update notes. Continued use of the extension after changes constitutes acceptance of the updated policy.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>9. Contact</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
          <p>
            Victor Ironali<br />
            NaliTech Consults<br />
            <a href="mailto:typebridgeapp@gmail.com">typebridgeapp@gmail.com</a><br />
            <a href="https://typebridge.vercel.app" target="_blank" rel="noopener noreferrer">https://typebridge.vercel.app</a>
          </p>
        </div>

      </div>
    </div>
  </PageLayout>
);

export default PrivacyPolicy;
