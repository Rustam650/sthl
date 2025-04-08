/**
 * Административный клиент для работы с API портфолио
 */
export const AdminPortfolioApiClient = {
  /**
   * Получает все проекты портфолио
   */
  getAllPortfolioItems: async () => {
    try {
      const response = await fetch('/api/admin/portfolio');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить портфолио`);
      }
      
      const data = await response.json();
      
      // Проверяем и форматируем данные
      return data.map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
        services: Array.isArray(item.services) ? item.services : []
      }));
    } catch (error) {
      console.error('Ошибка при получении проектов портфолио:', error);
      throw error;
    }
  },

  /**
   * Получает проект по ID
   * @param {string|number} id ID проекта
   */
  getPortfolioItemById: async (id) => {
    const response = await fetch(`/api/admin/portfolio/${id}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить проект`);
    }
    return await response.json();
  },
  
  /**
   * Создает новый проект портфолио
   * @param {Object} data Данные нового проекта
   */
  createPortfolioItem: async (data) => {
    const response = await fetch('/api/admin/portfolio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось создать проект`);
    }
    return await response.json();
  },
  
  /**
   * Обновляет существующий проект портфолио
   * @param {string|number} id ID проекта
   * @param {Object} data Данные для обновления
   */
  updatePortfolioItem: async (id, data) => {
    const response = await fetch(`/api/admin/portfolio/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось обновить проект`);
    }
    return await response.json();
  },
  
  /**
   * Удаляет проект портфолио
   * @param {string|number} id ID проекта
   */
  deletePortfolioItem: async (id) => {
    const response = await fetch(`/api/admin/portfolio/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось удалить проект`);
    }
    return await response.json();
  }
};
