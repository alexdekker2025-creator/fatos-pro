-- Статьи для всех 22 арканов Таро (русская и английская версии)
-- UPSERT версия: обновляет существующие записи или создает новые

-- Аркан 1: Маг
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_1_ru', 'Arcana (Cards)', 'ru', 'Аркан 1: Маг', 
'Сегодня вы полны энергии и возможностей. Маг символизирует начало новых дел, творческую силу и умение воплощать идеи в реальность. Используйте свои таланты и навыки для достижения целей. Это время действовать решительно и уверенно.', 
'arcana_1', NOW(), NOW()),
('arcana_1_en', 'Arcana (Cards)', 'en', 'Arcana 1: The Magician', 
'Today you are full of energy and possibilities. The Magician symbolizes the beginning of new endeavors, creative power, and the ability to manifest ideas into reality. Use your talents and skills to achieve your goals. This is a time to act decisively and confidently.', 
'arcana_1', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 2: Верховная Жрица
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_2_ru', 'Arcana (Cards)', 'ru', 'Аркан 2: Верховная Жрица', 
'День интуиции и внутренней мудрости. Прислушайтесь к своему внутреннему голосу, доверьтесь предчувствиям. Сегодня важно не спешить с решениями, а дать себе время для размышлений. Тайны могут раскрыться, если вы будете внимательны.', 
'arcana_2', NOW(), NOW()),
('arcana_2_en', 'Arcana (Cards)', 'en', 'Arcana 2: The High Priestess', 
'A day of intuition and inner wisdom. Listen to your inner voice, trust your premonitions. Today it is important not to rush decisions, but to give yourself time to reflect. Secrets may be revealed if you are attentive.', 
'arcana_2', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 3: Императрица
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_3_ru', 'Arcana (Cards)', 'ru', 'Аркан 3: Императрица', 
'Время изобилия, творчества и заботы. Императрица приносит гармонию в отношения и материальное благополучие. Сегодня благоприятно заниматься творчеством, заботиться о близких и наслаждаться красотой жизни. Природа и искусство вдохновят вас.', 
'arcana_3', NOW(), NOW()),
('arcana_3_en', 'Arcana (Cards)', 'en', 'Arcana 3: The Empress', 
'A time of abundance, creativity, and care. The Empress brings harmony to relationships and material well-being. Today is favorable for engaging in creativity, caring for loved ones, and enjoying the beauty of life. Nature and art will inspire you.', 
'arcana_3', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 4: Император
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_4_ru', 'Arcana (Cards)', 'ru', 'Аркан 4: Император', 
'День структуры, порядка и лидерства. Император призывает вас взять ответственность и контроль над ситуацией. Сегодня важно быть организованным, следовать плану и проявлять авторитет. Ваша решительность приведет к успеху.', 
'arcana_4', NOW(), NOW()),
('arcana_4_en', 'Arcana (Cards)', 'en', 'Arcana 4: The Emperor', 
'A day of structure, order, and leadership. The Emperor calls you to take responsibility and control of the situation. Today it is important to be organized, follow the plan, and show authority. Your determination will lead to success.', 
'arcana_4', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 5: Иерофант
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_5_ru', 'Arcana (Cards)', 'ru', 'Аркан 5: Иерофант', 
'Время традиций, обучения и духовного роста. Иерофант советует обратиться к мудрости предков, учителям или наставникам. Сегодня благоприятно для обучения, следования правилам и поиска глубокого смысла в жизни.', 
'arcana_5', NOW(), NOW()),
('arcana_5_en', 'Arcana (Cards)', 'en', 'Arcana 5: The Hierophant', 
'A time of tradition, learning, and spiritual growth. The Hierophant advises turning to the wisdom of ancestors, teachers, or mentors. Today is favorable for learning, following rules, and seeking deep meaning in life.', 
'arcana_5', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 6: Влюбленные
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_6_ru', 'Arcana (Cards)', 'ru', 'Аркан 6: Влюбленные', 
'День выбора, любви и гармонии. Влюбленные символизируют важные решения в отношениях и необходимость следовать своему сердцу. Сегодня важно быть честным с собой и другими. Любовь и партнерство в центре внимания.', 
'arcana_6', NOW(), NOW()),
('arcana_6_en', 'Arcana (Cards)', 'en', 'Arcana 6: The Lovers', 
'A day of choice, love, and harmony. The Lovers symbolize important decisions in relationships and the need to follow your heart. Today it is important to be honest with yourself and others. Love and partnership are in focus.', 
'arcana_6', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 7: Колесница
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_7_ru', 'Arcana (Cards)', 'ru', 'Аркан 7: Колесница', 
'Время движения, победы и контроля. Колесница призывает вас двигаться вперед с уверенностью и решимостью. Сегодня вы способны преодолеть любые препятствия. Держите курс и не отвлекайтесь на мелочи.', 
'arcana_7', NOW(), NOW()),
('arcana_7_en', 'Arcana (Cards)', 'en', 'Arcana 7: The Chariot', 
'A time of movement, victory, and control. The Chariot calls you to move forward with confidence and determination. Today you are capable of overcoming any obstacles. Stay on course and do not get distracted by trifles.', 
'arcana_7', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 8: Сила
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_8_ru', 'Arcana (Cards)', 'ru', 'Аркан 8: Сила', 
'День внутренней силы, терпения и мужества. Сила учит управлять эмоциями и проявлять мягкую силу. Сегодня важно быть терпеливым, сострадательным и уверенным в себе. Ваша внутренняя сила поможет преодолеть трудности.', 
'arcana_8', NOW(), NOW()),
('arcana_8_en', 'Arcana (Cards)', 'en', 'Arcana 8: Strength', 
'A day of inner strength, patience, and courage. Strength teaches to manage emotions and show gentle power. Today it is important to be patient, compassionate, and confident. Your inner strength will help overcome difficulties.', 
'arcana_8', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 9: Отшельник
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_9_ru', 'Arcana (Cards)', 'ru', 'Аркан 9: Отшельник', 
'Время уединения, самопознания и внутреннего поиска. Отшельник советует отступить от суеты и заглянуть внутрь себя. Сегодня благоприятно для медитации, размышлений и поиска ответов в тишине. Мудрость приходит в одиночестве.', 
'arcana_9', NOW(), NOW()),
('arcana_9_en', 'Arcana (Cards)', 'en', 'Arcana 9: The Hermit', 
'A time of solitude, self-knowledge, and inner search. The Hermit advises to step back from the hustle and look within. Today is favorable for meditation, reflection, and seeking answers in silence. Wisdom comes in solitude.', 
'arcana_9', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 10: Колесо Фортуны
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_10_ru', 'Arcana (Cards)', 'ru', 'Аркан 10: Колесо Фортуны', 
'День перемен, судьбы и новых возможностей. Колесо Фортуны приносит неожиданные повороты событий. Сегодня важно быть гибким и открытым к переменам. Удача на вашей стороне, если вы готовы принять новое.', 
'arcana_10', NOW(), NOW()),
('arcana_10_en', 'Arcana (Cards)', 'en', 'Arcana 10: Wheel of Fortune', 
'A day of change, destiny, and new opportunities. The Wheel of Fortune brings unexpected turns of events. Today it is important to be flexible and open to change. Luck is on your side if you are ready to embrace the new.', 
'arcana_10', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 11: Справедливость
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_11_ru', 'Arcana (Cards)', 'ru', 'Аркан 11: Справедливость', 
'Время истины, баланса и справедливых решений. Справедливость призывает к честности и объективности. Сегодня важно взвесить все за и против, принять взвешенное решение. Каждое действие имеет последствия.', 
'arcana_11', NOW(), NOW()),
('arcana_11_en', 'Arcana (Cards)', 'en', 'Arcana 11: Justice', 
'A time of truth, balance, and fair decisions. Justice calls for honesty and objectivity. Today it is important to weigh all pros and cons, make a balanced decision. Every action has consequences.', 
'arcana_11', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 12: Повешенный
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_12_ru', 'Arcana (Cards)', 'ru', 'Аркан 12: Повешенный', 
'День паузы, жертвы и нового взгляда. Повешенный учит смотреть на ситуацию с другой стороны. Сегодня важно отпустить контроль, принять ситуацию и найти новую перспективу. Иногда нужно остановиться, чтобы двигаться дальше.', 
'arcana_12', NOW(), NOW()),
('arcana_12_en', 'Arcana (Cards)', 'en', 'Arcana 12: The Hanged Man', 
'A day of pause, sacrifice, and new perspective. The Hanged Man teaches to look at the situation from another side. Today it is important to let go of control, accept the situation, and find a new perspective. Sometimes you need to stop to move forward.', 
'arcana_12', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 13: Смерть
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_13_ru', 'Arcana (Cards)', 'ru', 'Аркан 13: Смерть', 
'Время трансформации, завершения и нового начала. Смерть символизирует конец старого и рождение нового. Сегодня важно отпустить прошлое и открыться переменам. Трансформация необходима для роста.', 
'arcana_13', NOW(), NOW()),
('arcana_13_en', 'Arcana (Cards)', 'en', 'Arcana 13: Death', 
'A time of transformation, completion, and new beginning. Death symbolizes the end of the old and the birth of the new. Today it is important to let go of the past and open up to change. Transformation is necessary for growth.', 
'arcana_13', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 14: Умеренность
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_14_ru', 'Arcana (Cards)', 'ru', 'Аркан 14: Умеренность', 
'День баланса, гармонии и терпения. Умеренность учит находить золотую середину во всем. Сегодня важно быть умеренным, избегать крайностей и искать компромиссы. Гармония приходит через баланс.', 
'arcana_14', NOW(), NOW()),
('arcana_14_en', 'Arcana (Cards)', 'en', 'Arcana 14: Temperance', 
'A day of balance, harmony, and patience. Temperance teaches to find the golden mean in everything. Today it is important to be moderate, avoid extremes, and seek compromises. Harmony comes through balance.', 
'arcana_14', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 15: Дьявол
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_15_ru', 'Arcana (Cards)', 'ru', 'Аркан 15: Дьявол', 
'День искушений, зависимостей и материальных желаний. Дьявол предупреждает о ловушках и иллюзиях. Сегодня важно осознать свои слабости и не поддаваться соблазнам. Свобода начинается с осознания.', 
'arcana_15', NOW(), NOW()),
('arcana_15_en', 'Arcana (Cards)', 'en', 'Arcana 15: The Devil', 
'A day of temptations, addictions, and material desires. The Devil warns of traps and illusions. Today it is important to recognize your weaknesses and not give in to temptations. Freedom begins with awareness.', 
'arcana_15', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 16: Башня
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_16_ru', 'Arcana (Cards)', 'ru', 'Аркан 16: Башня', 
'Время внезапных перемен, разрушения иллюзий и освобождения. Башня приносит неожиданные события, которые разрушают старое. Сегодня важно принять перемены и увидеть в них возможность для нового начала.', 
'arcana_16', NOW(), NOW()),
('arcana_16_en', 'Arcana (Cards)', 'en', 'Arcana 16: The Tower', 
'A time of sudden changes, destruction of illusions, and liberation. The Tower brings unexpected events that destroy the old. Today it is important to accept changes and see in them an opportunity for a new beginning.', 
'arcana_16', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 17: Звезда
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_17_ru', 'Arcana (Cards)', 'ru', 'Аркан 17: Звезда', 
'День надежды, вдохновения и исцеления. Звезда приносит свет после тьмы, веру в будущее. Сегодня благоприятно для мечтаний, творчества и восстановления сил. Ваши надежды сбудутся.', 
'arcana_17', NOW(), NOW()),
('arcana_17_en', 'Arcana (Cards)', 'en', 'Arcana 17: The Star', 
'A day of hope, inspiration, and healing. The Star brings light after darkness, faith in the future. Today is favorable for dreaming, creativity, and restoring strength. Your hopes will come true.', 
'arcana_17', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 18: Луна
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_18_ru', 'Arcana (Cards)', 'ru', 'Аркан 18: Луна', 
'Время иллюзий, интуиции и подсознания. Луна предупреждает о неясности и обмане. Сегодня важно доверять интуиции, но проверять факты. Не все то, чем кажется. Прислушайтесь к своим снам и предчувствиям.', 
'arcana_18', NOW(), NOW()),
('arcana_18_en', 'Arcana (Cards)', 'en', 'Arcana 18: The Moon', 
'A time of illusions, intuition, and the subconscious. The Moon warns of uncertainty and deception. Today it is important to trust intuition but verify facts. Not everything is as it seems. Listen to your dreams and premonitions.', 
'arcana_18', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 19: Солнце
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_19_ru', 'Arcana (Cards)', 'ru', 'Аркан 19: Солнце', 
'День радости, успеха и ясности. Солнце приносит свет, тепло и позитивную энергию. Сегодня все складывается благоприятно, вы полны сил и оптимизма. Наслаждайтесь моментом и делитесь радостью с другими.', 
'arcana_19', NOW(), NOW()),
('arcana_19_en', 'Arcana (Cards)', 'en', 'Arcana 19: The Sun', 
'A day of joy, success, and clarity. The Sun brings light, warmth, and positive energy. Today everything is going favorably, you are full of strength and optimism. Enjoy the moment and share joy with others.', 
'arcana_19', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 20: Суд
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_20_ru', 'Arcana (Cards)', 'ru', 'Аркан 20: Суд', 
'Время пробуждения, призвания и важных решений. Суд призывает к переоценке жизни и новому началу. Сегодня важно услышать свой внутренний зов и ответить на него. Прошлое оценено, будущее открыто.', 
'arcana_20', NOW(), NOW()),
('arcana_20_en', 'Arcana (Cards)', 'en', 'Arcana 20: Judgement', 
'A time of awakening, calling, and important decisions. Judgement calls for a reassessment of life and a new beginning. Today it is important to hear your inner call and respond to it. The past is evaluated, the future is open.', 
'arcana_20', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 21: Мир
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_21_ru', 'Arcana (Cards)', 'ru', 'Аркан 21: Мир', 
'День завершения, достижения и гармонии. Мир символизирует успешное окончание цикла и полноту. Сегодня вы достигли цели, можете насладиться результатами. Это время праздновать успех и готовиться к новому циклу.', 
'arcana_21', NOW(), NOW()),
('arcana_21_en', 'Arcana (Cards)', 'en', 'Arcana 21: The World', 
'A day of completion, achievement, and harmony. The World symbolizes the successful end of a cycle and wholeness. Today you have reached your goal, you can enjoy the results. This is a time to celebrate success and prepare for a new cycle.', 
'arcana_21', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();

-- Аркан 22: Шут
INSERT INTO "Article" ("id", "category", "language", "title", "content", "relatedValue", "publishedAt", "updatedAt")
VALUES 
('arcana_22_ru', 'Arcana (Cards)', 'ru', 'Аркан 22: Шут', 
'День новых начинаний, спонтанности и свободы. Шут призывает к приключениям и риску. Сегодня важно быть открытым к новому опыту, не бояться неизвестности. Жизнь - это путешествие, наслаждайтесь каждым шагом.', 
'arcana_22', NOW(), NOW()),
('arcana_22_en', 'Arcana (Cards)', 'en', 'Arcana 22: The Fool', 
'A day of new beginnings, spontaneity, and freedom. The Fool calls for adventure and risk. Today it is important to be open to new experiences, not to fear the unknown. Life is a journey, enjoy every step.', 
'arcana_22', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE SET
  "category" = EXCLUDED."category",
  "language" = EXCLUDED."language",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "relatedValue" = EXCLUDED."relatedValue",
  "updatedAt" = NOW();
