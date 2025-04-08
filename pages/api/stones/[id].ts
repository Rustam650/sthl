import type { NextApiRequest, NextApiResponse } from 'next';
import { stonesRepository } from '../../../lib/db';

type Stone = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
  created_at?: Date;
  images?: string[];
  type?: string | null;
  
  // Добавляем поля для отображения на странице
  title?: string;          // Название камня для отображения
  stone_type?: string;     // Тип камня (мрамор, гранит и т.д.)
  detail_description?: string; // Подробное описание для страницы камня
  display_image?: string;  // Основное изображение для показа
  status?: string;         // Статус записи
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Stone | { error: string } | { success: boolean }>
) {
  const { id } = req.query;
  const stoneId = parseInt(id as string);
  
  console.log(`Processing request for stone ID: ${stoneId}, method: ${req.method}`);
  
  if (isNaN(stoneId)) {
    return res.status(400).json({ error: 'Некорректный ID камня' });
  }
  
  if (req.method === 'GET') {
    try {
      console.log(`Fetching stone with ID: ${stoneId}`);
      const stone = await stonesRepository.getStoneById(stoneId);
      
      if (!stone) {
        console.log(`Stone with ID ${stoneId} not found`);
        return res.status(404).json({ error: 'Камень не найден' });
      }
      
      console.log(`Stone found:`, stone);
      
      // Преобразуем данные из репозитория в формат, соответствующий типу Stone
      const formattedStone: Stone = {
        ...stone,
        price: stone.price ? parseFloat(stone.price.toString()) : null,
        images: stone.image_url ? [stone.image_url] : [],
        type: stone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Error fetching stone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Проверяем и обрабатываем ошибки доступа к базе данных
      if (errorMessage.includes('denied access') || 
          errorMessage.includes('permission denied')) {
        return res.status(500).json({ 
          error: `Ошибка доступа к базе данных. Пожалуйста, проверьте, что пользователь базы данных имеет необходимые права.` 
        });
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
      
      // Обновляем камень в базе через репозиторий
      const updatedStone = await stonesRepository.updateStone(stoneId, {
        name,
        description,
        image_url: images && images.length > 0 ? images[0] : null,
        category: type || null
      });
      
      console.log(`Stone updated successfully:`, updatedStone);
      
      // Возвращаем обновленный камень с дополнительными полями
      const formattedStone: Stone = {
        ...updatedStone,
        price: updatedStone.price ? parseFloat(updatedStone.price.toString()) : null,
        images: updatedStone.image_url ? [updatedStone.image_url] : [],
        type: updatedStone.category
      };
      
      res.status(200).json(formattedStone);
    } catch (error) {
      console.error('Error updating stone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Проверяем и обрабатываем ошибки доступа к базе данных
      if (errorMessage.includes('denied access') || 
          errorMessage.includes('permission denied')) {
        return res.status(500).json({ 
          error: `Ошибка доступа к базе данных. Убедитесь, что пользователь базы данных имеет права на обновление записей.` 
        });
      }
      
      res.status(500).json({ error: `Не удалось обновить камень: ${errorMessage}` });
    }
  } else if (req.method === 'DELETE') {
    try {
      console.log(`Deleting stone with ID: ${stoneId}`);
      
      const success = await stonesRepository.deleteStone(stoneId);
      
      if (!success) {
        return res.status(404).json({ error: 'Камень не найден' });
      }
      
      console.log(`Stone with ID ${stoneId} deleted successfully`);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting stone:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Проверяем и обрабатываем ошибки доступа к базе данных
      if (errorMessage.includes('denied access') || 
          errorMessage.includes('permission denied')) {
        return res.status(500).json({ 
          error: `Ошибка доступа к базе данных. Убедитесь, что пользователь базы данных имеет права на удаление записей.` 
        });
      }
      
      res.status(500).json({ error: `Не удалось удалить камень: ${errorMessage}` });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}