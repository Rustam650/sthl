import Layout from '@/components/Layout';
import styles from '@/styles/Contact.module.css';
import commonStyles from '@/styles/common.module.css';

export default function Contact() {
  return (
    <Layout title="STHL | Контакты">
      {/* Page Header */}
      <div className={commonStyles.pageHeader}>
        <div className="container">
          <div className={commonStyles.pageHeaderContent}>
            <h1 className={commonStyles.pageHeaderTitle}>Контакты</h1>
            <p className={commonStyles.pageHeaderSubtitle}>
              Свяжитесь с нами удобным для вас способом
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className={styles.contactInfo}>
            <h2 className={styles.contactTitle}>Контактная информация</h2>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Адрес</h3>
                <p className={styles.infoText}>
                  г. Махачкала, ул. Танкаева 57
                </p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Телефон</h3>
                <p className={styles.infoText}>
                  <a href="tel:+79299895555">+7 (929) 989 55 55</a>
                </p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <i className="fas fa-envelope"></i>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>
                  <a href="mailto:stone.hill@mail.ru">stone.hill@mail.ru</a>
                </p>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Часы работы</h3>
                <p className={styles.infoText}>
                  Пн-Сб: 9:00 - 19:00<br />
                  Вс: выходной
                </p>
              </div>
            </div>
            
            <div className={styles.socialLinks}>
              <a href="https://wa.me/79094849980" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://t.me/StoneHillru" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
