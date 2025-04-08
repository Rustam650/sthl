import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';
import { AdminStoneApiClient } from '../../../lib/client/admin-stone-api';

export default function NewStone() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: '' // Добавляем поле для типа камня
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageIsValid, setImageIsValid] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Функция для проверки изображения
  useEffect(() => {
    if (!formData.imageUrl) {
      setImageIsValid(false);
      return;
    }

    const img = new window.Image();
    img.onload = () => setImageIsValid(true);
    img.onerror = () => setImageIsValid(false);
    img.src = formData.imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [formData.imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Подготавливаем данные для отправки
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        type: formData.type || null
      };

      console.log("Отправляемые данные:", dataToSend);

      // Используем админский API-клиент для создания
      const responseData = await AdminStoneApiClient.createStone(dataToSend);
      console.log("Ответ API:", responseData);
      
      console.log("Камень успешно создан с ID:", responseData.id);
      // Если успешно, перенаправляем на страницу управления камнями
      router.push('/stonehill/stones');
    } catch (error) {
      console.error("Ошибка создания:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Добавление нового камня">
      <div className={styles.contentHeader}>
        <h1 className={styles.pageTitle}>Добавление нового камня</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={`${styles.form} ${styles.stoneForm}`}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Название камня <span className={styles.requiredMark}>*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
              placeholder="Введите название камня"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.formLabel}>Тип камня</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Например: Мрамор, Гранит, Оникс"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>Описание <span className={styles.requiredMark}>*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className={styles.formTextarea}
              placeholder="Введите описание камня"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.formLabel}>URL изображения</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="https://example.com/image.jpg"
            />
            <small className={styles.formHelper}>Укажите прямую ссылку на изображение</small>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Превью изображения</label>
            <div className={`${styles.imagePreview} ${formData.imageUrl && imageIsValid ? styles.hasImage : ''}`}>
              {formData.imageUrl ? (
                <>
                  {imageIsValid ? (
                    <img 
                      src={formData.imageUrl} 
                      alt="Превью"
                      className={styles.previewImage}
                    />
                  ) : (
                    <div className={styles.noPreview}>
                      <i className={styles.warningIcon}>⚠️</i>
                      <p>Ошибка загрузки изображения. Проверьте URL.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noPreview}>
                  <p>Введите URL изображения для просмотра</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => router.back()}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            className={styles.saveButton}
            disabled={loading || !formData.name || !formData.description}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
