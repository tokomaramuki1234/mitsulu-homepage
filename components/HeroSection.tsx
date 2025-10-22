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
        />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heroCenter} ${visible ? styles.visible : ''}`}>
          <p className={styles.heroSubtitle}>
            小さな組織の手が回らないお困りごとを横断的に解決する
          </p>
          <h1 className={styles.heroTagline}>
            様々な悩みの受け皿に<br />
            <span className={styles.heroTaglineEn}>All worries welcome here</span>
          </h1>
          <div className={styles.heroButtons}>
            <a
              href="#contact"
              className={styles.ctaButtonPrimary}
              aria-label="お問い合わせフォームへ移動"
            >
              <i className="fas fa-paper-plane"></i> 無料で相談してみる
            </a>
            <a
              href="#services"
              className={styles.ctaButtonSecondary}
              aria-label="サービス内容を見る"
            >
              <i className="fas fa-chevron-down"></i> サービス内容を見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
