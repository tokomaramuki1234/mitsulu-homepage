import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`${styles.backToTop} ${isVisible ? styles.backToTopVisible : ''}`}
      onClick={scrollToTop}
      aria-label="ページトップへ戻る"
    >
      <i className="fas fa-arrow-up"></i>
    </button>
  );
};

export default BackToTop;
