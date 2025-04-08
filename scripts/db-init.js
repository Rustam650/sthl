const mysql = require('mysql2/promise');

async function initDatabase() {
  console.log('Checking database connection...');
  
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  };
  
  let connection;
  
  try {
    connection = await mysql.createConnection(config);
    console.log('Successfully connected to MySQL database');
    
    // Проверяем существующие таблицы
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Existing tables:', tables.map(t => Object.values(t)[0]));
    
    const requiredTables = ['stone', 'portfolio'];
    const existingTables = tables.map(t => Object.values(t)[0]);
    
    // Создаем необходимые таблицы, если их нет
    console.log('Checking required tables...');
    
    // Проверяем таблицу stone
    if (!existingTables.includes('stone')) {
      console.log('Creating stone table...');
      await connection.query(`
        CREATE TABLE stone (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2),
          image_url VARCHAR(255),
          category VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Stone table created successfully');
    } else {
      console.log('Stone table already exists');
    }
    
    // Проверяем таблицу portfolio
    if (!existingTables.includes('portfolio')) {
      console.log('Creating portfolio table...');
      await connection.query(`
        CREATE TABLE portfolio (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          fullDescription TEXT,
          images TEXT,
          client VARCHAR(255),
          completion_date DATE,
          services TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Portfolio table created successfully');
    } else {
      console.log('Portfolio table already exists');
    }
    
    console.log('Database initialization completed');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Запускаем инициализацию, если скрипт запущен напрямую
if (require.main === module) {
  initDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Uncaught error during database initialization:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase }; 