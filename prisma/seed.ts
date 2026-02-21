import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing articles
  await prisma.article.deleteMany({});
  console.log('✓ Cleared existing articles');

  // Seed destiny numbers
  await seedDestinyNumbers();
  
  // Seed matrix positions
  await seedMatrixPositions();
  
  // Seed Pythagorean square cells
  await seedPythagoreanSquareCells();

  // Seed arcana descriptions
  await seedArcanaDescriptions();

  console.log('✅ Database seeding completed successfully!');
}

async function seedDestinyNumbers() {
  console.log('📊 Seeding destiny numbers...');

  const destinyNumbers = [
    // Number 1
    {
      title: 'Число судьбы 1',
      content: 'Число 1 символизирует лидерство, независимость и новые начинания. Люди с этим числом обладают сильной волей, амбициозны и стремятся к достижению целей. Они прирожденные лидеры, способные вдохновлять других и прокладывать новые пути.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_1'
    },
    {
      title: 'Destiny Number 1',
      content: 'Number 1 symbolizes leadership, independence, and new beginnings. People with this number possess strong will, ambition, and drive to achieve goals. They are natural leaders capable of inspiring others and forging new paths.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_1'
    },
    // Number 2
    {
      title: 'Число судьбы 2',
      content: 'Число 2 олицетворяет гармонию, партнерство и дипломатию. Люди с этим числом обладают чувствительностью, интуицией и способностью к сотрудничеству. Они миротворцы, умеющие находить баланс и создавать гармоничные отношения.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_2'
    },
    {
      title: 'Destiny Number 2',
      content: 'Number 2 represents harmony, partnership, and diplomacy. People with this number possess sensitivity, intuition, and ability to cooperate. They are peacemakers who can find balance and create harmonious relationships.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_2'
    },
    // Number 3
    {
      title: 'Число судьбы 3',
      content: 'Число 3 символизирует творчество, самовыражение и коммуникацию. Люди с этим числом обладают артистизмом, оптимизмом и способностью вдохновлять других. Они талантливы в искусстве, общении и создании радости вокруг себя.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_3'
    },
    {
      title: 'Destiny Number 3',
      content: 'Number 3 symbolizes creativity, self-expression, and communication. People with this number possess artistry, optimism, and ability to inspire others. They are talented in arts, communication, and creating joy around them.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_3'
    },
    // Number 4
    {
      title: 'Число судьбы 4',
      content: 'Число 4 олицетворяет стабильность, практичность и трудолюбие. Люди с этим числом обладают организованностью, надежностью и способностью создавать прочные основы. Они методичны, дисциплинированы и ценят порядок.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_4'
    },
    {
      title: 'Destiny Number 4',
      content: 'Number 4 represents stability, practicality, and hard work. People with this number possess organization, reliability, and ability to create solid foundations. They are methodical, disciplined, and value order.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_4'
    },
    // Number 5
    {
      title: 'Число судьбы 5',
      content: 'Число 5 символизирует свободу, изменения и приключения. Люди с этим числом обладают любознательностью, адаптивностью и жаждой новых впечатлений. Они динамичны, универсальны и стремятся к разнообразию в жизни.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_5'
    },
    {
      title: 'Destiny Number 5',
      content: 'Number 5 symbolizes freedom, change, and adventure. People with this number possess curiosity, adaptability, and thirst for new experiences. They are dynamic, versatile, and seek variety in life.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_5'
    },
    // Number 6
    {
      title: 'Число судьбы 6',
      content: 'Число 6 олицетворяет ответственность, заботу и служение. Люди с этим числом обладают состраданием, гармоничностью и стремлением помогать другим. Они прекрасные воспитатели, целители и создатели уюта.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_6'
    },
    {
      title: 'Destiny Number 6',
      content: 'Number 6 represents responsibility, care, and service. People with this number possess compassion, harmony, and desire to help others. They are excellent nurturers, healers, and creators of comfort.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_6'
    },
    // Number 7
    {
      title: 'Число судьбы 7',
      content: 'Число 7 символизирует мудрость, духовность и анализ. Люди с этим числом обладают глубоким умом, интуицией и стремлением к познанию истины. Они философы, исследователи и искатели духовного понимания.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_7'
    },
    {
      title: 'Destiny Number 7',
      content: 'Number 7 symbolizes wisdom, spirituality, and analysis. People with this number possess deep mind, intuition, and desire to know the truth. They are philosophers, researchers, and seekers of spiritual understanding.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_7'
    },
    // Number 8
    {
      title: 'Число судьбы 8',
      content: 'Число 8 олицетворяет власть, материальный успех и достижения. Люди с этим числом обладают амбициозностью, деловой хваткой и способностью управлять ресурсами. Они прирожденные руководители и организаторы.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_8'
    },
    {
      title: 'Destiny Number 8',
      content: 'Number 8 represents power, material success, and achievements. People with this number possess ambition, business acumen, and ability to manage resources. They are natural executives and organizers.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_8'
    },
    // Number 9
    {
      title: 'Число судьбы 9',
      content: 'Число 9 символизирует завершение, гуманизм и универсальную любовь. Люди с этим числом обладают состраданием, идеализмом и стремлением служить человечеству. Они мудры, щедры и способны видеть общую картину.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_9'
    },
    {
      title: 'Destiny Number 9',
      content: 'Number 9 symbolizes completion, humanism, and universal love. People with this number possess compassion, idealism, and desire to serve humanity. They are wise, generous, and able to see the big picture.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_9'
    },
    // Master Number 11
    {
      title: 'Число судьбы 11',
      content: 'Мастер-число 11 символизирует духовное просветление, интуицию и вдохновение. Люди с этим числом обладают высокой чувствительностью, экстрасенсорными способностями и миссией просвещения. Они духовные учителя и проводники света.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_11'
    },
    {
      title: 'Destiny Number 11',
      content: 'Master number 11 symbolizes spiritual enlightenment, intuition, and inspiration. People with this number possess high sensitivity, psychic abilities, and mission of enlightenment. They are spiritual teachers and light bearers.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_11'
    },
    // Master Number 22
    {
      title: 'Число судьбы 22',
      content: 'Мастер-число 22 олицетворяет мастерство строительства, практическую мудрость и глобальное видение. Люди с этим числом обладают способностью воплощать грандиозные идеи в реальность. Они архитекторы судьбы и создатели масштабных проектов.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_22'
    },
    {
      title: 'Destiny Number 22',
      content: 'Master number 22 represents master building, practical wisdom, and global vision. People with this number possess ability to manifest grand ideas into reality. They are architects of destiny and creators of large-scale projects.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_22'
    },
    // Master Number 33
    {
      title: 'Число судьбы 33',
      content: 'Мастер-число 33 символизирует безусловную любовь, служение и духовное учительство. Люди с этим числом обладают высшей формой сострадания и способностью исцелять других. Они мастера-целители и духовные наставники человечества.',
      category: 'destiny_number',
      language: 'ru',
      relatedValue: 'destiny_33'
    },
    {
      title: 'Destiny Number 33',
      content: 'Master number 33 symbolizes unconditional love, service, and spiritual teaching. People with this number possess highest form of compassion and ability to heal others. They are master healers and spiritual guides of humanity.',
      category: 'destiny_number',
      language: 'en',
      relatedValue: 'destiny_33'
    },
  ];

  await prisma.article.createMany({ data: destinyNumbers });

  console.log(`✓ Created ${destinyNumbers.length} destiny number articles`);
}

async function seedMatrixPositions() {
  console.log('🔮 Seeding matrix positions...');

  const matrixPositions = [];

  // Descriptions for each position type
  const positionDescriptions: Record<string, { ru: string; en: string; titleRu: string; titleEn: string }> = {
    dayNumber: {
      titleRu: 'Число дня',
      titleEn: 'Day Number',
      ru: 'Число дня отражает вашу внутреннюю силу, лидерские качества и способность к самореализации. Оно показывает, как вы проявляете себя в мире и какие таланты используете для достижения целей.',
      en: 'Day number reflects your inner strength, leadership qualities, and ability for self-realization. It shows how you manifest yourself in the world and what talents you use to achieve goals.'
    },
    monthNumber: {
      titleRu: 'Число месяца',
      titleEn: 'Month Number',
      ru: 'Число месяца раскрывает ваш подход к партнерству, способность к сотрудничеству и гармонии в отношениях. Оно показывает, как вы взаимодействуете с другими людьми и строите связи.',
      en: 'Month number reveals your approach to partnership, ability to cooperate, and harmony in relationships. It shows how you interact with others and build connections.'
    },
    yearNumber: {
      titleRu: 'Число года',
      titleEn: 'Year Number',
      ru: 'Число года отражает ваш творческий потенциал, способность к самовыражению и коммуникации. Оно показывает, как вы проявляете свою уникальность и делитесь своими идеями с миром.',
      en: 'Year number reflects your creative potential, ability for self-expression, and communication. It shows how you manifest your uniqueness and share your ideas with the world.'
    },
    lifePathNumber: {
      titleRu: 'Число жизненного пути',
      titleEn: 'Life Path Number',
      ru: 'Число жизненного пути показывает вашу стабильность, практичность и способность создавать прочный фундамент. Оно отражает ваш подход к работе, организации и построению материальной базы.',
      en: 'Life path number shows your stability, practicality, and ability to create solid foundation. It reflects your approach to work, organization, and building material base.'
    },
    personalityNumber: {
      titleRu: 'Число личности',
      titleEn: 'Personality Number',
      ru: 'Число личности раскрывает вашу потребность в свободе, изменениях и новых впечатлениях. Оно показывает, как вы адаптируетесь к переменам и исследуете мир вокруг себя.',
      en: 'Personality number reveals your need for freedom, changes, and new experiences. It shows how you adapt to changes and explore the world around you.'
    },
    soulNumber: {
      titleRu: 'Число души',
      titleEn: 'Soul Number',
      ru: 'Число души отражает вашу внутреннюю сущность, духовные стремления и глубинные желания. Оно показывает, что действительно важно для вашей души и к чему вы стремитесь на духовном уровне.',
      en: 'Soul number reflects your inner essence, spiritual aspirations, and deep desires. It shows what truly matters to your soul and what you strive for on a spiritual level.'
    },
    powerNumber: {
      titleRu: 'Число силы',
      titleEn: 'Power Number',
      ru: 'Число силы показывает вашу внутреннюю мощь, способность преодолевать препятствия и достигать целей. Оно отражает вашу решимость, волю и энергию для реализации задуманного.',
      en: 'Power number shows your inner strength, ability to overcome obstacles, and achieve goals. It reflects your determination, will, and energy to realize your plans.'
    },
    karmicNumber: {
      titleRu: 'Кармическое число',
      titleEn: 'Karmic Number',
      ru: 'Кармическое число раскрывает ваши кармические задачи, уроки прошлых воплощений и то, что вам нужно проработать в этой жизни. Оно показывает области роста и развития.',
      en: 'Karmic number reveals your karmic tasks, lessons from past incarnations, and what you need to work through in this life. It shows areas of growth and development.'
    }
  };

  // Generate articles for each position with values 1-9, 11, 22, 33
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  
  for (const [positionName, desc] of Object.entries(positionDescriptions)) {
    for (const value of values) {
      // Russian version
      matrixPositions.push({
        title: `${desc.titleRu}: ${value}`,
        content: desc.ru,
        category: 'destiny_matrix',
        language: 'ru',
        relatedValue: `matrix_${positionName}_${value}`
      });

      // English version
      matrixPositions.push({
        title: `${desc.titleEn}: ${value}`,
        content: desc.en,
        category: 'destiny_matrix',
        language: 'en',
        relatedValue: `matrix_${positionName}_${value}`
      });
    }
  }

  await prisma.article.createMany({ data: matrixPositions });

  console.log(`✓ Created ${matrixPositions.length} matrix position articles`);
}

async function seedPythagoreanSquareCells() {
  console.log('📐 Seeding Pythagorean square cells...');

  const squareCells = [];

  // Generate articles for each digit (1-9) with different counts (0-5)
  const cellDescriptions: Record<number, { ru: string; en: string }> = {
    1: {
      ru: 'Единицы в квадрате Пифагора отражают силу характера, волю и эгоизм. Чем больше единиц, тем сильнее выражены лидерские качества и стремление к доминированию. Отсутствие единиц указывает на мягкость характера.',
      en: 'Ones in Pythagorean square reflect strength of character, will, and ego. The more ones, the stronger leadership qualities and desire to dominate. Absence of ones indicates soft character.'
    },
    2: {
      ru: 'Двойки показывают уровень жизненной энергии и биополя. Множество двоек указывает на сильную энергетику и способность делиться энергией с другими. Отсутствие двоек говорит о необходимости беречь силы.',
      en: 'Twos show level of life energy and biofield. Multiple twos indicate strong energy and ability to share energy with others. Absence of twos suggests need to conserve strength.'
    },
    3: {
      ru: 'Тройки отражают склонность к точным наукам, технике и порядку. Много троек указывает на аналитический склад ума и педантичность. Отсутствие троек говорит о творческом, гуманитарном мышлении.',
      en: 'Threes reflect inclination to exact sciences, technology, and order. Many threes indicate analytical mindset and meticulousness. Absence of threes suggests creative, humanitarian thinking.'
    },
    4: {
      ru: 'Четверки показывают физическое здоровье и выносливость организма. Множество четверок указывает на крепкое здоровье и хорошую физическую форму. Отсутствие четверок требует внимания к здоровью.',
      en: 'Fours show physical health and body endurance. Multiple fours indicate strong health and good physical condition. Absence of fours requires attention to health.'
    },
    5: {
      ru: 'Пятерки отражают способность к логическому мышлению и интуиции. Много пятерок указывает на развитую интуицию и умение планировать. Отсутствие пятерок говорит о склонности к мечтательности.',
      en: 'Fives reflect ability for logical thinking and intuition. Many fives indicate developed intuition and planning skills. Absence of fives suggests tendency to daydreaming.'
    },
    6: {
      ru: 'Шестерки показывают отношение к физическому труду и материальному миру. Множество шестерок указывает на трудолюбие и практичность. Отсутствие шестерок говорит о нелюбви к рутинной работе.',
      en: 'Sixes show attitude to physical work and material world. Multiple sixes indicate hard work and practicality. Absence of sixes suggests dislike for routine work.'
    },
    7: {
      ru: 'Семерки отражают везение, удачу и связь с высшими силами. Много семерок указывает на особую защиту судьбы и способность к эзотерике. Отсутствие семерок требует больше усилий для достижения целей.',
      en: 'Sevens reflect fortune, luck, and connection with higher forces. Many sevens indicate special protection of fate and ability for esoterics. Absence of sevens requires more effort to achieve goals.'
    },
    8: {
      ru: 'Восьмерки показывают чувство долга, ответственность и доброту. Множество восьмерок указывает на высокую ответственность и стремление помогать другим. Отсутствие восьмерок говорит о свободолюбии.',
      en: 'Eights show sense of duty, responsibility, and kindness. Multiple eights indicate high responsibility and desire to help others. Absence of eights suggests love of freedom.'
    },
    9: {
      ru: 'Девятки отражают память, интеллект и способность к обучению. Много девяток указывает на отличную память и аналитические способности. Отсутствие девяток требует развития памяти и концентрации.',
      en: 'Nines reflect memory, intellect, and learning ability. Many nines indicate excellent memory and analytical abilities. Absence of nines requires development of memory and concentration.'
    }
  };

  const cellTitles: Record<number, { ru: string; en: string }> = {
    1: { ru: 'Характер', en: 'Character' },
    2: { ru: 'Энергия', en: 'Energy' },
    3: { ru: 'Интерес к науке', en: 'Interest in Science' },
    4: { ru: 'Здоровье', en: 'Health' },
    5: { ru: 'Логика и интуиция', en: 'Logic and Intuition' },
    6: { ru: 'Труд и заземление', en: 'Work and Grounding' },
    7: { ru: 'Удача', en: 'Luck' },
    8: { ru: 'Долг', en: 'Duty' },
    9: { ru: 'Память и ум', en: 'Memory and Mind' }
  };

  // Create articles for each digit with counts 0-5
  for (let digit = 1; digit <= 9; digit++) {
    for (let count = 0; count <= 5; count++) {
      // Russian version
      squareCells.push({
        title: `Ячейка ${digit}: ${cellTitles[digit].ru} (${count})`,
        content: cellDescriptions[digit].ru,
        category: 'pythagorean_square',
        language: 'ru',
        relatedValue: `square_${digit}_${count}`
      });

      // English version
      squareCells.push({
        title: `Cell ${digit}: ${cellTitles[digit].en} (${count})`,
        content: cellDescriptions[digit].en,
        category: 'pythagorean_square',
        language: 'en',
        relatedValue: `square_${digit}_${count}`
      });
    }
  }

  await prisma.article.createMany({ data: squareCells });

  console.log(`✓ Created ${squareCells.length} Pythagorean square cell articles`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


async function seedArcanaDescriptions() {
  console.log('🃏 Seeding arcana descriptions...');

  const arcanaDescriptions = [
    // Arcana 1 - The Magician
    {
      title: 'Аркан 1: Маг',
      content: 'Маг символизирует начало, силу воли и способность воплощать идеи в реальность. Это день для новых начинаний, проявления инициативы и использования всех доступных ресурсов.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_1'
    },
    {
      title: 'Arcana 1: The Magician',
      content: 'The Magician symbolizes beginning, willpower, and ability to manifest ideas into reality. This is a day for new beginnings, showing initiative, and using all available resources.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_1'
    },
    // Arcana 2 - The High Priestess
    {
      title: 'Аркан 2: Верховная Жрица',
      content: 'Верховная Жрица олицетворяет интуицию, тайные знания и внутреннюю мудрость. День для медитации, прислушивания к внутреннему голосу и раскрытия скрытых истин.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_2'
    },
    {
      title: 'Arcana 2: The High Priestess',
      content: 'The High Priestess embodies intuition, secret knowledge, and inner wisdom. A day for meditation, listening to inner voice, and revealing hidden truths.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_2'
    },
    // Arcana 3 - The Empress
    {
      title: 'Аркан 3: Императрица',
      content: 'Императрица символизирует плодородие, творчество и материнскую заботу. День для творческих проектов, заботы о близких и наслаждения красотой жизни.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_3'
    },
    {
      title: 'Arcana 3: The Empress',
      content: 'The Empress symbolizes fertility, creativity, and maternal care. A day for creative projects, caring for loved ones, and enjoying life\'s beauty.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_3'
    },
    // Arcana 4 - The Emperor
    {
      title: 'Аркан 4: Император',
      content: 'Император олицетворяет власть, структуру и стабильность. День для принятия важных решений, установления порядка и проявления лидерских качеств.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_4'
    },
    {
      title: 'Arcana 4: The Emperor',
      content: 'The Emperor embodies power, structure, and stability. A day for making important decisions, establishing order, and showing leadership qualities.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_4'
    },
    // Arcana 5 - The Hierophant
    {
      title: 'Аркан 5: Иерофант',
      content: 'Иерофант символизирует традиции, обучение и духовное руководство. День для получения знаний, следования традициям и поиска мудрых советов.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_5'
    },
    {
      title: 'Arcana 5: The Hierophant',
      content: 'The Hierophant symbolizes traditions, learning, and spiritual guidance. A day for gaining knowledge, following traditions, and seeking wise counsel.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_5'
    },
    // Arcana 6 - The Lovers
    {
      title: 'Аркан 6: Влюбленные',
      content: 'Влюбленные олицетворяют выбор, гармонию и союз. День для важных решений в отношениях, поиска баланса и укрепления связей с близкими.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_6'
    },
    {
      title: 'Arcana 6: The Lovers',
      content: 'The Lovers embody choice, harmony, and union. A day for important relationship decisions, finding balance, and strengthening bonds with loved ones.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_6'
    },
    // Arcana 7 - The Chariot
    {
      title: 'Аркан 7: Колесница',
      content: 'Колесница символизирует победу, движение вперед и контроль. День для достижения целей, преодоления препятствий и уверенного движения к успеху.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_7'
    },
    {
      title: 'Arcana 7: The Chariot',
      content: 'The Chariot symbolizes victory, moving forward, and control. A day for achieving goals, overcoming obstacles, and confidently moving toward success.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_7'
    },
    // Arcana 8 - Strength
    {
      title: 'Аркан 8: Сила',
      content: 'Сила олицетворяет внутреннюю силу, мужество и терпение. День для проявления стойкости, преодоления страхов и укрощения внутренних демонов.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_8'
    },
    {
      title: 'Arcana 8: Strength',
      content: 'Strength embodies inner power, courage, and patience. A day for showing resilience, overcoming fears, and taming inner demons.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_8'
    },
    // Arcana 9 - The Hermit
    {
      title: 'Аркан 9: Отшельник',
      content: 'Отшельник символизирует уединение, самопознание и внутренний поиск. День для размышлений, медитации и поиска ответов внутри себя.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_9'
    },
    {
      title: 'Arcana 9: The Hermit',
      content: 'The Hermit symbolizes solitude, self-knowledge, and inner search. A day for reflection, meditation, and finding answers within yourself.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_9'
    },
    // Arcana 10 - Wheel of Fortune
    {
      title: 'Аркан 10: Колесо Фортуны',
      content: 'Колесо Фортуны олицетворяет перемены, судьбу и циклы жизни. День для принятия изменений, доверия судьбе и понимания, что все циклично.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_10'
    },
    {
      title: 'Arcana 10: Wheel of Fortune',
      content: 'Wheel of Fortune embodies change, destiny, and life cycles. A day for accepting changes, trusting fate, and understanding that everything is cyclical.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_10'
    },
    // Arcana 11 - Justice
    {
      title: 'Аркан 11: Справедливость',
      content: 'Справедливость символизирует баланс, истину и кармическое воздаяние. День для честных поступков, принятия справедливых решений и восстановления равновесия.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_11'
    },
    {
      title: 'Arcana 11: Justice',
      content: 'Justice symbolizes balance, truth, and karmic retribution. A day for honest actions, making fair decisions, and restoring equilibrium.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_11'
    },
    // Arcana 12 - The Hanged Man
    {
      title: 'Аркан 12: Повешенный',
      content: 'Повешенный олицетворяет жертву, новый взгляд и освобождение. День для смены перспективы, отпускания старого и принятия необходимых жертв.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_12'
    },
    {
      title: 'Arcana 12: The Hanged Man',
      content: 'The Hanged Man embodies sacrifice, new perspective, and liberation. A day for changing perspective, letting go of the old, and accepting necessary sacrifices.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_12'
    },
    // Arcana 13 - Death
    {
      title: 'Аркан 13: Смерть',
      content: 'Смерть символизирует трансформацию, окончание и новое начало. День для завершения старых циклов, освобождения от прошлого и подготовки к переменам.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_13'
    },
    {
      title: 'Arcana 13: Death',
      content: 'Death symbolizes transformation, ending, and new beginning. A day for completing old cycles, releasing the past, and preparing for changes.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_13'
    },
    // Arcana 14 - Temperance
    {
      title: 'Аркан 14: Умеренность',
      content: 'Умеренность олицетворяет гармонию, баланс и терпение. День для поиска золотой середины, объединения противоположностей и спокойного движения вперед.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_14'
    },
    {
      title: 'Arcana 14: Temperance',
      content: 'Temperance embodies harmony, balance, and patience. A day for finding the golden mean, uniting opposites, and moving forward calmly.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_14'
    },
    // Arcana 15 - The Devil
    {
      title: 'Аркан 15: Дьявол',
      content: 'Дьявол символизирует искушение, зависимость и материальные привязанности. День для осознания своих слабостей, освобождения от оков и преодоления соблазнов.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_15'
    },
    {
      title: 'Arcana 15: The Devil',
      content: 'The Devil symbolizes temptation, addiction, and material attachments. A day for recognizing your weaknesses, breaking free from chains, and overcoming temptations.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_15'
    },
    // Arcana 16 - The Tower
    {
      title: 'Аркан 16: Башня',
      content: 'Башня олицетворяет разрушение, внезапные перемены и освобождение. День для принятия неожиданных изменений, разрушения иллюзий и построения нового на руинах старого.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_16'
    },
    {
      title: 'Arcana 16: The Tower',
      content: 'The Tower embodies destruction, sudden changes, and liberation. A day for accepting unexpected changes, shattering illusions, and building anew on the ruins of the old.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_16'
    },
    // Arcana 17 - The Star
    {
      title: 'Аркан 17: Звезда',
      content: 'Звезда символизирует надежду, вдохновение и духовное озарение. День для мечтаний, веры в лучшее и следования своей путеводной звезде.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_17'
    },
    {
      title: 'Arcana 17: The Star',
      content: 'The Star symbolizes hope, inspiration, and spiritual enlightenment. A day for dreaming, believing in the best, and following your guiding star.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_17'
    },
    // Arcana 18 - The Moon
    {
      title: 'Аркан 18: Луна',
      content: 'Луна олицетворяет иллюзии, подсознание и интуицию. День для работы со снами, доверия интуиции и исследования глубин своего подсознания.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_18'
    },
    {
      title: 'Arcana 18: The Moon',
      content: 'The Moon embodies illusions, subconscious, and intuition. A day for working with dreams, trusting intuition, and exploring the depths of your subconscious.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_18'
    },
    // Arcana 19 - The Sun
    {
      title: 'Аркан 19: Солнце',
      content: 'Солнце символизирует радость, успех и жизненную энергию. День для празднования достижений, наслаждения жизнью и излучения позитивной энергии.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_19'
    },
    {
      title: 'Arcana 19: The Sun',
      content: 'The Sun symbolizes joy, success, and life energy. A day for celebrating achievements, enjoying life, and radiating positive energy.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_19'
    },
    // Arcana 20 - Judgement
    {
      title: 'Аркан 20: Суд',
      content: 'Суд олицетворяет пробуждение, возрождение и призвание. День для переоценки жизни, принятия важных решений и ответа на свое истинное призвание.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_20'
    },
    {
      title: 'Arcana 20: Judgement',
      content: 'Judgement embodies awakening, rebirth, and calling. A day for reassessing life, making important decisions, and answering your true calling.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_20'
    },
    // Arcana 21 - The World
    {
      title: 'Аркан 21: Мир',
      content: 'Мир символизирует завершение, целостность и достижение. День для празднования успехов, осознания своей целостности и подготовки к новому циклу.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_21'
    },
    {
      title: 'Arcana 21: The World',
      content: 'The World symbolizes completion, wholeness, and achievement. A day for celebrating successes, realizing your wholeness, and preparing for a new cycle.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_21'
    },
    // Arcana 22 - The Fool
    {
      title: 'Аркан 22: Шут',
      content: 'Шут олицетворяет новое начало, спонтанность и безграничные возможности. День для смелых шагов, доверия вселенной и открытости новому опыту.',
      category: 'arcana',
      language: 'ru',
      relatedValue: 'arcana_22'
    },
    {
      title: 'Arcana 22: The Fool',
      content: 'The Fool embodies new beginning, spontaneity, and limitless possibilities. A day for bold steps, trusting the universe, and being open to new experiences.',
      category: 'arcana',
      language: 'en',
      relatedValue: 'arcana_22'
    },
  ];

  await prisma.article.createMany({ data: arcanaDescriptions });

  console.log(`✓ Created ${arcanaDescriptions.length} arcana description articles`);
}
