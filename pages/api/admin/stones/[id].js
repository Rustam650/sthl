import { authMiddleware } from '../../../../admin/auth';
import { stonesRepository } from '../../../../lib/db';
import nextConnect from 'next-connect';

const handler = nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    try {
      const { id } = req.query;
      const stoneId = parseInt(id);
      
      if (isNaN(stoneId)) {
        return res.status(400).json({ error: 'Некорректный ID камня' });
      }
      
      const stone = await stonesRepository.getStoneById(stoneId);
      
      if (!stone) {
        return res.status(404).json({ error: 'Камень не найден' });
      }
      
      // Форматируем ответ для клиента
      const formattedStone = {
        ...stone,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Ошибка при получении камня:', error);
      res.status(500).json({ error: 'Не удалось получить камень' });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.query;
      const stoneId = parseInt(id);
      
      if (isNaN(stoneId)) {
        return res.status(400).json({ error: 'Некорректный ID камня' });
      }
      
      const { name, description, price, images, type } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Название камня обязательно' });
      }
      
      // Обновляем камень через репозиторий
      const updatedStone = await stonesRepository.updateStone(stoneId, {
        name,
        description,
        price: price ? parseFloat(price) : null,
        image_url: images && images.length > 0 ? images[0] : null,
        category: type || null
      });
      
      // Форматируем ответ для клиента
      const formattedStone = {
        ...updatedStone,
        images: updatedStone.image_url ? [updatedStone.image_url] : [],
        type: updatedStone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Ошибка при обновлении камня:', error);
      res.status(500).json({ error: 'Не удалось обновить камень' });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.query;
      const stoneId = parseInt(id);
      
      if (isNaN(stoneId)) {
        return res.status(400).json({ error: 'Некорректный ID камня' });
      }
      
      const success = await stonesRepository.deleteStone(stoneId);
      
      if (!success) {
        return res.status(404).json({ error: 'Камень не найден' });
      }
      
      res.status(200).json({ message: 'Камень успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении камня:', error);
      res.status(500).json({ error: 'Не удалось удалить камень' });
    }
  });

export default handler;
