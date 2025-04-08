import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prismadb';
import { pool, dbInitializer } from '../../../lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Результаты проверки
    const diagnostics: Record<string, any> = {
      timestamp: new Date().toISOString(),
      prismaConnection: false,
      mysqlConnection: false,
      tables: {},
      connectionDetails: {},
      recommendations: []
    };
    
    // Проверяем подключение через Prisma
    try {
      await prisma.$queryRaw`SELECT 1`;
      diagnostics.prismaConnection = true;
    } catch (error) {
      diagnostics.prismaError = error instanceof Error ? error.message : 'Unknown error';
      diagnostics.recommendations.push('Проверьте настройки подключения в .env файле (DATABASE_URL)');
    }
    
    // Проверяем подключение через mysql2
    try {
      const connectionCheck = await dbInitializer.checkConnection();
      diagnostics.mysqlConnection = connectionCheck.success;
      if (!connectionCheck.success) {
        diagnostics.mysqlError = connectionCheck.message;
      }
    } catch (error) {
      diagnostics.mysqlError = error instanceof Error ? error.message : 'Unknown error';
    }
    
    // Проверяем таблицы
    if (diagnostics.mysqlConnection) {
      const tablesCheck = await dbInitializer.checkTablesExist();
      diagnostics.tables = tablesCheck;
      
      if (tablesCheck.missing && tablesCheck.missing.length > 0) {
        diagnostics.recommendations.push('Необходимо инициализировать базу данных через админ-панель');
      }
    }
    
    // Проверяем настройки подключения
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const sanitizedUrl = dbUrl.replace(/:[^:]*@/, ':***@');
      diagnostics.connectionDetails.url = sanitizedUrl;
      
      try {
        const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
        if (match) {
          const [, user, , host, port, database] = match;
          diagnostics.connectionDetails.user = user;
          diagnostics.connectionDetails.host = host;
          diagnostics.connectionDetails.port = port;
          diagnostics.connectionDetails.database = database;
        }
      } catch (error) {
        diagnostics.connectionDetails.parseError = 'Не удалось разобрать строку подключения';
      }
    } else {
      diagnostics.recommendations.push('DATABASE_URL не найден в .env файле');
    }
    
    res.status(200).json(diagnostics);
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при проверке статуса базы данных',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
}
