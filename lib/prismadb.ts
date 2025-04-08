import { PrismaClient } from '@prisma/client';

// Инициализация с дополнительной обработкой ошибок
const prismaClientSingleton = () => {
  try {
    return new PrismaClient({
      log: ['error', 'warn'],
      errorFormat: 'pretty',
    });
  } catch (error) {
    console.error('Ошибка инициализации Prisma:', error);
    throw error;
  }
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Проверка соединения с БД
export async function testConnection() {
  try {
    // Выполняем простой запрос для проверки соединения
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Успешное подключение к базе данных');
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    return false;
  }
}