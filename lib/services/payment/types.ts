/**
 * Payment Service Types
 * 
 * Типы данных для работы с платежными системами
 */

/**
 * Платежная сессия
 */
export interface PaymentSession {
  /** Уникальный идентификатор сессии */
  id: string;
  /** URL для перенаправления пользователя на страницу оплаты */
  url: string;
  /** Время истечения сессии */
  expiresAt: Date;
}

/**
 * Результат обработки платежа
 */
export interface PaymentResult {
  /** ID заказа в нашей системе */
  orderId: string;
  /** Статус платежа */
  status: 'completed' | 'failed';
  /** Сумма платежа */
  amount: number;
  /** Валюта платежа (ISO 4217) */
  currency: string;
  /** ID транзакции во внешней платежной системе */
  externalId?: string;
}

/**
 * Интерфейс провайдера платежной системы
 * 
 * Реализует паттерн Strategy для работы с разными платежными системами
 */
export interface PaymentProvider {
  /**
   * Создать платежную сессию
   * 
   * @param amount - Сумма платежа
   * @param currency - Валюта платежа (ISO 4217)
   * @param userId - ID пользователя
   * @param orderId - ID заказа в нашей системе
   * @param serviceId - ID услуги (опционально)
   * @param locale - Язык интерфейса (опционально)
   * @returns Платежная сессия с URL для перенаправления
   */
  createSession(
    amount: number,
    currency: string,
    userId: string,
    orderId: string,
    serviceId?: string,
    locale?: string
  ): Promise<PaymentSession>;

  /**
   * Верифицировать подпись вебхука
   * 
   * @param payload - Тело запроса вебхука
   * @param signature - Подпись из заголовков
   * @returns true если подпись валидна, false иначе
   */
  verifyWebhook(payload: any, signature: string): boolean;

  /**
   * Обработать вебхук от платежной системы
   * 
   * @param payload - Тело запроса вебхука
   * @returns Результат обработки платежа
   */
  processWebhook(payload: any): Promise<PaymentResult>;
}

/**
 * Регион пользователя для выбора платежной системы
 */
export type UserRegion = 'RU' | 'OTHER';

/**
 * Тип платежного провайдера
 */
export type PaymentProviderType = 'yukassa' | 'stripe';
