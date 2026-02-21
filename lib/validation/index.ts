/**
 * Модуль валидации
 * 
 * Экспортирует функции для валидации дат рождения и имен
 */

export { validateBirthDate, type ValidationResult } from './date';
export { sumNameLetters, validateName } from './name';
export { BirthDateSchema } from './schemas';
