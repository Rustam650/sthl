import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Учетные данные для сравнения - использование открытого текста для отладки
const ADMIN_CREDENTIALS = {
  username: 'stoneadmin',
  plainPassword: 'stonepassword' // Пароль в открытом виде для прямого сравнения
};

// Секретный ключ для JWT
const JWT_SECRET = process.env.JWT_SECRET || 'stonehill-admin-secret-key';

// Middleware для проверки аутентификации
export function authMiddleware(req, res, next) {
  const token = req.cookies.admin_token;
  
  if (!token) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

// Функция для аутентификации пользователя
export async function authenticateUser(username, password) {
  // Проверка учетных данных
  if (username !== ADMIN_CREDENTIALS.username) {
    return null;
  }
  
  // Прямое сравнение пароля вместо хеша
  const passwordMatch = (password === ADMIN_CREDENTIALS.plainPassword);
  if (!passwordMatch) {
    return null;
  }
  
  // Создание JWT токена
  const token = jwt.sign(
    { username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
  
  return token;
}

// Функция для установки токена в куки
export function setAuthCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60, // 8 часов
    sameSite: 'strict',
    path: '/'
  }));
}

// Функция для удаления токена из куки при выходе
export function clearAuthCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'strict',
    path: '/'
  }));
}
