import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import SectionCta from './SectionCta';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

const allServices = [
  {
    icon: 'fas fa-microphone',
    color: '#248EC6', // メインカラー：Cyan
    title: 'ファシリテーション',
    description: '会議や研修を前向きに進めるお手伝い'
  },
  {
    icon: 'fas fa-users',
    color: '#CD2272', // メインカラー：Magenta
    title: '企画・研修',
    description: 'チームビルディングや社員研修の企画運営'
  },
  {
    icon: 'fas fa-paint-brush',
    color: '#EAE33C', // メインカラー：Yellow
    title: 'デザイン・制作',
    description: 'Web・チラシ・名刺・ポスター対応'
  },
  {
    icon: 'fas fa-laptop-code',
    color: '#0A0F0F', // セミメインカラー：Black
    title: 'Web構築・開発・運用',
    description: 'Webサイト構築・SNS運用・HP更新'
  },
  {
    icon: 'fas fa-diagram-project',
    color: '#D1221A', // サブカラー：Red
    title: '進行管理',
    description: '印刷・制作現場の調整、PMO業務'
  },
  {
    icon: 'fas fa-graduation-cap',
    color: '#1B2B59', // サブカラー：Navy
    title: '教育・講習',
    description: '日本語教育・Adobe操作・AI・Office・PC操作支援'
  },
  {
    icon: 'fas fa-mountain',
    color: '#208B3B', // サブカラー：Green
    title: '体験サポート',
    description: 'シュノーケリング・登山・観光案内・キャンプ＆BBQ・地域イベント企画'
  }
];

const services = [
  // Top Row: 2 items
  {
    row: 'top',
    items: [allServices[0], allServices[1]]
  },
  // Middle Row: 3 items
  {
    row: 'middle',
    items: [allServices[2], allServices[3], allServices[4]]
  },
  // Bottom Row: 2 items
  {
    row: 'bottom',
    items: [allServices[5], allServices[6]]
  }
];

const ServicesSection = () => {
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

  // SSR時はnullを返す
  if (isMobile === null) {
    return (
      <section ref={ref} className={styles.servicesSection} id="services">
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
            三流ができること
          </h2>
        </div>
      </section>
    );
  }

  const ServiceCard = ({ service, index }: { service: typeof allServices[0], index: number }) => (
    <article
      className={`${styles.serviceCard} ${isVisible ? styles.visible : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={styles.serviceIcon}
        style={{ backgroundColor: service.color }}
      >
        <i className={service.icon}></i>
      </div>
      <h3 className={styles.serviceTitle}>{service.title}</h3>
      <p className={styles.serviceDescription}>{service.description}</p>
    </article>
  );

  return (
    <section ref={ref} className={styles.servicesSection} id="services">
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          三流ができること
        </h2>

        {/* PC表示: グリッドレイアウト */}
        {!isMobile && (
          <>
            {services.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`${styles.servicesRow} ${
                  row.items.length === 2 ? styles.servicesRow2 : styles.servicesRow3
                }`}
              >
                {row.items.map((service, itemIndex) => (
                  <ServiceCard
                    key={itemIndex}
                    service={service}
                    index={rowIndex * 3 + itemIndex}
                  />
                ))}
              </div>
            ))}
          </>
        )}

        {/* タブレット・スマホ表示: スライダー */}
        {isMobile && (
          <div className={styles.servicesSlider}>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={true}
              loop={false}
              className={styles.servicesSwiper}
            >
              {allServices.map((service, index) => (
                <SwiperSlide key={index}>
                  <ServiceCard service={service} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <SectionCta
          text="身近なお悩みを解決へと導きます。"
          buttonText="まずは気軽にご相談ください"
        />
      </div>
    </section>
  );
};

export default ServicesSection;
