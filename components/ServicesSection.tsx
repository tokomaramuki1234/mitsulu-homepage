import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';
import SectionCta from './SectionCta';

const services = [
  // Top Row: 2 items
  {
    row: 'top',
    items: [
      {
        icon: 'fas fa-bullseye',
        color: '#248EC6', // メインカラー：Cyan
        title: 'ファシリテーション',
        description: '会議や研修を前向きに進めるお手伝い'
      },
      {
        icon: 'fas fa-puzzle-piece',
        color: '#CD2272', // メインカラー：Magenta
        title: '企画・研修',
        description: 'チームビルディングや社員研修の企画運営'
      }
    ]
  },
  // Middle Row: 3 items
  {
    row: 'middle',
    items: [
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
        icon: 'fas fa-cogs',
        color: '#1B2B59', // サブカラー：Navy
        title: '進行管理',
        description: '印刷・制作現場の調整、PMO業務'
      }
    ]
  },
  // Bottom Row: 2 items
  {
    row: 'bottom',
    items: [
      {
        icon: 'fas fa-graduation-cap',
        color: '#D1221A', // サブカラー：Red
        title: '教育・講習',
        description: '日本語教育・Adobe操作・AI・Office・PC操作支援'
      },
      {
        icon: 'fas fa-mountain',
        color: '#208B3B', // サブカラー：Green
        title: '体験サポート',
        description: 'シュノーケリング・登山・観光案内・キャンプ＆BBQ・地域イベント企画'
      }
    ]
  }
];

const ServicesSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          三流にできること
        </h2>

        {services.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`${styles.servicesRow} ${
              row.items.length === 2 ? styles.servicesRow2 : styles.servicesRow3
            }`}
          >
            {row.items.map((service, itemIndex) => (
              <article
                key={itemIndex}
                className={`${styles.serviceCard} ${isVisible ? styles.visible : ''}`}
                style={{ animationDelay: `${(rowIndex * 3 + itemIndex) * 0.1}s` }}
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
            ))}
          </div>
        ))}
        
        <SectionCta 
          text="気になるサービスがありましたか？"
          buttonText="まずは気軽にご相談ください"
        />
      </div>
    </section>
  );
};

export default ServicesSection;
