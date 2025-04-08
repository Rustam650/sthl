import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Секретный ключ для JWT (должен совпадать с ключом в auth.js)
const JWT_SECRET = process.env.JWT_SECRET || 'stonehill-admin-secret-key';

export default async function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.admin_token;
    
    if (!token) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.status(200).json({ 
      authenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
}
