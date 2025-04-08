import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../admin/components/AdminLayout';
import styles from '../../admin/styles/Admin.module.css';

export default function Dashboard() {
  const [stats, setStats] = useState({
    stones: 0,
    portfolio: 0
  });
  const [initializing, setInitializing] = useState(false);
  const [initStatus, setInitStatus] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Используем глобальную настройку из .env для подключения к БД
        // Удаляем жестко закодированные учетные данные
        
        // Получаем статистику по камням
        const stonesResponse = await fetch('/api/admin/stones');
        if (stonesResponse.ok) {
          const stonesData = await stonesResponse.json();
          setStats(prev => ({ ...prev, stones: stonesData.length }));
        }
        
        // Получаем статистику по портфолио
        const portfolioResponse = await fetch('/api/admin/portfolio');
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setStats(prev => ({ ...prev, portfolio: portfolioData.length }));
        }
      } catch (error) {
        console.error('Ошибка при загрузке статистики:', error);
      }
    };
    
    fetchStats();
  }, [initStatus]); // Перезагружаем статистику после инициализации БД
  
  // Функция для инициализации базы данных
  const initializeDatabase = async () => {
    if (window.confirm('Вы уверены, что хотите инициализировать базу данных? Это действие создаст все необходимые таблицы, если они еще не существуют.')) {
      setInitializing(true);
      setInitStatus(null);
      
      try {
        const response = await fetch('/api/admin/initialize-db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setInitStatus({
            success: true,
            message: 'База данных успешно инициализирована'
          });
        } else {
          setInitStatus({
            success: false,
            message: data.error || 'Ошибка при инициализации базы данных'
          });
        }
      } catch (error) {
        console.error('Ошибка при инициализации БД:', error);
        setInitStatus({
          success: false,
          message: 'Ошибка при инициализации базы данных: ' + (error.message || 'Неизвестная ошибка')
        });
      } finally {
        setInitializing(false);
      }
    }
  };
  
  return (
    <AdminLayout title="Панель управления">
      <div className={styles.dashboardContainer}>
        <h1>Панель управления</h1>
        <p>Добро пожаловать в админ-панель сайта StoneHill</p>
        
        {initStatus && (
          <div className={`${styles.statusMessage} ${initStatus.success ? styles.successMessage : styles.errorMessage}`}>
            {initStatus.message}
          </div>
        )}
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard} onClick={() => router.push('/stonehill/stones')}>
            <h2>Камни</h2>
            <p className={styles.statNumber}>{stats.stones}</p>
          </div>
          
          <div className={styles.statCard} onClick={() => router.push('/stonehill/portfolio')}>
            <h2>Портфолио</h2>
            <p className={styles.statNumber}>{stats.portfolio}</p>
          </div>
        </div>
        
        <div className={styles.quickLinks}>
          <h2>Быстрые действия</h2>
          <div className={styles.linksGrid}>
            <button 
              className={styles.linkButton}
              onClick={() => router.push('/stonehill/stones/new')}
            >
              Добавить новый камень
            </button>
            
            <button 
              className={styles.linkButton}
              onClick={() => router.push('/stonehill/portfolio/new')}
            >
              Добавить новый проект
            </button>
            
            <button 
              className={`${styles.linkButton} ${styles.dbInitButton}`}
              onClick={initializeDatabase}
              disabled={initializing}
            >
              {initializing ? 'Инициализация...' : 'Инициализировать БД'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
