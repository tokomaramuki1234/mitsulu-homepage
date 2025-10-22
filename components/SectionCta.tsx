import styles from '../styles/Home.module.css';

interface SectionCtaProps {
  text?: string;
  buttonText?: string;
}

const SectionCta: React.FC<SectionCtaProps> = ({ 
  text = '気になるサービスがありましたか？',
  buttonText = 'まずは気軽にご相談ください'
}) => {
  return (
    <div className={styles.sectionCta}>
      <p className={styles.ctaText}>{text}</p>
      <a href="#contact" className={styles.ctaButtonInline}>
        {buttonText} <i className="fas fa-arrow-right"></i>
      </a>
    </div>
  );
};

export default SectionCta;
