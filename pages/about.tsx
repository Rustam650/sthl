import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/About.module.css';
import commonStyles from '@/styles/common.module.css';

const team = [
  {
    name: 'Александр Петров',
    position: 'Главный архитектор, основатель',
    bio: 'Выпускник МАРХИ, имеет 20-летний опыт работы в архитектуре. Руководил проектами в России, Европе и Азии.',
    image: '/images/team/team-1.jpg'
  },
  {
    name: 'Елена Смирнова',
    position: 'Дизайнер интерьеров',
    bio: 'Специалист в области дизайна интерьеров с опытом работы более 15 лет. Обладает уникальным видением пространства.',
    image: '/images/team/team-2.jpg'
  },
  {
    name: 'Михаил Иванов',
    position: 'Технический директор',
    bio: 'Инженер-строитель с богатым опытом в реализации сложных архитектурных проектов. Эксперт в области современных строительных технологий.',
    image: '/images/team/team-3.jpg'
  },
  {
    name: 'Анна Козлова',
    position: 'Ландшафтный архитектор',
    bio: 'Специалист по проектированию ландшафтов и озеленению. Создаёт гармоничную среду вокруг зданий.',
    image: '/images/team/team-4.jpg'
  }
];

const timeline = [
  {
    year: '2010',
    title: 'Основание компании',
    description: 'STHL была основана группой архитекторов, объединенных общим видением современной архитектуры.'
  },
  {
    year: '2012',
    title: 'Первый крупный проект',
    description: 'Завершение строительства бизнес-центра "Меркурий", который получил награду "Лучший коммерческий проект года".'
  },
  {
    year: '2015',
    title: 'Международное признание',
    description: 'Открытие офиса в Европе и начало работы над международными проектами. Получение престижной архитектурной премии.'
  },
  {
    year: '2018',
    title: 'Инновационные технологии',
    description: 'Внедрение передовых технологий в проектирование и строительство. Переход на BIM-моделирование для всех проектов.'
  },
  {
    year: '2020',
    title: 'Экологическое направление',
    description: 'Запуск специализированного направления по экологическому строительству и устойчивому развитию.'
  },
  {
    year: '2023',
    title: 'Новые горизонты',
    description: 'Расширение спектра услуг и географии проектов. Начало работы над масштабным проектом городского развития.'
  }
];

export default function About() {
  return (
    <Layout title="STHL | О нас">
      {/* Page Header */}
      <div className={commonStyles.pageHeader}>
        <div className="container">
          <div className={commonStyles.pageHeaderContent}>
            <h1 className={commonStyles.pageHeaderTitle}>О нашей компании</h1>
            <p className={commonStyles.pageHeaderSubtitle}>
              Узнайте больше о нашей истории, миссии и команде профессионалов
            </p>
          </div>
        </div>
      </div>

      {/* Intro Section */}
      <section className="section">
        <div className="container">
          <div className={styles.aboutIntro}>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutTitle}>Наша история</h2>
              <p className={styles.aboutParagraph}>
                STHL была основана в 2010 году группой опытных архитекторов, объединенных общим видением: создавать пространства, которые сочетают в себе инновационные технологии, функциональность и эстетическую привлекательность.
              </p>
              <p className={styles.aboutParagraph}>
                За более чем десятилетие работы мы успешно реализовали свыше 200 проектов различного масштаба и сложности: от частных резиденций до общественных и коммерческих зданий. Наши работы отмечены многочисленными профессиональными наградами и, что более важно, высоко оценены нашими клиентами.
              </p>
              <p className={styles.aboutParagraph}>
                Сегодня STHL — это команда из более чем 50 талантливых специалистов, каждый из которых вносит уникальный вклад в развитие нашей компании и реализацию самых амбициозных проектов.
              </p>
            </div>
            <div className={styles.aboutImageContainer}>
              <Image 
                src="/images/about/about-office.jpg" 
                alt="Офис STHL"
                width={600}
                height={400}
                className={styles.aboutImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className={commonStyles.sectionAlt + ' section'}>
        <div className="container">
          <div className={styles.missionContainer}>
            <div className={styles.missionContent}>
              <h2 className={styles.missionTitle}>Наша миссия и ценности</h2>
              <p className={styles.missionText}>
                Мы стремимся создавать архитектуру, которая не только отвечает функциональным требованиям, но и формирует гармоничную среду, вдохновляющую людей и способствующую устойчивому развитию общества.
              </p>
              
              <div className={styles.valuesGrid}>
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <span className="icon-innovation"></span>
                  </div>
                  <h3 className={styles.valueTitle}>Инновации</h3>
                  <p className={styles.valueDescription}>
                    Мы постоянно ищем новые подходы и технологии, чтобы создавать уникальные проекты, опережающие время.
                  </p>
                </div>
                
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <span className="icon-quality"></span>
                  </div>
                  <h3 className={styles.valueTitle}>Качество</h3>
                  <p className={styles.valueDescription}>
                    Мы уделяем внимание каждой детали, чтобы обеспечить высочайшее качество проектирования и реализации.
                  </p>
                </div>
                
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <span className="icon-sustainability"></span>
                  </div>
                  <h3 className={styles.valueTitle}>Устойчивость</h3>
                  <p className={styles.valueDescription}>
                    Мы проектируем с учетом экологических аспектов, стремясь минимизировать воздействие на окружающую среду.
                  </p>
                </div>
                
                <div className={styles.valueCard}>
                  <div className={styles.valueIcon}>
                    <span className="icon-collaboration"></span>
                  </div>
                  <h3 className={styles.valueTitle}>Сотрудничество</h3>
                  <p className={styles.valueDescription}>
                    Мы верим в силу командной работы и тесного взаимодействия с клиентами для достижения наилучших результатов.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section">
        <div className="container">
          <div className={commonStyles.sectionHeader}>
            <h2 className={commonStyles.sectionTitle}>Наша команда</h2>
            <p className={commonStyles.sectionDescription}>
              Профессионалы, которые воплощают ваши идеи в реальность
            </p>
          </div>
          
          <div className={styles.teamGrid}>
            {team.map((member, index) => (
              <div className={styles.teamCard} key={index}>
                <div className={styles.teamImageContainer}>
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={400}
                    height={500}
                    className={styles.teamImage}
                  />
                </div>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamPosition}>{member.position}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                  <div className={styles.teamSocial}>
                    <a href="#" className={styles.socialIcon}>
                      <span className="icon-linkedin"></span>
                    </a>
                    <a href="#" className={styles.socialIcon}>
                      <span className="icon-email"></span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className={commonStyles.sectionAlt + ' section'}>
        <div className="container">
          <div className={commonStyles.sectionHeader}>
            <h2 className={commonStyles.sectionTitle}>Наша история</h2>
            <p className={commonStyles.sectionDescription}>
              Ключевые моменты в развитии компании STHL
            </p>
          </div>
          
          <div className={styles.timeline}>
            {timeline.map((item, index) => (
              <div className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`} key={index}>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineYear}>{item.year}</div>
                  <h3 className={styles.timelineTitle}>{item.title}</h3>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.aboutCta + ' section'}>
        <div className="container">
          <div className={styles.aboutCtaContent}>
            <h2 className={styles.aboutCtaTitle}>Станьте частью нашей истории</h2>
            <p className={styles.aboutCtaText}>
              Давайте вместе создадим проект, который станет новой главой в истории нашей компании
            </p>
            <div className={styles.aboutCtaButtons}>
              <Link href="/contact" className={commonStyles.button + ' ' + commonStyles.buttonPrimary}>
                Связаться с нами
              </Link>
              <Link href="/portfolio" className={commonStyles.button + ' ' + commonStyles.buttonOutline + ' ' + commonStyles.whiteOutline}>
                Наши проекты
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
