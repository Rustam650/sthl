import { contactsRepository } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, message } = req.body;
      
      // Валидация
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
      }
      
      // Сохранение контакта
      const contact = await contactsRepository.createContact({
        name,
        email,
        phone: phone || null,
        message
      });
      
      return res.status(201).json({ 
        success: true, 
        message: 'Ваше сообщение успешно отправлено!', 
        contact 
      });
    } catch (error) {
      console.error('Ошибка при сохранении контакта:', error);
      return res.status(500).json({ error: 'Произошла ошибка при отправке сообщения' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Метод ${req.method} не разрешен`);
  }
}
