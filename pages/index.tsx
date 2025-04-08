import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>STHL | Современные архитектурные решения</title>
        <meta name="description" content="Инновационная архитектурная компания, специализирующаяся на натуральном камне и современных дизайнерских решениях" />
      </Head>
      
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>STONE HILL</h1>
            <p className={styles.heroDescription}>
              Мы специализируемся на производстве облицовочной плитки, фасадного
              декора, малых архитектурных форм из натурального камня, оказании
              профессиональных строительно-монтажных и проектных услуг.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/stones" className={styles.primaryBtn}>
                <span>Каталог камня</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
              <Link href="/contact" className={styles.secondaryBtn}>
                <span>Связаться с нами</span>
                <i className="fas fa-envelope"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Блок преимуществ */}
      <section className={styles.advantages}>
        <div className="container">
          <div className={styles.advantagesGrid}>
            <div className={styles.advantageCard}>
              <div className={styles.advantageIcon}>
                <i className="fas fa-medal"></i> {/* Иконка медали для премиум качества */}
              </div>
              <h3 className={styles.advantageTitle}>Премиум качество</h3>
              <p className={styles.advantageDesc}>Лучшие сорта натурального камня со всего мира</p>
            </div>
            
            <div className={styles.advantageCard}>
              <div className={styles.advantageIcon}>
                <i className="fas fa-cog"></i> {/* Иконка шестеренки для точной обработки */}
              </div>
              <h3 className={styles.advantageTitle}>Точная обработка</h3>
              <p className={styles.advantageDesc}>Современное оборудование и опытные мастера</p>
            </div>
            
            <div className={styles.advantageCard}>
              <div className={styles.advantageIcon}>
                <i className="fas fa-truck"></i> {/* Стандартная иконка грузовика для доставки */}
              </div>
              <h3 className={styles.advantageTitle}>Быстрая доставка</h3>
              <p className={styles.advantageDesc}>Доставка по всей России в кратчайшие сроки</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Остальные секции главной страницы */}
    </Layout>
  );
}
