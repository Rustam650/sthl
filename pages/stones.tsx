import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Stones.module.css';
import commonStyles from '@/styles/common.module.css';
import { StoneApiClient } from '@/lib/client/stone-api.js';

// Определение типа для камня
type Stone = {
  id: number;
  name: string;
  description: string | null;
  type?: string | null;
  price?: string | number | null;
  image?: string;
  images?: string[];
  image_url?: string | null;
};

// Инициализируем пустой массив для камней
const initialStones: Stone[] = [];

export default function Stones() {
  const [stones, setStones] = useState<Stone[]>(initialStones);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStones() {
      try {
        console.log('Fetching stones from API using StoneApiClient...');
        setLoading(true);
        setError(null);
        
        // Используем клиент API вместо прямых fetch-запросов
        const data = await StoneApiClient.getAllStones();
        console.log(`Received ${data.length} stones from API:`, data);
        setStones(data);
      } catch (error) {
        console.error('Ошибка при загрузке камней:', error);
        setError(error instanceof Error ? error.message : 'Не удалось загрузить данные о камнях');
      } finally {
        setLoading(false);
      }
    }

    fetchStones();
  }, []);

  return (
    <Layout title="STHL | Виды камня">
      {/* Page Header */}
      <div className={commonStyles.pageHeader}>
        <div className="container">
          <div className={commonStyles.pageHeaderContent}>
            <h1 className={commonStyles.pageHeaderTitle}>Виды натурального камня</h1>
            <p className={commonStyles.pageHeaderSubtitle}>
              Познакомьтесь с разновидностями природного камня для создания уникальных интерьеров и экстерьеров
            </p>
          </div>
        </div>
      </div>

      {/* Stones Section */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className={styles.loading}>Загрузка камней...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : stones.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Камни не найдены. Пожалуйста, посетите эту страницу позже.</p>
            </div>
          ) : (
            <div className={styles.stoneGrid}>
              {stones.map(stone => (
                <Link 
                  href={`/stones/${stone.id}`}
                  key={stone.id}
                  className={styles.stoneCard}
                >
                  <div className={styles.stoneImageContainer}>
                    {stone.images && stone.images.length > 0 ? (
                      <Image 
                        src={stone.images[0]} 
                        alt={stone.name}
                        width={300}
                        height={200}
                        className={styles.stoneImage}
                      />
                    ) : stone.image_url ? (
                      <Image 
                        src={stone.image_url} 
                        alt={stone.name}
                        width={300}
                        height={200}
                        className={styles.stoneImage}
                      />
                    ) : (
                      <div className={styles.noImage}>Нет изображения</div>
                    )}
                  </div>
                  <div className={styles.stoneContent}>
                    <h3 className={styles.stoneName}>{stone.name}</h3>
                    {stone.type && <p className={styles.stoneType}>{stone.type}</p>}
                    <p className={styles.stoneDescription}>{stone.description}</p>
                    {stone.price && <p className={styles.stonePrice}>от {stone.price} ₽/м²</p>}
                    <span className={styles.stoneButton}>Подробнее</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Natural Stone */}
      <section className={`${commonStyles.sectionAlt} section`}>
        <div className="container">
          <div className={commonStyles.sectionHeader}>
            <h2 className={commonStyles.sectionTitle}>Почему натуральный камень?</h2>
            <p className={commonStyles.sectionDescription}>
              Преимущества использования натурального камня в архитектуре и интерьере
            </p>
          </div>
          
          <div className={commonStyles.grid + ' ' + commonStyles.grid3}>
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Долговечность</h3>
                <p className={commonStyles.cardDescription}>
                  Натуральный камень проверен временем - многие каменные сооружения стоят тысячелетиями. 
                  При правильном уходе каменные поверхности будут служить десятилетиями без потери качества.
                </p>
              </div>
            </div>
            
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Уникальность</h3>
                <p className={commonStyles.cardDescription}>
                  Каждый кусок натурального камня уникален. Природный рисунок, текстура и оттенки никогда не повторяются 
                  полностью, делая каждое изделие эксклюзивным.
                </p>
              </div>
            </div>
            
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Экологичность</h3>
                <p className={commonStyles.cardDescription}>
                  Натуральный камень - это экологически чистый материал, не выделяющий вредных веществ. 
                  Он гипоаллергенен и безопасен для здоровья человека и окружающей среды.
                </p>
              </div>
            </div>
            
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Престиж</h3>
                <p className={commonStyles.cardDescription}>
                  Изделия из натурального камня всегда ассоциировались с роскошью и высоким статусом. 
                  Они добавляют интерьеру или экстерьеру благородство и изысканность.
                </p>
              </div>
            </div>
            
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Практичность</h3>
                <p className={commonStyles.cardDescription}>
                  Многие виды камня обладают высокой устойчивостью к влаге, температурным колебаниям и 
                  механическим воздействиям, что делает их идеальными для различных условий эксплуатации.
                </p>
              </div>
            </div>
            
            <div className={commonStyles.card}>
              <div className={commonStyles.cardContent}>
                <h3 className={commonStyles.cardTitle}>Универсальность</h3>
                <p className={commonStyles.cardDescription}>
                  Натуральный камень органично вписывается в любой стиль интерьера - от классики до ультрасовременного 
                  минимализма, позволяя воплотить в жизнь самые смелые дизайнерские идеи.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={commonStyles.section}>
        <div className="container">
          <div className={commonStyles.sectionHeader}>
            <h2 className={commonStyles.sectionTitle}>Заинтересовались натуральным камнем?</h2>
            <p className={commonStyles.sectionDescription}>
              Наши специалисты помогут вам подобрать идеальный материал для вашего проекта
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link href="/contact" className={commonStyles.button + ' ' + commonStyles.buttonPrimary}>
              Получить консультацию
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Для совместимости с другими компонентами
export { initialStones as stones };