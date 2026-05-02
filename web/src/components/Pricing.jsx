import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import styles from './Pricing.module.css';

const plans = [
  {
    name: 'Free',
    audience: 'Solo designers and hobbyists',
    price: '$0',
    originalPrice: null,
    period: 'forever',
    buttonClass: styles.btnBlack,
    features: [
      'Up to 10 document parses/mo',
      'Webflow integration',
      'Standard field detection',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    audience: 'Professional designers and freelancers',
    price: '$12',
    originalPrice: '$15',
    period: 'per month, billed annually',
    buttonClass: styles.btnPurple,
    features: [
      'Unlimited document parses',
      'All builders (Framer, Elementor)',
      'Advanced PDF parsing',
      'Priority email support',
    ],
  },
  {
    name: 'Enterprise',
    audience: 'Agencies and large design teams',
    price: '$49',
    originalPrice: '$60',
    period: 'per month, billed annually',
    buttonClass: styles.btnBlack,
    features: [
      'Everything in Pro',
      'Team workspaces & sharing',
      'Custom taxonomy mapping',
      'Dedicated onboarding',
    ],
  },
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className={`${styles.section} pricing-section`} id="pricing">
      <div className="container">
        <div className={styles.containerPricing}>
          
          {/* Header */}
        <div className={styles.header}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.title}
          >
            Plans and Pricing
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={styles.subtitle}
          >
            Optimized Pricing for Scalable Web Building
          </motion.p>

          {/* Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={styles.toggleWrapper}
          >
            <div className={styles.toggleBg}>
              <button 
                className={`${styles.toggleBtn} ${!isAnnual ? styles.active : ''}`}
                onClick={() => setIsAnnual(false)}
              >
                Monthly
              </button>
              <button 
                className={`${styles.toggleBtn} ${isAnnual ? styles.active : ''}`}
                onClick={() => setIsAnnual(true)}
              >
                Annual <span className={styles.badge}>Save 20%</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className={styles.grid}>
          {plans.map((plan, index) => {
            // Calculate displayed price based on toggle (simplified for demo)
            const displayPrice = !isAnnual && plan.name !== 'Free' 
              ? `$${Math.round(parseInt(plan.price.replace('$', '')) * 1.25)}` 
              : plan.price;
            
            const displayOriginal = !isAnnual ? null : plan.originalPrice;

            return (
              <motion.div 
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <p className={styles.planAudience}>{plan.audience}</p>
                  
                  <div className={styles.priceRow}>
                    <span className={styles.price}>{displayPrice}</span>
                    {displayOriginal && (
                      <span className={styles.originalPrice}>{displayOriginal}</span>
                    )}
                  </div>
                  <p className={styles.period}>
                    {!isAnnual && plan.name !== 'Free' ? 'per month, billed monthly' : plan.period}
                  </p>
                  
                  <button className={`${styles.actionBtn} ${plan.buttonClass}`}>
                    Get Started
                  </button>
                </div>

                <div className={styles.cardBottom}>
                  <p className={styles.includesLabel}>What's included:</p>
                  <ul className={styles.featureList}>
                    {plan.features.map((feature, i) => (
                      <li key={i}>
                        <FiCheck className={styles.checkIcon} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
