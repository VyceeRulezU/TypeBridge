import React, { useEffect } from 'react';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`${styles.root} ${styles[type]}`}>
      {message}
    </div>
  );
}
