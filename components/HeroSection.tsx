import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const HeroSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroLogoContainer}>
        <img
          src="/images/topimg.svg"
          alt="三流ビジュアル"
          className={styles.heroMainLogo}
          style={{ maxWidth: '70%', width: '70%', height: 'auto' }}
        />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heroCenter} ${visible ? styles.visible : ''}`}>
          <a
            href="mailto:me@mitsulu.style"
            className={styles.ctaButton}
            aria-label="お問い合わせメールを送る"
          >
            <i className="fas fa-envelope"></i> ご相談はこちら
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
