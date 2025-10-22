import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';
import SectionCta from './SectionCta';

const PhilosophySection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.philosophySection}>
      <div className={styles.container}>
        <div className={styles.philosophyContent}>
          <div className={`${styles.philosophyLeft} ${isVisible ? styles.visible : ''}`}>
            <h2 className={styles.sectionTitle}>三流の価値</h2>
            <p className={styles.philosophyText}>
              幅広い分野に対応できる柔軟性が強みです。分野を横断してつなぎ、足りないところを補います。現場の小さな課題をまとめて解決し、着実に前進をサポートします。
            </p>
          </div>
          <div className={`${styles.philosophyRight} ${isVisible ? styles.visible : ''}`}>
            <div className={styles.philosophyIcons}>
              <i className="fas fa-arrow-right"></i>
              <i className="fas fa-user-tie"></i>
              <i className="fas fa-link"></i>
              <i className="fas fa-puzzle-piece"></i>
              <i className="fas fa-check-circle"></i>
            </div>
          </div>
        </div>
        
        <SectionCta 
          text="三流の考え方に共感いただけましたか？"
          buttonText="一緒に課題解決しましょう"
        />
      </div>
    </section>
  );
};

export default PhilosophySection;
