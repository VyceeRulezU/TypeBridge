import React from 'react';
import { motion } from 'framer-motion';
import PageLayout from './PageLayout';
import styles from './Blog.module.css';

const posts = [
  {
    tag: 'Product',
    date: 'May 2, 2026',
    title: 'Introducing TypeBridge 1.0: Deploy copy directly into your web builder',
    excerpt: 'Today we are officially launching TypeBridge, the browser extension that eliminates the copy-paste grind between your content docs and your web builder canvas.',
    readTime: '4 min read',
  },
  {
    tag: 'Tutorial',
    date: 'April 28, 2026',
    title: 'How to use TypeBridge with Webflow: A step-by-step guide',
    excerpt: 'A practical walkthrough of setting up TypeBridge with your Webflow project, from installing the extension to injecting your first section.',
    readTime: '6 min read',
  },
  {
    tag: 'Design',
    date: 'April 20, 2026',
    title: 'The hidden cost of copy-pasting in web design workflows',
    excerpt: 'We analysed 200 designer workflows and found that manual copy deployment accounts for up to 30% of site-building time. Here is what we found.',
    readTime: '5 min read',
  },
];

const Blog = () => (
  <PageLayout>
    <div className={styles.hero}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className={styles.eyebrow}>Blog</span>
          <h1 className={styles.title}>Insights, updates &amp; design workflow tips</h1>
        </motion.div>
      </div>
    </div>

    <section className={styles.posts}>
      <div className="container">
        <div className={styles.grid}>
          {posts.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${styles.card} ${i === 0 ? styles.featured : ''}`}
            >
              <div className={styles.cardMeta}>
                <span className={styles.tag}>{p.tag}</span>
                <span className={styles.date}>{p.date}</span>
              </div>
              <h2 className={styles.cardTitle}>{p.title}</h2>
              <p className={styles.cardExcerpt}>{p.excerpt}</p>
              <div className={styles.cardFooter}>
                <span className={styles.readTime}>{p.readTime}</span>
                <a href="#" className={styles.readMore}>Read article</a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Blog;
