import { useState, useEffect } from 'react';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';

export default function PortfolioDebug() {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkDbStatus() {
      try {
        setLoading(true);
        const response = await fetch('/api/debug/portfolio-db-status');
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        console.error('Ошибка при проверке БД:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    checkDbStatus();
  }, []);

  return (
    <AdminLayout title="Диагностика портфолио">
      <div className={styles.contentHeader}>
        <h1>Диагностика данных портфолио</h1>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {loading ? (
        <div className={styles.loadingSpinner}>Загрузка данных диагностики...</div>
      ) : (
        <div className={styles.debugContainer} style={{ padding: '20px' }}>
          <h2>Статус соединения с БД: <span style={{ color: dbStatus?.connection === 'ok' ? 'green' : 'red' }}>{dbStatus?.connection}</span></h2>
          
          {dbStatus?.error && (
            <div className={styles.errorMessage}>
              <h3>Ошибка:</h3>
              <pre>{dbStatus.error}</pre>
            </div>
          )}
          
          {dbStatus?.tableStatus && (
            <div>
              <h3>Статус таблицы portfolio:</h3>
              <pre>{JSON.stringify(dbStatus.tableStatus, null, 2)}</pre>
            </div>
          )}
          
          {dbStatus?.sampleData && (
            <div>
              <h3>Пример данных:</h3>
              <pre>{JSON.stringify(dbStatus.sampleData, null, 2)}</pre>
            </div>
          )}
          
          {dbStatus?.recommendations?.length > 0 && (
            <div>
              <h3>Рекомендации:</h3>
              <ul>
                {dbStatus.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: '10px', color: '#d32f2f' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div style={{ marginTop: '30px' }}>
            <button 
              className={styles.button}
              onClick={() => window.location.href = '/stonehill/portfolio'}
            >
              Вернуться к списку проектов
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
