import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoGrid from './components/LogoGrid';
import ValueProp from './components/ValueProp';
import HowItWorks from './components/HowItWorks';
import BentoFeatures from './components/BentoFeatures';
import Testimonials from './components/Testimonials';
// import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import styles from './styles/LandingPage.module.css';

// Inner pages
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import License from './components/License';
import About from './components/About';
import Blog from './components/Blog';
import Changelog from './components/Changelog';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

const routes = {
  '/privacy':    <PrivacyPolicy />,
  '/terms':      <TermsOfService />,
  '/license':    <License />,
  '/about':      <About />,
  '/blog':       <Blog />,
  '/changelog':  <Changelog />,
  '/contact':    <Contact />,
};

function App() {
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname.replace(/\/$/, '') || '/' : '/');

  useEffect(() => {
    const handleNavigation = (e) => {
      // Find closest anchor tag
      const a = e.target.closest('a');
      if (!a || !a.href) return;
      
      try {
        const url = new URL(a.href);
        // Intercept if same origin
        if (url.origin === window.location.origin) {
          const newPath = url.pathname.replace(/\/$/, '') || '/';
          
          // Different page
          if (newPath !== path) {
            e.preventDefault();
            window.history.pushState({}, '', url.pathname + url.hash);
            setPath(newPath);
            // Scroll to top smoothly when route changes
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
          } else if (url.hash) {
            // Same page hash link
            e.preventDefault();
            window.history.pushState({}, '', url.pathname + url.hash);
            const target = document.querySelector(url.hash);
            if (target) {
              // Calculate offset for sticky navbar (80px)
              const y = target.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          } else {
             // Same page, no hash (e.g. clicking logo again)
             e.preventDefault();
             window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      } catch (err) {
        // invalid URL, ignore and let default behavior take over
      }
    };

    const handlePopState = () => {
      setPath(window.location.pathname.replace(/\/$/, '') || '/');
    };

    document.addEventListener('click', handleNavigation);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      document.removeEventListener('click', handleNavigation);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [path]);

  // Page wrapper for smooth fade transitions
  const PageWrapper = ({ children, keyName }) => (
    <motion.div
      key={keyName}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );

  let currentView;
  
  if (routes[path]) {
    currentView = <PageWrapper keyName={path}>{routes[path]}</PageWrapper>;
  } else if (path === '' || path === '/') {
    currentView = (
      <PageWrapper keyName="home">
        <div className={styles.wrapper}>
          <Navbar />
          <main>
            <Hero />
            <LogoGrid />
            <ValueProp />
            <HowItWorks />
            <BentoFeatures />
            <Testimonials />
            {/* <Pricing /> */}
            <FAQ />
            <CTASection />
          </main>
          <Footer />
          <BackToTop />
        </div>
      </PageWrapper>
    );
  } else {
    currentView = <PageWrapper keyName="404"><NotFound /></PageWrapper>;
  }

  return (
    <AnimatePresence mode="wait">
      {currentView}
    </AnimatePresence>
  );
}

export default App;
