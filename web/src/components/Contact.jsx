import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMail, FiMessageCircle } from 'react-icons/fi';
import PageLayout from './PageLayout';
import styles from './Contact.module.css';

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        e.target.reset(); // clear the form
      }
    } catch (error) {
      console.log(error);
    }
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
                  <a href="mailto:typebridgeapp@gmail.com">typebridgeapp@gmail.com</a>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><FiMessageCircle /></div>
                <div>
                  <h3>Support</h3>
                  <a href="mailto:typebridgeapp@gmail.com">typebridgeapp@gmail.com</a>
                </div>
              </div>
              <p className={styles.response}>We typically respond within one business day.</p>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.formWrap}>
              <form 
                className={styles.form} 
                onSubmit={handleSubmit}
              >
                {/* Replace this value with your actual Web3Forms access key */}
                <input type="hidden" name="access_key" value="466216b2-3632-4493-b713-7eaea970f1c4" />
                
                {/* Subject customization */}
                <input type="hidden" name="subject" value="New Submission from TypeBridge Contact Page" />
                
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="you@company.com" required />
                  </div>
                </div>
                
                <div className={styles.field}>
                  <label>Message</label>
                  <textarea name="message" rows={5} placeholder="Tell us more..." required />
                </div>
                
                <button type="submit" className="btn btn-primary">
                  Send Message <FiSend />
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {sent && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={styles.modalContent}
            >
              <div className={styles.success}>
                <FiSend className={styles.successIcon} />
                <h3>Message sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => setSent(false)} style={{ marginTop: '1.5rem', width: '100%' }}>
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default Contact;
