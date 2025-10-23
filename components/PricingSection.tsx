import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const PricingSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          ご予算に合わせて柔軟に対応
        </h2>
        <p className={`${styles.pricingIntro} ${isVisible ? styles.visible : ''}`}>
          ご予算に応じて柔軟に対応いたします。まずはお気軽にご相談ください。
        </p>

        <div className={styles.pricingCards}>
          <div className={`${styles.pricingCard} ${isVisible ? styles.visible : ''}`} style={{ animationDelay: '0s' }}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>時間単価</h3>
              <div className={styles.pricingPrice}>¥5,500<span>～/時間</span></div>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>単発のご相談・作業</li>
              <li>スポット対応</li>
              <li>短期プロジェクト</li>
            </ul>
          </div>

          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured} ${isVisible ? styles.visible : ''}`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.pricingBadge}>おすすめ</div>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>月額契約</h3>
              <div className={styles.pricingPrice}>¥16,500<span>〜/月</span></div>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>継続的なサポート</li>
              <li>電話等の相談無料</li>
              <li>優先対応</li>
            </ul>
            <p className={styles.pricingNote}>※月間稼働時間が8時間を超える場合は別途お見積り</p>
          </div>

          <div className={`${styles.pricingCard} ${isVisible ? styles.visible : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.pricingHeader}>
              <h3 className={styles.pricingTitle}>カスタムプラン</h3>
              <div className={styles.pricingPrice}>要相談</div>
            </div>
            <ul className={styles.pricingFeatures}>
              <li>大規模プロジェクト</li>
              <li>専任サポート</li>
              <li>長期契約</li>
            </ul>
            <p className={styles.pricingNote}>お見積もりいたします</p>
          </div>
        </div>

        <p className={`${styles.pricingFooter} ${isVisible ? styles.visible : ''}`}>
          ※価格はすべて税込み表記です。<br />※料金はプロジェクト内容により変動します。詳しくはお問い合わせください。
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
