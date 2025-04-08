const { execSync } = require('child_process');
const path = require('path');

async function main() {
  try {
    console.log('Запуск настройки базы данных...');
    
    // Удаляем старые миграции, если они существуют
    console.log('Очистка старых миграций...');
    try {
      execSync('rm -rf prisma/migrations', { stdio: 'inherit' });
    } catch (error) {
      console.log('Директория миграций не существует или ошибка при удалении');
    }
    
    // Генерируем клиент Prisma
    console.log('Генерация клиента Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Создаем новую миграцию
    console.log('Создание новой миграции...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    
    console.log('База данных успешно настроена!');
  } catch (error) {
    console.error('Ошибка при настройке базы данных:', error);
    process.exit(1);
  }
}

main();
