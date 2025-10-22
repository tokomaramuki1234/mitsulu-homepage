import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const ContactSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.contactContent}>
          <div className={`${styles.contactLeft} ${isVisible ? styles.visible : ''}`}>
            <h2 className={styles.sectionTitle}>ご相談ください</h2>
            <p className={styles.contactText}>
              誰に頼めばいいかわからない案件、専門家を雇うほどではないが手を貸してほしい仕事、現場の"潤滑油"がほしいとき
            </p>
            <a
              href="mailto:me@mitsulu.style"
              className={styles.ctaButton}
              aria-label="お問い合わせメールを送る"
            >
              <i className="fas fa-envelope"></i> お問い合わせフォームへ
            </a>
          </div>
          <div className={`${styles.contactRight} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.contactIcons}>
              <i className="fas fa-comments"></i>
              <i className="fas fa-handshake"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
