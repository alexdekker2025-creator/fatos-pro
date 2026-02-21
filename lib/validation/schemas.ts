/**
 * Zod-схемы для валидации данных
 */

import { z } from 'zod';

/**
 * Схема валидации даты рождения
 * - День: 1-31
 * - Месяц: 1-12
 * - Год: 1900 - текущий год
 * - Проверка корректности даты (например, 31 февраля недопустимо)
 * - Проверка на будущие даты
 */
export const BirthDateSchema = z.object({
  day: z.number().int().min(1).max(31),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
}).refine((data) => {
  // Проверка, что дата существует
  const date = new Date(data.year, data.month - 1, data.day);
  return date.getDate() === data.day && 
         date.getMonth() === data.month - 1 && 
         date.getFullYear() === data.year;
}, {
  message: "Некорректная дата",
});

/**
 * Схема валидации регистрации пользователя
 * - Email: валидный email адрес
 * - Пароль: минимум 8 символов, максимум 100
 * - Имя: минимум 2 символа, максимум 100
 * 
 * Требование 20.6: Проверка безопасности паролей (минимум 8 символов)
 */
export const UserRegistrationSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100, 'Пароль слишком длинный')
    .refine(
      (password) => {
        // Проверка на наличие хотя бы одной цифры
        const hasNumber = /\d/.test(password);
        // Проверка на наличие хотя бы одной буквы
        const hasLetter = /[a-zA-Z]/.test(password);
        return hasNumber && hasLetter;
      },
      {
        message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
      }
    ),
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное'),
});

/**
 * Схема валидации входа пользователя
 * - Email: валидный email адрес
 * - Пароль: обязательное поле
 */
export const UserLoginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(1, 'Пароль обязателен'),
});

/**
 * Схема валидации статьи
 * - Заголовок: минимум 1 символ, максимум 200
 * - Содержание: минимум 1 символ
 * - Категория: destiny_number, matrix_position или square_cell
 * - Язык: ru или en
 * - Связанное значение: опционально
 */
export const ArticleSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен').max(200, 'Заголовок слишком длинный'),
  content: z.string().min(1, 'Содержание обязательно'),
  category: z.enum(['destiny_number', 'matrix_position', 'square_cell'], {
    errorMap: () => ({ message: 'Некорректная категория' }),
  }),
  language: z.enum(['ru', 'en'], {
    errorMap: () => ({ message: 'Некорректный язык' }),
  }),
  relatedValue: z.string().optional(),
});
