import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  fallbackSrc = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Сбрасываем состояние при изменении src
    setIsLoading(true);
    setError(null);
    setImageSrc(src);
  }, [src]);

  // Обработчик ошибок загрузки
  const handleError = () => {
    console.error(`Ошибка загрузки изображения: ${src}`);
    setError(`Не удалось загрузить изображение: ${src}`);
    setImageSrc(fallbackSrc);
    setIsLoading(false);
  };

  // Обработчик успешной загрузки
  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  return (
    <>
      {isLoading && (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#2A2A2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span>Загрузка...</span>
        </div>
      )}
      
      <Image 
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </>
  );
};

export default SafeImage;
