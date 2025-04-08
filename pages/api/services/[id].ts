import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../../lib/db';
import { RowDataPacket } from 'mysql2';

interface ServiceRow extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Service | { error: string }>
) {
  const { id } = req.query;
  
  if (req.method === 'GET') {
    try {
      const serviceId = parseInt(id as string);
      
      if (isNaN(serviceId)) {
        return res.status(400).json({ error: 'Некорректный ID услуги' });
      }
      
      const [services] = await pool.query<ServiceRow[]>('SELECT * FROM service WHERE id = ?', [serviceId]);
      const service = services[0];
      
      if (!service) {
        return res.status(404).json({ error: 'Услуга не найдена' });
      }
      
      res.status(200).json(service);
    } catch (error) {
      console.error('Error fetching service:', error);
      res.status(500).json({ error: 'Не удалось загрузить данные об услуге' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}