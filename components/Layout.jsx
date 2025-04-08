import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Закрываем мобильное меню при изменении маршрута
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  return (
    <div className={styles.layoutWrapper}>
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo}>
              <img src="/images/logo.svg" alt="STHL Logo" className={styles.logoImage} />
            </Link>

            <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
              <Link 
                href="/" 
                className={`${styles.navLink} ${router.pathname === '/' ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-home"></i> Главная
              </Link>
              <Link 
                href="/about" 
                className={`${styles.navLink} ${router.pathname === '/about' ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-info-circle"></i> О нас
              </Link>
              <Link 
                href="/services" 
                className={`${styles.navLink} ${router.pathname === '/services' ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-briefcase"></i> Услуги
              </Link>
              <Link 
                href="/portfolio" 
                className={`${styles.navLink} ${router.pathname.startsWith('/portfolio') ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-images"></i> Портфолио
              </Link>
              <Link 
                href="/stones" 
                className={`${styles.navLink} ${router.pathname.startsWith('/stones') ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-gem"></i> Камень
              </Link>
              <Link 
                href="/contact" 
                className={`${styles.navLink} ${router.pathname === '/contact' ? styles.navLinkActive : ''}`}
              >
                <i className="fas fa-envelope"></i> Контакты
              </Link>
              
              <div className={styles.navContact}>
                <a href="tel:+70000000000" className={styles.navPhone}>
                  <i className="fas fa-phone-alt"></i> +7 (000) 000-00-00
                </a>
              </div>
            </nav>

            <div className={styles.headerActions}>
              <a href="tel:+70000000000" className={styles.headerPhone}>
                <i className="fas fa-phone-alt"></i>
                <span>+7 (000) 000-00-00</span>
              </a>
              
              <button 
                className={`${styles.mobileMenuToggle} ${isMobileMenuOpen ? styles.mobileMenuActive : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>
              <Link href="/" className={styles.logo}>
                <img src="/images/logow.svg" alt="STHL Logo" className={styles.footerLogoImage} />
              </Link>
              <p className={styles.footerDescription}>
                Профессиональные решения в области дизайна интерьера, ремонта и отделки помещений.
                Создаём стильные и функциональные пространства с 2010 года.
              </p>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.footerLinkColumn}>
                <h4 className={styles.footerLinkTitle}>Навигация</h4>
                <ul className={styles.footerLinkList}>
                  <li><Link href="/">Главная</Link></li>
                  <li><Link href="/about">О нас</Link></li>
                  <li><Link href="/services">Услуги</Link></li>
                  <li><Link href="/portfolio">Портфолио</Link></li>
                  <li><Link href="/contacts">Контакты</Link></li>
                </ul>
              </div>
              
              <div className={styles.footerLinkColumn}>
                <h4 className={styles.footerLinkTitle}>Услуги</h4>
                <ul className={styles.footerLinkList}>
                  <li><Link href="/services/design">Дизайн интерьера</Link></li>
                  <li><Link href="/services/renovation">Ремонт помещений</Link></li>
                  <li><Link href="/services/construction">Строительство</Link></li>
                  <li><Link href="/services/landscape">Ландшафтный дизайн</Link></li>
                </ul>
              </div>
              
              <div className={styles.footerLinkColumn}>
                <h4 className={styles.footerLinkTitle}>Контакты</h4>
                <ul className={styles.footerContactList}>
                  <li className={styles.contactItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>г. Москва, ул. Примерная, д. 123</span>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-phone-alt"></i>
                    <a href="tel:+70000000000">+7 (000) 000-00-00</a>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-envelope"></i>
                    <a href="mailto:info@sthl.ru">info@sthl.ru</a>
                  </li>
                  <li className={styles.contactItem}>
                    <i className="fas fa-clock"></i>
                    <span>Пн-Пт: 9:00 - 18:00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>© {new Date().getFullYear()} STHL. Все права защищены.</p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>Политика конфиденциальности</a>
              <a href="#" className={styles.socialLink}>Условия использования</a>
            </div>
          </div>
        </div>
      </footer>
      
      <div className={styles.mobileTabbar}>
        <Link href="/" className={`${styles.tabbarItem} ${router.pathname === '/' ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-home"></i>
          <span>Главная</span>
        </Link>
        <Link href="/services" className={`${styles.tabbarItem} ${router.pathname === '/services' ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-briefcase"></i>
          <span>Услуги</span>
        </Link>
        <Link href="/portfolio" className={`${styles.tabbarItem} ${router.pathname.startsWith('/portfolio') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-images"></i>
          <span>Портфолио</span>
        </Link>
        <Link href="/stones" className={`${styles.tabbarItem} ${router.pathname.startsWith('/stones') ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-gem"></i>
          <span>Камень</span>
        </Link>
        <Link href="/contact" className={`${styles.tabbarItem} ${router.pathname === '/contact' ? styles.tabbarItemActive : ''}`}>
          <i className="fas fa-envelope"></i>
          <span>Контакты</span>
        </Link>
      </div>
    </div>
  );
}