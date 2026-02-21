/**
 * Destiny Number Calculator
 * Calculates the Destiny Number (Число Судьбы) from a birth date
 */

export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export interface DestinyNumber {
  value: number;
  isMasterNumber: boolean;
}

export interface DestinyMatrix {
  positions: Map<string, number>;
}

export class DestinyCalculator {
  /**
   * Calculate the Destiny Number from a birth date
   * Algorithm: Sum all digits of the date iteratively until reaching a single digit (1-9)
   * or a master number (11, 22, 33)
   * 
   * @param date - Birth date object with day, month, year
   * @returns DestinyNumber object with value and master number flag
   * 
   * @example
   * calculateDestinyNumber({ day: 15, month: 8, year: 1990 })
   * // 1+5+8+1+9+9+0 = 33 (master number)
   * // Returns { value: 33, isMasterNumber: true }
   */
  calculateDestinyNumber(date: BirthDate): DestinyNumber {
    // Combine all digits from day, month, and year
    const allDigits = this.extractDigits(date.day)
      .concat(this.extractDigits(date.month))
      .concat(this.extractDigits(date.year));
    
    // Sum all digits iteratively
    let sum = allDigits.reduce((acc, digit) => acc + digit, 0);
    
    // Keep reducing until we get a single digit or master number
    while (sum > 9 && !this.isMasterNumber(sum)) {
      sum = this.sumDigits(sum);
    }
    
    return {
      value: sum,
      isMasterNumber: this.isMasterNumber(sum)
    };
  }

  /**
   * Extract individual digits from a number
   * @param num - Number to extract digits from
   * @returns Array of individual digits
   * 
   * @example
   * extractDigits(123) // Returns [1, 2, 3]
   */
  private extractDigits(num: number): number[] {
    return num.toString().split('').map(d => parseInt(d, 10));
  }

  /**
   * Sum all digits of a number
   * @param num - Number to sum digits of
   * @returns Sum of all digits
   * 
   * @example
   * sumDigits(123) // Returns 6 (1+2+3)
   */
  private sumDigits(num: number): number {
    return this.extractDigits(num).reduce((acc, digit) => acc + digit, 0);
  }

  /**
   * Check if a number is a master number (11, 22, 33)
   * @param num - Number to check
   * @returns True if the number is a master number
   */
  private isMasterNumber(num: number): boolean {
    return num === 11 || num === 22 || num === 33;
  }

  /**
   * Calculate the Destiny Matrix from a birth date
   * The matrix includes key numerological positions based on the birth date
   * 
   * @param date - Birth date object with day, month, year
   * @returns DestinyMatrix object with positions map
   * 
   * @example
   * calculateDestinyMatrix({ day: 15, month: 8, year: 1990 })
   * // Returns matrix with positions: dayNumber, monthNumber, yearNumber, etc.
   */
  calculateDestinyMatrix(date: BirthDate): DestinyMatrix {
    const positions = new Map<string, number>();
    
    // Position 1: Day Number (reduced to single digit or master number)
    const dayNumber = this.reduceToSingleDigit(date.day);
    positions.set('dayNumber', dayNumber);
    
    // Position 2: Month Number (reduced to single digit or master number)
    const monthNumber = this.reduceToSingleDigit(date.month);
    positions.set('monthNumber', monthNumber);
    
    // Position 3: Year Number (reduced to single digit or master number)
    const yearNumber = this.reduceToSingleDigit(date.year);
    positions.set('yearNumber', yearNumber);
    
    // Position 4: Life Path Number (same as Destiny Number)
    const lifePath = this.calculateDestinyNumber(date);
    positions.set('lifePathNumber', lifePath.value);
    
    // Position 5: Personality Number (day + month)
    const personalitySum = date.day + date.month;
    const personalityNumber = this.reduceToSingleDigit(personalitySum);
    positions.set('personalityNumber', personalityNumber);
    
    // Position 6: Soul Number (month + year reduced)
    const soulSum = monthNumber + yearNumber;
    const soulNumber = this.reduceToSingleDigit(soulSum);
    positions.set('soulNumber', soulNumber);
    
    // Position 7: Power Number (day + year reduced)
    const powerSum = dayNumber + yearNumber;
    const powerNumber = this.reduceToSingleDigit(powerSum);
    positions.set('powerNumber', powerNumber);
    
    // Position 8: Karmic Number (all three reduced numbers summed)
    const karmicSum = dayNumber + monthNumber + yearNumber;
    const karmicNumber = this.reduceToSingleDigit(karmicSum);
    positions.set('karmicNumber', karmicNumber);
    
    return { positions };
  }

  /**
   * Reduce a number to a single digit or master number
   * @param num - Number to reduce
   * @returns Reduced number (1-9, 11, 22, 33)
   */
  private reduceToSingleDigit(num: number): number {
    let sum = num;
    
    while (sum > 9 && !this.isMasterNumber(sum)) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }
}
