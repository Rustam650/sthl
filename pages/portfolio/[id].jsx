import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/ProjectDetails.module.css';
import { PortfolioApiClient } from '../../lib/client/portfolio-api';

export default function ProjectDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullImage, setShowFullImage] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      try {
        setLoading(true);
        const data = await PortfolioApiClient.getPortfolioItemById(id);
        setProject(data);
      } catch (error) {
        console.error('Ошибка при загрузке проекта:', error);
        setError(error.message || 'Не удалось загрузить проект. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  // Функция для открытия полноразмерного изображения
  const openFullImage = () => {
    setShowFullImage(true);
    document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
  };

  // Функция для закрытия полноразмерного изображения
  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = 'auto'; // Восстанавливаем прокрутку страницы
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.projectLoading}>
            <div className={styles.loader}></div>
            <p>Загрузка проекта...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container">
          <div className={styles.projectNotFound}>
            <h1>Проект не найден</h1>
            <p>{error || 'Запрашиваемый проект не существует или был удален.'}</p>
            <Link href="/portfolio" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i> Вернуться к портфолио
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{project.title} | Портфолио STHL</title>
        <meta name="description" content={project.description} />
      </Head>
      
      <div className={styles.projectContainer}>
        <div className="container">
          <div className={styles.backLinkContainer}>
            <Link href="/portfolio" className={styles.backLink}>
              <i className="fas fa-arrow-left"></i> Назад к портфолио
            </Link>
          </div>
          
          <div className={styles.projectDetailSingleColumn}>
            {/* Блок с заголовком */}
            <div className={styles.projectHeaderRow}>
              <div className={styles.projectTitleColumn}>
                <h1 className={styles.projectTitle}>{project.title}</h1>
              </div>
            </div>

            {/* Блок с изображениями */}
            <div className={styles.projectGallery}>
              <div 
                className={styles.mainImageContainer} 
                onClick={openFullImage}
              >
                <Image 
                  src={project.images && project.images.length > 0 ? project.images[activeImage] : '/images/placeholder.jpg'}
                  alt={`${project.title} - изображение ${activeImage + 1}`}
                  width={650}
                  height={470}
                  className={styles.mainImage}
                />
              </div>
              
              {project.images && project.images.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                  {project.images.map((image, index) => (
                    <div 
                      key={index} 
                      className={`${styles.thumbnail} ${index === activeImage ? styles.activeThumbnail : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image 
                        src={image}
                        alt={`Миниатюра ${index + 1}`}
                        width={100}
                        height={70}
                        objectFit="cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Блок с описанием проекта */}
            <div className={styles.projectDescriptionBlock}>
              <h2 className={styles.projectDescriptionTitle}>Описание проекта</h2>
              <div className={styles.projectDescription}>
                {project.fullDescription ? (
                  <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
                ) : (
                  <p>{project.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для полноразмерного изображения */}
      {showFullImage && (
        <div className={styles.fullImageOverlay} onClick={closeFullImage}>
          <div className={styles.fullImageContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeFullImage}>
              &times;
            </button>
            <img
              src={project.images[activeImage]}
              alt={`${project.title} - полноразмерное изображение`}
              className={styles.fullImage}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
