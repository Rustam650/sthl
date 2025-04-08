import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../admin/components/AdminLayout';
import styles from '../../../admin/styles/Admin.module.css';

export default function NewPortfolioItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    images: [''],
    client: '',
    completion: '',
    services: ['']
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };
  
  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };
  
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages.length > 0 ? newImages : ['']
    }));
  };
  
  const handleServiceChange = (index, value) => {
    const newServices = [...formData.services];
    newServices[index] = value;
    setFormData(prev => ({
      ...prev,
      services: newServices
    }));
  };
  
  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, '']
    }));
  };
  
  const removeService = (index) => {
    const newServices = [...formData.services];
    newServices.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      services: newServices.length > 0 ? newServices : ['']
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Фильтруем пустые URL изображений и услуги
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      const filteredServices = formData.services.filter(svc => svc.trim() !== '');
      
      if (filteredImages.length === 0) {
        throw new Error('Необходимо добавить хотя бы одно изображение');
      }
      
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          images: filteredImages,
          services: filteredServices
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Не удалось создать проект');
      }
      
      router.push('/stonehill/portfolio');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AdminLayout title="Добавить новый проект">
      <div className={styles.contentHeader}>
        <h1>Добавить новый проект</h1>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Название проекта *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="client">Клиент</label>
            <input
              type="text"
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="completion">Дата завершения</label>
            <input
              type="text"
              id="completion"
              name="completion"
              value={formData.completion}
              onChange={handleChange}
              placeholder="Например: Март 2023"
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Краткое описание *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          ></textarea>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="fullDescription">Полное описание</label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            rows={6}
            placeholder="Поддерживает HTML-форматирование"
          ></textarea>
        </div>
        
        <div className={styles.formGroup}>
          <label>Изображения *</label>
          {formData.images.map((img, index) => (
            <div key={index} className={styles.applicationItem}>
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="Введите URL изображения"
                required={index === 0} // Только первое изображение обязательно
              />
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => removeImage(index)}
                disabled={formData.images.length === 1} // Нельзя удалить единственное изображение
              >
                Удалить
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addImage}
          >
            Добавить изображение
          </button>
        </div>
        
        <div className={styles.formGroup}>
          <label>Предоставленные услуги</label>
          {formData.services.map((service, index) => (
            <div key={index} className={styles.applicationItem}>
              <input
                type="text"
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                placeholder="Введите название услуги"
              />
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => removeService(index)}
              >
                Удалить
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className={styles.addButton}
            onClick={addService}
          >
            Добавить услугу
          </button>
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
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
