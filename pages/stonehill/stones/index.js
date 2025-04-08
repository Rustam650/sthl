import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';
import { AdminStoneApiClient } from '../../../lib/client/admin-stone-api';

export default function StonesAdmin() {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchStones() {
      try {
        setLoading(true);
        setError(null);
        
        // Выполняем диагностику БД перед запросом камней
        const diagnosticResponse = await fetch('/api/debug/db-status');
        const diagnosticData = await diagnosticResponse.json();
        console.log('Database diagnostic:', diagnosticData);
        
        if (diagnosticData.connection !== 'ok') {
          throw new Error('Проблема с подключением к базе данных. Обратитесь к администратору.');
        }
        
        // Используем админский API-клиент вместо прямого fetch
        const data = await AdminStoneApiClient.getAllStones();
        console.log(`Loaded ${data.length} stones:`, data);
        setStones(data);
      } catch (error) {
        console.error('Ошибка при загрузке камней:', error);
        setError(error instanceof Error ? error.message : 'Неизвестная ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    }

    fetchStones();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Вы уверены, что хотите удалить этот камень?')) {
      return;
    }
    
    try {
      // Используем админский API-клиент для удаления
      await AdminStoneApiClient.deleteStone(id);
      
      // Обновляем список после удаления
      const updatedStones = stones.filter(stone => stone.id !== id);
      setStones(updatedStones);
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <AdminLayout title="Управление камнями">
      <div className={styles.contentHeader}>
        <h1>Управление камнями</h1>
        <button 
          className={styles.addButton}
          onClick={() => router.push('/stonehill/stones/new')}
        >
          Добавить камень
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
            <div className={styles.typeColumn}>Тип</div>
            <div className={styles.priceColumn}>Цена</div>
            <div className={styles.actionsColumn}>Действия</div>
          </div>
          
          {stones.length === 0 ? (
            <div className={styles.emptyState}>
              Камни не найдены. Создайте первый камень, нажав на кнопку "Добавить камень".
            </div>
          ) : (
            stones.map(stone => (
              <div key={stone.id} className={styles.tableRow}>
                <div className={styles.thumbnailColumn}>
                  {stone.images && stone.images.length > 0 ? (
                    <img 
                      src={stone.images[0]} 
                      alt={stone.name} 
                      className={styles.thumbnailImage}
                    />
                  ) : (
                    <div className={styles.noImage}>Нет изображения</div>
                  )}
                </div>
                <div className={styles.nameColumn}>{stone.name}</div>
                <div className={styles.typeColumn}>{stone.type || '-'}</div>
                <div className={styles.priceColumn}>{stone.price ? `${stone.price} ₽/м²` : '-'}</div>
                <div className={styles.actionsColumn}>
                  <button 
                    className={styles.editButton}
                    onClick={() => router.push(`/stonehill/stones/${stone.id}`)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(stone.id)}
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
