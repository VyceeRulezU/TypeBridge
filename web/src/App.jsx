import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoGrid from './components/LogoGrid';
import ValueProp from './components/ValueProp';
import Outcomes from './components/Outcomes';
import CaseStudies from './components/CaseStudies';
import Footer from './components/Footer';
import styles from './styles/LandingPage.module.css';

function App() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main>
        <Hero />
        <LogoGrid />
        <ValueProp />
        <Outcomes />
        <CaseStudies />
      </main>
      <Footer />
    </div>
  );
}

export default App;
