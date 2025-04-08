import { stonesRepository } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('[API] Accessing stones API using native MySQL driver');
      
      // Проверка соединения с БД
      const connectionCheck = await stonesRepository.validateConnection();
      if (!connectionCheck.success) {
        return res.status(500).json({ 
          error: 'Ошибка подключения к базе данных', 
          details: connectionCheck.error,
          code: connectionCheck.code
        });
      }
      
      const stones = await stonesRepository.getAllStones();
      
      // Трансформируем данные для совместимости с существующим интерфейсом
      const formattedStones = stones.map(stone => ({
        ...stone,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      }));
      
      res.status(200).json(formattedStones);
    } catch (error) {
      console.error('[API] Error in stones API:', error);
      res.status(500).json({ 
        error: 'Ошибка при получении данных', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('[API] Creating new stone');
      const { name, description, type, images } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Название камня обязательно' });
      }
      
      // Создаем новый камень
      const stone = await stonesRepository.createStone({
        name,
        description,
        image_url: images && images.length > 0 ? images[0] : null,
        category: type
      });
      
      // Форматируем ответ для совместимости с клиентом
      const formattedStone = {
        ...stone,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      };
      
      res.status(201).json(formattedStone);
    } catch (error) {
      console.error('[API] Error creating stone:', error);
      res.status(500).json({ 
        error: 'Ошибка при создании камня', 
        details: `Ошибка при работе с базой данных: ${error.message}`
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
