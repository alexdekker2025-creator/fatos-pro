/**
 * Скрипт для добавления страницы "Политика конфиденциальности"
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Добавление страницы "Политика конфиденциальности"...');

  // Проверяем, существует ли уже страница
  const existing = await prisma.contentPage.findUnique({
    where: { slug: 'privacy' },
  });

  if (existing) {
    console.log('Страница "privacy" уже существует. Обновляем...');
    await prisma.contentPage.update({
      where: { slug: 'privacy' },
      data: {
        titleRu: 'Политика конфиденциальности',
        titleEn: 'Privacy Policy',
        contentRu: `
<h2>Политика конфиденциальности FATOS.pro</h2>

<p><strong>Дата вступления в силу:</strong> 23 февраля 2026 года</p>

<h3>1. Введение</h3>
<p>Добро пожаловать на FATOS.pro. Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию.</p>

<h3>2. Информация, которую мы собираем</h3>
<p>Мы можем собирать следующие типы информации:</p>
<ul>
  <li><strong>Личная информация:</strong> имя, адрес электронной почты, дата рождения (для нумерологических расчетов)</li>
  <li><strong>Данные об использовании:</strong> информация о том, как вы используете наш сайт</li>
  <li><strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система</li>
  <li><strong>Cookies:</strong> небольшие файлы данных, хранящиеся на вашем устройстве</li>
</ul>

<h3>3. Как мы используем вашу информацию</h3>
<p>Мы используем собранную информацию для:</p>
<ul>
  <li>Предоставления нумерологических расчетов и услуг</li>
  <li>Улучшения функциональности сайта</li>
  <li>Отправки уведомлений и обновлений (с вашего согласия)</li>
  <li>Обеспечения безопасности и предотвращения мошенничества</li>
  <li>Соблюдения юридических обязательств</li>
</ul>

<h3>4. Защита данных</h3>
<p>Мы применяем современные меры безопасности для защиты ваших данных:</p>
<ul>
  <li>Шифрование данных при передаче (SSL/TLS)</li>
  <li>Безопасное хранение паролей (хеширование)</li>
  <li>Регулярные проверки безопасности</li>
  <li>Ограниченный доступ к персональным данным</li>
</ul>

<h3>5. Передача данных третьим лицам</h3>
<p>Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением:</p>
<ul>
  <li>Платежных систем (для обработки платежей)</li>
  <li>Сервисов аналитики (в анонимизированной форме)</li>
  <li>Случаев, требуемых законом</li>
</ul>

<h3>6. Ваши права</h3>
<p>Вы имеете право:</p>
<ul>
  <li>Получить доступ к своим персональным данным</li>
  <li>Исправить неточные данные</li>
  <li>Удалить свои данные (право на забвение)</li>
  <li>Ограничить обработку данных</li>
  <li>Возразить против обработки данных</li>
  <li>Получить копию своих данных</li>
</ul>

<h3>7. Cookies</h3>
<p>Мы используем cookies для улучшения вашего опыта. Вы можете управлять настройками cookies в своем браузере.</p>

<h3>8. Изменения в политике</h3>
<p>Мы можем обновлять эту политику конфиденциальности. Изменения вступают в силу после публикации на сайте.</p>

<h3>9. Контакты</h3>
<p>Если у вас есть вопросы о нашей политике конфиденциальности, свяжитесь с нами:</p>
<ul>
  <li>Email: <a href="mailto:privacy@fatos.pro">privacy@fatos.pro</a></li>
  <li>Сайт: <a href="https://fatos.pro">https://fatos.pro</a></li>
</ul>
        `,
        contentEn: `
<h2>FATOS.pro Privacy Policy</h2>

<p><strong>Effective Date:</strong> February 23, 2026</p>

<h3>1. Introduction</h3>
<p>Welcome to FATOS.pro. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.</p>

<h3>2. Information We Collect</h3>
<p>We may collect the following types of information:</p>
<ul>
  <li><strong>Personal Information:</strong> name, email address, date of birth (for numerological calculations)</li>
  <li><strong>Usage Data:</strong> information about how you use our website</li>
  <li><strong>Technical Data:</strong> IP address, browser type, operating system</li>
  <li><strong>Cookies:</strong> small data files stored on your device</li>
</ul>

<h3>3. How We Use Your Information</h3>
<p>We use the collected information to:</p>
<ul>
  <li>Provide numerological calculations and services</li>
  <li>Improve website functionality</li>
  <li>Send notifications and updates (with your consent)</li>
  <li>Ensure security and prevent fraud</li>
  <li>Comply with legal obligations</li>
</ul>

<h3>4. Data Protection</h3>
<p>We implement modern security measures to protect your data:</p>
<ul>
  <li>Data encryption during transmission (SSL/TLS)</li>
  <li>Secure password storage (hashing)</li>
  <li>Regular security audits</li>
  <li>Limited access to personal data</li>
</ul>

<h3>5. Third-Party Data Sharing</h3>
<p>We do not sell or share your personal data with third parties, except:</p>
<ul>
  <li>Payment systems (for payment processing)</li>
  <li>Analytics services (in anonymized form)</li>
  <li>Cases required by law</li>
</ul>

<h3>6. Your Rights</h3>
<p>You have the right to:</p>
<ul>
  <li>Access your personal data</li>
  <li>Correct inaccurate data</li>
  <li>Delete your data (right to be forgotten)</li>
  <li>Restrict data processing</li>
  <li>Object to data processing</li>
  <li>Receive a copy of your data</li>
</ul>

<h3>7. Cookies</h3>
<p>We use cookies to improve your experience. You can manage cookie settings in your browser.</p>

<h3>8. Policy Changes</h3>
<p>We may update this privacy policy. Changes take effect after publication on the website.</p>

<h3>9. Contact Us</h3>
<p>If you have questions about our privacy policy, contact us:</p>
<ul>
  <li>Email: <a href="mailto:privacy@fatos.pro">privacy@fatos.pro</a></li>
  <li>Website: <a href="https://fatos.pro">https://fatos.pro</a></li>
</ul>
        `,
        isPublished: true,
        sortOrder: 2,
      },
    });
    console.log('✅ Страница "privacy" обновлена');
  } else {
    await prisma.contentPage.create({
      data: {
        slug: 'privacy',
        titleRu: 'Политика конфиденциальности',
        titleEn: 'Privacy Policy',
        contentRu: `
<h2>Политика конфиденциальности FATOS.pro</h2>

<p><strong>Дата вступления в силу:</strong> 23 февраля 2026 года</p>

<h3>1. Введение</h3>
<p>Добро пожаловать на FATOS.pro. Мы уважаем вашу конфиденциальность и стремимся защитить ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию.</p>

<h3>2. Информация, которую мы собираем</h3>
<p>Мы можем собирать следующие типы информации:</p>
<ul>
  <li><strong>Личная информация:</strong> имя, адрес электронной почты, дата рождения (для нумерологических расчетов)</li>
  <li><strong>Данные об использовании:</strong> информация о том, как вы используете наш сайт</li>
  <li><strong>Технические данные:</strong> IP-адрес, тип браузера, операционная система</li>
  <li><strong>Cookies:</strong> небольшие файлы данных, хранящиеся на вашем устройстве</li>
</ul>

<h3>3. Как мы используем вашу информацию</h3>
<p>Мы используем собранную информацию для:</p>
<ul>
  <li>Предоставления нумерологических расчетов и услуг</li>
  <li>Улучшения функциональности сайта</li>
  <li>Отправки уведомлений и обновлений (с вашего согласия)</li>
  <li>Обеспечения безопасности и предотвращения мошенничества</li>
  <li>Соблюдения юридических обязательств</li>
</ul>

<h3>4. Защита данных</h3>
<p>Мы применяем современные меры безопасности для защиты ваших данных:</p>
<ul>
  <li>Шифрование данных при передаче (SSL/TLS)</li>
  <li>Безопасное хранение паролей (хеширование)</li>
  <li>Регулярные проверки безопасности</li>
  <li>Ограниченный доступ к персональным данным</li>
</ul>

<h3>5. Передача данных третьим лицам</h3>
<p>Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением:</p>
<ul>
  <li>Платежных систем (для обработки платежей)</li>
  <li>Сервисов аналитики (в анонимизированной форме)</li>
  <li>Случаев, требуемых законом</li>
</ul>

<h3>6. Ваши права</h3>
<p>Вы имеете право:</p>
<ul>
  <li>Получить доступ к своим персональным данным</li>
  <li>Исправить неточные данные</li>
  <li>Удалить свои данные (право на забвение)</li>
  <li>Ограничить обработку данных</li>
  <li>Возразить против обработки данных</li>
  <li>Получить копию своих данных</li>
</ul>

<h3>7. Cookies</h3>
<p>Мы используем cookies для улучшения вашего опыта. Вы можете управлять настройками cookies в своем браузере.</p>

<h3>8. Изменения в политике</h3>
<p>Мы можем обновлять эту политику конфиденциальности. Изменения вступают в силу после публикации на сайте.</p>

<h3>9. Контакты</h3>
<p>Если у вас есть вопросы о нашей политике конфиденциальности, свяжитесь с нами:</p>
<ul>
  <li>Email: <a href="mailto:privacy@fatos.pro">privacy@fatos.pro</a></li>
  <li>Сайт: <a href="https://fatos.pro">https://fatos.pro</a></li>
</ul>
        `,
        contentEn: `
<h2>FATOS.pro Privacy Policy</h2>

<p><strong>Effective Date:</strong> February 23, 2026</p>

<h3>1. Introduction</h3>
<p>Welcome to FATOS.pro. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.</p>

<h3>2. Information We Collect</h3>
<p>We may collect the following types of information:</p>
<ul>
  <li><strong>Personal Information:</strong> name, email address, date of birth (for numerological calculations)</li>
  <li><strong>Usage Data:</strong> information about how you use our website</li>
  <li><strong>Technical Data:</strong> IP address, browser type, operating system</li>
  <li><strong>Cookies:</strong> small data files stored on your device</li>
</ul>

<h3>3. How We Use Your Information</h3>
<p>We use the collected information to:</p>
<ul>
  <li>Provide numerological calculations and services</li>
  <li>Improve website functionality</li>
  <li>Send notifications and updates (with your consent)</li>
  <li>Ensure security and prevent fraud</li>
  <li>Comply with legal obligations</li>
</ul>

<h3>4. Data Protection</h3>
<p>We implement modern security measures to protect your data:</p>
<ul>
  <li>Data encryption during transmission (SSL/TLS)</li>
  <li>Secure password storage (hashing)</li>
  <li>Regular security audits</li>
  <li>Limited access to personal data</li>
</ul>

<h3>5. Third-Party Data Sharing</h3>
<p>We do not sell or share your personal data with third parties, except:</p>
<ul>
  <li>Payment systems (for payment processing)</li>
  <li>Analytics services (in anonymized form)</li>
  <li>Cases required by law</li>
</ul>

<h3>6. Your Rights</h3>
<p>You have the right to:</p>
<ul>
  <li>Access your personal data</li>
  <li>Correct inaccurate data</li>
  <li>Delete your data (right to be forgotten)</li>
  <li>Restrict data processing</li>
  <li>Object to data processing</li>
  <li>Receive a copy of your data</li>
</ul>

<h3>7. Cookies</h3>
<p>We use cookies to improve your experience. You can manage cookie settings in your browser.</p>

<h3>8. Policy Changes</h3>
<p>We may update this privacy policy. Changes take effect after publication on the website.</p>

<h3>9. Contact Us</h3>
<p>If you have questions about our privacy policy, contact us:</p>
<ul>
  <li>Email: <a href="mailto:privacy@fatos.pro">privacy@fatos.pro</a></li>
  <li>Website: <a href="https://fatos.pro">https://fatos.pro</a></li>
</ul>
        `,
        isPublished: true,
        sortOrder: 2,
      },
    });
    console.log('✅ Страница "privacy" создана');
  }
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
