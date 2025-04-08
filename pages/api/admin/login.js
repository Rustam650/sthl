import { authenticateUser, setAuthCookie } from '../../../admin/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Необходимо указать имя пользователя и пароль' });
  }
  
  try {
    const token = await authenticateUser(username, password);
    
    if (!token) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }
    
    // Устанавливаем токен в куки
    setAuthCookie(res, token);
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('Ошибка аутентификации:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
