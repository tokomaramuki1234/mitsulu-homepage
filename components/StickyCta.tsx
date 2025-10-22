import { useState, useEffect } from 'react';
import styles from '../styles/StickyCta.module.css';

const StickyCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // ヒーローセクションを通過したら表示（600px以降）
      setVisible(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.stickyCta}>
      <a href="#contact" className={styles.stickyButton} aria-label="お問い合わせフォームへ移動">
        <i className="fas fa-paper-plane"></i>
        <span className={styles.stickyText}>無料相談</span>
      </a>
    </div>
  );
};

export default StickyCta;
