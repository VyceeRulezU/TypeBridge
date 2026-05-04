import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Lead Designer, Contrast Studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
    quote: "TypeBridge cut our content deployment time in half. I used to waste 2 hours copy-pasting into Webflow. Now it's 15 minutes flat.",
    rating: 5,
  },
  {
    name: 'Marcus Webb',
    role: 'Freelance Web Designer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop',
    quote: "The field detection is genuinely magic. Works inside Webflow's canvas without any setup. My clients are amazed at how fast I work now.",
    rating: 5,
  },
  {
    name: 'Priya Nair',
    role: 'Content Strategist, Helix Agency',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    quote: 'Finally a tool that bridges the gap between my Google Docs and Webflow. The section parsing alone is worth every penny.',
    rating: 5,
  },
  {
    name: 'Elena Rodriguez',
    role: 'Senior Frontend, Bolt Tech',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop',
    quote: "The accuracy of the copy injection is unmatched. No more broken layouts or missing formatting when moving from Docs to Webflow.",
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Product Designer, Flowbase',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    quote: "TypeBridge has become a core part of our design-to-dev handoff. It's the missing link that makes content updates effortless.",
    rating: 5,
  },
  {
    name: 'Sophia Laurent',
    role: 'Agency Owner, Lux Design',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop',
    quote: "Our clients love how fast we can turn around landing page updates now. It's a massive competitive advantage for our agency.",
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Webflow Expert, DevCo',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
    quote: "I've tried every copy tool out there, and TypeBridge is the only one that feels like it was built by actual Webflow users.",
    rating: 5,
  },
  {
    name: 'Mia Thompson',
    role: 'Content Manager, Spark Digital',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    quote: "Managing content for 20+ sites used to be a nightmare. TypeBridge turned that into a simple, automated workflow.",
    rating: 5,
  },
  {
    name: 'Lucas Berg',
    role: 'UX Lead, Nordic Agency',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
    quote: "The seamless integration with Google Docs means our copywriters don't have to learn a new tool. They just write, and we sync.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cardsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / cardsPerPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextPage();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextPage, isPaused, currentPage]);

  return (
    <section 
      className="testimonials-section" 
      id="testimonials" 
      style={{ padding: '6rem 0', background: 'white', overflow: 'hidden' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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

        <div className={styles.carouselContainer}>
          <div className={styles.carouselWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className={styles.grid}
              >
                {testimonials
                  .slice(currentPage * cardsPerPage, (currentPage + 1) * cardsPerPage)
                  .map((t, i) => (
                    <div key={t.name} className={styles.card}>
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
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.controls}>
            <div className={styles.dots}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${currentPage === i ? styles.activeDot : ''}`}
                  onClick={() => setCurrentPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
