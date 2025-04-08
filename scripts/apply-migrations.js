const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function applyMigrations() {
  try {
    console.log('Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    console.log('Applying database migrations...');
    await execAsync('npx prisma migrate deploy');
    
    console.log('Migrations applied successfully');
    return true;
  } catch (error) {
    console.error('Error applying migrations:', error);
    return false;
  }
}

// Запускаем применение миграций, если скрипт запущен напрямую
if (require.main === module) {
  applyMigrations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Uncaught error during migrations:', error);
      process.exit(1);
    });
}

module.exports = { applyMigrations }; 