import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'STHL | Современные архитектурные решения'
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Проверяем активную страницу
  const isActive = (path: string) => {
    if (path === '/services' && router.pathname.startsWith('/services')) {
      return true;
    }
    if (path === '/stones' && router.pathname.startsWith('/stones')) {
      return true;
    }
    return router.pathname === path;
  };

  // Обработка скролла для изменения стиля шапки
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={styles.layoutWrapper}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Инновационная архитектурная компания, специализирующаяся на натуральном камне и современных дизайнерских решениях" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              <Image 
                src={scrolled ? "/images/logow.svg" : "/images/logo.svg"} 
                alt="STHL Logo" 
                width={120} 
                height={40} 
                className={styles.logoImage}
              />
            </Link>
            
            <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
              <Link 
                href="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-home"></i>
                <span>Главная</span>
              </Link>
              <Link 
                href="/services" 
                className={`${styles.navLink} ${isActive('/services') ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-briefcase"></i>
                <span>Услуги</span>
              </Link>
              <Link 
                href="/stones" 
                className={`${styles.navLink} ${isActive('/stones') ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-gem"></i>
                <span>Камень</span>
              </Link>
              <Link 
                href="/portfolio" 
                className={`${styles.navLink} ${isActive('/portfolio') ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-images"></i>
                <span>Портфолио</span>
              </Link>
              <Link 
                href="/contact" 
                className={`${styles.navLink} ${isActive('/contact') ? styles.navLinkActive : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className="fas fa-envelope"></i>
                <span>Контакты</span>
              </Link>
              
              <div className={styles.navContact}>
                <a href="tel:+71234567890" className={styles.navPhone}>
                  <i className="fas fa-phone"></i> +7 (123) 456-78-90
                </a>
              </div>
            </nav>
            
            <div className={styles.headerActions}>
              <a href="tel:+71234567890" className={styles.headerPhone}>
                <i className="fas fa-phone"></i>
                <span>+7 (123) 456-78-90</span>
              </a>
              
              <button 
                className={`${styles.mobileMenuToggle} ${mobileMenuOpen ? styles.mobileMenuActive : ''}`}
                onClick={toggleMobileMenu}
                aria-label="Меню"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>{children}</main>
      
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Link href="/">
                <img src="/images/logow.svg" alt="STHL" className={styles.footerLogoImage} style={{ height: '65px' }} />
              </Link>
              <p className={styles.footerDescription}>
                Профессиональные решения в области дизайна интерьера, ремонта и отделки помещений.
              </p>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.footerLinkColumn}>
                <h4 className={styles.footerLinkTitle}>Навигация</h4>
                <ul className={styles.footerLinkList}>
                  <li><Link href="/"><i className="fas fa-chevron-right"></i> Главная</Link></li>
                  <li><Link href="/services"><i className="fas fa-chevron-right"></i> Услуги</Link></li>
                  <li><Link href="/stones"><i className="fas fa-chevron-right"></i> Виды камня</Link></li>
                  <li><Link href="/portfolio"><i className="fas fa-chevron-right"></i> Портфолио</Link></li>
                  <li><Link href="/contact"><i className="fas fa-chevron-right"></i> Контакты</Link></li>
                </ul>
              </div>
              
              <div className={styles.footerLinkColumn}>
                <h4 className={styles.footerLinkTitle}>Контакты</h4>
                <ul className={styles.footerContactList}>
                  <li className={styles.contactItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>г. Москва, ул. Архитектурная, д. 1</span>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-phone"></i>
                    <a href="tel:+71234567890">+7 (123) 456-78-90</a>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:info@sthl.ru">info@sthl.ru</a>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-clock"></i>
                    <span>Пн-Сб: 9:00 - 19:00</span>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-calendar-times"></i>
                    <span>Вс: выходной</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© {new Date().getFullYear()} StoneHill. Все права защищены.</p>
          </div>
        </div>
      </footer>
      
      {/* Мобильный тапбар */}
      <div className={styles.mobileTabbar}>
        <Link href="/" className={`${styles.tabbarItem} ${isActive('/') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-home"></i>
          <span>Главная</span>
        </Link>
        <Link href="/services" className={`${styles.tabbarItem} ${isActive('/services') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-briefcase"></i>
          <span>Услуги</span>
        </Link>
        <Link href="/stones" className={`${styles.tabbarItem} ${isActive('/stones') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-gem"></i>
          <span>Камень</span>
        </Link>
        <Link href="/portfolio" className={`${styles.tabbarItem} ${isActive('/portfolio') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-images"></i>
          <span>Портфолио</span>
        </Link>
        <Link href="/contact" className={`${styles.tabbarItem} ${isActive('/contact') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-envelope"></i>
          <span>Контакты</span>
        </Link>
        <a href="tel:+71234567890" className={styles.tabbarItem}>
          <i className="fas fa-phone"></i>
          <span>Звонок</span>
        </a>
      </div>
    </div>
  );
};

export default Layout;