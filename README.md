# STHL - Stone Hill

Сайт компании по работе с натуральным камнем.

## Технологии

- Next.js
- React
- MySQL
- Tailwind CSS

## Локальная разработка

1. Клонировать репозиторий
```bash
git clone https://github.com/Rustam650/sthl.git
cd sthl
```

2. Установить зависимости
```bash
npm install
```

3. Создать файл .env.local на основе .env.example
```bash
cp .env.example .env.local
```

4. Запустить сервер разработки
```bash
npm run dev
```

## Деплой на TimeWeb Cloud Apps

1. Подключить репозиторий GitHub к проекту в TimeWeb Cloud Apps
2. Настроить переменные окружения согласно .env.production
3. Запустить деплой через интерфейс TimeWeb Cloud Apps
4. После деплоя проверить работу сайта и админ-панели

## Структура проекта

- `/admin` - Компоненты и утилиты для административной панели
- `/components` - React-компоненты для интерфейса сайта
- `/lib` - Библиотеки, API-клиенты, работа с базой данных
- `/pages` - Страницы Next.js
- `/public` - Статические файлы (изображения, иконки)
- `/styles` - CSS и CSS-модули
- `/scripts` - Скрипты для работы с базой данных и деплоя

## Команды

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка проекта
- `npm start` - Запуск продакшн-сервера
- `npm run db:init` - Инициализация базы данных
- `npm run db:migrate` - Применение миграций 