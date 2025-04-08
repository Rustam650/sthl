-- Предоставление всех необходимых прав пользователю gen_user на базу данных default_db
GRANT ALL PRIVILEGES ON default_db.* TO 'gen_user'@'%';
FLUSH PRIVILEGES;
