import { portfolioRepository } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const portfolioItems = await portfolioRepository.getAllPortfolioItems();
    
    // Форматируем данные для публичного API
    const formattedItems = portfolioItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      fullDescription: item.fullDescription,
      images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
      client: item.client,
      completion: item.completion_date ? new Date(item.completion_date).toLocaleDateString('ru-RU') : null,
      services: Array.isArray(item.services) ? item.services : JSON.parse(item.services || '[]')
    }));
    
    res.status(200).json(formattedItems);
  } catch (error) {
    console.error('Ошибка при получении списка портфолио:', error);
    res.status(500).json({ error: 'Не удалось загрузить проекты портфолио' });
  }
}
