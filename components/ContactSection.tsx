import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const ContactSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Formspreeを使用（無料プラン）
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', company: '', message: '' });
      } else {
        setError('送信に失敗しました。もう一度お試しください。');
      }
    } catch (err) {
      setError('送信に失敗しました。もう一度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} ${isVisible ? styles.visible : ''}`}>
          ご相談ください
        </h2>
        <p className={`${styles.contactIntro} ${isVisible ? styles.visible : ''}`}>
          誰に頼めばいいかわからない案件、複数の分野にまたがる業務、現場の"潤滑油"が必要なとき、ぜひお声がけください。
        </p>

        <div className={styles.contactFormWrapper}>
          {submitted ? (
            <div className={styles.thankYouMessage}>
              <i className="fas fa-check-circle"></i>
              <h3>お問い合わせありがとうございます</h3>
              <p>内容を確認次第、ご連絡させていただきます。</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`${styles.contactForm} ${isVisible ? styles.visible : ''}`}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  お名前 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  placeholder="山田 太郎"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.formLabel}>
                  会社名・団体名（任意）
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="株式会社○○"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  お問い合わせ内容 <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={styles.formTextarea}
                  placeholder="お困りごとやご相談内容をお聞かせください..."
                />
              </div>

              {error && (
                <div className={styles.errorMessage}>
                  <i className="fas fa-exclamation-circle"></i> {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={styles.formSubmitButton}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> 送信中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> 送信する
                  </>
                )}
              </button>

              <p className={styles.formNote}>
                ※メールアドレス・電話番号の入力は不要です。<br />
                返信が必要な場合は、メッセージ欄にご記入ください。
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
