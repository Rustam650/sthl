import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Admin.module.css';

export default function AdminLayout({ children, title = 'Админ-панель' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth');
        
        if (!response.ok) {
          // Если не авторизован, перенаправляем на страницу входа
          router.push('/stonehill');
          return;
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        // В случае ошибки перенаправляем на страницу входа
        router.push('/stonehill');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST'
      });
      
      router.push('/stonehill');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.adminContainer}>
      <Head>
        <title>{title} | STHL Admin</title>
      </Head>
      
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1>STHL</h1>
          <p>Панель управления</p>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link href="/stonehill/dashboard" className={router.pathname === '/stonehill/dashboard' ? styles.activeLink : ''}>
            <span>Панель управления</span>
          </Link>
          <Link href="/stonehill/stones" className={router.pathname.startsWith('/stonehill/stones') ? styles.activeLink : ''}>
            <span>Камни</span>
          </Link>
          <Link href="/stonehill/portfolio" className={router.pathname.startsWith('/stonehill/portfolio') ? styles.activeLink : ''}>
            <span>Портфолио</span>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <span>Просмотр сайта</span>
          </a>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </aside>
      
      <main className={styles.content}>
        <header className={styles.contentHeader}>
          <div className={styles.headerTitle}>{title}</div>
          {user && (
            <div className={styles.userInfo}>
              <span>{user.username}</span>
            </div>
          )}
        </header>
        
        <div className={styles.contentBody}>
          {children}
        </div>
      </main>
    </div>
  );
}
