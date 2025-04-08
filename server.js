const express = require('express');
const next = require('next');
const path = require('path');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  
  // Статические файлы
  server.use(express.static(path.join(__dirname, 'public')));
  
  // Маршрут проверки работоспособности для TimeWeb
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Явная обработка корневого маршрута
  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });
  
  // Инициализация базы данных при старте сервера
  if (process.env.NODE_ENV === 'production') {
    try {
      // Попытка инициализации БД при запуске
      require('./scripts/db-init').initDatabase().then(success => {
        console.log('Database initialization:', success ? 'successful' : 'failed');
      }).catch(err => {
        console.error('Database initialization error:', err);
      });
    } catch (error) {
      console.error('Failed to require db-init script:', error);
    }
  }
  
  // Обрабатываем все остальные запросы через Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 