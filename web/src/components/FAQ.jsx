import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronUp, FiChevronDown, FiMessageCircle } from 'react-icons/fi';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'Which web builders does TypeBridge support?',
    a: 'TypeBridge natively supports Webflow, Framer, Elementor, and Gutenberg (WordPress). Wix and Squarespace support is coming in v2.',
  },
  {
    q: 'Does TypeBridge store my content anywhere?',
    a: 'No. All parsing and processing happens locally in your browser. Nothing leaves your machine — not even to our servers.',
  },
  {
    q: 'What file types can I upload?',
    a: 'You can upload .docx (Microsoft Word) and .pdf files. You can also paste raw text directly into the extension.',
  },
  {
    q: 'How does the field detection work?',
    a: 'TypeBridge uses a combination of focus events, Shadow DOM traversal, and selection-change listeners to detect active text fields inside web builder canvases — even ones wrapped in iframes.',
  },
  {
    q: 'Is there a free version?',
    a: 'Yes — the extension is free to install and use. Premium features like PDF upload and session memory require a Pro license.',
  },
  {
    q: 'Can I re-apply a section after it has been applied?',
    a: 'Absolutely. Every applied section has a Re-apply button and an inline edit option so you can tweak and re-inject without re-parsing your entire document.',
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className={`${styles.section} faq-section`} id="faq">
      <div className="container">
        <div className={styles.layout}>

          {/* Left column */}
          <div className={styles.left}>
            <div className={styles.eyebrowRow}>
              <FiMessageCircle className={styles.eyebrowIcon} />
              <span className={styles.eyebrow}>TypeBridge Support</span>
            </div>
            <h2 className={styles.title}>Frequently asked<br />questions</h2>

            <div className={styles.contactCard}>
              <h3>Still have a question?</h3>
              <p>Can't find the answer you're looking for? Send us an email and we'll get back to you as soon as possible!</p>
              <a href="mailto:support@typebridge.io" className={styles.contactBtn}>Send email</a>
            </div>
          </div>

          {/* Right column — accordion */}
          <div className={styles.right}>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`${styles.item} ${open === i ? styles.itemOpen : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className={styles.question}>
                  <span>{faq.q}</span>
                  <div className={`${styles.toggle} ${open === i ? styles.toggleOpen : ''}`}>
                    {open === i ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      className={styles.answerWrap}
                    >
                      <p className={styles.answerText}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
