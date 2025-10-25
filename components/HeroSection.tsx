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
          width="500"
          height="500"
        />
      </div>
      <div className={styles.container}>
        <div className={`${styles.heroCenter} ${visible ? styles.visible : ''}`}>
          <h1 className={styles.heroTagline}>
            建設業・介護施設・飲食業など、<br />
            従業員5〜20名の小さな会社の<br />
            ITに関するお困りごとをまるごと解決
          </h1>
          <p className={styles.heroSubtitle}>
            「ホームページを作ったけど効果がない」「業務効率化したいけど何から始めればいいかわからない」<br />
            そんなお悩みを、ITが苦手な経営者様でも安心してお任せいただけるようサポートします。
          </p>
          <div className={styles.heroButtons}>
            <a
              href="#contact"
              className={styles.ctaButtonPrimary}
              aria-label="お問い合わせフォームへ移動"
            >
              <i className="fas fa-paper-plane"></i> まずは気軽に相談してみる
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
