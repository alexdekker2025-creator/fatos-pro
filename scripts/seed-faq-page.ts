import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const faqPageRu = `
<div style="display: flex; flex-direction: column; gap: 2rem;">
  <div>
    <h1 style="font-size: 1.875rem; font-weight: bold; color: #ffffff; margin-bottom: 1rem;">FATOS.PRO — ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ</h1>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔮</span> Что такое нумерология и зачем она мне?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Нумерология — это язык, на котором с вами говорит ваша дата рождения. Без гаданий, без магии. Просто математика, которая объясняет, почему вы — это вы. Почему у вас много энергии или, наоборот, быстро устаёте. Почему вам легко с одними людьми и сложно с другими. Мы не придумываем смыслы — мы их расшифровываем.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>⚙️</span> Как вы считаете?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      По классическим системам: квадрат Пифагора, матрица судьбы (22 аркана), число имени. Никакой самодеятельности. Вы вводите дату рождения — алгоритмы делают расчёт, а мы переводим цифры в человеческий язык. Никаких общих фраз, только то, что относится лично к вам.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔐</span> Надо регистрироваться?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Да, регистрация нужна, чтобы сохранять ваши расчёты и возвращаться к ним в любой момент. Это бесплатно, занимает 10 секунд и сразу даёт доступ к личному кабинету, где хранятся все ваши отчёты.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🛡️</span> Куда уходят мои данные?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Никуда. Мы не продаём их, не передаём третьим лицам и не рассылаем спам. Вся информация защищена современным шифрованием. Ваши цифры — только ваши.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>💳</span> Как оплатить полный разбор?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Через ЮKassa (для России) и Stripe (для всего остального мира). Без скрытых комиссий, без автопродлений, без сюрпризов. Оплатили — получили PDF — живёте дальше.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>↩️</span> А если не зайдёт?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Если отчёт не откроется, в нём техническая ошибка или что-то пошло не так — напишите нам в течение 14 дней, и мы вернём деньги. Никаких «ой, а вы уже открыли». Технические проблемы — наша ответственность.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>📞</span> Как с вами связаться?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      По делу — на <a href="mailto:support@fatos.pro" style="color: #a78bfa; text-decoration: underline;">support@fatos.pro</a>. По душам — в <a href="https://www.instagram.com/fatos_taro_numbers" target="_blank" rel="noopener noreferrer" style="color: #a78bfa; text-decoration: underline;">Instagram</a>. По остальным вопросам — просто пишите, ответим ❤️
    </p>
  </div>
</div>
  `;

  const faqPageEn = `
<div style="display: flex; flex-direction: column; gap: 2rem;">
  <div>
    <h1 style="font-size: 1.875rem; font-weight: bold; color: #ffffff; margin-bottom: 1rem;">FATOS.PRO — FREQUENTLY ASKED QUESTIONS</h1>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔮</span> What is numerology and why do I need it?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Numerology is the language your date of birth speaks to you. No fortune-telling, no magic. Just mathematics that explains why you are who you are. Why you have a lot of energy or, conversely, get tired quickly. Why it's easy with some people and difficult with others. We don't make up meanings — we decipher them.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>⚙️</span> How do you calculate?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Using classical systems: Pythagorean square, destiny matrix (22 arcana), name number. No improvisation. You enter your date of birth — algorithms do the calculation, and we translate numbers into human language. No generic phrases, only what applies personally to you.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔐</span> Do I need to register?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Yes, registration is needed to save your calculations and return to them at any time. It's free, takes 10 seconds, and immediately gives access to your personal account where all your reports are stored.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🛡️</span> Where does my data go?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Nowhere. We don't sell it, don't transfer it to third parties, and don't send spam. All information is protected by modern encryption. Your numbers are only yours.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>💳</span> How to pay for a full analysis?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Through YuKassa (for Russia) and Stripe (for the rest of the world). No hidden fees, no auto-renewals, no surprises. Paid — received PDF — live on.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>↩️</span> What if it doesn't work?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      If the report doesn't open, there's a technical error, or something went wrong — write to us within 14 days, and we'll refund your money. No "oh, you already opened it". Technical problems are our responsibility.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>📞</span> How to contact you?
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      For business — <a href="mailto:support@fatos.pro" style="color: #a78bfa; text-decoration: underline;">support@fatos.pro</a>. For heart-to-heart — <a href="https://www.instagram.com/fatos_taro_numbers" target="_blank" rel="noopener noreferrer" style="color: #a78bfa; text-decoration: underline;">Instagram</a>. For other questions — just write, we'll answer ❤️
    </p>
  </div>
</div>
  `;

  await prisma.contentPage.upsert({
    where: { slug: 'faq' },
    update: {
      titleRu: 'Часто задаваемые вопросы',
      titleEn: 'FAQ',
      contentRu: faqPageRu,
      contentEn: faqPageEn,
      isPublished: true,
      sortOrder: 2,
    },
    create: {
      slug: 'faq',
      titleRu: 'Часто задаваемые вопросы',
      titleEn: 'FAQ',
      contentRu: faqPageRu,
      contentEn: faqPageEn,
      isPublished: true,
      sortOrder: 2,
    },
  });

  console.log('FAQ page created/updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
