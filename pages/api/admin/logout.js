import { clearAuthCookie } from '../../../admin/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
  
  // Очищаем куки с токеном
  clearAuthCookie(res);
  
  return res.status(200).json({ success: true });
}
