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
          <h1 className={styles.pageTitle}>MIT License</h1>
          <p className={styles.pageMeta}>Effective date: May 1, 2026</p>
        </motion.div>
      </div>
    </div>

    <div className={styles.body}>
      <div className={styles.bodyInner}>
        
        <div className={styles.section}>
          <p>
            <strong>Product:</strong> Typebridge<br />
            <strong>Copyright holder:</strong> NaliTech Consults · Victor Ironali<br />
            <strong>Year:</strong> 2026
          </p>
          <p>This license applies to the open-source components of the Typebridge codebase. Proprietary components, brand assets, and the Typebridge name and logo remain the exclusive property of NaliTech Consults and are not covered by this license.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>License text</h2>
          <p>Copyright (c) 2026 NaliTech Consults (Victor Ironali)</p>
          <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
          <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
          <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>What this license covers</h2>
          <p>The MIT License grants anyone the right to:</p>
          <ul>
            <li>Use the licensed code in personal and commercial projects</li>
            <li>Copy, modify, and distribute the code freely</li>
            <li>Sublicense the code as part of a larger work</li>
            <li>Use the code privately without any obligation to publish changes</li>
          </ul>
          <p>The only requirement is that the copyright notice above is included in all copies or substantial portions of the software.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>What this license does NOT cover</h2>
          <p>The following are expressly excluded from this MIT License:</p>
          <ul>
            <li>The Typebridge name, wordmark, and logo — these are trademarks of NaliTech Consults</li>
            <li>The Typebridge brand identity, color system, and visual design assets</li>
            <li>Any proprietary Pro tier features and their source code</li>
            <li>The Typebridge domain and associated web properties</li>
          </ul>
          <p>If you fork or build upon the open-source components of Typebridge, you must use a different product name, logo, and brand identity. You may not represent your product as Typebridge or as officially affiliated with NaliTech Consults.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>Attribution (recommended)</h2>
          <p>While not required by the MIT License, we appreciate attribution when you build upon Typebridge's open-source components. A recommended attribution format:</p>
          <p><em>Built with components from Typebridge by NaliTech Consults (<a href="https://typebridge.vercel.app" target="_blank" rel="noopener noreferrer">https://typebridge.vercel.app</a>)</em></p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>Contributing</h2>
          <p>Contributions to the Typebridge open-source codebase are welcome. By submitting a pull request or contribution, you agree that your contribution will be licensed under the same MIT License and that you have the right to grant this license.</p>
          <p>All contributions remain subject to review and acceptance by NaliTech Consults. We reserve the right to accept or reject any contribution for any reason.</p>
        </div>
        <div className={styles.divider} />

        <div className={styles.section}>
          <h2>Questions about licensing</h2>
          <p>If you have questions about what is and is not covered by this license, or if you wish to use Typebridge components in a way that may not be covered by the MIT License, please contact:</p>
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

export default License;
