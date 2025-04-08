import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function DebugRoutes() {
  const router = useRouter();
  
  // Проверяем наличие файлов портфолио
  const checkFileExistence = async (path: string) => {
    try {
      const response = await fetch(path);
      return response.status !== 404;
    } catch (error) {
      return false;
    }
  };
  
  return (
    <Layout title="STHL | Отладка маршрутов">
      <div className="container" style={{padding: '150px 0 50px 0'}}>
        <h1>Отладка маршрутов</h1>
        
        <div style={{background: '#333', color: '#fff', padding: '20px', borderRadius: '5px', marginTop: '20px'}}>
          <h2>Текущий маршрут</h2>
          <pre>{JSON.stringify({
            pathname: router.pathname,
            asPath: router.asPath,
            query: router.query,
            isReady: router.isReady
          }, null, 2)}</pre>
        </div>
        
        <div style={{marginTop: '20px'}}>
          <h2>Тестирование маршрутов</h2>
          <ul>
            <li>
              <button 
                onClick={() => router.push('/portfolio')}
                style={{background: '#F3B942', border: 'none', padding: '10px 20px', margin: '5px', cursor: 'pointer'}}
              >
                Перейти на /portfolio
              </button>
            </li>
            <li>
              <button 
                onClick={() => router.push('/portfolio/1')}
                style={{background: '#F3B942', border: 'none', padding: '10px 20px', margin: '5px', cursor: 'pointer'}}
              >
                Перейти на /portfolio/1
              </button>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
