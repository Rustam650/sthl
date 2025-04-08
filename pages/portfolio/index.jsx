import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Portfolio.module.css';
import { PortfolioApiClient } from '../../lib/client/portfolio-api';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const data = await PortfolioApiClient.getAllPortfolioItems();
        setProjects(data);
      } catch (error) {
        console.error('Ошибка при загрузке проектов:', error);
        setError(error.message || 'Не удалось загрузить проекты. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Портфолио | STHL</title>
        <meta name="description" content="Примеры наших проектов в сфере дизайна интерьера и ремонта помещений" />
      </Head>
      
      <div className={styles.portfolioContainer}>
        <div className="container">
          <h1 className={styles.portfolioTitle}>Наши проекты</h1>
          <p className={styles.portfolioDescription}>
            Представляем вашему вниманию наши лучшие работы в сфере дизайна интерьера и ремонта. 
            Каждый проект уникален и создан с учетом индивидуальных потребностей заказчика.
          </p>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Загрузка проектов...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={styles.refreshButton}
              >
                Обновить страницу
              </button>
            </div>
          ) : (
            <div className={styles.portfolioGrid}>
              {projects.length === 0 ? (
                <div className={styles.noProjects}>
                  <p>Проекты пока не добавлены. Пожалуйста, посетите эту страницу позже.</p>
                </div>
              ) : (
                projects.map(project => (
                  <div key={project.id} className={styles.portfolioCard}>
                    <div className={styles.portfolioImage}>
                      <Image 
                        src={project.images && project.images.length > 0 ? project.images[0] : '/images/placeholder.jpg'}
                        alt={project.title}
                        width={350}
                        height={200}
                        objectFit="cover"
                      />
                    </div>
                    <div className={styles.portfolioContent}>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <Link href={`/portfolio/${project.id}`} className={styles.cardLink}>
                        Подробнее <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}