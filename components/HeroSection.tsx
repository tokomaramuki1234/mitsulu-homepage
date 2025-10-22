import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const HeroSection = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={`${styles.heroCenter} ${visible ? styles.visible : ''}`}>
            <div className={styles.heroImage}>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop" 
                alt="チームで協力して働く様子"
              />
            </div>
            <h1 className={styles.heroTitle}>
              🌿 三流 ― 小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん
            </h1>
            <p className={styles.heroSubtitle}>
              広い視野で、分野をまたぎ、小さな課題をまとめて解決します。
            </p>
            <p className={styles.heroCatchphrase}>様々な悩みの受け皿に。</p>
            <p className={styles.heroCatchphraseEn}>All worries welcome here.</p>
            <a
              href="mailto:me@mitsulu.style"
              className={styles.ctaButton}
              aria-label="お問い合わせメールを送る"
            >
              <i className="fas fa-envelope"></i> ご相談はこちら
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
