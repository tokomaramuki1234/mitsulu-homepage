import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const HeroSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroLogoText}>
        One place, many solutions.
      </div>
      <div className={styles.heroLogoContainer}>
        <img
          src="/images/topimg.svg"
          alt="Mitsulu Logo"
          className={styles.heroMainLogo}
        />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heroCenter} ${visible ? styles.visible : ''}`}>
          <h1 className={styles.heroTagline}>
            小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん
          </h1>
          <div className={styles.heroButtons}>
            <a
              href="#contact"
              className={styles.ctaButtonPrimary}
              aria-label="お問い合わせフォームへ移動"
            >
              <i className="fas fa-paper-plane"></i> 無料で相談してみる
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
