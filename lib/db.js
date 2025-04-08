const mysql = require('mysql2/promise');

// Создаем пул соединений с базой данных
const pool = mysql.createPool({
  host: process.env.DB_HOST || '147.45.110.29',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER || 'gen_user',
  password: process.env.DB_PASSWORD || '9x?T&Lg:Q&W$+X',
  database: process.env.DB_NAME || 'default_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Тестирование соединения
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Успешное подключение к базе данных MySQL');
    connection.release();
    return true;
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return false;
  }
}

// Базовые функции для работы с камнями
const stonesRepository = {
  // Проверка соединения с БД
  validateConnection: async () => {
    try {
      await pool.query('SELECT 1');
      return { success: true };
    } catch (error) {
      console.error('Ошибка проверки соединения:', error);
      return { 
        success: false, 
        error: error.message,
        code: error.code || 'UNKNOWN'
      };
    }
  },
  
  getAllStones: async () => {
    try {
      // Проверяем соединение перед выполнением основного запроса
      const connectionCheck = await stonesRepository.validateConnection();
      if (!connectionCheck.success) {
        throw new Error(`Ошибка соединения с БД: ${connectionCheck.error}`);
      }
      
      const [rows] = await pool.query('SELECT * FROM stone ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Ошибка при получении списка камней:', error);
      throw error;
    }
  },

  getStoneById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM stone WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении камня с ID ${id}:`, error);
      throw error;
    }
  },

  createStone: async (stoneData) => {
    try {
      const { name, description, price, image_url, category } = stoneData;
      const [result] = await pool.query(
        'INSERT INTO stone (name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, image_url, category]
      );
      
      return { id: result.insertId, ...stoneData };
    } catch (error) {
      console.error('Ошибка при создании камня:', error);
      throw error;
    }
  },

  updateStone: async (id, stoneData) => {
    try {
      const { name, description, price, image_url, category } = stoneData;
      await pool.query(
        'UPDATE stone SET name = ?, description = ?, price = ?, image_url = ?, category = ? WHERE id = ?',
        [name, description, price, image_url, category, id]
      );
      
      return { id: parseInt(id), ...stoneData };
    } catch (error) {
      console.error(`Ошибка при обновлении камня с ID ${id}:`, error);
      throw error;
    }
  },

  deleteStone: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM stone WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении камня с ID ${id}:`, error);
      throw error;
    }
  }
};

// Базовые функции для работы с услугами
const servicesRepository = {
  getAllServices: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM service ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Ошибка при получении списка услуг:', error);
      throw error;
    }
  },

  getServiceById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM service WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении услуги с ID ${id}:`, error);
      throw error;
    }
  },

  createService: async (serviceData) => {
    try {
      const { name, description, price, duration } = serviceData;
      const [result] = await pool.query(
        'INSERT INTO service (name, description, price, duration) VALUES (?, ?, ?, ?)',
        [name, description, price, duration]
      );
      
      return { id: result.insertId, ...serviceData };
    } catch (error) {
      console.error('Ошибка при создании услуги:', error);
      throw error;
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const { name, description, price, duration } = serviceData;
      await pool.query(
        'UPDATE service SET name = ?, description = ?, price = ?, duration = ? WHERE id = ?',
        [name, description, price, duration, id]
      );
      
      return { id: parseInt(id), ...serviceData };
    } catch (error) {
      console.error(`Ошибка при обновлении услуги с ID ${id}:`, error);
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM service WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении услуги с ID ${id}:`, error);
      throw error;
    }
  }
};

// Базовые функции для работы с портфолио
const portfolioRepository = {
  getAllPortfolioItems: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM portfolio ORDER BY created_at DESC');
      
      // Корректно обрабатываем JSON-строки
      return rows.map(item => {
        let images = [];
        let services = [];
        
        try {
          images = JSON.parse(item.images || '[]');
        } catch (e) {
          console.error('Ошибка при парсинге JSON изображений:', e);
        }
        
        try {
          services = JSON.parse(item.services || '[]');
        } catch (e) {
          console.error('Ошибка при парсинге JSON услуг:', e);
        }
        
        return {
          ...item,
          images,
          services
        };
      });
    } catch (error) {
      console.error('Ошибка при получении списка портфолио:', error);
      throw error;
    }
  },

  getPortfolioItemById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM portfolio WHERE id = ?', [id]);
      if (!rows.length) return null;
      
      const item = rows[0];
      return {
        ...item,
        images: JSON.parse(item.images || '[]'),
        services: item.services ? JSON.parse(item.services) : []
      };
    } catch (error) {
      console.error(`Ошибка при получении проекта портфолио с ID ${id}:`, error);
      throw error;
    }
  },

  createPortfolioItem: async (portfolioData) => {
    try {
      const { title, description, fullDescription, images, client, completion_date, services } = portfolioData;
      
      const [result] = await pool.query(
        `INSERT INTO portfolio 
         (title, description, fullDescription, images, client, completion_date, services) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          description, 
          fullDescription || '', 
          JSON.stringify(images || []), 
          client || '', 
          completion_date ? new Date(completion_date) : null, 
          JSON.stringify(services || [])
        ]
      );
      
      return { 
        id: result.insertId, 
        ...portfolioData,
        images: Array.isArray(images) ? images : [],
        services: Array.isArray(services) ? services : []
      };
    } catch (error) {
      console.error('Ошибка при создании проекта портфолио:', error);
      throw error;
    }
  },

  updatePortfolioItem: async (id, portfolioData) => {
    try {
      const { title, description, fullDescription, images, client, completion_date, services } = portfolioData;
      
      await pool.query(
        `UPDATE portfolio SET 
         title = ?, description = ?, fullDescription = ?, images = ?, 
         client = ?, completion_date = ?, services = ? 
         WHERE id = ?`,
        [
          title, 
          description, 
          fullDescription || '', 
          JSON.stringify(images || []), 
          client || '', 
          completion_date ? new Date(completion_date) : null, 
          JSON.stringify(services || []),
          id
        ]
      );
      
      return { 
        id: parseInt(id), 
        ...portfolioData,
        images: Array.isArray(images) ? images : [],
        services: Array.isArray(services) ? services : []
      };
    } catch (error) {
      console.error(`Ошибка при обновлении проекта портфолио с ID ${id}:`, error);
      throw error;
    }
  },

  deletePortfolioItem: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM portfolio WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении проекта портфолио с ID ${id}:`, error);
      throw error;
    }
  }
};

// Базовые функции для работы с контактными формами
const contactsRepository = {
  getAllContacts: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM contact ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      console.error('Ошибка при получении списка контактов:', error);
      throw error;
    }
  },

  getContactById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM contact WHERE id = ?', [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении контакта с ID ${id}:`, error);
      throw error;
    }
  },

  createContact: async (contactData) => {
    try {
      const { name, email, phone, message } = contactData;
      const [result] = await pool.query(
        'INSERT INTO contact (name, email, phone, message, is_read) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, message, false]
      );
      
      return { id: result.insertId, ...contactData, is_read: false };
    } catch (error) {
      console.error('Ошибка при создании контакта:', error);
      throw error;
    }
  },

  markContactAsRead: async (id, isRead = true) => {
    try {
      await pool.query('UPDATE contact SET is_read = ? WHERE id = ?', [isRead, id]);
      return true;
    } catch (error) {
      console.error(`Ошибка при обновлении статуса контакта с ID ${id}:`, error);
      throw error;
    }
  },

  deleteContact: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM contact WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении контакта с ID ${id}:`, error);
      throw error;
    }
  }
};

// Функции для инициализации базы данных
const dbInitializer = {
  checkConnection: async () => {
    try {
      await pool.query('SELECT 1');
      return { success: true, message: 'База данных доступна' };
    } catch (error) {
      return { success: false, message: `Ошибка подключения: ${error.message}` };
    }
  },
  
  checkTablesExist: async () => {
    try {
      const [tables] = await pool.query('SHOW TABLES');
      const tableNames = tables.map(table => Object.values(table)[0]);
      return {
        success: true,
        tables: tableNames,
        missing: ['stone', 'service', 'portfolio', 'contact'].filter(table => !tableNames.includes(table))
      };
    } catch (error) {
      return { success: false, message: `Ошибка проверки таблиц: ${error.message}` };
    }
  },
  
  initializeTables: async () => {
    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS stone (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        image_url TEXT,
        category VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS service (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        duration VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS portfolio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        fullDescription TEXT,
        images TEXT NOT NULL,
        client VARCHAR(255),
        completion_date DATETIME,
        services TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS contact (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    try {
      for (const query of createTableQueries) {
        await pool.query(query);
      }
      return { success: true, message: 'Таблицы успешно созданы' };
    } catch (error) {
      return { success: false, message: `Ошибка создания таблиц: ${error.message}` };
    }
  },
  
  checkPermissions: async () => {
    const permissions = {
      select: false,
      insert: false,
      update: false,
      delete: false
    };
    
    try {
      // Проверка SELECT
      await pool.query('SELECT 1 FROM stone LIMIT 1');
      permissions.select = true;
      
      // Проверка INSERT
      const [insertResult] = await pool.query(
        'INSERT INTO stone (name, description) VALUES (?, ?)',
        ['PermissionTest', 'Testing permissions']
      );
      permissions.insert = true;
      const testId = insertResult.insertId;
      
      // Проверка UPDATE
      await pool.query(
        'UPDATE stone SET description = ? WHERE id = ?',
        ['Updated for permission test', testId]
      );
      permissions.update = true;
      
      // Проверка DELETE
      await pool.query('DELETE FROM stone WHERE id = ?', [testId]);
      permissions.delete = true;
      
      return {
        success: true,
        permissions,
        message: 'У пользователя есть все необходимые права доступа'
      };
    } catch (error) {
      return {
        success: false,
        permissions,
        message: `Ошибка проверки прав доступа: ${error.message}`
      };
    }
  }
};

module.exports = {
  pool,
  testConnection,
  stonesRepository,
  servicesRepository,
  portfolioRepository,
  contactsRepository,
  dbInitializer
};
