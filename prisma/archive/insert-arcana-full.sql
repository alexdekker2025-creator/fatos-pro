-- ============================================
-- ПОЛНЫЙ СКРИПТ ДОБАВЛЕНИЯ ОПИСАНИЙ АРКАНОВ
-- ============================================
-- Данные из предоставленного JSON
-- Каждый аркан содержит описания для утра, дня, вечера и ночи

-- ВАЖНО: Сначала удалите старые статьи арканов
-- DELETE FROM "Article" WHERE category = 'Arcana (Cards)';

INSERT INTO "Article" (id, title, content, category, language, "relatedValue", "publishedAt", "updatedAt")
VALUES

-- ========================================
-- АРКАН 1: МАГ / THE MAGICIAN
-- ========================================
(
  gen_random_uuid(),
  'Маг',
  E'🌅 УТРО\nУтро силы. Ты чувствуешь, что можешь всё. Сегодня твоя воля и слово имеют вес. Начинай важные дела именно сейчас.\n\n☀️ ДЕНЬ\nДень реализации. Ты — центр событий. Твои идеи находят отклик, инструменты слушаются, люди поддерживают. Бери инициативу.\n\n🌇 ВЕЧЕР\nВечером важно закрепить результат. Не распыляйся, доведи начатое до конца. То, что ты создал сегодня, будет работать на тебя долго.\n\n🌙 НОЧЬ\nНочь удовлетворения. Ты засыпаешь с чувством «я сделал это». Энергия дня уходит, оставляя приятную усталость мастера.',
  'Arcana (Cards)',
  'ru',
  'arcana_1',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'The Magician',
  E'🌅 MORNING\nMorning of power. You feel you can do anything. Today your will and word carry weight. Start important matters right now.\n\n☀️ DAY\nDay of realization. You are the center of events. Your ideas resonate, tools obey, people support. Take initiative.\n\n🌇 EVENING\nIn the evening it''s important to consolidate results. Don''t scatter, finish what you started. What you created today will work for you for a long time.\n\n🌙 NIGHT\nNight of satisfaction. You fall asleep with the feeling "I did it". The energy of the day fades, leaving pleasant fatigue of a master.',
  'Arcana (Cards)',
  'en',
  'arcana_1',
  NOW(),
  NOW()
),
