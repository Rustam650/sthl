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
  res: NextApiResponse<Service[] | { error: string }>
) {
  if (req.method === 'GET') {
    try {
      const [services] = await pool.query<ServiceRow[]>('SELECT * FROM service');
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ error: 'Не удалось загрузить список услуг' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}