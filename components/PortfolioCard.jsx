import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Portfolio.module.css';

export default function PortfolioCard({ project }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  
  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % project.images.length);
  };
  
  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + project.images.length) % project.images.length);
  };
  
  return (
    <div className={styles.portfolioCard} onClick={() => setShowLightbox(true)}>
      <div className={styles.portfolioImage}>
        <Image 
          src={project.images[activeImage]} 
          alt={project.title}
          width={350}
          height={200}
          objectFit="cover"
        />
        
        <div className={styles.imageNavigation}>
          <button className={styles.navButton} onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className={styles.imageDots}>
            {project.images.map((_, index) => (
              <span 
                key={index} 
                className={`${styles.imageDot} ${index === activeImage ? styles.activeDot : ''}`}
                onClick={(e) => { e.stopPropagation(); setActiveImage(index); }}
              ></span>
            ))}
          </div>
          <button className={styles.navButton} onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardDescription}>{project.description}</p>
        <a href="#" className={styles.cardLink}>Подробнее <i className="fas fa-arrow-right"></i></a>
      </div>
      
      {showLightbox && (
        <div className={styles.lightbox} onClick={() => setShowLightbox(false)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setShowLightbox(false)}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className={styles.lightboxImageContainer}>
              <Image 
                src={project.images[activeImage]} 
                alt={project.title}
                layout="fill"
                objectFit="contain"
                className={styles.lightboxImage}
              />
            </div>
            
            <div className={styles.lightboxControls}>
              <button className={styles.lightboxNavButton} onClick={prevImage}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <div className={styles.lightboxCounter}>
                {activeImage + 1} / {project.images.length}
              </div>
              <button className={styles.lightboxNavButton} onClick={nextImage}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
