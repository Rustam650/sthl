import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const instructions = {
    title: 'Инструкция по инициализации базы данных',
    steps: [
      {
        step: 1,
        title: 'Авторизуйтесь в админ-панели',
        description: 'Перейдите по адресу /stonehill и войдите в систему с учетными данными администратора.'
      },
      {
        step: 2,
        title: 'Перейдите в раздел "Панель управления"',
        description: 'В боковом меню выберите "Панель управления".'
      },
      {
        step: 3,
        title: 'Инициализируйте базу данных',
        description: 'Нажмите на кнопку "Инициализировать БД" и подождите завершения процесса.'
      },
      {
        step: 4,
        title: 'Проверьте результат',
        description: 'После инициализации вернитесь на страницу со списком камней и обновите ее.'
      }
    ],
    additionalInfo: [
      'Если вы видите ошибку о недостатке прав доступа, обратитесь к разработчикам для настройки привилегий пользователя базы данных.',
      'Для диагностики проблем с подключением используйте API-эндпоинт /api/debug/db-status'
    ],
    connectionInfo: {
      host: process.env.DB_HOST || 'не указан',
      database: process.env.DB_NAME || 'не указана',
      user: process.env.DB_USER || 'не указан'
    }
  };

  res.status(200).json(instructions);
}
