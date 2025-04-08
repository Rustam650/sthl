import { stonesRepository } from '../../../lib/db';
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Создаем объект для ответа
  const response = {
    timestamp: new Date().toISOString(),
    connection: 'unknown',
    mysqlConnection: false,
    tables: null,
    recommendations: []
  };

  try {
    // Проверяем подключение через stonesRepository
    const connectionCheck = await stonesRepository.validateConnection();
    response.mysqlConnection = connectionCheck.success;
    
    if (connectionCheck.success) {
      response.connection = 'ok';
      
      try {
        // Получаем список таблиц
        const pool = mysql.createPool({
          host: process.env.DB_HOST || '147.45.110.29',
          port: process.env.DB_PORT || '3306',
          user: process.env.DB_USER || 'gen_user',
          password: process.env.DB_PASSWORD || '9x?T&Lg:Q&W$+X',
          database: process.env.DB_NAME || 'default_db',
          waitForConnections: true,
          connectionLimit: 1,
          queueLimit: 0
        });

        const [tables] = await pool.query('SHOW TABLES');
        await pool.end();

        response.tables = {
          tables: tables.map(table => Object.values(table)[0]),
          count: tables.length
        };
        
        // Проверяем наличие нужных таблиц
        const requiredTables = ['stone', 'service', 'portfolio', 'contact'];
        const missingTables = requiredTables.filter(table => 
          !response.tables.tables.includes(table)
        );
        
        if (missingTables.length > 0) {
          response.recommendations.push(
            `Отсутствуют необходимые таблицы: ${missingTables.join(', ')}. Необходимо инициализировать базу данных.`
          );
        }
      } catch (error) {
        console.error('Error getting tables:', error);
        response.tables = { error: error.message };
        response.recommendations.push('Ошибка при получении списка таблиц. Проверьте права доступа пользователя базы данных.');
      }
    } else {
      response.connection = 'error';
      response.recommendations.push(
        'Проблема подключения к базе данных. Проверьте настройки подключения в .env файле и доступность сервера БД.'
      );
      
      if (connectionCheck.error) {
        response.error = connectionCheck.error;
        response.code = connectionCheck.code;
        
        if (connectionCheck.code === 'ER_ACCESS_DENIED_ERROR') {
          response.recommendations.push('Ошибка доступа. Проверьте логин и пароль пользователя БД в .env файле.');
        } else if (connectionCheck.code === 'ECONNREFUSED') {
          response.recommendations.push('Сервер БД недоступен. Проверьте адрес и порт в .env файле.');
        }
      }
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in DB status check:', error);
    response.connection = 'error';
    response.error = error.message;
    res.status(500).json(response);
  }
}
