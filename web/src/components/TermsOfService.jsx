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
          <p className={styles.pageMeta}>Effective date: May 1, 2026</p>
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
            By installing or using Typebridge, you agree to these Terms of Service. If you do not agree, do not install or use the extension.
          </p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>1. Acceptance of terms</h2>
          <p>These Terms of Service ("Terms") govern your use of the Typebridge Chrome extension ("Extension") published by NaliTech Consults ("we", "us", "our"). By installing, accessing, or using the Extension, you agree to be bound by these Terms and our Privacy Policy, which is incorporated by reference.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>2. Description of the service</h2>
          <p>Typebridge is a Chrome browser extension that allows users to paste structured copy documents into a side panel and apply text sections directly into active fields within visual web builder interfaces including WordPress, Webflow, Framer, Elementor, Squarespace, and similar platforms.</p>
          <p>The Extension operates entirely within your browser. It does not transmit your content to external servers. It is a tool to assist with copy deployment workflows and does not publish, save, or otherwise modify content on any website on your behalf.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>3. Licence grant</h2>
          <p>Subject to these Terms, NaliTech Consults grants you a limited, non-exclusive, non-transferable, revocable licence to use the Extension for your personal or internal business purposes.</p>
          <p>This licence does not include the right to:</p>
          <ul>
            <li>Sublicense, sell, resell, transfer, assign, or otherwise commercially exploit the Extension</li>
            <li>Modify, translate, adapt, or create derivative works based on the Extension</li>
            <li>Reverse engineer, decompile, or disassemble the Extension except as permitted by applicable law</li>
            <li>Use the Extension to build a competing product or service</li>
            <li>Remove or alter any proprietary notices, labels, or marks on the Extension</li>
          </ul>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>4. Free and Pro tiers</h2>
          <p>Typebridge is available in a free tier and a paid Pro tier. The free tier is provided at no cost and may be used indefinitely. The Pro tier requires a paid subscription at the then-current pricing listed on the Typebridge website.</p>
          
          <h3>4.1 Free tier</h3>
          <p>The free tier includes core copy deployment functionality as described in the Chrome Web Store listing. We reserve the right to modify the features included in the free tier with reasonable notice.</p>
          
          <h3>4.2 Pro tier</h3>
          <p>Pro tier subscriptions are billed monthly or annually as selected at checkout. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are available within 7 days of initial purchase or renewal if the Pro features have not been substantially used.</p>
          
          <h3>4.3 Price changes</h3>
          <p>We reserve the right to change Pro tier pricing. We will provide at least 30 days notice of price changes via email or extension update notes. Continued use after the effective date constitutes acceptance of the new pricing.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>5. Acceptable use</h2>
          <p>You agree to use the Extension only for lawful purposes and in accordance with these Terms. You agree not to use the Extension to:</p>
          <ul>
            <li>Violate any applicable local, national, or international law or regulation</li>
            <li>Infringe the intellectual property rights of any third party, including applying copyrighted copy to websites without authorisation</li>
            <li>Transmit unsolicited or unauthorised advertising or promotional material</li>
            <li>Attempt to gain unauthorised access to any website, system, or network</li>
            <li>Interfere with or disrupt the operation of any website or service</li>
            <li>Introduce viruses, malware, or other malicious code</li>
          </ul>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>6. Intellectual property</h2>
          <p>The Extension, including its source code, design, user interface, and documentation, is owned by NaliTech Consults and is protected by copyright, trademark, and other intellectual property laws.</p>
          <p>The name "Typebridge", the Typebridge logo, and associated brand assets are trademarks of NaliTech Consults. You may not use these marks without our prior written consent.</p>
          <p>The Extension is made available under the MIT License for the open-source components of its codebase as specified in the LICENSE file. Proprietary components and brand assets remain the exclusive property of NaliTech Consults.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>7. Third-party platforms</h2>
          <p>The Extension is designed to work with third-party web builder platforms including WordPress, Webflow, Framer, Elementor, and Squarespace. We are not affiliated with, endorsed by, or in partnership with any of these platforms. Your use of those platforms is subject to their own terms of service and privacy policies.</p>
          <p>We do not guarantee compatibility with any specific version of any third-party platform. Builder platforms may update their interfaces in ways that affect Extension functionality. We will endeavour to maintain compatibility but cannot guarantee uninterrupted operation.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>8. Disclaimer of warranties</h2>
          <p>THE EXTENSION IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p>NaliTech Consults does not warrant that the Extension will be uninterrupted, error-free, or free of viruses or other harmful components. We do not warrant that defects will be corrected or that the Extension or the servers that make it available are free of viruses or other harmful components.</p>
          <p>You use the Extension entirely at your own risk. We are not responsible for any content you deploy using the Extension or for any changes made to websites through the Extension's functionality.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>9. Limitation of liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NALITECH CONSULTS AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
          <ul>
            <li>Your access to or use of (or inability to access or use) the Extension</li>
            <li>Any conduct or content of any third party in connection with the Extension</li>
            <li>Any content obtained from the Extension</li>
            <li>Unauthorised access, use, or alteration of your transmissions or content</li>
          </ul>
          <p>IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR $100 USD IF YOU HAVE NOT MADE ANY PAYMENTS.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>10. Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless NaliTech Consults and its officers, directors, employees, and agents from and against any claims, liabilities, damages, judgements, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to your violation of these Terms or your use of the Extension.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>11. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the Extension at any time, with or without cause or notice, including if we reasonably believe you have violated these Terms.</p>
          <p>Upon termination, your right to use the Extension will immediately cease. Provisions of these Terms that by their nature should survive termination shall survive, including intellectual property ownership, disclaimers, indemnification, and limitation of liability.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>12. Governing law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions. Any dispute arising under or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in Abuja, Federal Capital Territory, Nigeria.</p>
          <p>If you are accessing the Extension from outside Nigeria, you are responsible for compliance with local laws. These Terms do not limit any consumer protection rights you may have under applicable law in your country of residence.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>13. Changes to these terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by updating the effective date at the top of this document and, where appropriate, providing notice through the Extension or Chrome Web Store listing. Your continued use of the Extension after any changes take effect constitutes your acceptance of the revised Terms.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>14. Severability</h2>
          <p>If any provision of these Terms is found to be invalid or unenforceable, that provision will be limited or eliminated to the minimum extent necessary, and the remaining provisions of these Terms will remain in full force and effect.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>15. Entire agreement</h2>
          <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and NaliTech Consults regarding the Extension and supersede all prior and contemporaneous agreements, representations, and warranties.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>16. Contact</h2>
          <p>For questions about these Terms of Service, please contact:</p>
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

export default TermsOfService;
