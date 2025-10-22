import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

const proposals = [
  {
    id: 1,
    title: '例①｜小さな会社のWebと紙の顔づくり',
    description: 'Webサイトと名刺、チラシを一貫してデザイン・制作。オンラインとオフラインの印象を統一し、伝わりやすさを高めます。',
    image: 'https://via.placeholder.com/600x400/00A1C9/FFFFFF?text=Web+デザイン',
    alt: 'Webと紙の顔づくり'
  },
  {
    id: 2,
    title: '例②｜地域イベントの「なんでも屋」',
    description: '会場設営からチラシ制作、広報SNS、当日の司会進行まで。人手不足の現場を、臨機応変にサポートします。',
    image: 'https://via.placeholder.com/600x400/E60012/FFFFFF?text=地域イベント',
    alt: '地域イベントの企画運営'
  },
  {
    id: 3,
    title: '例③｜社員研修＋実践ワークショップ',
    description: 'AIツールやMicrosoft Officeの操作研修を、実際の課題解決ワークと組み合わせ。現場ですぐ使える知識を身につけられる場をつくります。',
    image: 'https://via.placeholder.com/600x400/FFF100/333333?text=研修',
    alt: '社員研修とワークショップ'
  },
  {
    id: 4,
    title: '例④｜外国人スタッフの日本語＋業務トレーニング',
    description: '接客や現場マナーなど、実務に合わせた日本語指導を提供。多国籍チームの円滑な連携を支えます。',
    image: 'https://via.placeholder.com/600x400/1C1C1C/FFFFFF?text=日本語教育',
    alt: '外国人スタッフの日本語教育'
  },
  {
    id: 5,
    title: '例⑤｜地域観光のプロモーション企画',
    description: '登山・観光案内・キャンプ体験などの体験型ツアーを企画し、Web・SNS発信までワンストップでサポートします。',
    image: 'https://via.placeholder.com/600x400/00A1C9/FFFFFF?text=地域観光',
    alt: '地域観光のプロモーション'
  },
  {
    id: 6,
    title: '例⑥｜中小企業のWeb運用まるごと代行',
    description: 'ホームページ更新、SNS運用、簡単な写真撮影や文章修正も。「専任を雇うほどではない」けれど手が回らない部分を補います。',
    image: 'https://via.placeholder.com/600x400/E60012/FFFFFF?text=Web運用',
    alt: 'Web運用代行'
  },
  {
    id: 7,
    title: '例⑦｜教育現場のICTサポート',
    description: '授業でのタブレット活用やAIツール導入、Office教育などを支援。先生と生徒の"わからない"の間をつなぎます。',
    image: 'https://via.placeholder.com/600x400/FFF100/333333?text=ICT教育',
    alt: 'ICTサポート'
  },
  {
    id: 8,
    title: '例⑧｜地域の空きスペース活用支援',
    description: 'イベントやワークショップ、展示会の企画・広報・運営を一体的に支援。地域の人が集まる場づくりをお手伝いします。',
    image: 'https://via.placeholder.com/600x400/1C1C1C/FFFFFF?text=空きスペース',
    alt: '空きスペース活用'
  },
  {
    id: 9,
    title: '例⑨｜動画で伝える企業ストーリー',
    description: '会社紹介や採用向け動画を、企画から編集まで柔軟に対応。「特別な機材がなくてもできる映像」を提案します。',
    image: 'https://via.placeholder.com/600x400/00A1C9/FFFFFF?text=動画制作',
    alt: '動画制作'
  },
  {
    id: 10,
    title: '例⑩｜キャンプ＆BBQ×学びのイベント企画',
    description: '自然の中での交流会やチームビルディングを企画。遊びながら学べる、体験重視のプログラムをつくります。',
    image: 'https://via.placeholder.com/600x400/E60012/FFFFFF?text=キャンプ',
    alt: 'キャンプイベント'
  }
];

const ProposalsSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section ref={ref} className={styles.proposalsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          三流だからできること
        </h2>
        <p className={`${styles.proposalsIntro} ${isVisible ? styles.visible : ''}`}>
          一流の専門家ではない。<br />
          けれど、分野をまたいでつなげることができる。<br />
          そんな"ちょっとずつできる"を組み合わせることで、こんな提案ができます。
        </p>

        <div className={styles.proposalsList}>
          {proposals.map((proposal, index) => (
            <article
              key={proposal.id}
              className={`${styles.proposalItem} ${
                index % 2 === 1 ? styles.proposalItemReverse : ''
              } ${isVisible ? styles.visible : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.proposalImage}>
                <img
                  src={proposal.image}
                  alt={proposal.alt}
                  width={600}
                  height={400}
                />
              </div>
              <div className={styles.proposalContent}>
                <h3 className={styles.proposalTitle}>{proposal.title}</h3>
                <p className={styles.proposalDescription}>{proposal.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProposalsSection;
