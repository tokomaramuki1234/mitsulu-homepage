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
          <div className={`${styles.heroLeft} ${visible ? styles.visible : ''}`}>
            <h1 className={styles.heroTitle}>
              🌿 三流 ― 一流じゃなくても、できることがある
            </h1>
            <p className={styles.heroSubtitle}>
              深くはない。ただ、広い。分野をまたぎ、小さな課題をまとめて解決します。
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
          <div className={`${styles.heroRight} ${visible ? styles.visible : ''}`}>
            <div className={styles.heroIcons}>
              <i className="fas fa-laptop"></i>
              <i className="fas fa-file-alt"></i>
              <i className="fas fa-mountain"></i>
              <i className="fas fa-campground"></i>
              <i className="fas fa-water"></i>
              <i className="fas fa-user-friends"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
