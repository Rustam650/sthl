require('dotenv').config();
const mysql = require('mysql2/promise');

function validateDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error('Переменная DATABASE_URL не найдена в .env файле');
    return false;
  }
  
  console.log('Текущая строка подключения (замаскированная):');
  console.log(url.replace(/:[^:]*@/, ':***@'));
  
  try {
    // Попытка распарсить URL базы данных
    const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)(\?.*)?$/);
    
    if (!match) {
      console.error('Неверный формат строки подключения к базе данных');
      console.log('\nОжидаемый формат:');
      console.log('mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE');
      return false;
    }
    
    const [, username, password, host, port, database, params] = match;
    
    // Проверка порта
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      console.error(`Неверный номер порта: ${port}. Порт должен быть числом от 1 до 65535.`);
      return false;
    }
    
    console.log('\nРазобранные данные подключения:');
    console.log(`- Хост: ${host}`);
    console.log(`- Порт: ${port}`);
    console.log(`- База данных: ${database}`);
    console.log(`- Пользователь: ${username}`);
    console.log(`- Параметры: ${params || 'отсутствуют'}`);
    
    console.log('\nСтрока подключения выглядит правильно!');
    return true;
  } catch (error) {
    console.error('Ошибка при анализе строки подключения:', error.message);
    return false;
  }
}

function suggestCorrectFormat() {
  console.log('\n=== РЕКОМЕНДАЦИИ ПО ИСПРАВЛЕНИЮ ===');
  console.log('Откройте файл .env в корне проекта и убедитесь, что переменная DATABASE_URL имеет следующий формат:');
  console.log('\nDATABASE_URL="mysql://username:password@host:port/database_name"');
  console.log('\nПример:');
  console.log('DATABASE_URL="mysql://gen_user:password@147.45.110.29:3306/default_db"');
  
  console.log('\nОбратите внимание на следующие часто встречающиеся ошибки:');
  console.log('1. Пароль содержит специальные символы, требующие URL-кодирования');
  console.log('2. Порт не является числом или содержит нечисловые символы');
  console.log('3. Отсутствуют двойные кавычки вокруг значения');
  console.log('4. В строке подключения есть пробелы или непечатаемые символы');
}

console.log('=== ПРОВЕРКА СТРОКИ ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ ===\n');
const isValid = validateDatabaseUrl();

if (!isValid) {
  suggestCorrectFormat();
}

async function checkDbConnection() {
  console.log('Checking database connection...');
  
  const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };
  
  let connection;
  
  try {
    console.log('Connecting to MySQL with config:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database
    });
    
    connection = await mysql.createConnection(config);
    console.log('Connection established successfully!');
    
    // Проверка соединения простым запросом
    const [result] = await connection.query('SELECT 1 as test');
    console.log('Test query result:', result);
    
    // Проверяем существующие таблицы
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Existing tables:', tables.map(t => Object.values(t)[0]));
    
    return {
      connected: true,
      tables: tables.map(t => Object.values(t)[0])
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      error: error.message
    };
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Запускаем проверку, если скрипт запущен напрямую
if (require.main === module) {
  checkDbConnection()
    .then(result => {
      console.log('Check result:', result);
      process.exit(result.connected ? 0 : 1);
    })
    .catch(error => {
      console.error('Uncaught error during check:', error);
      process.exit(1);
    });
}

module.exports = { validateDatabaseUrl, checkDbConnection };
