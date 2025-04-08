// Скрипт для выдачи необходимых прав пользователю gen_user
const { execSync } = require('child_process');
require('dotenv').config();

console.log('Скрипт для выдачи прав пользователю gen_user на базу данных default_db');
console.log('----------------------------------------------------------------------');

// Извлекаем данные подключения из переменной окружения
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Ошибка: Переменная DATABASE_URL не найдена в .env файле');
  process.exit(1);
}

// Парсим строку подключения
try {
  const match = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error('Ошибка: Не удалось распознать формат строки подключения');
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;
  
  console.log(`Информация о подключении:`);
  console.log(`- Пользователь: ${user}`);
  console.log(`- Хост: ${host}`);
  console.log(`- Порт: ${port}`);
  console.log(`- База данных: ${database}`);
  
  console.log('\nВнимание: Этот скрипт должен быть выполнен пользователем с правами администратора базы данных');
  console.log('Команда для выдачи прав, которую нужно выполнить на сервере MySQL:');
  console.log('\n```sql');
  console.log(`GRANT ALL PRIVILEGES ON ${database}.* TO '${user}'@'%';`);
  console.log('FLUSH PRIVILEGES;');
  console.log('```\n');
  
  console.log('Если у вас есть прямой доступ к серверу MySQL, вы можете выполнить следующую команду:');
  console.log(`mysql -h ${host} -P ${port} -u root -p -e "GRANT ALL PRIVILEGES ON ${database}.* TO '${user}'@'%'; FLUSH PRIVILEGES;"`);
  
  console.log('\nПроверка текущих прав:');
  console.log(`mysql -h ${host} -P ${port} -u ${user} -p${password} -e "SHOW GRANTS FOR CURRENT_USER;"`);
  
} catch (error) {
  console.error('Ошибка при обработке строки подключения:', error.message);
  process.exit(1);
}
