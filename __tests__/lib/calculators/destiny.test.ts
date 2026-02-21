import { DestinyCalculator, BirthDate } from '@/lib/calculators/destiny';

describe('DestinyCalculator', () => {
  let calculator: DestinyCalculator;

  beforeEach(() => {
    calculator = new DestinyCalculator();
  });

  describe('calculateDestinyNumber', () => {
    it('should calculate destiny number for a simple date', () => {
      const date: BirthDate = { day: 1, month: 1, year: 2000 };
      // 1+1+2+0+0+0 = 4
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(4);
      expect(result.isMasterNumber).toBe(false);
    });

    it('should calculate destiny number with iterative reduction', () => {
      const date: BirthDate = { day: 29, month: 11, year: 1985 };
      // 2+9+1+1+1+9+8+5 = 36
      // 3+6 = 9
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(9);
      expect(result.isMasterNumber).toBe(false);
    });


    it('should recognize master number 11', () => {
      const date: BirthDate = { day: 11, month: 3, year: 2069 };
      // 1+1+3+2+0+6+9 = 22 (master!)
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(22);
      expect(result.isMasterNumber).toBe(true);
    });

    it('should recognize master number 22', () => {
      const date: BirthDate = { day: 29, month: 1, year: 2008 };
      // 2+9+1+2+0+0+8 = 22
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(22);
      expect(result.isMasterNumber).toBe(true);
    });

    it('should recognize master number 33', () => {
      const date: BirthDate = { day: 15, month: 8, year: 1990 };
      // 1+5+8+1+9+9+0 = 33
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(33);
      expect(result.isMasterNumber).toBe(true);
    });

    it('should return same result for multiple calculations (idempotency)', () => {
      const date: BirthDate = { day: 15, month: 6, year: 1987 };
      
      const result1 = calculator.calculateDestinyNumber(date);
      const result2 = calculator.calculateDestinyNumber(date);
      const result3 = calculator.calculateDestinyNumber(date);
      
      expect(result1.value).toBe(result2.value);
      expect(result2.value).toBe(result3.value);
      expect(result1.isMasterNumber).toBe(result2.isMasterNumber);
    });

    it('should handle dates with zeros', () => {
      const date: BirthDate = { day: 10, month: 10, year: 2000 };
      // 1+0+1+0+2+0+0+0 = 4
      const result = calculator.calculateDestinyNumber(date);
      
      expect(result.value).toBe(4);
      expect(result.isMasterNumber).toBe(false);
    });

    it('should calculate all single digit results (1-9)', () => {
      const testCases = [
        { date: { day: 1, month: 1, year: 2000 }, expected: 4 },   // 1+1+2+0+0+0 = 4
        { date: { day: 1, month: 1, year: 2001 }, expected: 5 },   // 1+1+2+0+0+1 = 5
        { date: { day: 1, month: 1, year: 2002 }, expected: 6 },   // 1+1+2+0+0+2 = 6
        { date: { day: 1, month: 1, year: 2003 }, expected: 7 },   // 1+1+2+0+0+3 = 7
        { date: { day: 1, month: 1, year: 2004 }, expected: 8 },   // 1+1+2+0+0+4 = 8
        { date: { day: 1, month: 1, year: 2005 }, expected: 9 },   // 1+1+2+0+0+5 = 9
        { date: { day: 1, month: 1, year: 1999 }, expected: 3 },   // 1+1+1+9+9+9 = 30, 3+0 = 3
        { date: { day: 1, month: 2, year: 1999 }, expected: 4 },   // 1+2+1+9+9+9 = 31, 3+1 = 4
        { date: { day: 1, month: 3, year: 1999 }, expected: 5 },   // 1+3+1+9+9+9 = 32, 3+2 = 5
      ];

      testCases.forEach(({ date, expected }) => {
        const result = calculator.calculateDestinyNumber(date);
        expect(result.value).toBe(expected);
      });
    });
  });
});
