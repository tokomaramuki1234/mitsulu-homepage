import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';

const PricingSection = () => {
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

  const pricingPlans = [
    {
      id: 'frontend',
      category: '',
      title: '4時間相談プラン',
      price: '¥10,000',
      unit: '（税込）',
      duration: '4時間',
      features: [
        'まずは気軽にご相談',
        '現状の課題をヒアリング',
        '解決策の方向性をご提案',
        '次のステップをご案内'
      ],
      recommended: '初めての方におすすめ',
      isFeatured: false,
      icon: 'fas fa-comments',
      color: '#EAE33C',
      cta: '気軽に相談してみる'
    },
    {
      id: 'middleend',
      category: '',
      title: '月額継続サポート',
      price: '¥22,000',
      unit: '/月（税込）',
      duration: '月8時間',
      features: [
        '定期的なIT相談・サポート',
        '継続的な業務改善支援',
        '電話・メール相談無料',
        '優先対応'
      ],
      recommended: '継続的なサポートが必要な方',
      isFeatured: true,
      icon: 'fas fa-handshake',
      color: '#248EC6',
      cta: '継続サポートを申し込む'
    },
    {
      id: 'backend',
      category: '',
      title: 'カスタムプラン',
      price: '個別見積もり',
      unit: '',
      duration: '柔軟に対応',
      features: [
        'ホームページ制作',
        '業務システム導入',
        '大規模プロジェクト対応',
        'フルサポート体制'
      ],
      recommended: '本格的な導入をお考えの方',
      isFeatured: false,
      icon: 'fas fa-rocket',
      color: '#CD2272',
      cta: 'プロジェクトを相談する'
    }
  ];

  // SSR時はnullを返す
  if (isMobile === null) {
    return (
      <section ref={ref} className={styles.pricingSection} id="pricing">
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
            料金プラン
          </h2>
        </div>
      </section>
    );
  }

  const PricingCard = ({ plan, index }: { plan: typeof pricingPlans[0], index: number }) => (
    <div
      className={`${styles.pricingCard} ${plan.isFeatured ? styles.pricingCardFeatured : ''} ${isVisible ? styles.visible : ''}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        '--plan-color': plan.color 
      } as React.CSSProperties & { '--plan-color': string }}
    >
      {plan.isFeatured && <div className={styles.pricingBadge}>一番人気</div>}
      
      {plan.category && (
        <div className={styles.pricingCategory}>
          <i className={plan.icon}></i>
          <span>{plan.category}</span>
        </div>
      )}

      <div className={styles.pricingHeader}>
        <h3 className={styles.pricingTitle}>{plan.title}</h3>
        <div className={styles.pricingPrice}>
          {plan.price}
          {plan.unit && <span className={styles.pricingUnit}>{plan.unit}</span>}
        </div>
        <div className={styles.pricingDuration}>
          <i className="fas fa-clock"></i>
          {plan.duration}
        </div>
      </div>

      <div className={styles.pricingRecommended}>
        <i className="fas fa-check-circle"></i>
        {plan.recommended}
      </div>

      <ul className={styles.pricingFeatures}>
        {plan.features.map((feature, i) => (
          <li key={i}>
            <i className="fas fa-check"></i>
            {feature}
          </li>
        ))}
      </ul>

      <a href="#contact" className={styles.pricingCta}>
        {plan.cta}
        <i className="fas fa-arrow-right"></i>
      </a>
    </div>
  );

  return (
    <section ref={ref} className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          料金プラン
        </h2>
        <p className={`${styles.pricingIntro} ${isVisible ? styles.visible : ''}`}>
          あなたのニーズに合わせた、3つのプランをご用意しています。<br />
          まずは気軽に始められる「4時間相談プラン」からスタートし、<br />
          必要に応じて継続サポートやカスタムプランへステップアップできます。
        </p>

        {/* PC表示: グリッドレイアウト */}
        {!isMobile && (
          <div className={styles.pricingCards}>
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        )}

        {/* タブレット・スマホ表示: スライダー */}
        {isMobile && (
          <div className={styles.pricingSlider}>
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={true}
              loop={false}
              className={styles.pricingSwiper}
            >
              {pricingPlans.map((plan, index) => (
                <SwiperSlide key={plan.id}>
                  <PricingCard plan={plan} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className={`${styles.pricingNote} ${isVisible ? styles.visible : ''}`}>
          <h4 className={styles.pricingNoteTitle}>
            <i className="fas fa-info-circle"></i>
            プラン選びのポイント
          </h4>
          <div className={styles.pricingNoteContent}>
            <div className={styles.pricingNoteItem}>
              <strong>4時間相談プラン</strong>がおすすめの方:
              <ul>
                <li>初めてITサポートを利用する</li>
                <li>まずは相談してみたい</li>
                <li>単発の課題を解決したい</li>
              </ul>
            </div>
            <div className={styles.pricingNoteItem}>
              <strong>月額継続サポート</strong>がおすすめの方:
              <ul>
                <li>定期的なサポートが必要</li>
                <li>継続的に業務改善したい</li>
                <li>IT担当者がいない</li>
              </ul>
            </div>
            <div className={styles.pricingNoteItem}>
              <strong>カスタムプラン</strong>がおすすめの方:
              <ul>
                <li>ホームページを制作したい</li>
                <li>業務システムを導入したい</li>
                <li>大規模プロジェクトを進めたい</li>
              </ul>
            </div>
          </div>
        </div>

        <p className={`${styles.pricingFooter} ${isVisible ? styles.visible : ''}`}>
          ※カスタムプランの料金は、プロジェクト内容により個別にお見積もりいたします。<br />
          ※月額継続サポートは、月間稼働時間が8時間を超える場合は別途お見積りとなります。<br />
          ※すべて税込み表記です。
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
