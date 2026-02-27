/**
 * Age Calculation Utility
 * Calculates age from birth date, accounting for whether birthday has occurred this year
 */

import { BirthDate } from '@/types/numerology';

/**
 * Calculate age from birth date
 * @param birthDate - Birth date object with day, month, year
 * @param currentDate - Current date (defaults to today)
 * @returns Age in years
 */
export function calculateAge(birthDate: BirthDate, currentDate: Date = new Date()): number {
  const birthYear = birthDate.year;
  const birthMonth = birthDate.month;
  const birthDay = birthDate.day;

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const currentDay = currentDate.getDate();

  // Calculate base age
  let age = currentYear - birthYear;

  // Check if birthday has occurred this year
  const birthdayOccurred =
    currentMonth > birthMonth || (currentMonth === birthMonth && currentDay >= birthDay);

  // If birthday hasn't occurred yet this year, subtract 1
  if (!birthdayOccurred) {
    age -= 1;
  }

  return age;
}

/**
 * Format age as string with years label
 * @param age - Age in years
 * @returns Formatted age string (e.g., "25 лет")
 */
export function formatAge(age: number): string {
  // Russian pluralization rules for "год/года/лет"
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return `${age} лет`;
  }

  if (lastDigit === 1) {
    return `${age} год`;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  }

  return `${age} лет`;
}

/**
 * Calculate age and return formatted string
 * @param birthDate - Birth date object
 * @param currentDate - Current date (defaults to today)
 * @returns Formatted age string
 */
export function getFormattedAge(birthDate: BirthDate, currentDate?: Date): string {
  const age = calculateAge(birthDate, currentDate);
  return formatAge(age);
}
