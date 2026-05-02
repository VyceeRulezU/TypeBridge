import React from 'react';
import Navbar from './Navbar';
import CTASection from './CTASection';
import Footer from './Footer';
import BackToTop from './BackToTop';
import styles from './PageLayout.module.css';

const PageLayout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <CTASection />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PageLayout;
