import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';
import { AdminPortfolioApiClient } from '../../../lib/client/admin-portfolio-api';

export default function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPortfolioItems() {
      try {
        setLoading(true);
        setError(null);
        
        // Используем API-клиент для получения данных
        const data = await AdminPortfolioApiClient.getAllPortfolioItems();
        console.log('Loaded portfolio items:', data);
        setPortfolioItems(data);
      } catch (error) {
        console.error('Ошибка при загрузке портфолио:', error);
        setError(error.message || 'Не удалось загрузить проекты портфолио');
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolioItems();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) {
      return;
    }
    
    try {
      // Используем API-клиент для удаления
      await AdminPortfolioApiClient.deletePortfolioItem(id);
      
      // Обновляем список после удаления
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
      setError(error.message || 'Ошибка при удалении проекта');
    }
  }

  return (
    <AdminLayout title="Управление портфолио">
      <div className={styles.contentHeader}>
        <h1>Управление портфолио</h1>
        <button 
          className={styles.addButton}
          onClick={() => router.push('/stonehill/portfolio/new')}
        >
          Добавить проект
        </button>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {loading ? (
        <div className={styles.loadingSpinner}>Загрузка...</div>
      ) : (
        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.thumbnailColumn}>Изображение</div>
            <div className={styles.nameColumn}>Название</div>
            <div className={styles.clientColumn}>Клиент</div>
            <div className={styles.actionsColumn}>Действия</div>
          </div>
          
          {portfolioItems.length === 0 ? (
            <div className={styles.emptyState}>
              Проекты не найдены. Создайте первый проект, нажав на кнопку "Добавить проект".
            </div>
          ) : (
            portfolioItems.map(item => (
              <div key={item.id} className={styles.tableRow}>
                <div className={styles.thumbnailColumn}>
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className={styles.thumbnailImage}
                    />
                  ) : (
                    <div className={styles.noImage}>Нет изображения</div>
                  )}
                </div>
                <div className={styles.nameColumn}>{item.title}</div>
                <div className={styles.clientColumn}>{item.client || '-'}</div>
                <div className={styles.actionsColumn}>
                  <button 
                    className={styles.editButton}
                    onClick={() => router.push(`/stonehill/portfolio/${item.id}`)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}