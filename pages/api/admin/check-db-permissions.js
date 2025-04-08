import { authMiddleware } from '../../../admin/auth';
import { stonesRepository } from '../../../lib/db';
import nextConnect from 'next-connect';
import mysql from 'mysql2/promise';

const handler = nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    try {
      // Проверяем соединение
      const connectionCheck = await stonesRepository.validateConnection();
      if (!connectionCheck.success) {
        return res.status(500).json({
          connection: false,
          error: connectionCheck.error,
          message: 'Ошибка подключения к базе данных'
        });
      }

      // Создаем соединение для проверки прав
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

      // Получение списка таблиц
      const [tables] = await pool.query('SHOW TABLES');
      const tableNames = tables.map(t => Object.values(t)[0]);

      // Проверяем права для каждой таблицы
      const permissions = {};
      
      for (const table of tableNames) {
        try {
          // Проверяем права на SELECT
          await pool.query(`SELECT 1 FROM ${table} LIMIT 1`);
          permissions[table] = { read: true };
          
          try {
            // Проверяем права на INSERT с последующим DELETE для тестовой записи
            const [insertResult] = await pool.query(
              `INSERT INTO ${table} (name, description) VALUES (?, ?)`, 
              [`Test ${Date.now()}`, 'Permission test']
            );
            if (insertResult && insertResult.insertId) {
              await pool.query(`DELETE FROM ${table} WHERE id = ?`, [insertResult.insertId]);
              permissions[table].write = true;
            }
          } catch (writeError) {
            permissions[table].write = false;
            permissions[table].writeError = writeError.message;
          }
        } catch (readError) {
          permissions[table] = { 
            read: false,
            readError: readError.message
          };
        }
      }

      // Освобождение соединения
      await pool.end();

      res.status(200).json({
        connection: true,
        tables: tableNames,
        permissions,
        message: 'Проверка разрешений для базы данных выполнена успешно'
      });
    } catch (error) {
      console.error('Ошибка при проверке разрешений базы данных:', error);
      res.status(500).json({
        connection: false,
        error: error.message,
        message: 'Ошибка при проверке разрешений базы данных'
      });
    }
  });

export default handler;
