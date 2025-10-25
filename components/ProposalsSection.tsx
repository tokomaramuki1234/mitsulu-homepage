import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import SectionCta from './SectionCta';

// 業種別ケーススタディデータ
const caseStudies = {
  construction: {
    id: 'construction',
    industry: '建設業',
    icon: 'fas fa-hard-hat',
    color: '#248EC6',
    tagline: '築10年の顧客から工事受注を実現',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=500&fit=crop',
    alt: '建設業の現場',
    summary: {
      before: [
        'ホームページを作ったが全く効果がなかった',
        '紙ベースで見積もり・顧客管理をしていた',
        '過去の顧客データが活用できていなかった'
      ],
      after: [
        'ホームページの運用方法を習得し、問い合わせが来るようになった',
        '顧客管理システムで築10年の顧客をリスト化',
        'メンテナンスDMを一斉送信し、工事受注につながった',
        '事務作業の効率化により時間削減'
      ]
    },
    details: {
      challenge: '以前、ホームページを制作したものの、誰からも問い合わせが来ず、アクセス解析も見ていたが結果が出ませんでした。見積書や顧客情報は紙のファイルで管理しており、過去の顧客に連絡を取ることも困難な状況でした。',
      solution: [
        '**ホームページの活用法を基礎から学習**: SEO対策、問い合わせフォームの最適化、施工事例の効果的な見せ方を習得',
        '**顧客管理システムの導入**: Excel・Googleスプレッドシートを活用し、過去10年分の顧客データをデジタル化',
        '**メンテナンス提案の仕組み化**: 築年数に応じた自動メンテナンス案内の設定'
      ],
      result: '顧客管理システムから「築10年」の顧客リストを抽出し、メンテナンス案内DMを一斉送信したところ、3件の工事受注に成功。また、ホームページからの問い合わせも月1〜2件入るようになり、営業活動の効率が大幅に向上しました。',
      period: '導入期間: 約2ヶ月',
      cost: '初期費用: 約15万円、月額サポート: 22,000円'
    }
  },
  nursing: {
    id: 'nursing',
    industry: '介護施設',
    icon: 'fas fa-user-nurse',
    color: '#CD2272',
    tagline: 'シフト作成時間を80%削減',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&h=500&fit=crop',
    alt: '介護施設のスタッフ',
    summary: {
      before: [
        'シフト作成に膨大な時間がかかっていた',
        '従業員の希望を手作業で集計・調整',
        'シフト変更の度に大混乱'
      ],
      after: [
        '従業員の希望を入力するだけで自動的にシフトが完成',
        'シフト作成時間が週10時間 → 週2時間に短縮',
        '従業員の満足度も向上'
      ]
    },
    details: {
      challenge: '20名のスタッフのシフト作成に毎週10時間以上を費やしていました。Excelで手作業で調整しており、希望が重なった場合は個別に電話で調整。急な変更があると、また一から作り直しという状況でした。',
      solution: [
        '**シフト管理システムの導入**: Googleフォームで希望を収集、Googleスプレッドシートで自動調整',
        '**制約条件の設定**: 必要人数、スキル、勤務時間の上限などを自動チェック',
        '**スマホ対応**: スタッフが自分のスマホから希望を入力できる仕組み'
      ],
      result: 'シフト作成時間が週10時間から2時間に短縮（80%削減）。スタッフからも「希望が通りやすくなった」「変更がすぐわかる」と好評で、離職率も低下しました。',
      period: '導入期間: 約1ヶ月',
      cost: '初期費用: 約8万円、月額サポート: 22,000円'
    }
  },
  restaurant: {
    id: 'restaurant',
    industry: '飲食業',
    icon: 'fas fa-utensils',
    color: '#EAE33C',
    tagline: '営業ツールとしての統一デザイン',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop',
    alt: '飲食店の店内',
    summary: {
      before: [
        '普通の名刺しかなかった',
        'ホームページ、チラシ、メニュー表のデザインがバラバラ',
        'お店の雰囲気が伝わりにくかった'
      ],
      after: [
        '営業ツールとしても使える綺麗なデザインの名刺',
        'ホームページ、チラシ、メニュー表のデザインを統一',
        'ブランドイメージが確立され、リピーター増加'
      ]
    },
    details: {
      challenge: '開店当初に作った名刺とホームページのデザインが古く、チラシやメニュー表も別々の業者に依頼していたため、統一感がありませんでした。「どんなお店なのか」が伝わりづらく、新規顧客獲得に苦労していました。',
      solution: [
        '**ブランドデザインの統一**: ロゴ、カラー、フォントを統一したデザインガイドライン作成',
        '**営業ツール一式の制作**: 名刺、ホームページ、チラシ、メニュー表をワンストップで制作',
        '**SNS運用サポート**: InstagramとFacebookでの発信方法もアドバイス'
      ],
      result: '統一感のあるデザインにより、「おしゃれなお店」という印象が定着。SNSでのシェアも増え、新規顧客が月20%増加。リピーター率も向上し、安定した経営につながっています。',
      period: '導入期間: 約1.5ヶ月',
      cost: '初期費用: 約20万円、月額サポート: なし（制作のみ）'
    }
  }
};

const ProposalsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [selectedIndustry, setSelectedIndustry] = useState<'construction' | 'nursing' | 'restaurant'>('construction');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const selectedCase = caseStudies[selectedIndustry];

  const toggleDetails = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  return (
    <section ref={ref} className={styles.proposalsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          業種別ケーススタディ
        </h2>
        <p className={`${styles.proposalsIntro} ${isVisible ? styles.visible : ''}`}>
          実際の課題をどう解決したか。<br />
          あなたの業種に近い事例をご覧ください。
        </p>

        {/* 業種選択ボタン */}
        <div className={`${styles.industryButtons} ${isVisible ? styles.visible : ''}`}>
          <button
            className={`${styles.industryButton} ${selectedIndustry === 'construction' ? styles.active : ''}`}
            onClick={() => setSelectedIndustry('construction')}
            style={{ '--button-color': caseStudies.construction.color } as React.CSSProperties}
          >
            <i className={caseStudies.construction.icon}></i>
            <span>建設業</span>
          </button>
          <button
            className={`${styles.industryButton} ${selectedIndustry === 'nursing' ? styles.active : ''}`}
            onClick={() => setSelectedIndustry('nursing')}
            style={{ '--button-color': caseStudies.nursing.color } as React.CSSProperties}
          >
            <i className={caseStudies.nursing.icon}></i>
            <span>介護施設</span>
          </button>
          <button
            className={`${styles.industryButton} ${selectedIndustry === 'restaurant' ? styles.active : ''}`}
            onClick={() => setSelectedIndustry('restaurant')}
            style={{ '--button-color': caseStudies.restaurant.color } as React.CSSProperties}
          >
            <i className={caseStudies.restaurant.icon}></i>
            <span>飲食業</span>
          </button>
        </div>

        {/* ケーススタディ表示 */}
        <div className={`${styles.caseStudyContainer} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.caseStudyHeader}>
            <div className={styles.caseStudyImage}>
              <img
                src={selectedCase.image}
                alt={selectedCase.alt}
                width={800}
                height={500}
              />
            </div>
            <div className={styles.caseStudyHeaderContent}>
              <h3 className={styles.caseStudyIndustry} style={{ color: selectedCase.color }}>
                <i className={selectedCase.icon}></i>
                {selectedCase.industry}
              </h3>
              <p className={styles.caseStudyTagline}>{selectedCase.tagline}</p>
            </div>
          </div>

          <div className={styles.caseStudyContent}>
            <div className={styles.beforeAfter}>
              <div className={styles.beforeColumn}>
                <h4 className={styles.beforeAfterTitle}>
                  <i className="fas fa-times-circle"></i>
                  Before（導入前の課題）
                </h4>
                <ul className={styles.beforeAfterList}>
                  {selectedCase.summary.before.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.afterColumn}>
                <h4 className={styles.beforeAfterTitle}>
                  <i className="fas fa-check-circle"></i>
                  After（導入後の成果）
                </h4>
                <ul className={styles.beforeAfterList}>
                  {selectedCase.summary.after.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* アコーディオン（詳細） */}
            <div className={styles.caseStudyAccordion}>
              <button
                className={`${styles.accordionButton} ${expandedCase === selectedCase.id ? styles.active : ''}`}
                onClick={() => toggleDetails(selectedCase.id)}
              >
                <span>詳細を見る</span>
                <i className={`fas fa-chevron-down ${expandedCase === selectedCase.id ? styles.rotate : ''}`}></i>
              </button>
              
              {expandedCase === selectedCase.id && (
                <div className={styles.accordionContent}>
                  <div className={styles.detailSection}>
                    <h5 className={styles.detailSectionTitle}>
                      <i className="fas fa-exclamation-triangle"></i>
                      抱えていた課題
                    </h5>
                    <p className={styles.detailSectionText}>{selectedCase.details.challenge}</p>
                  </div>

                  <div className={styles.detailSection}>
                    <h5 className={styles.detailSectionTitle}>
                      <i className="fas fa-lightbulb"></i>
                      実施した解決策
                    </h5>
                    <ul className={styles.detailSolutionList}>
                      {selectedCase.details.solution.map((item, index) => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.detailSection}>
                    <h5 className={styles.detailSectionTitle}>
                      <i className="fas fa-chart-line"></i>
                      得られた成果
                    </h5>
                    <p className={styles.detailSectionText}>{selectedCase.details.result}</p>
                  </div>

                  <div className={styles.detailMeta}>
                    <div className={styles.detailMetaItem}>
                      <i className="fas fa-clock"></i>
                      <span>{selectedCase.details.period}</span>
                    </div>
                    <div className={styles.detailMetaItem}>
                      <i className="fas fa-yen-sign"></i>
                      <span>{selectedCase.details.cost}</span>
                    </div>
                  </div>

                  {/* アコーディオン内のCTAボタン */}
                  <div className={styles.accordionCta}>
                    <a href="#contact" className={styles.accordionCtaButton}>
                      <i className="fas fa-envelope"></i>
                      同じような課題でお困りですか？まずはお気軽にご相談ください
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <SectionCta 
          text="他にも様々な業種・課題に対応しています"
          buttonText="あなたの課題を相談してみる"
        />
      </div>
    </section>
  );
};

export default ProposalsSection;
