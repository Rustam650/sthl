import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { RowDataPacket } from 'mysql2';

interface StoneRow extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  created_at: Date;
}

type Stone = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  created_at?: Date;
  images?: string[]; // Добавляем поле images для совместимости с админ-панелью
  type?: string | null; // Добавляем поле type для совместимости с клиентской частью
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stone[] | Stone | { error: string }>
) {
  try {
    // Добавим расширенное логирование для диагностики
    const dbUrl = process.env.DATABASE_URL;
    const sanitizedUrl = dbUrl?.replace(/:[^:]*@/, ':***@');
    console.log(`[API] Accessing stones API with database URL: ${sanitizedUrl}`);
    
    // Проверяем подключение к базе данных перед выполнением запроса
    try {
      const [result] = await pool.query('SELECT 1');
      console.log('[API] Database connection test successful');
    } catch (connError) {
      console.error('[API] Database connection test failed:', connError);
      return res.status(500).json({ 
        error: 'Ошибка подключения к базе данных. Проверьте настройки подключения в .env файле и доступность сервера базы данных.' 
      });
    }

    // Проверяем существование таблицы stone
    try {
      const [tables] = await pool.query<RowDataPacket[]>('SHOW TABLES');
      console.log('[API] Available tables:', tables);
      
      // Проверяем, есть ли таблица stone среди существующих таблиц
      const tableExists = Array.isArray(tables) && tables.some(
        table => Object.values(table)[0] === 'stone'
      );
      
      if (!tableExists) {
        console.error('[API] Table "stone" does not exist');
        return res.status(500).json({ 
          error: 'Таблица "stone" не существует. Необходимо инициализировать базу данных через админ-панель.' 
        });
      }
    } catch (tableError) {
      console.error('[API] Error checking tables:', tableError);
    }

    // Получение камней из базы данных
    const [stones] = await pool.query<StoneRow[]>('SELECT * FROM stone');
    
    // Преобразуем данные для совместимости с фронтендом
    const formattedStones = stones.map(stone => ({
      ...stone,
      price: stone.price ? parseFloat(stone.price.toString()) : null,
      images: stone.image_url ? [stone.image_url] : [],
      type: stone.category
    }));
    
    console.log(`[API] Successfully retrieved ${formattedStones.length} stones`);
    res.status(200).json(formattedStones);
  } catch (error) {
    console.error('[API] Error in stones API:', error);
    
    // Подробная обработка ошибок
    let errorMessage = 'Ошибка при получении данных';
    let details = '';
    
    if (error instanceof Error) {
      // Анализ сообщения об ошибке для определения типа проблемы
      const errorText = error.message.toLowerCase();
      
      if (errorText.includes('denied access') || 
          errorText.includes('permission denied') || 
          errorText.includes('access denied')) {
        errorMessage = 'Ошибка прав доступа к базе данных';
        details = 'Пользователю gen_user не хватает необходимых прав для доступа к базе данных default_db. Проверьте привилегии пользователя на сервере MySQL.';
        details += ' Рекомендуется выполнить команду: GRANT ALL PRIVILEGES ON default_db.* TO \'gen_user\'@\'%\'; FLUSH PRIVILEGES;';
      } else if (errorText.includes('connect')) {
        errorMessage = 'Ошибка подключения к базе данных';
        details = 'Не удается установить соединение с сервером базы данных. Проверьте сетевые настройки и доступность сервера.';
      } else if (errorText.includes('authentication')) {
        errorMessage = 'Ошибка аутентификации в базе данных';
        details = 'Неправильные учетные данные для подключения к базе данных. Проверьте имя пользователя и пароль в .env файле.';
      } else if (errorText.includes('does not exist') || errorText.includes('doesn\'t exist')) {
        errorMessage = 'Ошибка структуры базы данных';
        details = 'Таблица или база данных не существует. Попробуйте инициализировать базу данных через админ-панель по адресу /stonehill/dashboard.';
      } else {
        details = error.message;
      }
      
      console.error(`[API] Detailed error: ${errorMessage} - ${details}`);
    }
    
    res.status(500).json({ 
      error: `${errorMessage}. ${details}`
    });
  }
}