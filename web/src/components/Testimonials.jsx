import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Lead Designer, Contrast Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    quote: 'TypeBridge cut our content deployment time in half. I used to waste 2 hours copy-pasting into Webflow. Now it\'s 15 minutes flat.',
    rating: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Freelance Web Designer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop',
    quote: 'The field detection is genuinely magic. Works inside Webflow\'s canvas without any setup. My clients are amazed at how fast I work now.',
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Content Strategist, Helix Agency',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    quote: 'Finally a tool that bridges the gap between my Google Docs and Webflow. The section parsing alone is worth every penny.',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" id="testimonials" style={{ padding: '6rem 0', background: 'white' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={styles.header}
        >
          <span className={styles.eyebrow}>Testimonials</span>
          <h2 className={styles.title}>Designers love TypeBridge</h2>
          <p className={styles.subtitle}>Trusted by 5,000+ designers, agencies, and content teams worldwide.</p>
        </motion.div>

        <div className={styles.grid}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={styles.card}
            >
              <div className={styles.stars}>
                {Array.from({ length: t.rating }).map((_, s) => (
                  <FiStar key={s} className={styles.star} />
                ))}
              </div>
              <p className={styles.quote}>"{t.quote}"</p>
              <div className={styles.author}>
                <img src={t.avatar} alt={t.name} className={styles.avatar} />
                <div>
                  <div className={styles.name}>{t.name}</div>
                  <div className={styles.role}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
