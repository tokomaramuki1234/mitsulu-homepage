import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import styles from '../styles/Home.module.css';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import ProposalsSection from '../components/ProposalsSection';
import ConcernsSection from '../components/ConcernsSection';
import PhilosophySection from '../components/PhilosophySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import StickyCta from '../components/StickyCta';
import AchievementsSection from '../components/AchievementsSection';
import PricingSection from '../components/PricingSection';

const Home: NextPage = () => {
  useEffect(() => {
    console.log('三流 LP Initialized Successfully! 🌿');
  }, []);

  return (
    <div>
      <Head>
        <title>三流（Mitsulu）｜ 小さな悩みの受け皿に。小さな組織のIT課題を横断的に解決</title>
        <meta name="description" content="三流（Mitsulu）は小規模組織・個人事業主向けのIT課題解決サービス。Web制作、システム開発、ファシリテーション、企画・研修など、手が回らないお困りごとを横断的に解決します。時間単価5,500円〜、月額16,500円〜。50+プロジェクト実績。様々な悩みの受け皿に。" />
        <meta name="keywords" content="三流,Mitsulu,IT課題解決,Web制作,システム開発,ファシリテーション,企画,研修,小規模組織,個人事業主,業務効率化,地域活性化,秋田" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        {/* Adobe Fonts - ADSコリダンス */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(d) {
                var config = {
                  kitId: 'yhm1iir',
                  scriptTimeout: 3000,
                  async: true
                },
                h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
              })(document);
            `,
          }}
        />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8G3032S69R"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8G3032S69R');
            `,
          }}
        />
        
        {/* Schema.org 構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "三流（Mitsulu）",
              "alternateName": "Mitsuryū",
              "url": "https://mitsulu.style",
              "logo": "https://mitsulu.style/images/topimg.svg",
              "description": "小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん。Web制作、システム開発、ファシリテーション、企画・研修など幅広く対応。",
              "areaServed": {
                "@type": "Country",
                "name": "JP"
              },
              "priceRange": "¥5,500 - ¥100,000+",
              "telephone": "",
              "email": "",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "JP",
                "addressRegion": "秋田県"
              },
              "serviceType": [
                "Web制作",
                "システム開発",
                "ファシリテーション",
                "企画・研修",
                "デザイン",
                "地域活性化",
                "業務効率化"
              ],
              "slogan": "様々な悩みの受け皿に - All worries welcome here",
              "foundingDate": "2023",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "reviewCount": "20"
              }
            })
          }}
        />
      </Head>

      {/* Skip Link */}
      <a href="#main-content" className={styles.skipLink}>
        メインコンテンツへスキップ
      </a>

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main id="main-content">
        <ServicesSection />
        <AchievementsSection />
        <PricingSection />
        <ProposalsSection />
        <ConcernsSection />
        <PhilosophySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />

      {/* Sticky CTA Button */}
      <StickyCta />
    </div>
  );
};

export default Home;
