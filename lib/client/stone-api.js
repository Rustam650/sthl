import { STONE_ROUTES } from '../api-routes';

/**
 * Клиент для работы с API камней
 */
export const StoneApiClient = {
  /**
   * Получает все камни
   */
  getAllStones: async () => {
    const response = await fetch(STONE_ROUTES.public.getAll);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить камни`);
    }
    return await response.json();
  },

  /**
   * Получает камень по ID
   * @param {string|number} id ID камня
   */
  getStoneById: async (id) => {
    const response = await fetch(STONE_ROUTES.public.getById(id));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить камень`);
    }
    return await response.json();
  },

  // ...другие методы API...
};
