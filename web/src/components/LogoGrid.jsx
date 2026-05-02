import React from 'react';
import { motion } from 'framer-motion';
import { 
  SiWebflow, 
  SiWix, 
  SiFramer, 
  SiWordpress, 
  SiSquarespace, 
  SiElementor 
} from 'react-icons/si';
import styles from './LogoGrid.module.css';

const partners = [
  { name: 'Webflow', icon: SiWebflow },
  { name: 'Wix', icon: SiWix },
  { name: 'Framer', icon: SiFramer },
  { name: 'WordPress', icon: SiWordpress },
  { name: 'Squarespace', icon: SiSquarespace },
  { name: 'Elementor', icon: SiElementor }
];

const LogoGrid = () => {
  return (
    <section className={`${styles.section} logo-section`} id="partners">
      <div className="container">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={styles.label}
        >
          SEAMLESSLY INTEGRATES WITH YOUR FAVORITE BUILDERS
        </motion.p>
        <div className={styles.grid}>
          {partners.map((p, i) => (
            <motion.div 
              key={p.name} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={styles.logoItem}
            >
              <p.icon className={styles.icon} />
              <span className={styles.name}>{p.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoGrid;
