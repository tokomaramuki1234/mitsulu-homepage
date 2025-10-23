import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

const AchievementsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // SSR時はnullを返す
  if (isMobile === null) {
    return (
      <section ref={ref} className={styles.achievementsSection}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
            これまでの実績
          </h2>
        </div>
      </section>
    );
  }

  const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => (
    <div
      className={`${styles.statCard} ${isVisible ? styles.visible : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
        <i className={stat.icon}></i>
      </div>
      <div className={styles.statNumber}>{stat.number}</div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  );

  return (
    <section ref={ref} className={styles.achievementsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          これまでの実績
        </h2>

        {/* PC表示: グリッドレイアウト */}
        {!isMobile && (
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        )}

        {/* タブレット・スマホ表示: スライダー */}
        {isMobile && (
          <div className={styles.achievementsSlider}>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={true}
              loop={false}
              className={styles.achievementsSwiper}
            >
              {stats.map((stat, index) => (
                <SwiperSlide key={index}>
                  <StatCard stat={stat} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
