import { authMiddleware } from '../../../../admin/auth';
import { stonesRepository } from '../../../../lib/db';
import nextConnect from 'next-connect';

const handler = nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    try {
      const stones = await stonesRepository.getAllStones();
      
      // Форматируем ответ для совместимости с клиентом
      const formattedStones = stones.map(stone => ({
        ...stone,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      }));
      
      res.status(200).json(formattedStones);
    } catch (error) {
      console.error('Ошибка при получении камней:', error);
      res.status(500).json({ error: 'Не удалось получить список камней' });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, description, price, images, type } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Название камня обязательно' });
      }
      
      // Создаем новый камень через репозиторий
      const stone = await stonesRepository.createStone({
        name,
        description,
        price: price ? parseFloat(price) : null,
        image_url: images && images.length > 0 ? images[0] : null,
        category: type || null
      });
      
      // Форматируем ответ для клиента
      const formattedStone = {
        ...stone,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      };
      
      res.status(201).json(formattedStone);
    } catch (error) {
      console.error('Ошибка при создании камня:', error);
      res.status(500).json({ error: 'Не удалось создать камень' });
    }
  });

export default handler;
