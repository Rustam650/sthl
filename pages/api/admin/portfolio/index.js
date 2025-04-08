import { authMiddleware } from '../../../../admin/auth';
import { portfolioRepository } from '../../../../lib/db';
import nextConnect from 'next-connect';

const handler = nextConnect()
  .use(authMiddleware)
  .get(async (req, res) => {
    try {
      const portfolioItems = await portfolioRepository.getAllPortfolioItems();
      
      // Обеспечиваем правильное форматирование JSON данных
      const formattedItems = portfolioItems.map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
        services: Array.isArray(item.services) ? item.services : JSON.parse(item.services || '[]')
      }));
      
      res.status(200).json(formattedItems);
    } catch (error) {
      console.error('Ошибка при получении списка портфолио:', error);
      res.status(500).json({ error: 'Ошибка при получении списка портфолио' });
    }
  })
  .post(async (req, res) => {
    try {
      const { title, description, fullDescription, images, client, completion, services } = req.body;
      
      if (!title || !description || !images || !images.length) {
        return res.status(400).json({ error: 'Необходимо заполнить все обязательные поля' });
      }
      
      const newPortfolioItem = await portfolioRepository.createPortfolioItem({
        title,
        description,
        fullDescription: fullDescription || '',
        images: images,
        client: client || '',
        completion_date: completion || null,
        services: services || []
      });
      
      res.status(201).json(newPortfolioItem);
    } catch (error) {
      console.error('Ошибка при создании проекта портфолио:', error);
      res.status(500).json({ error: 'Ошибка при создании проекта портфолио' });
    }
  });

export default handler;
