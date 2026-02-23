/**
 * Скрипт для создания таблицы ContentPage и начальных данных
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Проверка существования таблицы ContentPage...');

  try {
    // Проверяем, существует ли таблица
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'ContentPage'
      );
    `;

    if (tableExists[0].exists) {
      console.log('✅ Таблица ContentPage уже существует');
      
      // Проверяем количество записей
      const count = await prisma.contentPage.count();
      console.log(`📊 Найдено записей: ${count}`);
      
      if (count === 0) {
        console.log('Добавляем начальные данные...');
        await insertInitialData();
      }
    } else {
      console.log('Создаём таблицу ContentPage...');
      
      // Создаём таблицу
      await prisma.$executeRawUnsafe(`
        CREATE TABLE "ContentPage" (
          "id" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "titleRu" TEXT NOT NULL,
          "titleEn" TEXT NOT NULL,
          "contentRu" TEXT NOT NULL,
          "contentEn" TEXT NOT NULL,
          "isPublished" BOOLEAN NOT NULL DEFAULT true,
          "sortOrder" INTEGER NOT NULL DEFAULT 0,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "ContentPage_pkey" PRIMARY KEY ("id")
        );
      `);

      // Создаём индексы
      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX "ContentPage_slug_key" ON "ContentPage"("slug");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "ContentPage_slug_idx" ON "ContentPage"("slug");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "ContentPage_isPublished_idx" ON "ContentPage"("isPublished");
      `);
      await prisma.$executeRawUnsafe(`
        CREATE INDEX "ContentPage_sortOrder_idx" ON "ContentPage"("sortOrder");
      `);

      console.log('✅ Таблица создана');
      
      // Добавляем начальные данные
      await insertInitialData();
    }

    console.log('✅ Готово!');
  } catch (error) {
    console.error('❌ Ошибка:', error);
    throw error;
  }
}

async function insertInitialData() {
  const pages = [
    {
      id: 'about',
      slug: 'about',
      titleRu: 'О проекте',
      titleEn: 'About Us',
      contentRu: `<h2>О проекте FATOS.pro</h2>
<p>FATOS.pro — это современная платформа для нумерологических расчётов и самопознания.</p>
<h3>Наша миссия</h3>
<p>Мы помогаем людям лучше понять себя через древнюю науку нумерологии, используя современные технологии.</p>
<h3>Что мы предлагаем</h3>
<ul>
<li>Точные нумерологические расчёты</li>
<li>Персональные рекомендации</li>
<li>Удобный интерфейс</li>
<li>Поддержка на русском и английском языках</li>
</ul>`,
      contentEn: `<h2>About FATOS.pro</h2>
<p>FATOS.pro is a modern platform for numerological calculations and self-discovery.</p>
<h3>Our Mission</h3>
<p>We help people better understand themselves through the ancient science of numerology using modern technology.</p>
<h3>What We Offer</h3>
<ul>
<li>Accurate numerological calculations</li>
<li>Personalized recommendations</li>
<li>User-friendly interface</li>
<li>Support in Russian and English</li>
</ul>`,
      sortOrder: 1,
    },
    {
      id: 'privacy',
      slug: 'privacy',
      titleRu: 'Политика конфиденциальности',
      titleEn: 'Privacy Policy',
      contentRu: `<h2>Политика конфиденциальности</h2>
<p><em>Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}</em></p>
<h3>1. Сбор информации</h3>
<p>Мы собираем следующую информацию:</p>
<ul>
<li>Email адрес и имя при регистрации</li>
<li>Дата рождения для нумерологических расчётов</li>
<li>Информация об использовании сервиса</li>
</ul>
<h3>2. Использование информации</h3>
<p>Ваши данные используются для:</p>
<ul>
<li>Предоставления нумерологических расчётов</li>
<li>Улучшения качества сервиса</li>
<li>Отправки важных уведомлений</li>
</ul>
<h3>3. Защита данных</h3>
<p>Мы используем современные методы шифрования и защиты данных. Ваши персональные данные не передаются третьим лицам без вашего согласия.</p>
<h3>4. Cookies</h3>
<p>Мы используем cookies для улучшения работы сайта и аналитики.</p>
<h3>5. Ваши права</h3>
<p>Вы имеете право:</p>
<ul>
<li>Запросить копию ваших данных</li>
<li>Удалить свой аккаунт</li>
<li>Отозвать согласие на обработку данных</li>
</ul>
<h3>6. Контакты</h3>
<p>По вопросам конфиденциальности: support@fatos.pro</p>`,
      contentEn: `<h2>Privacy Policy</h2>
<p><em>Last updated: ${new Date().toLocaleDateString('en-US')}</em></p>
<h3>1. Information Collection</h3>
<p>We collect the following information:</p>
<ul>
<li>Email address and name during registration</li>
<li>Date of birth for numerological calculations</li>
<li>Service usage information</li>
</ul>
<h3>2. Use of Information</h3>
<p>Your data is used for:</p>
<ul>
<li>Providing numerological calculations</li>
<li>Improving service quality</li>
<li>Sending important notifications</li>
</ul>
<h3>3. Data Protection</h3>
<p>We use modern encryption and data protection methods. Your personal data is not shared with third parties without your consent.</p>
<h3>4. Cookies</h3>
<p>We use cookies to improve website functionality and analytics.</p>
<h3>5. Your Rights</h3>
<p>You have the right to:</p>
<ul>
<li>Request a copy of your data</li>
<li>Delete your account</li>
<li>Withdraw consent for data processing</li>
</ul>
<h3>6. Contact</h3>
<p>For privacy questions: support@fatos.pro</p>`,
      sortOrder: 2,
    },
    {
      id: 'terms',
      slug: 'terms',
      titleRu: 'Пользовательское соглашение',
      titleEn: 'Terms of Service',
      contentRu: `<h2>Пользовательское соглашение</h2>
<p><em>Последнее обновление: ${new Date().toLocaleDateString('ru-RU')}</em></p>
<h3>1. Принятие условий</h3>
<p>Используя сервис FATOS.pro, вы соглашаетесь с условиями данного соглашения.</p>
<h3>2. Описание сервиса</h3>
<p>FATOS.pro предоставляет нумерологические расчёты и рекомендации. Результаты носят информационный характер.</p>
<h3>3. Регистрация</h3>
<p>Для использования некоторых функций требуется регистрация. Вы обязуетесь:</p>
<ul>
<li>Предоставлять достоверную информацию</li>
<li>Не передавать доступ к аккаунту третьим лицам</li>
<li>Соблюдать правила использования сервиса</li>
</ul>
<h3>4. Платные услуги</h3>
<p>Некоторые функции доступны за плату. Оплата производится через защищённые платёжные системы.</p>
<h3>5. Ограничение ответственности</h3>
<p>Нумерологические расчёты предоставляются "как есть". Мы не несём ответственности за решения, принятые на основе результатов.</p>
<h3>6. Изменения условий</h3>
<p>Мы оставляем за собой право изменять условия соглашения. Об изменениях будет сообщено заранее.</p>
<h3>7. Контакты</h3>
<p>По вопросам соглашения: support@fatos.pro</p>`,
      contentEn: `<h2>Terms of Service</h2>
<p><em>Last updated: ${new Date().toLocaleDateString('en-US')}</em></p>
<h3>1. Acceptance of Terms</h3>
<p>By using FATOS.pro service, you agree to these terms.</p>
<h3>2. Service Description</h3>
<p>FATOS.pro provides numerological calculations and recommendations. Results are for informational purposes.</p>
<h3>3. Registration</h3>
<p>Some features require registration. You agree to:</p>
<ul>
<li>Provide accurate information</li>
<li>Not share account access with third parties</li>
<li>Follow service usage rules</li>
</ul>
<h3>4. Paid Services</h3>
<p>Some features are available for a fee. Payment is processed through secure payment systems.</p>
<h3>5. Limitation of Liability</h3>
<p>Numerological calculations are provided "as is". We are not responsible for decisions made based on results.</p>
<h3>6. Changes to Terms</h3>
<p>We reserve the right to modify these terms. Changes will be announced in advance.</p>
<h3>7. Contact</h3>
<p>For terms questions: support@fatos.pro</p>`,
      sortOrder: 3,
    },
    {
      id: 'faq',
      slug: 'faq',
      titleRu: 'Часто задаваемые вопросы',
      titleEn: 'FAQ',
      contentRu: `<h2>Часто задаваемые вопросы</h2>
<h3>Что такое нумерология?</h3>
<p>Нумерология — это древняя наука о влиянии чисел на жизнь человека. Она помогает лучше понять свои сильные стороны, таланты и жизненный путь.</p>
<h3>Как работают расчёты?</h3>
<p>Мы используем проверенные методики нумерологии, основанные на дате рождения. Алгоритмы рассчитывают ваши числа судьбы, матрицу и другие важные показатели.</p>
<h3>Нужна ли регистрация?</h3>
<p>Базовые расчёты доступны без регистрации. Для сохранения результатов и доступа к расширенным функциям рекомендуем зарегистрироваться.</p>
<h3>Безопасны ли мои данные?</h3>
<p>Да, мы используем современное шифрование и не передаём ваши данные третьим лицам.</p>
<h3>Как оплатить премиум-услуги?</h3>
<p>Мы принимаем оплату через ЮKassa и Stripe. Все платежи защищены.</p>
<h3>Можно ли вернуть деньги?</h3>
<p>Возврат возможен в течение 14 дней при наличии технических проблем. Свяжитесь с поддержкой.</p>
<h3>Как связаться с поддержкой?</h3>
<p>Напишите нам на support@fatos.pro</p>`,
      contentEn: `<h2>Frequently Asked Questions</h2>
<h3>What is numerology?</h3>
<p>Numerology is an ancient science about the influence of numbers on human life. It helps better understand your strengths, talents, and life path.</p>
<h3>How do calculations work?</h3>
<p>We use proven numerology methods based on birth date. Algorithms calculate your destiny numbers, matrix, and other important indicators.</p>
<h3>Is registration required?</h3>
<p>Basic calculations are available without registration. We recommend registering to save results and access advanced features.</p>
<h3>Is my data safe?</h3>
<p>Yes, we use modern encryption and do not share your data with third parties.</p>
<h3>How to pay for premium services?</h3>
<p>We accept payment through YooKassa and Stripe. All payments are secure.</p>
<h3>Can I get a refund?</h3>
<p>Refunds are possible within 14 days in case of technical issues. Contact support.</p>
<h3>How to contact support?</h3>
<p>Email us at support@fatos.pro</p>`,
      sortOrder: 4,
    },
  ];

  for (const page of pages) {
    await prisma.contentPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
    console.log(`✅ Добавлена страница: ${page.slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
