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
      title: '時間単価',
      price: '¥5,500',
      unit: '～/時間',
      features: [
        '単発のご相談・作業',
        'スポット対応',
        '短期プロジェクト'
      ],
      isFeatured: false,
      note: null
    },
    {
      title: '月額契約',
      price: '¥16,500',
      unit: '〜/月',
      features: [
        '継続的なサポート',
        '電話等の相談無料',
        '優先対応'
      ],
      isFeatured: true,
      note: '※月間稼働時間が8時間を超える場合は別途お見積り'
    },
    {
      title: 'カスタムプラン',
      price: '要相談',
      unit: '',
      features: [
        '大規模プロジェクト',
        '専任サポート',
        '長期契約'
      ],
      isFeatured: false,
      note: 'お見積もりいたします'
    }
  ];

  // SSR時はnullを返す
  if (isMobile === null) {
    return (
      <section ref={ref} className={styles.pricingSection} id="pricing">
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
            ご予算に合わせて柔軟に対応
          </h2>
        </div>
      </section>
    );
  }

  const PricingCard = ({ plan, index }: { plan: typeof pricingPlans[0], index: number }) => (
    <div
      className={`${styles.pricingCard} ${plan.isFeatured ? styles.pricingCardFeatured : ''} ${isVisible ? styles.visible : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {plan.isFeatured && <div className={styles.pricingBadge}>おすすめ</div>}
      <div className={styles.pricingHeader}>
        <h3 className={styles.pricingTitle}>{plan.title}</h3>
        <div className={styles.pricingPrice}>
          {plan.price}
          {plan.unit && <span>{plan.unit}</span>}
        </div>
      </div>
      <ul className={styles.pricingFeatures}>
        {plan.features.map((feature, i) => (
          <li key={i}>{feature}</li>
        ))}
      </ul>
      {plan.note && <p className={styles.pricingNote}>{plan.note}</p>}
    </div>
  );

  return (
    <section ref={ref} className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          ご予算に合わせて柔軟に対応
        </h2>
        <p className={`${styles.pricingIntro} ${isVisible ? styles.visible : ''}`}>
          ご予算に応じて柔軟に対応いたします。まずはお気軽にご相談ください。
        </p>

        {/* PC表示: グリッドレイアウト */}
        {!isMobile && (
          <div className={styles.pricingCards}>
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} />
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
                <SwiperSlide key={index}>
                  <PricingCard plan={plan} index={index} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <p className={`${styles.pricingFooter} ${isVisible ? styles.visible : ''}`}>
          ※価格はすべて税込み表記です。<br />※料金はプロジェクト内容により変動します。詳しくはお問い合わせください。
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
