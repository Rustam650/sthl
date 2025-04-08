import { stonesRepository } from '../../../lib/db';

export default async function handler(req, res) {
  const { id } = req.query;
  const stoneId = parseInt(id);
  
  console.log(`Processing request for stone ID: ${stoneId}, method: ${req.method}`);
  
  if (isNaN(stoneId)) {
    return res.status(400).json({ error: "Некорректный ID камня" });
  }
  
  if (req.method === 'GET') {
    try {
      const stone = await stonesRepository.getStoneById(stoneId);
      
      if (!stone) {
        return res.status(404).json({ error: "Камень не найден" });
      }
      
      // Форматируем ответ для клиента
      const formattedStone = {
        ...stone,
        price: stone.price ? parseFloat(stone.price.toString()) : null,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Error getting stone:', error);
      
      let errorMessage = 'Неизвестная ошибка';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Обрабатываем особые случаи ошибок
        if (errorMessage.includes('access denied') || errorMessage.includes('denied to user')) {
          return res.status(500).json({ 
            error: `Ошибка доступа к базе данных. Пожалуйста, проверьте, что пользователь базы данных имеет необходимые права.` 
          });
        }
      }
      
      res.status(500).json({ error: `Не удалось загрузить камень: ${errorMessage}` });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name, description, images, type } = req.body;
      
      console.log(`Updating stone with ID: ${stoneId}`, { name, description, images, type });
      
      if (!name || !description) {
        return res.status(400).json({ error: 'Необходимо указать название и описание камня' });
      }
      
      // Обновляем камень через репозиторий
      const updatedStone = await stonesRepository.updateStone(stoneId, {
        name,
        description,
        image_url: images && images.length > 0 ? images[0] : null,
        category: type || null
      });
      
      console.log(`Stone updated successfully:`, updatedStone);
      
      // Возвращаем обновленный камень с дополнительными полями
      const formattedStone = {
        ...updatedStone,
        price: updatedStone.price ? parseFloat(updatedStone.price.toString()) : null,
        images: updatedStone.image_url ? [updatedStone.image_url] : [],
        type: updatedStone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Error updating stone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: `Не удалось обновить камень: ${errorMessage}` });
    }
  } else if (req.method === 'DELETE') {
    try {
      const success = await stonesRepository.deleteStone(stoneId);
      
      if (!success) {
        return res.status(404).json({ error: "Камень не найден или не может быть удален" });
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting stone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ error: `Не удалось удалить камень: ${errorMessage}` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
