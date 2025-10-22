import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const AchievementsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const stats = [
    {
      icon: 'fas fa-project-diagram',
      number: '50+',
      label: 'プロジェクト実績',
      color: '#248EC6'
    },
    {
      icon: 'fas fa-building',
      number: '20+',
      label: '支援企業・団体',
      color: '#CD2272'
    },
    {
      icon: 'fas fa-layer-group',
      number: '7',
      label: '専門分野',
      color: '#EAE33C'
    }
  ];

  return (
    <section ref={ref} className={styles.achievementsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          これまでの実績
        </h2>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${styles.statCard} ${isVisible ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
                <i className={stat.icon}></i>
              </div>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
