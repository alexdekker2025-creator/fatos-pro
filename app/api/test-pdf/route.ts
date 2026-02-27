import { NextResponse } from 'next/server';
import { PythagoreanCalculator } from '@/lib/calculators/pythagorean';
import {
  generateIntroduction,
  generateCellInterpretation,
  generateOverallPicture,
  generateSummary,
  generateHowToUse,
  generateNextSteps,
} from '@/lib/generators/pythagoreanReportGenerator';

export async function GET() {
  const calculator = new PythagoreanCalculator();

  // Дата рождения: 14.05.1983
  const birthDate = { day: 14, month: 5, year: 1983 };

  // Вычисляем рабочие числа
  const workingNumbers = calculator.calculateWorkingNumbers(birthDate);

  // Строим квадрат
  const square = calculator.buildSquare(birthDate, workingNumbers);

  // Преобразуем в массив [count1, count2, ..., count9]
  const squareArray = Array.from(square.digitCounts.values());

  // Генерируем отчёт
  const report = {
    birthDate: '14.05.1983',
    workingNumbers,
    square: squareArray,
    introduction: generateIntroduction('Тестовый пользователь'),
    cells: Array.from({ length: 9 }, (_, i) => {
      const digit = i + 1;
      const count = squareArray[i];
      return {
        digit,
        count,
        interpretation: generateCellInterpretation(digit, count),
      };
    }),
    overallPicture: generateOverallPicture(squareArray),
    summary: generateSummary(squareArray),
    howToUse: generateHowToUse(),
    nextSteps: generateNextSteps(),
  };

  return NextResponse.json(report, { status: 200 });
}
