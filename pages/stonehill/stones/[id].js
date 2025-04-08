import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// Переименуем импорт компонента Image чтобы избежать конфликта имен
import NextImage from 'next/image';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';
import { AdminStoneApiClient } from '../../../lib/client/admin-stone-api';

export default function EditStone() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    type: '' // Добавляем поле для типа камня
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [imageIsValid, setImageIsValid] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    async function fetchStone() {
      try {
        // Используем админский API-клиент вместо публичного
        const stoneData = await AdminStoneApiClient.getStoneById(id);
        
        setFormData({
          name: stoneData.name || '',
          description: stoneData.description || '',
          imageUrl: stoneData.images && stoneData.images.length > 0 ? stoneData.images[0] : '',
          type: stoneData.type || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке камня:', error);
        setError('Не удалось загрузить данные о камне');
        setLoading(false);
      }
    }

    fetchStone();
  }, [id]);

  // Функция для проверки изображения
  useEffect(() => {
    if (!formData.imageUrl) {
      setImageIsValid(false);
      return;
    }

    // Используем глобальный объект window.Image вместо просто Image
    const img = new window.Image();
    img.onload = () => setImageIsValid(true);
    img.onerror = () => setImageIsValid(false);
    img.src = formData.imageUrl;

    return () => {
      // Очистка ресурсов
      img.onload = null;
      img.onerror = null;
    };
  }, [formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Подготавливаем данные для отправки
      const dataToSend = {
        name: formData.name,
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        type: formData.type || null
      };

      // Используем админский API-клиент для обновления
      await AdminStoneApiClient.updateStone(id, dataToSend);

      // Если успешно, перенаправляем на страницу управления камнями
      router.push('/stonehill/stones');
    } catch (error) {
      setError(error.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Редактирование камня">
        <div className={styles.loadingSpinner}>Загрузка...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Редактирование камня">
      <div className={styles.contentHeader}>
        <h1>Редактирование камня</h1>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Название камня</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Тип камня</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Например: Мрамор, Гранит, Оникс"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">URL изображения</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Превью изображения</label>
            <div className={styles.imagePreview}>
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
                      Ошибка загрузки изображения. Проверьте URL.
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noPreview}>
                  Введите URL изображения для просмотра
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
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
