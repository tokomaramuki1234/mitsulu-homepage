import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const concernsData = [
  {
    id: 'facilitation',
    icon: 'fas fa-bullseye',
    color: '#248EC6', // メインカラー：Cyan
    title: 'ファシリテーション',
    items: [
      '会議がいつも長引いて結論が出ない。進行を任せたい。',
      '社内のコミュニケーションが希薄。活性化させたい。',
      'プレゼンテーションやワークショップの進行に不安がある。',
      'ブレインストーミングをうまく引き出せない。',
      'オンライン会議のセッティングや進行が苦手。'
    ]
  },
  {
    id: 'planning',
    icon: 'fas fa-puzzle-piece',
    color: '#CD2272', // メインカラー：Magenta
    title: '企画・研修',
    items: [
      '新人研修のプログラムを作りたいが、ノウハウがない。',
      'チームビルディングのイベントを企画したい。',
      '社員のモチベーションを上げる施策を考えたい。',
      '採用活動を強化したいが、アピール方法が分からない。',
      '後継者育成のプログラムを作りたい。'
    ]
  },
  {
    id: 'design',
    icon: 'fas fa-paint-brush',
    color: '#EAE33C', // メインカラー：Yellow
    title: 'デザイン・制作',
    items: [
      'チラシや名刺のデザインを頼みたいが、どこに頼めばいいか分からない。',
      '会社案内のパンフレットを作りたい。',
      'イベントのポスターやフライヤーを作りたい。',
      'ロゴマークを作りたいが、デザイナーに依頼する予算がない。',
      'ブランドイメージを統一したいが、どうすればいいか分からない。',
      '商品・サービスの魅力を伝える動画を作りたい。'
    ]
  },
  {
    id: 'web',
    icon: 'fas fa-laptop-code',
    color: '#0A0F0F', // セミメインカラー：Black
    title: 'Web構築・開発・運用',
    items: [
      'ホームページを作りたい。自分だけのメールアドレスがほしい。',
      'Webサイトの更新方法が分からず放置している。',
      'SNSで情報発信したいが、やり方が分からない。',
      'Webサイトのアクセス解析をしたいが、Google Analyticsが難しい。',
      'メールマガジンやニュースレターを始めたい。',
      'SNS広告を出したいが、運用方法が分からない。',
      'ECサイトを立ち上げたいが、どのプラットフォームがいいか分からない。'
    ]
  },
  {
    id: 'management',
    icon: 'fas fa-cogs',
    color: '#1B2B59', // サブカラー：Navy
    title: '進行管理',
    items: [
      'プロジェクトの進行管理が苦手。外部の目が欲しい。',
      '業務フローを整理したいが、どこから手をつければいいか分からない。',
      '社内マニュアルを作りたいが、時間がない。',
      '働き方改革を進めたいが、何から始めればいいか分からない。',
      '複数の外注先との調整が大変。まとめて任せたい。'
    ]
  },
  {
    id: 'education',
    icon: 'fas fa-graduation-cap',
    color: '#D1221A', // サブカラー：Red
    title: '教育・講習',
    items: [
      'パソコン、スマホの操作が分からない。もっと上手に使いたい。',
      'Excelやパワポの使い方を教えてほしい。',
      'AIツールを仕事に活かしたいが、どこから始めればいいか分からない。',
      '動画編集を覚えたいが、独学では難しい。',
      'デザインソフト（Photoshop、Illustrator）を使えるようになりたい。',
      '日本語教育のプログラムを用意したい。',
      '外国人スタッフとのコミュニケーションがうまくいかない。',
      'タブレットを授業で使いたいが、設定が分からない。'
    ]
  },
  {
    id: 'experience',
    icon: 'fas fa-mountain',
    color: '#208B3B', // サブカラー：Green
    title: '体験サポート',
    items: [
      '地域イベントを企画したいが、何から始めればいいか分からない。',
      '観光ツアーを企画したいが、ノウハウがない。',
      'キャンプやアウトドアイベントを企画したい。',
      '地域の魅力を発信したいが、方法が分からない。',
      '空きスペースを活用したイベントを開催したい。',
      '外国人観光客向けの案内を充実させたい。',
      'インバウンド対応の研修をしたい。'
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
                <i className={category.icon} style={{ color: category.color }}></i>
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
