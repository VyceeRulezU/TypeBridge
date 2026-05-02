import React from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiHeart, FiGlobe } from 'react-icons/fi';
import PageLayout from './PageLayout';
import styles from './About.module.css';

const values = [
  { icon: FiZap, title: 'Speed First', desc: 'Every feature is built to remove a step, eliminate a click, or shave a minute off the deployment process.' },
  { icon: FiHeart, title: 'Built for Designers', desc: 'We obsess over the designer workflow. TypeBridge fits naturally into how creative teams actually work.' },
  { icon: FiGlobe, title: 'Privacy by Default', desc: 'Everything runs locally. No accounts, no tracking, no data ever leaving your machine.' },
];

const About = () => (
  <PageLayout>
    {/* Hero */}
    <div className={styles.hero}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className={styles.eyebrow}>About Us</span>
          <h1 className={styles.title}>We're closing the gap between<br />content and web building</h1>
          <p className={styles.subtitle}>TypeBridge started as a personal frustration. We were spending hours manually copy-pasting approved content into Webflow. So we built a tool to fix it.</p>
        </motion.div>
      </div>
    </div>

    {/* Mission */}
    <section className={styles.missionSection}>
      <div className="container">
        <div className={styles.missionGrid}>
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.missionText}>
            <h2>Our mission</h2>
            <p>To make content deployment invisible — so designers and developers can focus on craft, not clipboard management.</p>
            <p>We believe the best tools feel like superpowers. TypeBridge should feel like you can think it and it's done.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={styles.missionStat}>
            <div className={styles.stat}><span>5,000+</span><p>Active designers</p></div>
            <div className={styles.stat}><span>6</span><p>Supported builders</p></div>
            <div className={styles.stat}><span>0</span><p>Data collected</p></div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className={styles.valuesSection}>
      <div className="container">
        <h2 className={styles.valuesTitle}>What we stand for</h2>
        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={styles.valueCard}>
              <div className={styles.valueIcon}><v.icon /></div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default About;
