import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { PrismaClient } from '@prisma/client';

// Учетные данные для сравнения - использование открытого текста для отладки
const ADMIN_CREDENTIALS = {
  username: 'stoneadmin',
  plainPassword: 'stonepassword' // Пароль в открытом виде для прямого сравнения
};

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'stonehill-admin-secret-key';

// Middleware для проверки аутентификации
export function authMiddleware(req, res, next) {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

// Функция для аутентификации пользователя
export async function authenticateUser(username, password) {
  // Проверка учетных данных
  if (username !== ADMIN_CREDENTIALS.username) {
    return null;
  }
  
  // Прямое сравнение пароля вместо хеша
  const passwordMatch = (password === ADMIN_CREDENTIALS.plainPassword);
  if (!passwordMatch) {
    return null;
  }
  
  // Создание JWT токена
  const token = jwt.sign(
    { username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  
  return token;
}

// Функция для установки токена в куки
export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60, // 8 часов
    sameSite: 'strict',
    path: '/'
  }));
}

// Функция для удаления токена из куки при выходе
export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/'
  }));
}

// Инициализация PrismaClient
const prismaClientSingleton = () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    const sanitizedUrl = dbUrl.replace(/:[^:]*@/, ':***@');
    console.log(`Connecting to: ${sanitizedUrl}`);
    
    // Пробуем извлечь компоненты строки подключения для более подробной диагностики
    try {
      const connectionParts = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      if (connectionParts) {
        const [, user, , host, port, database] = connectionParts;
        console.log(`Connection details: user=${user}, host=${host}, port=${port}, database=${database}`);
      }
    } catch (parseError) {
      console.warn('Could not parse connection string details:', parseError.message);
    }
    
    // Создаем клиент Prisma с расширенными параметрами
    return new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      // Добавляем настройки для повышения устойчивости соединения
      __internal: {
        engine: {
          connectTimeout: 10000, // 10 секунд на подключение
          connectionLimit: 5     // Ограничиваем количество одновременных соединений
        }
      }
    });
  } catch (error) {
    console.error('Error initializing Prisma Client:', error);
    throw error;
  }
};

// Используем глобальный объект для хранения экземпляра PrismaClient
const globalForPrisma = global;
globalForPrisma.prisma = globalForPrisma.prisma || prismaClientSingleton();

// Экспортируем экземпляр prisma для использования в приложении
export const prisma = globalForPrisma.prisma;

// Проверка соединения с базой данных при инициализации
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection with user gen_user...');
    // Простой запрос для проверки соединения
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful!');
    
    // Проверяем наличие таблиц и права доступа
    try {
      // Проверка прав на SELECT
      const tables = await prisma.$queryRaw`SHOW TABLES`;
      console.log('Tables available:', tables.map(t => Object.values(t)[0]).join(', '));
      
      // Проверяем права на запись для каждой таблицы
      const tablesToTest = ['stone', 'service', 'portfolio', 'contact'];
      
      for (const table of tablesToTest) {
        try {
          console.log(`Testing write permissions for ${table} table...`);
          
          // Временные данные для тестирования каждой таблицы
          let testData = {};
          if (table === 'stone') {
            testData = { name: 'Test Stone', description: 'Permission test' };
          } else if (table === 'service') {
            testData = { name: 'Test Service', description: 'Permission test' };
          } else if (table === 'portfolio') {
            testData = { title: 'Test Portfolio', description: 'Permission test', images: '[]' };
          } else if (table === 'contact') {
            testData = { name: 'Test Contact', email: 'test@example.com', message: 'Permission test' };
          }
          
          // Создаем тестовую запись
          const result = await prisma[table].create({ data: testData });
          
          // Удаляем тестовую запись
          await prisma[table].delete({ where: { id: result.id } });
          
          console.log(`✓ ${table} table write permissions OK`);
        } catch (tableError) {
          console.error(`✗ ${table} table permission error:`, tableError.message);
        }
      }
    } catch (permissionError) {
      console.error('Permission error:', permissionError.message);
      console.error(`
      ------------------------------------------------
      ОШИБКА ПРАВ ДОСТУПА К БАЗЕ ДАННЫХ!
      
      Пользователю gen_user не хватает необходимых прав.
      Рекомендуемое решение:
      
      1. Подключитесь к MySQL с правами администратора
      2. Выполните следующие команды:
         
         GRANT ALL PRIVILEGES ON default_db.* TO 'gen_user'@'%';
         FLUSH PRIVILEGES;
      
      Или обратитесь к администратору базы данных.
      ------------------------------------------------
      `);
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error(`
    ------------------------------------------------
    ОШИБКА ПОДКЛЮЧЕНИЯ К БАЗЕ ДАННЫХ!
    
    Проверьте:
    1. Правильность учетных данных в .env файле
    2. Что пользователь gen_user имеет доступ к базе данных
    3. Сетевые настройки и файрволы
    ------------------------------------------------
    `);
  }
}

// Запускаем проверку соединения, если это серверный код
if (typeof window === 'undefined') {
  testDatabaseConnection();
}