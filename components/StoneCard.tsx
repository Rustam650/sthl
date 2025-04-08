import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Stones.module.css';

interface Stone {
  id: number;
  name: string;
  description: string | null;
  type?: string | null;
  price?: string | number | null;
  image?: string;
  images?: string[];
  image_url?: string | null;
}

interface StoneCardProps {
  stone: Stone;
}

const StoneCard: React.FC<StoneCardProps> = ({ stone }) => {
  return (
    <Link href={`/stones/${stone.id}`} className={styles.similarCard}>
      <div className={styles.similarImageContainer}>
        {stone.images && stone.images.length > 0 ? (
          <Image 
            src={stone.images[0]} 
            alt={stone.name}
            width={200}
            height={150}
            className={styles.similarImage}
          />
        ) : stone.image_url ? (
          <Image 
            src={stone.image_url} 
            alt={stone.name}
            width={200}
            height={150}
            className={styles.similarImage}
          />
        ) : (
          <div className={styles.noImage}>Нет изображения</div>
        )}
      </div>
      <div className={styles.similarContent}>
        <h3 className={styles.similarName}>{stone.name}</h3>
        {stone.price && <p className={styles.similarPrice}>{stone.price} ₽/м²</p>}
      </div>
    </Link>
  );
};

export default StoneCard;