// Тест функции определения времени суток
function getCurrentTimeOfDay(hours) {
  // Утро: 6:00-11:59
  if (hours >= 6 && hours < 12) {
    return 'morning';
  }
  // День: 12:00-17:59
  else if (hours >= 12 && hours < 18) {
    return 'day';
  }
  // Вечер: 18:00-23:59
  else if (hours >= 18 && hours < 24) {
    return 'evening';
  }
  // Ночь: 00:00-05:59
  else {
    return 'night';
  }
}

console.log('🕐 Тестирование определения времени суток\n');
console.log('─'.repeat(60));

// Тестируем все часы суток
const timeRanges = [
  { range: '00:00-05:59', expected: 'night', emoji: '🌙', label: 'Ночь' },
  { range: '06:00-11:59', expected: 'morning', emoji: '🌅', label: 'Утро' },
  { range: '12:00-17:59', expected: 'day', emoji: '☀️', label: 'День' },
  { range: '18:00-23:59', expected: 'evening', emoji: '🌇', label: 'Вечер' },
];

timeRanges.forEach(({ range, expected, emoji, label }) => {
  console.log(`\n${emoji} ${label} (${range}):`);
  
  const [start, end] = range.split('-');
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  
  // Тестируем начало диапазона
  const resultStart = getCurrentTimeOfDay(startHour);
  const statusStart = resultStart === expected ? '✅' : '❌';
  console.log(`  ${statusStart} ${startHour}:00 → ${resultStart}`);
  
  // Тестируем середину диапазона
  const midHour = startHour + Math.floor((endHour - startHour) / 2);
  const resultMid = getCurrentTimeOfDay(midHour);
  const statusMid = resultMid === expected ? '✅' : '❌';
  console.log(`  ${statusMid} ${midHour}:00 → ${resultMid}`);
  
  // Тестируем конец диапазона (последний час)
  const lastHour = endHour === 0 ? 23 : endHour - 1;
  const resultEnd = getCurrentTimeOfDay(lastHour);
  const statusEnd = resultEnd === expected ? '✅' : '❌';
  console.log(`  ${statusEnd} ${lastHour}:00 → ${resultEnd}`);
});

console.log('\n' + '─'.repeat(60));

// Текущее время
const now = new Date();
const currentHour = now.getHours();
const currentMinute = now.getMinutes();
const currentTimeOfDay = getCurrentTimeOfDay(currentHour);

const timeLabels = {
  morning: '🌅 Утро',
  day: '☀️ День',
  evening: '🌇 Вечер',
  night: '🌙 Ночь'
};

console.log(`\n⏰ Текущее время: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
console.log(`📍 Время суток: ${timeLabels[currentTimeOfDay]}`);
console.log(`🎴 Автоматически откроется карта: "${currentTimeOfDay}"`);

console.log('\n✅ Тест завершен!');
