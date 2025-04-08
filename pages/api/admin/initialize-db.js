import { authMiddleware } from '../../../admin/auth';
import { dbInitializer } from '../../../lib/db';
import nextConnect from 'next-connect';

const handler = nextConnect()
  .use(authMiddleware)
  .post(async (req, res) => {
    try {
      console.log('Initializing database tables...');
      
      // Проверка соединения перед созданием таблиц
      const connectionCheck = await dbInitializer.checkConnection();
      if (!connectionCheck.success) {
        return res.status(500).json({
          error: `Ошибка подключения к базе данных: ${connectionCheck.message}`
        });
      }
      
      // Проверка существующих таблиц
      const tablesCheck = await dbInitializer.checkTablesExist();
      
      // Создание таблиц, если они отсутствуют
      const initResult = await dbInitializer.initializeTables();
      
      if (initResult.success) {
        // Проверка прав доступа
        const permissionCheck = await dbInitializer.checkPermissions();
        
        if (permissionCheck.success) {
          res.status(200).json({
            success: true,
            message: 'База данных инициализирована успешно',
            tables: ['stone', 'service', 'portfolio', 'contact'],
            permissions: permissionCheck.permissions
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'Таблицы созданы, но есть проблемы с правами доступа',
            permissions: permissionCheck.permissions,
            error: permissionCheck.message
          });
        }
      } else {
        res.status(500).json({
          success: false,
          message: 'Ошибка при инициализации базы данных',
          error: initResult.message
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      res.status(500).json({ 
        error: `Ошибка при инициализации базы данных: ${error.message}` 
      });
    }
  });

export default handler;
