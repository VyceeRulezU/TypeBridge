import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiMessageCircle } from 'react-icons/fi';
import PageLayout from './PageLayout';
import styles from './Contact.module.css';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PageLayout>
      <div className={styles.hero}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className={styles.eyebrow}>Contact</span>
            <h1 className={styles.title}>We'd love to hear from you</h1>
            <p className={styles.subtitle}>Whether it's a bug, a feature request, or just a hello — drop us a message and we'll get back within 24 hours.</p>
          </motion.div>
        </div>
      </div>

      <section className={styles.body}>
        <div className="container">
          <div className={styles.layout}>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.info}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FiMail /></div>
                <div>
                  <h3>Email us</h3>
                  <a href="mailto:hello@typebridge.io">hello@typebridge.io</a>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FiMessageCircle /></div>
                <div>
                  <h3>Support</h3>
                  <a href="mailto:support@typebridge.io">support@typebridge.io</a>
                </div>
              </div>
              <p className={styles.response}>We typically respond within one business day.</p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.formWrap}>
              {sent ? (
                <div className={styles.success}>
                  <FiSend className={styles.successIcon} />
                  <h3>Message sent!</h3>
                  <p>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label>Name</label>
                      <input type="text" placeholder="Your name" required />
                    </div>
                    <div className={styles.field}>
                      <label>Email</label>
                      <input type="email" placeholder="you@company.com" required />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Subject</label>
                    <input type="text" placeholder="What's this about?" required />
                  </div>
                  <div className={styles.field}>
                    <label>Message</label>
                    <textarea rows={5} placeholder="Tell us more..." required />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Message <FiSend />
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
