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

const Home: NextPage = () => {
  useEffect(() => {
    console.log('三流 LP Initialized Successfully! 🌿');
  }, []);

  return (
    <div>
      <Head>
        <title>三流（Mitsuryū）｜ 様々な悩みの受け皿に。</title>
        <meta name="description" content="三流（Mitsuryū）- 様々な悩みの受け皿に。小さな組織の手が回らないお困りごとを横断的に解決するIT系の何でも屋さん。分野をまたぎ、小さな課題をまとめて解決します。" />
        <meta name="keywords" content="三流,Mitsuryū,ファシリテーション,Web制作,デザイン,企画,研修,地域活性化,秋田" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
        
        {/* Font Awesome */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
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
        <ProposalsSection />
        <ConcernsSection />
        <PhilosophySection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Home;
