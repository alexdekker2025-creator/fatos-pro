-- Скрипт для удаления старых статей арканов
-- Удаляет все записи с category = 'Arcana (Cards)'

-- Сначала проверим, сколько записей будет удалено
SELECT COUNT(*) as "Количество записей для удаления"
FROM "Article" 
WHERE category = 'Arcana (Cards)';

-- Посмотрим, какие именно записи будут удалены
SELECT id, title, "relatedValue", language
FROM "Article" 
WHERE category = 'Arcana (Cards)'
ORDER BY "relatedValue", language;

-- ВНИМАНИЕ: Раскомментируйте следующую строку, чтобы выполнить удаление
-- DELETE FROM "Article" WHERE category = 'Arcana (Cards)';

-- После удаления проверим результат
-- SELECT COUNT(*) as "Осталось записей" FROM "Article" WHERE category = 'Arcana (Cards)';
