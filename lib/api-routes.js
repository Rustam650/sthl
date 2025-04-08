/**
 * Файл содержит все пути API для работы с камнями
 */

const STONE_ROUTES = {
  // Публичные API маршруты
  public: {
    getAll: '/api/stones',
    getById: (id) => `/api/stones/${id}`,
    create: '/api/stones',
    update: (id) => `/api/stones/${id}`,
    delete: (id) => `/api/stones/${id}`,
    dbStatus: '/api/debug/db-status',
    dbHelp: '/api/stones/db-help'
  },
  
  // Административные API маршруты
  admin: {
    getAll: '/api/admin/stones',
    getById: (id) => `/api/admin/stones/${id}`,
    create: '/api/admin/stones',
    update: (id) => `/api/admin/stones/${id}`,
    delete: (id) => `/api/admin/stones/${id}`,
    initDb: '/api/admin/initialize-db',
    checkPermissions: '/api/admin/check-db-permissions'
  }
};

module.exports = {
  STONE_ROUTES
};
