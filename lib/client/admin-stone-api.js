import { STONE_ROUTES } from '../api-routes';

/**
 * Административный клиент для работы с API камней
 */
export const AdminStoneApiClient = {
  /**
   * Получает все камни (административный доступ)
   */
  getAllStones: async () => {
    const response = await fetch(STONE_ROUTES.admin.getAll);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить камни`);
    }
    return await response.json();
  },

  /**
   * Получает камень по ID (административный доступ)
   * @param {string|number} id ID камня
   */
  getStoneById: async (id) => {
    const response = await fetch(STONE_ROUTES.admin.getById(id));
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось загрузить камень`);
    }
    return await response.json();
  },

  /**
   * Создает новый камень (административный доступ)
   * @param {Object} stoneData Данные камня
   */
  createStone: async (stoneData) => {
    const response = await fetch(STONE_ROUTES.admin.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stoneData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось создать камень`);
    }
    return await response.json();
  },

  /**
   * Обновляет существующий камень (административный доступ)
   * @param {string|number} id ID камня
   * @param {Object} stoneData Данные камня
   */
  updateStone: async (id, stoneData) => {
    const response = await fetch(STONE_ROUTES.admin.update(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stoneData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось обновить камень`);
    }
    return await response.json();
  },

  /**
   * Удаляет камень (административный доступ)
   * @param {string|number} id ID камня
   */
  deleteStone: async (id) => {
    const response = await fetch(STONE_ROUTES.admin.delete(id), {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка ${response.status}: Не удалось удалить камень`);
    }
    return await response.json();
  }
};
