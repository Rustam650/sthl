import { getPool } from '../../../lib/db';

export default async function handler(req, res) {
  const response = {
    connection: 'error',
    tableStatus: null,
    sampleData: null,
    error: null,
    recommendations: []
  };

  try {
    const pool = getPool();
    
    // Проверяем соединение
    await pool.query('SELECT 1');
    response.connection = 'ok';
    
    // Проверяем структуру таблицы portfolio
    try {
      const [tableInfo] = await pool.query('DESCRIBE portfolio');
      response.tableStatus = {
        exists: true,
        columns: tableInfo.map(col => col.Field)
      };
      
      // Проверяем необходимые колонки
      const requiredColumns = ['id', 'title', 'description', 'images', 'services'];
      const missingColumns = requiredColumns.filter(col => 
        !response.tableStatus.columns.includes(col)
      );
      
      if (missingColumns.length > 0) {
        response.recommendations.push(
          `Отсутствуют необходимые колонки в таблице portfolio: ${missingColumns.join(', ')}`
        );
      }
      
      // Получаем пример данных
      const [sampleRows] = await pool.query('SELECT id, title, images, services FROM portfolio LIMIT 1');
      if (sampleRows.length > 0) {
        const sampleRow = sampleRows[0];
        response.sampleData = {
          id: sampleRow.id,
          title: sampleRow.title,
          imagesType: typeof sampleRow.images,
          servicesType: typeof sampleRow.services,
          imagesValue: sampleRow.images ? sampleRow.images.substring(0, 100) + '...' : null,
          servicesValue: sampleRow.services ? sampleRow.services.substring(0, 100) + '...' : null
        };
        
        // Проверяем корректность JSON
        try {
          JSON.parse(sampleRow.images || '[]');
        } catch (e) {
          response.recommendations.push('Поле images содержит некорректный JSON');
        }
        
        try {
          JSON.parse(sampleRow.services || '[]');
        } catch (e) {
          response.recommendations.push('Поле services содержит некорректный JSON');
        }
      } else {
        response.recommendations.push('Таблица portfolio не содержит данных');
      }
      
    } catch (error) {
      response.tableStatus = { exists: false, error: error.message };
      response.recommendations.push('Таблица portfolio не существует или имеет неправильную структуру');
    }
    
    await pool.end();
  } catch (error) {
    response.error = error.message;
    response.recommendations.push('Проблема с подключением к базе данных. Проверьте настройки подключения');
  }
  
  res.status(200).json(response);
}
