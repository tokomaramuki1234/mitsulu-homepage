import styles from '../styles/Home.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerCenter}>
            <p className={styles.footerTagline}>三流 ― 幅広く、柔軟に、あなたをサポート。</p>
          </div>
          <div className={styles.footerBottom}>
            <div className={styles.footerLeft}>
              <p>
                ドメイン：
                <a href="https://mitsulu.style/">https://mitsulu.style/</a>
              </p>
              <p>
                お問い合わせ：
                <a href="mailto:me@mitsulu.style">me@mitsulu.style</a>
              </p>
            </div>
          </div>
          <div className={styles.footerCopyright}>
            <p>&copy; 2025 三流. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
