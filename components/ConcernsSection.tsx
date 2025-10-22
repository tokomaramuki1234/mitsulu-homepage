import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const concernsData = [
  {
    id: 'it',
    icon: 'fas fa-desktop',
    title: 'IT・デジタル系（15項目）',
    items: [
      'パソコン、スマホの操作が分からない。もっと上手に使いたい。',
      'ホームページを作りたい。自分だけのメールアドレスがほしい。',
      'Webサイトの更新方法が分からず放置している。',
      'SNSで情報発信したいが、やり方が分からない。',
      'Excelやパワポの使い方を教えてほしい。',
      'AIツールを仕事に活かしたいが、どこから始めればいいか分からない。',
      '動画編集を覚えたいが、独学では難しい。',
      'デザインソフト（Photoshop、Illustrator）を使えるようになりたい。',
      'オンライン会議のセッティングが苦手。',
      '社内のIT機器トラブルに対応できる人がいない。',
      'Webサイトのアクセス解析をしたいが、Google Analyticsが難しい。',
      'メールマガジンやニュースレターを始めたい。',
      'クラウドストレージ（GoogleDrive、Dropbox）の使い方を知りたい。',
      'タブレットを授業で使いたいが、設定が分からない。',
      'ECサイトを立ち上げたいが、どのプラットフォームがいいか分からない。'
    ]
  },
  {
    id: 'management',
    icon: 'fas fa-briefcase',
    title: '経営・組織運営（12項目）',
    items: [
      '会議がいつも長引いて結論が出ない。進行を任せたい。',
      '新人研修のプログラムを作りたいが、ノウハウがない。',
      'チームビルディングのイベントを企画したい。',
      '社内のコミュニケーションが希薄。活性化させたい。',
      'プロジェクトの進行管理が苦手。外部の目が欲しい。',
      '業務フローを整理したいが、どこから手をつければいいか分からない。',
      '社員のモチベーションを上げる施策を考えたい。',
      'リモートワークの環境を整えたいが、何が必要か分からない。',
      '採用活動を強化したいが、アピール方法が分からない。',
      '社内マニュアルを作りたいが、時間がない。',
      '働き方改革を進めたいが、何から始めればいいか分からない。',
      '後継者育成のプログラムを作りたい。'
    ]
  },
  {
    id: 'marketing',
    icon: 'fas fa-bullhorn',
    title: 'マーケティング・広報（10項目）',
    items: [
      'チラシや名刺のデザインを頼みたいが、どこに頼めばいいか分からない。',
      '会社案内のパンフレットを作りたい。',
      'イベントのポスターやフライヤーを作りたい。',
      'プレスリリースを書きたいが、書き方が分からない。',
      'ブランドイメージを統一したいが、どうすればいいか分からない。',
      '商品・サービスの魅力を伝える動画を作りたい。',
      'SNS広告を出したいが、運用方法が分からない。',
      '地域メディアに取り上げてもらう方法が知りたい。',
      'ロゴマークを作りたいが、デザイナーに依頼する予算がない。',
      'お客様の声を集めて活用したい。'
    ]
  },
  {
    id: 'international',
    icon: 'fas fa-globe',
    title: '国際化・多様性（8項目）',
    items: [
      '外国人スタッフとのコミュニケーションがうまくいかない。',
      '日本語教育のプログラムを用意したい。',
      '多文化共生の研修を実施したい。',
      '外国人観光客向けの案内を充実させたい。',
      '英語のパンフレットやWebサイトを作りたい。',
      'インバウンド対応の研修をしたい。',
      '外国人スタッフの定着率を上げたい。',
      '多様性を活かした職場づくりをしたい。'
    ]
  },
  {
    id: 'community',
    icon: 'fas fa-users',
    title: '地域・コミュニティ・体験（5項目）',
    items: [
      '地域イベントを企画したいが、何から始めればいいか分からない。',
      '観光ツアーを企画したいが、ノウハウがない。',
      'キャンプやアウトドアイベントを企画したい。',
      '地域の魅力を発信したいが、方法が分からない。',
      '空きスペースを活用したイベントを開催したい。'
    ]
  }
];

const ConcernsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section ref={ref} className={styles.concernsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          こんなお悩みありませんか？
        </h2>

        <div className={styles.concernsAccordion}>
          {concernsData.map((category, index) => (
            <div
              key={category.id}
              className={`${styles.accordionItem} ${isVisible ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <button
                className={styles.accordionHeader}
                aria-expanded={openAccordion === category.id}
                onClick={() => toggleAccordion(category.id)}
              >
                <i className={category.icon}></i>
                <span>{category.title}</span>
                <i className={`fas fa-chevron-down ${styles.accordionIcon}`}></i>
              </button>
              <div
                className={`${styles.accordionContent} ${
                  openAccordion === category.id ? styles.accordionContentOpen : ''
                }`}
              >
                <ul className={styles.concernsList}>
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConcernsSection;
