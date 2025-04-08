import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/animations.css'; // Добавляем новый файл стилей с анимациями

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Отладочный код для отслеживания изменений маршрута
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log('Route changing to', url);
    };
    
    const handleRouteComplete = (url: string) => {
      console.log('Route changed to', url);
    };
    
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, [router]);
  
  return <Component {...pageProps} />;
}
