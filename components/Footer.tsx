import styles from '../styles/Home.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerCenter}>
            <p className={styles.footerTagline}>小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん</p>
          </div>
          <div className={styles.footerBottom}>

            <div className={styles.footerRight}>
              <p>小さな悩みの受け皿に。</p>
              <p>One plase, many solutions.</p>
            </div>
          </div>
          <div className={styles.footerCopyright}>
            <p>&copy; 2025 Mitsulu. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
