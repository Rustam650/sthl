import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { ResultSetHeader } from 'mysql2';

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean; message: string } | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const { name, email, phone, message } = req.body as ContactFormData;
      
      // Проверка обязательных полей
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Имя, email и сообщение обязательны для заполнения' });
      }
      
      // Сохраняем контактные данные в базу
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO contact (name, email, phone, message, is_read) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, message, false]
      );
      
      res.status(201).json({ 
        success: true, 
        message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.' 
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({ error: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}