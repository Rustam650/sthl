import { portfolioRepository } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

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
    
    // Форматируем данные для публичного API
    const formattedItem = {
      id: portfolioItem.id,
      title: portfolioItem.title,
      description: portfolioItem.description,
      fullDescription: portfolioItem.fullDescription,
      images: Array.isArray(portfolioItem.images) ? portfolioItem.images : JSON.parse(portfolioItem.images || '[]'),
      client: portfolioItem.client,
      completion: portfolioItem.completion_date ? new Date(portfolioItem.completion_date).toLocaleDateString('ru-RU') : null,
      services: Array.isArray(portfolioItem.services) ? portfolioItem.services : JSON.parse(portfolioItem.services || '[]')
    };
    
    res.status(200).json(formattedItem);
  } catch (error) {
    console.error('Ошибка при получении проекта портфолио:', error);
    res.status(500).json({ error: 'Не удалось загрузить проект портфолио' });
  }
}
