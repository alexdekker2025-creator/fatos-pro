-- Шаблон для добавления новых статей арканов
-- Заполните поля title и content для каждого аркана на русском и английском языках

-- ВАЖНО: Используется UPSERT (INSERT ... ON CONFLICT DO UPDATE)
-- Это означает, что если запись уже существует, она будет обновлена

INSERT INTO "Article" (id, title, content, category, language, "relatedValue", "publishedAt", "updatedAt")
VALUES

-- ========================================
-- АРКАН 0: ШУТ (THE FOOL)
-- ========================================
(
  gen_random_uuid(),
  'Шут',  -- ЗАПОЛНИТЕ: Название аркана на русском
  'ЗАПОЛНИТЕ: Полное описание аркана Шут на русском языке. Включите значение, символику, интерпретацию в раскладах.',
  'Arcana (Cards)',
  'ru',
  'arcana_0',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Fool',  -- ЗАПОЛНИТЕ: Название аркана на английском
  'FILL IN: Full description of The Fool arcana in English. Include meaning, symbolism, interpretation in readings.',
  'Arcana (Cards)',
  'en',
  'arcana_0',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 1: МАГ (THE MAGICIAN)
-- ========================================
(
  gen_random_uuid(),
  'Маг',
  'ЗАПОЛНИТЕ: Описание аркана Маг',
  'Arcana (Cards)',
  'ru',
  'arcana_1',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Magician',
  'FILL IN: Description of The Magician',
  'Arcana (Cards)',
  'en',
  'arcana_1',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 2: ВЕРХОВНАЯ ЖРИЦА (THE HIGH PRIESTESS)
-- ========================================
(
  gen_random_uuid(),
  'Верховная Жрица',
  'ЗАПОЛНИТЕ: Описание аркана Верховная Жрица',
  'Arcana (Cards)',
  'ru',
  'arcana_2',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The High Priestess',
  'FILL IN: Description of The High Priestess',
  'Arcana (Cards)',
  'en',
  'arcana_2',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 3: ИМПЕРАТРИЦА (THE EMPRESS)
-- ========================================
(
  gen_random_uuid(),
  'Императрица',
  'ЗАПОЛНИТЕ: Описание аркана Императрица',
  'Arcana (Cards)',
  'ru',
  'arcana_3',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Empress',
  'FILL IN: Description of The Empress',
  'Arcana (Cards)',
  'en',
  'arcana_3',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 4: ИМПЕРАТОР (THE EMPEROR)
-- ========================================
(
  gen_random_uuid(),
  'Император',
  'ЗАПОЛНИТЕ: Описание аркана Император',
  'Arcana (Cards)',
  'ru',
  'arcana_4',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Emperor',
  'FILL IN: Description of The Emperor',
  'Arcana (Cards)',
  'en',
  'arcana_4',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 5: ИЕРОФАНТ (THE HIEROPHANT)
-- ========================================
(
  gen_random_uuid(),
  'Иерофант',
  'ЗАПОЛНИТЕ: Описание аркана Иерофант',
  'Arcana (Cards)',
  'ru',
  'arcana_5',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Hierophant',
  'FILL IN: Description of The Hierophant',
  'Arcana (Cards)',
  'en',
  'arcana_5',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 6: ВЛЮБЛЕННЫЕ (THE LOVERS)
-- ========================================
(
  gen_random_uuid(),
  'Влюбленные',
  'ЗАПОЛНИТЕ: Описание аркана Влюбленные',
  'Arcana (Cards)',
  'ru',
  'arcana_6',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Lovers',
  'FILL IN: Description of The Lovers',
  'Arcana (Cards)',
  'en',
  'arcana_6',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 7: КОЛЕСНИЦА (THE CHARIOT)
-- ========================================
(
  gen_random_uuid(),
  'Колесница',
  'ЗАПОЛНИТЕ: Описание аркана Колесница',
  'Arcana (Cards)',
  'ru',
  'arcana_7',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Chariot',
  'FILL IN: Description of The Chariot',
  'Arcana (Cards)',
  'en',
  'arcana_7',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 8: СИЛА (STRENGTH)
-- ========================================
(
  gen_random_uuid(),
  'Сила',
  'ЗАПОЛНИТЕ: Описание аркана Сила',
  'Arcana (Cards)',
  'ru',
  'arcana_8',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Strength',
  'FILL IN: Description of Strength',
  'Arcana (Cards)',
  'en',
  'arcana_8',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 9: ОТШЕЛЬНИК (THE HERMIT)
-- ========================================
(
  gen_random_uuid(),
  'Отшельник',
  'ЗАПОЛНИТЕ: Описание аркана Отшельник',
  'Arcana (Cards)',
  'ru',
  'arcana_9',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Hermit',
  'FILL IN: Description of The Hermit',
  'Arcana (Cards)',
  'en',
  'arcana_9',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 10: КОЛЕСО ФОРТУНЫ (WHEEL OF FORTUNE)
-- ========================================
(
  gen_random_uuid(),
  'Колесо Фортуны',
  'ЗАПОЛНИТЕ: Описание аркана Колесо Фортуны',
  'Arcana (Cards)',
  'ru',
  'arcana_10',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Wheel of Fortune',
  'FILL IN: Description of Wheel of Fortune',
  'Arcana (Cards)',
  'en',
  'arcana_10',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 11: СПРАВЕДЛИВОСТЬ (JUSTICE)
-- ========================================
(
  gen_random_uuid(),
  'Справедливость',
  'ЗАПОЛНИТЕ: Описание аркана Справедливость',
  'Arcana (Cards)',
  'ru',
  'arcana_11',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Justice',
  'FILL IN: Description of Justice',
  'Arcana (Cards)',
  'en',
  'arcana_11',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 12: ПОВЕШЕННЫЙ (THE HANGED MAN)
-- ========================================
(
  gen_random_uuid(),
  'Повешенный',
  'ЗАПОЛНИТЕ: Описание аркана Повешенный',
  'Arcana (Cards)',
  'ru',
  'arcana_12',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Hanged Man',
  'FILL IN: Description of The Hanged Man',
  'Arcana (Cards)',
  'en',
  'arcana_12',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 13: СМЕРТЬ (DEATH)
-- ========================================
(
  gen_random_uuid(),
  'Смерть',
  'ЗАПОЛНИТЕ: Описание аркана Смерть',
  'Arcana (Cards)',
  'ru',
  'arcana_13',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Death',
  'FILL IN: Description of Death',
  'Arcana (Cards)',
  'en',
  'arcana_13',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 14: УМЕРЕННОСТЬ (TEMPERANCE)
-- ========================================
(
  gen_random_uuid(),
  'Умеренность',
  'ЗАПОЛНИТЕ: Описание аркана Умеренность',
  'Arcana (Cards)',
  'ru',
  'arcana_14',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Temperance',
  'FILL IN: Description of Temperance',
  'Arcana (Cards)',
  'en',
  'arcana_14',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 15: ДЬЯВОЛ (THE DEVIL)
-- ========================================
(
  gen_random_uuid(),
  'Дьявол',
  'ЗАПОЛНИТЕ: Описание аркана Дьявол',
  'Arcana (Cards)',
  'ru',
  'arcana_15',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Devil',
  'FILL IN: Description of The Devil',
  'Arcana (Cards)',
  'en',
  'arcana_15',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 16: БАШНЯ (THE TOWER)
-- ========================================
(
  gen_random_uuid(),
  'Башня',
  'ЗАПОЛНИТЕ: Описание аркана Башня',
  'Arcana (Cards)',
  'ru',
  'arcana_16',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Tower',
  'FILL IN: Description of The Tower',
  'Arcana (Cards)',
  'en',
  'arcana_16',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 17: ЗВЕЗДА (THE STAR)
-- ========================================
(
  gen_random_uuid(),
  'Звезда',
  'ЗАПОЛНИТЕ: Описание аркана Звезда',
  'Arcana (Cards)',
  'ru',
  'arcana_17',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Star',
  'FILL IN: Description of The Star',
  'Arcana (Cards)',
  'en',
  'arcana_17',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 18: ЛУНА (THE MOON)
-- ========================================
(
  gen_random_uuid(),
  'Луна',
  'ЗАПОЛНИТЕ: Описание аркана Луна',
  'Arcana (Cards)',
  'ru',
  'arcana_18',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Moon',
  'FILL IN: Description of The Moon',
  'Arcana (Cards)',
  'en',
  'arcana_18',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 19: СОЛНЦЕ (THE SUN)
-- ========================================
(
  gen_random_uuid(),
  'Солнце',
  'ЗАПОЛНИТЕ: Описание аркана Солнце',
  'Arcana (Cards)',
  'ru',
  'arcana_19',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Sun',
  'FILL IN: Description of The Sun',
  'Arcana (Cards)',
  'en',
  'arcana_19',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 20: СУД (JUDGEMENT)
-- ========================================
(
  gen_random_uuid(),
  'Суд',
  'ЗАПОЛНИТЕ: Описание аркана Суд',
  'Arcana (Cards)',
  'ru',
  'arcana_20',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Judgement',
  'FILL IN: Description of Judgement',
  'Arcana (Cards)',
  'en',
  'arcana_20',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 21: МИР (THE WORLD)
-- ========================================
(
  gen_random_uuid(),
  'Мир',
  'ЗАПОЛНИТЕ: Описание аркана Мир',
  'Arcana (Cards)',
  'ru',
  'arcana_21',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The World',
  'FILL IN: Description of The World',
  'Arcana (Cards)',
  'en',
  'arcana_21',
  NOW(),
  NOW()
),

-- ========================================
-- АРКАН 22: ШУТ (альтернативная нумерация)
-- ========================================
(
  gen_random_uuid(),
  'Шут',
  'ЗАПОЛНИТЕ: Описание аркана Шут (22)',
  'Arcana (Cards)',
  'ru',
  'arcana_22',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Fool',
  'FILL IN: Description of The Fool (22)',
  'Arcana (Cards)',
  'en',
  'arcana_22',
  NOW(),
  NOW()
)

ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  "updatedAt" = NOW();

-- Проверка результата
SELECT COUNT(*) as "Всего статей арканов" 
FROM "Article" 
WHERE category = 'Arcana (Cards)';

SELECT "relatedValue", language, title 
FROM "Article" 
WHERE category = 'Arcana (Cards)' 
ORDER BY "relatedValue", language;
