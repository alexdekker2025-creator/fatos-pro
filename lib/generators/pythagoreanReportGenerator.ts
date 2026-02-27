import { interpretations, cellNames } from '../interpretations/pythagoreanBasicInterpretations';

export interface ReportData {
  userName: string;
  birthDate: { day: number; month: number; year: number };
  square: number[]; // [count1, count2, ..., count9]
}

// Генерация введения
export function generateIntroduction(userName: string): string {
  return `Есть вещи, которые мы чувствуем, но не можем объяснить. Почему в одних ситуациях ты жёсткая и несгибаемая, а в других — устаёшь от одного взгляда? Почему с одними людьми легко, а другие выматывают за пять минут?

Квадрат Пифагора не даёт ответов «как надо жить». Он просто показывает, как устроена именно ты. Без оценок, без советов, без «исправь это». Просто честная карта твоей личности.

Вот она.`;
}

// Генерация описания ячейки
export function generateCellInterpretation(digit: number, count: number): { title: string; content: string } {
  const maxCount = Math.min(count, 6);
  const interpretation = interpretations[digit]?.[maxCount];
  
  if (!interpretation) {
    return {
      title: cellNames[digit] || `Цифра ${digit}`,
      content: `Количество цифр ${digit}: ${count}`,
    };
  }
  
  return interpretation;
}

// Генерация общей картины (ЖИВОЙ ТЕКСТ)
export function generateOverallPicture(square: number[]): string {
  const strongest = findStrongest(square);
  const weakest = findWeakest(square);
  const emptyCount = square.filter(c => c === 0).length;
  
  let text = '';
  
  // Начало - про сильные стороны
  if (strongest.count >= 4) {
    const strongName = cellNames[strongest.digits[0]].toLowerCase();
    text += `У тебя редкое сочетание: сильнейшая ${strongName}. `;
    text += `Ты способна добиваться того, что другим кажется невозможным. `;
  } else if (strongest.count === 3) {
    const strongNames = strongest.digits.slice(0, 2).map(d => cellNames[d].toLowerCase()).join(' и ');
    text += `У тебя хорошо развиты ${strongNames}. `;
    text += `Это твои главные ресурсы, на которые ты можешь опираться. `;
  } else {
    text += `У тебя сбалансированный квадрат — нет явных перекосов. `;
  }
  
  // Про слабые стороны
  if (weakest.count === 0 && emptyCount > 0) {
    text += `При этом `;
    if (emptyCount === 1) {
      const weakName = cellNames[weakest.digits[0]].toLowerCase();
      text += `${weakName} — пустая ячейка. `;
    } else if (emptyCount === 2) {
      const weakNames = weakest.digits.map(d => cellNames[d].toLowerCase()).join(' и ');
      text += `${weakNames} — пустые ячейки. `;
    } else {
      text += `у тебя несколько пустых ячеек. `;
    }
    text += `Это не недостатки, а зоны, где ты свободна от определённых ожиданий. `;
  } else if (weakest.count === 1) {
    const weakNames = weakest.digits.slice(0, 2).map(d => cellNames[d].toLowerCase()).join(', ');
    text += `${weakNames} требуют внимания, но это не критично. `;
  }
  
  // Связь между сильным и слабым
  if (strongest.count >= 4 && weakest.count <= 1) {
    text += `Ты можешь долго и упорно идти к цели, но важно помнить о балансе и не забывать про отдых. `;
  }
  
  // Заключение про пустые ячейки
  if (emptyCount > 0) {
    text += `\n\nПустые ячейки — это не «пробелы», которые надо срочно заполнить. Это зоны, где ты можешь выбирать свой путь, не ограниченная врождёнными склонностями.`;
  }
  
  return text.trim();
}


// Генерация итога (сильные/слабые стороны) - ЖИВОЙ ТЕКСТ
export function generateSummary(square: number[]): {
  strongest: string;
  weakest: string;
  mainSupport: string;
  growthZone: string;
} {
  const strongest = findStrongest(square);
  const weakest = findWeakest(square);
  
  // Формируем текст про самую сильную цифру
  let strongestText = '';
  if (strongest.count >= 5) {
    strongestText = `${strongest.digits[0]} — ${cellNames[strongest.digits[0]].toLowerCase()}`;
  } else if (strongest.count >= 3) {
    const names = strongest.digits.slice(0, 2).map(d => `${d} (${cellNames[d].toLowerCase()})`).join(', ');
    strongestText = names;
  } else {
    strongestText = 'Сбалансированный квадрат';
  }
  
  // Формируем текст про самую слабую цифру
  let weakestText = '';
  if (weakest.count === 0) {
    const names = weakest.digits.slice(0, 2).map(d => `${d} (${cellNames[d].toLowerCase()})`).join(', ');
    weakestText = names;
  } else if (weakest.count === 1) {
    const names = weakest.digits.slice(0, 2).map(d => `${d} (${cellNames[d].toLowerCase()})`).join(', ');
    weakestText = names;
  } else {
    weakestText = 'Нет явных слабых сторон';
  }
  
  // Генерируем живой текст про главную опору
  let mainSupport = '';
  if (strongest.count >= 5) {
    const strongName = cellNames[strongest.digits[0]].toLowerCase();
    mainSupport = `Ты можешь всё, что задумаешь, если будешь опираться на свою ${strongName}. Это твоя суперсила — используй её.`;
  } else if (strongest.count >= 3) {
    mainSupport = `Ты можешь всё, что задумаешь, если будешь действовать, а не ждать. Твои сильные стороны — это твой фундамент.`;
  } else {
    mainSupport = `У тебя сбалансированный квадрат. Ты можешь развиваться в любом направлении, которое выберешь.`;
  }
  
  // Генерируем живой текст про зону роста
  let growthZone = '';
  if (weakest.count === 0 && weakest.digits.length > 0) {
    const weakName = cellNames[weakest.digits[0]].toLowerCase();
    if (weakest.digits.includes(2)) {
      growthZone = `Твоя зона роста — не требовать от себя бесконечной активности и позволять себе отдыхать без чувства вины.`;
    } else if (weakest.digits.includes(6) || weakest.digits.includes(7)) {
      growthZone = `Твоя зона роста — принять, что ${weakName} не твоя сильная сторона, и это нормально. Не все должны быть одинаковыми.`;
    } else {
      growthZone = `Твоя зона роста — не пытаться заполнить пустые ячейки насильно. Они дают тебе свободу выбора.`;
    }
  } else if (weakest.count === 1) {
    growthZone = `Твоя зона роста — развивать слабые стороны постепенно, без давления на себя. Ты уже хороша такая, какая есть.`;
  } else {
    growthZone = `Твоя зона роста — не останавливаться на достигнутом и продолжать развиваться во всех направлениях.`;
  }
  
  return {
    strongest: strongestText,
    weakest: weakestText,
    mainSupport,
    growthZone,
  };
}

// Генерация блока "Как использовать этот отчёт"
export function generateHowToUse(): string[] {
  return [
    'Можешь просто понаблюдать за собой неделю и заметить, где твои сильные стороны проявляются, а где слабые напоминают о себе.',
    'Можешь показать его близким — иногда проще один раз дать прочитать, чем сто раз объяснять, почему тебе нужно побыть одной.',
    'Можешь убрать и забыть. А через месяц достать и перечитать. Часто спустя время мы видим то, что не замечали раньше.',
  ];
}

// Генерация блока "Что дальше"
export function generateNextSteps(): string {
  return `Этот отчёт — база. В нём только то, что лежит на поверхности. Если захочешь понять, как твои цифры связаны между собой, какие линии силы в тебе работают, как именно развивать слабые стороны и куда направлять сильные — для этого есть полный разбор.

Там мы говорим не просто «что у тебя есть», а «что с этим делать».`;
}

// Вспомогательные функции
function findStrongest(square: number[]): { digits: number[]; count: number } {
  const maxCount = Math.max(...square);
  const digits = square
    .map((count, index) => ({ digit: index + 1, count }))
    .filter(item => item.count === maxCount)
    .map(item => item.digit);
  
  return { digits, count: maxCount };
}

function findWeakest(square: number[]): { digits: number[]; count: number } {
  const minCount = Math.min(...square);
  const digits = square
    .map((count, index) => ({ digit: index + 1, count }))
    .filter(item => item.count === minCount)
    .map(item => item.digit);
  
  return { digits, count: minCount };
}
