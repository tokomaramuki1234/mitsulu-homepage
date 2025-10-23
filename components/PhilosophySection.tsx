import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';
import SectionCta from './SectionCta';

const PhilosophySection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.philosophySection}>
      <div className={styles.container}>
        <div className={`${styles.philosophyCentered} ${isVisible ? styles.visible : ''}`}>
          <h2 className={styles.sectionTitle}>三流の理念</h2>
          <p className={styles.philosophyTagline}>
            小さな悩みの受け皿に
          </p>
          <p className={styles.philosophyDescription}>
            "悩み"とは思考停止している状態を指します。<br />
            「〇〇だから」、「△△ができないから」といった理由で行動を起こせずにいる時、<br />
            人は悩みを抱えていると言えます。<br />
            <br />
            三流はそんな悩みの受け皿となり、あなたが再び前進できるようご支援致します。
          </p>
        </div>

        <SectionCta
          text="大小あれど、悩みは歩みを止めている状態。そのお悩みを乗り越えた先に見える景色があります。"
          buttonText="まずはお気軽にご相談ください"
        />
      </div>
    </section>
  );
};

export default PhilosophySection;
