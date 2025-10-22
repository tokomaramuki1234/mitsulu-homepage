import styles from '../styles/Home.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerCenter}>
            <p className={styles.footerTagline}>三流 ― 深くはない。ただ、広い。</p>
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
            <div className={styles.footerRight}>
              <div className={styles.socialIcons}>
                <a href="#" aria-label="Twitter" className={styles.socialIcon}>
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" aria-label="Facebook" className={styles.socialIcon}>
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" aria-label="Instagram" className={styles.socialIcon}>
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
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
