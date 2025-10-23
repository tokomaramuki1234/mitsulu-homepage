import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import styles from '../styles/Home.module.css';

const ContactSection = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      // Vercel API Routes に送信
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', category: '', message: '' });
      } else {
        setError(result.message || '送信に失敗しました。もう一度お試しください。');
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
              <div className={styles.formRow}>
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
                  <label htmlFor="email" className={styles.formLabel}>
                    メールアドレス <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    電話番号（任意）
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="090-1234-5678"
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
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.formLabel}>
                  お問い合わせ種類 <span className={styles.required}>*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={styles.formSelect}
                >
                  <option value="">選択してください</option>
                  <option value="facilitation">ファシリテーション</option>
                  <option value="planning">企画・研修</option>
                  <option value="design">デザイン・制作</option>
                  <option value="web">Web構築・開発・運用</option>
                  <option value="pm">進行管理</option>
                  <option value="education">教育・講習</option>
                  <option value="experience">体験サポート</option>
                  <option value="estimate">料金見積もり</option>
                  <option value="other">その他</option>
                </select>
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
                  placeholder="お困りごとやご相談内容を具体的にお聞かせください...&#10;&#10;例：&#10;・Webサイトのリニューアルを検討しています&#10;・社員研修の企画をお願いしたい&#10;・予算は○○円程度を考えています"
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
                ※お送りいただいた情報は、お問い合わせ対応の目的でのみ使用いたします。<br />
                ※通常、1〜2営業日以内にご返信いたします。
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
