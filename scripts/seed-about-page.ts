import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const aboutPageRu = `
<div style="display: flex; flex-direction: column; gap: 2rem;">
  <div>
    <h1 style="font-size: 1.875rem; font-weight: bold; color: #ffffff; margin-bottom: 1rem;">FATOS.PRO — твои цифры, твой путь.</h1>
    <p style="color: #ffffff; font-size: 1.125rem; line-height: 1.75;">
      Мы привыкли искать ответы на стороне: у психологов, тренеров, гуру. Но главное уже записано в твоей дате рождения. Мы просто помогаем это прочитать.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🌿</span> О чём этот проект
    </h2>
    <p style="color: #ffffff; line-height: 1.75; margin-bottom: 1rem;">
      FATOS родился из простого наблюдения: людям нужны не просто цифры, а понимание. Что значит эта двойка в квадрате? Почему у меня вечно нет энергии? Куда мне двигаться, если работа бесит, а удача обходит стороной?
    </p>
    <p style="color: #ffffff; line-height: 1.75;">
      Мы не гадаем. Мы считаем. По классическим системам, без воды, без шаманства. Просто показываем то, что уже есть.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>✨</span> Что у нас есть
    </h2>
    <ul style="display: flex; flex-direction: column; gap: 0.75rem; list-style: none; padding: 0;">
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Точные расчёты</strong> — по дате рождения, по имени, по квадрату Пифагора.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Живые расшифровки</strong> — не сухие определения, а тексты, которые хочется сохранить.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Персональные отчёты</strong> — под тебя, а не под абстрактного «среднего человека».</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Удобный интерфейс</strong> — никаких лишних кнопок, всё работает само.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Два языка</strong> — русский и английский, потому что цифры говорят на всех языках.</span>
      </li>
    </ul>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🌍</span> Для кого это
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Для тех, кто устал гадать на кофейной гуще. Для тех, кто хочет понимать себя, а не верить на слово. Для тех, кто готов смотреть правде в глаза — даже если она не всегда удобна.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔮</span> Почему FATOS
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Потому что мы не обещаем чуда. Мы даём инструмент. А уж как им распорядиться — решать тебе.
    </p>
  </div>
</div>
  `;

  const aboutPageEn = `
<div style="display: flex; flex-direction: column; gap: 2rem;">
  <div>
    <h1 style="font-size: 1.875rem; font-weight: bold; color: #ffffff; margin-bottom: 1rem;">FATOS.PRO — your numbers, your path.</h1>
    <p style="color: #ffffff; font-size: 1.125rem; line-height: 1.75;">
      We are used to looking for answers from others: psychologists, coaches, gurus. But the main thing is already written in your date of birth. We just help you read it.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🌿</span> About this project
    </h2>
    <p style="color: #ffffff; line-height: 1.75; margin-bottom: 1rem;">
      FATOS was born from a simple observation: people need not just numbers, but understanding. What does this two in the square mean? Why do I always have no energy? Where should I go if work is annoying and luck passes by?
    </p>
    <p style="color: #ffffff; line-height: 1.75;">
      We don't guess. We calculate. According to classical systems, without water, without shamanism. We just show what already exists.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>✨</span> What we have
    </h2>
    <ul style="display: flex; flex-direction: column; gap: 0.75rem; list-style: none; padding: 0;">
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Accurate calculations</strong> — by date of birth, by name, by Pythagorean square.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Live interpretations</strong> — not dry definitions, but texts that you want to save.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Personal reports</strong> — for you, not for an abstract "average person".</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Convenient interface</strong> — no extra buttons, everything works by itself.</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 0.75rem; color: #ffffff;">
        <span style="color: #60a5fa; font-size: 1.25rem;">🔹</span>
        <span><strong style="color: #ffffff;">Two languages</strong> — Russian and English, because numbers speak all languages.</span>
      </li>
    </ul>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🌍</span> For whom this is
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      For those who are tired of guessing on coffee grounds. For those who want to understand themselves, not take someone's word for it. For those who are ready to look truth in the eye — even if it is not always convenient.
    </p>
  </div>

  <div>
    <h2 style="font-size: 1.5rem; font-weight: 600; color: #d8b4fe; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      <span>🔮</span> Why FATOS
    </h2>
    <p style="color: #ffffff; line-height: 1.75;">
      Because we don't promise miracles. We give a tool. And how to use it is up to you.
    </p>
  </div>
</div>
  `;

  await prisma.contentPage.upsert({
    where: { slug: 'about' },
    update: {
      titleRu: 'О проекте',
      titleEn: 'About',
      contentRu: aboutPageRu,
      contentEn: aboutPageEn,
      isPublished: true,
      sortOrder: 1,
    },
    create: {
      slug: 'about',
      titleRu: 'О проекте',
      titleEn: 'About',
      contentRu: aboutPageRu,
      contentEn: aboutPageEn,
      isPublished: true,
      sortOrder: 1,
    },
  });

  console.log('About page created/updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
