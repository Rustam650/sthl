import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import styles from '@/styles/Stones.module.css';
import commonStyles from '@/styles/common.module.css';
import { StoneApiClient } from '@/lib/client/stone-api.js';

// Определение типа для камня, совпадающее с типом в API
type Stone = {
  id: number;
  name: string;
  description: string | null;
  type?: string | null;
  price?: string | number | null;
  image?: string;
  images?: string[];
  image_url?: string | null;
  category?: string | null;
};

export default function StoneDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [stone, setStone] = useState<Stone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState<boolean>(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Загружаем данные только если id определен
    if (!id) return;

    async function fetchStoneDetails() {
      try {
        console.log(`Fetching details for stone with ID: ${id}`);
        const stoneId = Array.isArray(id) ? id[0] : id;
        setStone(await StoneApiClient.getStoneById(stoneId as string));
      } catch (error) {
        console.error('Error fetching stone details:', error);
        
        // Проверяем, связана ли ошибка с базой данных
        if (error instanceof Error && (
          error.message.includes('база данных') || 
          error.message.includes('таблица') || 
          error.message.includes('не существует')
        )) {
          setDbError(true);
        }
        
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    }

    fetchStoneDetails();
  }, [id]);
  
  // Отладка описания камня
  useEffect(() => {
    if (stone?.description) {
      console.log("Описание из БД:", JSON.stringify(stone.description));
    }
  }, [stone]);

  // Функция для перехода к инициализации БД
  const goToDbInitialization = () => {
    router.push('/stonehill/dashboard');
  };

  // Функция для открытия изображения в полном размере
  const openFullImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setShowFullImage(true);
    document.body.style.overflow = 'hidden';
  };

  // Функция для закрытия полноразмерного изображения
  const closeFullImage = () => {
    setShowFullImage(false);
    document.body.style.overflow = 'auto';
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <Layout title="STHL | Загрузка...">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div className={styles.loader}></div>
          <p>Загрузка информации о камне...</p>
        </div>
      </Layout>
    );
  }

  // Если камень не найден, показываем сообщение об ошибке
  if (error || !stone) {
    return (
      <Layout title="STHL | Камень не найден">
        <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
          <h1>Камень не найден</h1>
          <p>{error || 'Запрашиваемый вид камня не существует или был удален.'}</p>
          
          {dbError ? (
            <>
              <p style={{color: '#d9534f', marginTop: '1rem'}}>
                Обнаружена проблема с подключением к базе данных, хотя структура базы данных может быть корректной.
              </p>
              <div style={{maxWidth: '600px', margin: '0 auto', textAlign: 'left', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '5px'}}>
                <h4 style={{marginTop: '0.5rem'}}>Возможные причины проблемы:</h4>
                <ul>
                  <li>Недостаточные права доступа пользователя базы данных (gen_user)</li>
                  <li>Неверная конфигурация подключения к БД в настройках .env</li> 
                  <li>Несоответствие имен таблиц в SQL-запросах фактической структуре БД</li>
                  <li>Временная недоступность сервера БД или сетевые проблемы</li>
                  <li>Ошибки в SQL-запросах при обращении к таблице stone</li>
                </ul>
                <p style={{fontSize: '0.9em', fontStyle: 'italic'}}>Приложение использует прямые SQL-запросы без ORM.</p>
              </div>
              <div style={{marginTop: '1.5rem'}}>
                <button 
                  onClick={() => fetch('/api/debug/db-status')
                    .then(res => res.json())
                    .then(data => {
                      const formattedData = {
                        подключение: data.mysqlConnection ? 'Успешно' : 'Ошибка',
                        таблицы: data.tables?.tables || 'Нет доступа',
                        рекомендации: data.recommendations || []
                      };
                      alert('Диагностика прямого подключения к БД: \n' + JSON.stringify(formattedData, null, 2));
                    })
                    .catch(err => {
                      alert('Ошибка диагностики: ' + err.message);
                    })
                  }
                  className={commonStyles.button}
                  style={{ marginRight: '1rem', backgroundColor: '#17a2b8', color: 'white' }}
                >
                  Диагностика БД
                </button>
                <button 
                  onClick={() => {
                    fetch('/api/admin/check-db-permissions').then(res => res.json())
                    .then(data => {
                      alert('Проверка прав доступа: \n' + 
                        JSON.stringify({
                          подключение: data.connection ? 'Успешно' : 'Ошибка',
                          права: data.permissions || {},
                          сообщение: data.message || 'Нет данных'
                        }, null, 2));
                    }).catch(err => {
                      console.error('Ошибка проверки прав:', err);
                      alert('Для проверки прав необходима авторизация администратора');
                      goToDbInitialization();
                    });
                  }}
                  className={commonStyles.button}
                  style={{ marginRight: '1rem', backgroundColor: '#28a745', color: 'white' }}
                >
                  Проверить права
                </button>
                <button 
                  onClick={goToDbInitialization}
                  className={commonStyles.button + ' ' + commonStyles.buttonPrimary}
                  style={{ marginRight: '1rem' }}
                >
                  Инициализировать базу данных
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className={commonStyles.button + ' ' + commonStyles.buttonOutline}
                >
                  Обновить страницу
                </button>
              </div>
            </>
          ) : null}
          
          <Link
            href="/stones"
            className={commonStyles.button + ' ' + commonStyles.buttonPrimary}
            style={{ marginTop: '2rem' }}
          >
            Вернуться к списку камней
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`STHL | ${stone.name}`}>
      {/* Секция с информацией о камне */}
      <section className={styles.stoneDetailSection}>
        <div className="container">
          <div className={styles.stoneDetailTwoColumn}>
            {/* Колонка с изображением */}
            <div className={styles.stoneImageColumn}>
              <div className={styles.imageContainer}>
                {stone.images && stone.images.length > 0 ? (
                  <Image 
                    src={stone.images[0]} 
                    alt={stone.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className={styles.stoneDetailImage}
                    priority
                    onClick={() => stone.images && stone.images.length > 0 && openFullImage(stone.images[0])}
                  />
                ) : stone.image_url ? (
                  <Image 
                    src={stone.image_url} 
                    alt={stone.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className={styles.stoneDetailImage}
                    priority
                    onClick={() => stone.image_url && openFullImage(stone.image_url)}
                  />
                ) : (
                  <div className={styles.noDetailImage}>
                    <p>Изображение отсутствует</p>
                  </div>
                )}
                <div className={styles.zoomIcon} onClick={() => {
                  const imageUrl = stone.images && stone.images.length > 0 
                    ? stone.images[0] 
                    : stone.image_url || '';
                  if (imageUrl) openFullImage(imageUrl);
                }}>
                  <span>🔍</span>
                </div>
              </div>
            </div>
            
            {/* Колонка с описанием */}
            <div style={{ 
              flex: '1', 
              minWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              height: '450px'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <h2 className={styles.stoneDetailName} style={{ margin: 0 }}>{stone.name}</h2>
                {stone.type && <p className={styles.stoneDetailType} style={{ margin: '0.5rem 0 0 0' }}>{stone.type}</p>}
              </div>
              {stone.price && (
                <div className={styles.stonePriceBlock} style={{ marginBottom: '1.5rem' }}>
                  <h3 className={styles.stoneContentHeading}>Стоимость</h3>
                  <p className={styles.stonePriceValue}>от {stone.price} ₽/м²</p>
                </div>
              )}
              <div style={{ flex: '1' }}></div>
              <div style={{ 
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M2 12h20M20 16H4M20 8H4"/>
                  </svg>
                  <span style={{ fontSize: '10px', color: '#313131', marginTop: '4px' }}>Прочность</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize: '10px', color: '#313131', marginTop: '4px' }}>Долговечность</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 16.8a7.14 7.14 0 0 0 2.24-3.22 7.23 7.23 0 0 0 .46-2.58 7.5 7.5 0 0 0-2.38-5.5 7.23 7.23 0 0 0-5.32-2A7.5 7.5 0 0 0 8.5 6.5a7.23 7.23 0 0 0-2.38 5.5 7.14 7.14 0 0 0 2.7 5.8"/>
                    <path d="M17 17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1"/>
                  </svg>
                  <span style={{ fontSize: '10px', color: '#313131', marginTop: '4px' }}>Экологичность</span>
                </div>
              </div>
              <div style={{ flex: '1' }}></div>
              <div className={styles.stoneActions} style={{ justifyContent: 'flex-start', marginTop: 'auto' }}>
                <Link 
                  href="/contact" 
                  className={commonStyles.button + ' ' + commonStyles.buttonPrimary}
                >
                  Запросить образец
                </Link>
                <Link 
                  href="/contact" 
                  className={commonStyles.button + ' ' + commonStyles.buttonOutline}
                >
                  Уточнить наличие
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.stoneFullWidthSection} style={{ marginTop: '2rem' }}>
            <h3 className={styles.stoneContentHeading}>Описание</h3>
            <div className={styles.stoneDetailDescription}>
              {stone.description ? (
                <>
                  {stone.description
                    .split(/\r?\n|\r|\n\r/)
                    .filter(line => line !== '')
                    .map((paragraph, index) => (
                      <p key={index} className={styles.descriptionParagraph}>
                        {paragraph.trim() || <>&nbsp;</>}
                      </p>
                    ))}
                </>
              ) : (
                <p className={styles.descriptionParagraph}>Описание отсутствует</p>
              )}
            </div>
          </div>
          <div className={styles.stoneNavigation}>
            <div className={styles.stoneNavLinks}>
              <Link href="/stones" className={styles.backToStones}>
                К списку камней
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className={commonStyles.sectionHeader}>
            <h2 className={commonStyles.sectionTitle}>Заинтересовались {stone.name.toLowerCase()}?</h2>
            <p className={commonStyles.sectionDescription}>
              Наши специалисты готовы ответить на все ваши вопросы
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/contact" className={commonStyles.button + ' ' + commonStyles.buttonPrimary}>
              Получить консультацию
            </Link>
          </div>
        </div>
      </section>
      {/* Полноразмерное изображение */}
      {showFullImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '40px'
          }}
          onClick={closeFullImage}
        >
          <button 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 1001
            }}
            onClick={closeFullImage}
          >
            ×
          </button>
          <div 
            className={styles.fullImageContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={currentImage} 
              alt={stone.name} 
              className={styles.fullImage}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}
