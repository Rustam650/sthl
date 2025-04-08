/**
 * Клиент для работы с API портфолио на публичной части сайта
 */
export const PortfolioApiClient = {
  /**
   * Получает все проекты портфолио
   */
  getAllPortfolioItems: async () => {
    try {
      const response = await fetch('/api/portfolio');
      
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
    try {
      const response = await fetch(`/api/portfolio/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить проект`);
      }
      
      const data = await response.json();
      
      // Проверяем и форматируем данные
      return {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        services: Array.isArray(data.services) ? data.services : []
      };
    } catch (error) {
      console.error(`Ошибка при получении проекта с ID ${id}:`, error);
      throw error;
    }
  }
};
