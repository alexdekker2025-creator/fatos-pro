/**
 * Input Sanitization Utilities
 * 
 * Санитизация пользовательских вводов для защиты от XSS и injection атак
 * Требование 20.4: Платформа ДОЛЖНА валидировать и санитизировать все пользовательские вводы
 */

/**
 * Экранирует HTML специальные символы для предотвращения XSS
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Удаляет потенциально опасные HTML теги и атрибуты
 */
export function stripHtml(text: string): string {
  // Удаляем все HTML теги
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Санитизирует строку для использования в SQL запросах
 * Примечание: Prisma автоматически защищает от SQL injection,
 * но эта функция полезна для дополнительной защиты
 */
export function sanitizeSql(text: string): string {
  // Экранируем одинарные кавычки
  return text.replace(/'/g, "''");
}

/**
 * Валидирует и санитизирует email адрес
 */
export function sanitizeEmail(email: string): string {
  // Приводим к нижнему регистру и удаляем пробелы
  let sanitized = email.toLowerCase().trim();
  
  // Удаляем потенциально опасные символы
  sanitized = sanitized.replace(/[<>()[\]\\,;:\s@"]/g, (char) => {
    // Разрешаем только @ и точку
    return char === '@' || char === '.' ? char : '';
  });
  
  return sanitized;
}

/**
 * Санитизирует имя пользователя
 */
export function sanitizeName(name: string): string {
  // Удаляем лишние пробелы
  let sanitized = name.trim().replace(/\s+/g, ' ');
  
  // Удаляем потенциально опасные символы, оставляя буквы, цифры, пробелы и дефисы
  sanitized = sanitized.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s-]/g, '');
  
  // Ограничиваем длину
  if (sanitized.length > 100) {
    sanitized = sanitized.substring(0, 100);
  }
  
  return sanitized;
}

/**
 * Санитизирует URL для предотвращения open redirect атак
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Разрешаем только http и https протоколы
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  } catch {
    // Если URL невалидный, возвращаем пустую строку
    return '';
  }
}

/**
 * Санитизирует текстовый контент (для статей и описаний)
 */
export function sanitizeContent(content: string): string {
  // Удаляем потенциально опасные скрипты
  let sanitized = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Удаляем inline event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Удаляем javascript: протокол из ссылок
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Удаляем data: протокол (может использоваться для XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  return sanitized;
}

/**
 * Санитизирует числовой ввод
 */
export function sanitizeNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    // Проверяем на NaN и Infinity
    if (isNaN(value) || !isFinite(value)) {
      return null;
    }
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
      return null;
    }
    return parsed;
  }
  
  return null;
}

/**
 * Санитизирует объект, применяя соответствующую санитизацию к каждому полю
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Record<keyof T, 'string' | 'email' | 'name' | 'content' | 'number' | 'url'>
): Partial<T> {
  const sanitized: Partial<T> = {};
  
  for (const key in schema) {
    const value = obj[key];
    const type = schema[key];
    
    if (value === undefined || value === null) {
      continue;
    }
    
    switch (type) {
      case 'string':
        if (typeof value === 'string') {
          sanitized[key] = stripHtml(value) as T[Extract<keyof T, string>];
        }
        break;
        
      case 'email':
        if (typeof value === 'string') {
          sanitized[key] = sanitizeEmail(value) as T[Extract<keyof T, string>];
        }
        break;
        
      case 'name':
        if (typeof value === 'string') {
          sanitized[key] = sanitizeName(value) as T[Extract<keyof T, string>];
        }
        break;
        
      case 'content':
        if (typeof value === 'string') {
          sanitized[key] = sanitizeContent(value) as T[Extract<keyof T, string>];
        }
        break;
        
      case 'number':
        sanitized[key] = sanitizeNumber(value) as T[Extract<keyof T, string>];
        break;
        
      case 'url':
        if (typeof value === 'string') {
          sanitized[key] = sanitizeUrl(value) as T[Extract<keyof T, string>];
        }
        break;
    }
  }
  
  return sanitized;
}

/**
 * Проверяет, содержит ли строка потенциально опасный контент
 */
export function containsMaliciousContent(text: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];
  
  return maliciousPatterns.some((pattern) => pattern.test(text));
}

/**
 * Валидирует длину строки
 */
export function validateLength(
  text: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  if (text.length < min) {
    return {
      valid: false,
      error: `Text must be at least ${min} characters long`,
    };
  }
  
  if (text.length > max) {
    return {
      valid: false,
      error: `Text must be at most ${max} characters long`,
    };
  }
  
  return { valid: true };
}
