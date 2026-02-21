import { DestinyCalculator, BirthDate } from '@/lib/calculators/destiny';

describe('DestinyCalculator - Matrix', () => {
  let calculator: DestinyCalculator;

  beforeEach(() => {
    calculator = new DestinyCalculator();
  });

  describe('calculateDestinyMatrix', () => {
    it('should calculate all matrix positions for a simple date', () => {
      const date: BirthDate = { day: 1, month: 1, year: 2000 };
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.size).toBeGreaterThan(0);
      expect(matrix.positions.has('dayNumber')).toBe(true);
      expect(matrix.positions.has('monthNumber')).toBe(true);
      expect(matrix.positions.has('yearNumber')).toBe(true);
      expect(matrix.positions.has('lifePathNumber')).toBe(true);
    });

    it('should calculate day number correctly', () => {
      const date: BirthDate = { day: 15, month: 1, year: 2000 };
      // 15 -> 1+5 = 6
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('dayNumber')).toBe(6);
    });

    it('should calculate month number correctly', () => {
      const date: BirthDate = { day: 1, month: 11, year: 2000 };
      // 11 is a master number
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('monthNumber')).toBe(11);
    });

    it('should calculate year number correctly', () => {
      const date: BirthDate = { day: 1, month: 1, year: 1990 };
      // 1990 -> 1+9+9+0 = 19 -> 1+9 = 10 -> 1+0 = 1
      const matrix = calculator.calculateDestinyMatrix(date);

      
      expect(matrix.positions.get('yearNumber')).toBe(1);
    });

    it('should calculate life path number (same as destiny number)', () => {
      const date: BirthDate = { day: 15, month: 8, year: 1990 };
      // 1+5+8+1+9+9+0 = 33 (master number)
      const matrix = calculator.calculateDestinyMatrix(date);
      const destinyNumber = calculator.calculateDestinyNumber(date);
      
      expect(matrix.positions.get('lifePathNumber')).toBe(destinyNumber.value);
      expect(matrix.positions.get('lifePathNumber')).toBe(33);
    });

    it('should calculate personality number', () => {
      const date: BirthDate = { day: 10, month: 5, year: 2000 };
      // day=10 -> 1, month=5 -> 5
      // personality = 10+5 = 15 -> 1+5 = 6
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('personalityNumber')).toBe(6);
    });

    it('should calculate soul number', () => {
      const date: BirthDate = { day: 1, month: 5, year: 1990 };
      // month=5, year=1990 -> 1+9+9+0=19 -> 1+9=10 -> 1+0=1
      // soul = 5+1 = 6
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('soulNumber')).toBe(6);
    });

    it('should calculate power number', () => {
      const date: BirthDate = { day: 15, month: 1, year: 2000 };
      // day=15 -> 1+5=6, year=2000 -> 2
      // power = 6+2 = 8
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('powerNumber')).toBe(8);
    });

    it('should calculate karmic number', () => {
      const date: BirthDate = { day: 10, month: 5, year: 2000 };
      // day=10 -> 1, month=5, year=2000 -> 2
      // karmic = 1+5+2 = 8
      const matrix = calculator.calculateDestinyMatrix(date);
      
      expect(matrix.positions.get('karmicNumber')).toBe(8);
    });

    it('should return same result for multiple calculations (idempotency)', () => {
      const date: BirthDate = { day: 15, month: 6, year: 1987 };
      
      const matrix1 = calculator.calculateDestinyMatrix(date);
      const matrix2 = calculator.calculateDestinyMatrix(date);
      const matrix3 = calculator.calculateDestinyMatrix(date);
      
      expect(matrix1.positions.get('dayNumber')).toBe(matrix2.positions.get('dayNumber'));
      expect(matrix2.positions.get('dayNumber')).toBe(matrix3.positions.get('dayNumber'));
      expect(matrix1.positions.get('lifePathNumber')).toBe(matrix2.positions.get('lifePathNumber'));
    });

    it('should handle master numbers in positions', () => {
      const date: BirthDate = { day: 11, month: 11, year: 2000 };
      const matrix = calculator.calculateDestinyMatrix(date);
      
      // Both day and month should be 11 (master number)
      expect(matrix.positions.get('dayNumber')).toBe(11);
      expect(matrix.positions.get('monthNumber')).toBe(11);
    });

    it('should calculate all 8 key positions', () => {
      const date: BirthDate = { day: 15, month: 8, year: 1990 };
      const matrix = calculator.calculateDestinyMatrix(date);
      
      const expectedPositions = [
        'dayNumber',
        'monthNumber',
        'yearNumber',
        'lifePathNumber',
        'personalityNumber',
        'soulNumber',
        'powerNumber',
        'karmicNumber'
      ];
      
      expect(matrix.positions.size).toBe(8);
      expectedPositions.forEach(position => {
        expect(matrix.positions.has(position)).toBe(true);
        expect(matrix.positions.get(position)).toBeGreaterThanOrEqual(1);
        expect(matrix.positions.get(position)).toBeLessThanOrEqual(33);
      });
    });

    it('should have all position values in valid range', () => {
      const date: BirthDate = { day: 29, month: 12, year: 1999 };
      const matrix = calculator.calculateDestinyMatrix(date);
      
      const validNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
      
      matrix.positions.forEach((value, key) => {
        expect(validNumbers).toContain(value);
      });
    });
  });
});
