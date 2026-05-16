import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    name: 'Chinedu Eze',
    role: 'Lead Designer, Contrast Studio',
    avatar: 'https://images.pexels.com/photos/12714871/pexels-photo-12714871.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "TypeBridge cut our content deployment time in half. I used to waste 2 hours copy-pasting into Webflow. Now it's 15 minutes flat.",
    rating: 5,
  },
  {
    name: 'Folake Adebayo',
    role: 'Freelance Web Designer',
    avatar: 'https://images.pexels.com/photos/34435728/pexels-photo-34435728.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "The field detection is genuinely magic. Works inside Webflow's canvas without any setup. My clients are amazed at how fast I work now.",
    rating: 5,
  },
  {
    name: 'Emeka Okafor',
    role: 'Content Strategist, Helix Agency',
    avatar: 'https://images.pexels.com/photos/30141182/pexels-photo-30141182.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: 'Finally a tool that bridges the gap between my Google Docs and Webflow. The section parsing alone is worth every penny.',
    rating: 5,
  },
  {
    name: 'Ngozi Obi',
    role: 'Senior Frontend, Bolt Tech',
    avatar: 'https://images.pexels.com/photos/34557574/pexels-photo-34557574.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "The accuracy of the copy injection is unmatched. No more broken layouts or missing formatting when moving from Docs to Webflow.",
    rating: 5,
  },
  {
    name: 'Tunde Bakare',
    role: 'Product Designer, Flowbase',
    avatar: 'https://images.pexels.com/photos/34204673/pexels-photo-34204673.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "TypeBridge has become a core part of our design-to-dev handoff. It's the missing link that makes content updates effortless.",
    rating: 5,
  },
  {
    name: 'Amaka Nwachukwu',
    role: 'Agency Owner, Lux Design',
    avatar: 'https://images.pexels.com/photos/33844622/pexels-photo-33844622.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "Our clients love how fast we can turn around landing page updates now. It's a massive competitive advantage for our agency.",
    rating: 5,
  },
  {
    name: 'Femi Ojo',
    role: 'Webflow Expert, DevCo',
    avatar: 'https://images.pexels.com/photos/27844480/pexels-photo-27844480.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "I've tried every copy tool out there, and TypeBridge is the only one that feels like it was built by actual Webflow users.",
    rating: 5,
  },
  {
    name: 'Chinwe Ikpeba',
    role: 'Content Manager, Spark Digital',
    avatar: 'https://images.pexels.com/photos/33511978/pexels-photo-33511978.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
    quote: "Managing content for 20+ sites used to be a nightmare. TypeBridge turned that into a simple, automated workflow.",
    rating: 5,
  },
  {
    name: 'Kazeem Balogun',
    role: 'UX Lead, Nordic Agency',
    avatar: 'https://images.pexels.com/photos/36544889/pexels-photo-36544889.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
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
