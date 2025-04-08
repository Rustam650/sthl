import { authMiddleware } from '../../../../admin/auth';
import { portfolioRepository } from '../../../../lib/db';
import nextConnect from 'next-connect';

const handler = nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    try {
      const { id } = req.query;
      const portfolioId = parseInt(id);
      
      if (isNaN(portfolioId)) {
        return res.status(400).json({ error: 'Некорректный ID проекта' });
      }
      
      const portfolioItem = await portfolioRepository.getPortfolioItemById(portfolioId);
      
      if (!portfolioItem) {
        return res.status(404).json({ error: 'Проект не найден' });
      }
      
      // Убедимся, что images и services правильно форматированы
      const formattedItem = {
        ...portfolioItem,
        images: Array.isArray(portfolioItem.images) ? portfolioItem.images : [],
        services: Array.isArray(portfolioItem.services) ? portfolioItem.services : []
      };
      
      res.status(200).json(formattedItem);
    } catch (error) {
      console.error('Ошибка при получении проекта портфолио:', error);
      res.status(500).json({ error: 'Ошибка при получении проекта портфолио' });
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.query;
      const portfolioId = parseInt(id);
      
      if (isNaN(portfolioId)) {
        return res.status(400).json({ error: 'Некорректный ID проекта' });
      }
      
      const { title, description, fullDescription, images, client, completion, services } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Название проекта обязательно' });
      }
      
      // Обновляем проект через репозиторий
      const updatedItem = await portfolioRepository.updatePortfolioItem(portfolioId, {
        title,
        description,
        fullDescription,
        images: Array.isArray(images) ? images.filter(img => img.trim() !== '') : [],
        client,
        completion_date: completion || null,
        services: Array.isArray(services) ? services.filter(svc => svc.trim() !== '') : []
      });
      
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Ошибка при обновлении проекта портфолио:', error);
      res.status(500).json({ error: 'Не удалось обновить проект' });
    }
  })
  .delete(async (req, res) => {
    try {
      const { id } = req.query;
      const portfolioId = parseInt(id);
      
      if (isNaN(portfolioId)) {
        return res.status(400).json({ error: 'Некорректный ID проекта' });
      }
      
      const success = await portfolioRepository.deletePortfolioItem(portfolioId);
      
      if (!success) {
        return res.status(404).json({ error: 'Проект не найден' });
      }
      
      res.status(200).json({ message: 'Проект успешно удален' });
    } catch (error) {
      console.error('Ошибка при удалении проекта портфолио:', error);
      res.status(500).json({ error: 'Не удалось удалить проект' });
    }
  });

export default handler;
