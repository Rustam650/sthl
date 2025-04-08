import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Services.module.css';
import commonStyles from '../styles/common.module.css';

// Список услуг
const services = [
  {
    id: 'facade-installation',
    title: 'Монтаж Фасада',
    description: 'Полный спектр услуг по облицовке фасадов натуральным камнем.',
    image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    features: [
      'Установка фасонных и архитектурных элементов из натурального камня, создавая уникальные дизайнерские решения.',
      'Наши специалисты обладают богатым опытом и необходимыми навыками для работы с камнем любой сложности.',
      'Высокое качество исполнения, соблюдение сроков и индивидуальный подход к каждому клиенту.'
    ]
  },
  {
    id: 'exterior-design',
    title: 'ДИЗАЙН-ПРОЕКТ ЭКСТЕРЬЕРА',
    description: 'Проект включает в себя визуализацию фасада здания или благоустройство территории, ландшафтный дизайн.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    features: [
      'Бесплатная консультация при заказе проекта',
      'Цены на камень от поставщика',
      'Полная рабочая документация проекта',
      'Авторский надзор'
    ]
  },
  {
    id: 'interior-design',
    title: 'ДИЗАЙН-ПРОЕКТ ИНТЕРЬЕРА',
    description: 'Создадим дизайн, отражающий ваш вкус. Работаем не только с жилыми пространствами - квартирами и домами, а так же с коммерческими пространствами.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    features: [
      'Индивидуальный проект',
      '3D визуализации',
      'Возможность корректировки',
      'Проект составляется под Ваш бюджет'
    ]
  }
];

export default function Services() {
  return (
    <Layout title="STHL | Услуги">
      {/* Hero Section */}
      <section className={styles.servicesHero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Наши услуги</h1>
            <p className={styles.heroSubtitle}>
              Мы предлагаем полный спектр услуг по работе с натуральным камнем, 
              создавая долговечные и элегантные решения для вашего пространства
            </p>
          </div>
        </div>
      </section>

      {/* Services Details - сразу перейдем к детальному описанию, убрав карточки */}
      {services.map((service, index) => (
        <section 
          className={`${styles.serviceDetail} section ${index % 2 === 0 ? commonStyles.sectionAlt : ''}`} 
          key={service.id} 
          id={`${service.id}-details`}
        >
          <div className="container">
            <div className={styles.serviceDetailWrapper}>
              <div className={index % 2 === 0 ? styles.serviceDetailImageLeft : styles.serviceDetailImageRight}>
                <div className={styles.serviceDetailImageContainer}>
                  <Image 
                    src={service.image}
                    alt={service.title}
                    width={800}
                    height={500}
                    className={styles.detailImage}
                  />
                </div>
              </div>
              
              <div className={styles.serviceDetailInfo}>
                <h2 className={styles.serviceDetailTitle}>{service.title}</h2>
                <div className={styles.separator}></div>
                <p className={styles.serviceDetailDescription}>{service.description}</p>
                
                <h3 className={styles.featuresTitle}>Что мы предлагаем</h3>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, index) => (
                    <li className={styles.featuresItem} key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className={`${styles.servicesCta} section`}>
        <div className="container">
          <div className={styles.servicesCtaContent}>
            <h2 className={styles.servicesCtaTitle}>Готовы начать ваш проект?</h2>
            <p className={styles.servicesCtaText}>Свяжитесь с нами для консультации и обсуждения деталей</p>
            <Link href="/contact" className={`${commonStyles.button} ${commonStyles.buttonPrimary} ${styles.ctaButton}`}>
              Связаться с нами
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}