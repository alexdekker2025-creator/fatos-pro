# Нумерологические калькуляторы

Модуль содержит реализации нумерологических калькуляторов для платформы FATOS.pro.

## Калькуляторы

### 1. PythagoreanCalculator (Квадрат Пифагора)

Вычисляет рабочие числа и строит квадрат Пифагора 3x3 на основе даты рождения.

```typescript
import { PythagoreanCalculator } from '@/lib/calculators';

const calculator = new PythagoreanCalculator();
const date = { day: 15, month: 6, year: 1987 };

// Вычислить рабочие числа
const workingNumbers = calculator.calculateWorkingNumbers(date);
// { first: 32, second: 5, third: 18, fourth: 9 }

// Построить квадрат Пифагора
const square = calculator.buildSquare(date, workingNumbers);
// [[1, 1], [4, 4, 4], [7, 7], [null], [5, 5], [8, 8, 8], [null], [null], [9, 9, 9]]
```

### 2. DestinyCalculator (Число Судьбы)

Вычисляет Число Судьбы путем итеративного суммирования цифр даты рождения.

```typescript
import { DestinyCalculator } from '@/lib/calculators';

const calculator = new DestinyCalculator();
const date = { day: 15, month: 8, year: 1990 };

// Вычислить число судьбы
const destinyNumber = calculator.calculateDestinyNumber(date);
// { value: 33, isMasterNumber: true }
```

**Мастер-числа:** 11, 22, 33 - особые числа, которые не редуцируются до однозначных.

**Алгоритм:**
1. Суммируются все цифры даты рождения
2. Если сумма > 9 и не является мастер-числом, суммируются цифры результата
3. Процесс повторяется до получения однозначного числа (1-9) или мастер-числа (11, 22, 33)

**Примеры:**
- 01.01.2000 → 1+1+2+0+0+0 = 4
- 29.11.1985 → 2+9+1+1+1+9+8+5 = 36 → 3+6 = 9
- 15.08.1990 → 1+5+8+1+9+9+0 = 33 (мастер-число)
- 29.01.2008 → 2+9+1+2+0+0+8 = 22 (мастер-число)

### 3. DestinyCalculator.calculateDestinyMatrix (Матрица Судьбы)

Вычисляет расширенную матрицу судьбы с 8 ключевыми позициями.

```typescript
import { DestinyCalculator } from '@/lib/calculators';

const calculator = new DestinyCalculator();
const date = { day: 15, month: 8, year: 1990 };

// Вычислить матрицу судьбы
const matrix = calculator.calculateDestinyMatrix(date);
// {
//   positions: Map {
//     'dayNumber' => 6,
//     'monthNumber' => 8,
//     'yearNumber' => 1,
//     'lifePathNumber' => 33,
//     'personalityNumber' => 5,
//     'soulNumber' => 9,
//     'powerNumber' => 7,
//     'karmicNumber' => 6
//   }
// }
```

**Позиции матрицы:**
1. **dayNumber** - Число дня (редуцированное значение дня рождения)
2. **monthNumber** - Число месяца (редуцированное значение месяца)
3. **yearNumber** - Число года (редуцированное значение года)
4. **lifePathNumber** - Число жизненного пути (то же, что и число судьбы)
5. **personalityNumber** - Число личности (день + месяц)
6. **soulNumber** - Число души (месяц + год)
7. **powerNumber** - Число силы (день + год)
8. **karmicNumber** - Кармическое число (день + месяц + год)

**Алгоритм:**
- Каждая позиция вычисляется путем редукции соответствующих чисел
- Редукция выполняется до получения однозначного числа (1-9) или мастер-числа (11, 22, 33)
- Все позиции взаимосвязаны и дают комплексный нумерологический портрет

## Тестирование

Все калькуляторы покрыты unit-тестами:

```bash
# Запустить все тесты
npm test

# Запустить тесты конкретного калькулятора
npx jest __tests__/lib/calculators/pythagorean.test.ts
npx jest __tests__/lib/calculators/destiny.test.ts
npx jest __tests__/lib/calculators/destiny-matrix.test.ts
```

## Типы данных

```typescript
interface BirthDate {
  day: number;    // 1-31
  month: number;  // 1-12
  year: number;   // 1900-текущий год
}

interface WorkingNumbers {
  first: number;
  second: number;
  third: number;
  fourth: number;
}

interface DestinyNumber {
  value: number;           // 1-9, 11, 22, 33
  isMasterNumber: boolean; // true для 11, 22, 33
}

interface DestinyMatrix {
  positions: Map<string, number>; // 8 ключевых позиций
}
```
