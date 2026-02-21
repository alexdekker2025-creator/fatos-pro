/**
 * YuKassa Payment Provider
 * 
 * Реализация провайдера для платежной системы ЮKassa (Яндекс.Касса)
 * Документация API: https://yookassa.ru/developers/api
 */

import crypto from 'crypto';
import { PaymentProvider, PaymentSession, PaymentResult } from './types';

/**
 * Конфигурация ЮKassa
 */
interface YuKassaConfig {
  /** ID магазина (shopId) */
  shopId: string;
  /** Секретный ключ */
  secretKey: string;
  /** URL API ЮKassa */
  apiUrl?: string;
}

/**
 * Ответ от API ЮKassa при создании платежа
 */
interface YuKassaPaymentResponse {
  id: string;
  status: string;
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  expires_at: string;
  amount: {
    value: string;
    currency: string;
  };
}

/**
 * Данные вебхука от ЮKassa
 */
interface YuKassaWebhookPayload {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    paid: boolean;
    amount: {
      value: string;
      currency: string;
    };
    metadata?: {
      order_id?: string;
    };
  };
}

/**
 * Провайдер для работы с ЮKassa
 */
export class YuKassaProvider implements PaymentProvider {
  private config: YuKassaConfig;
  private apiUrl: string;

  constructor(config?: Partial<YuKassaConfig>) {
    this.config = {
      shopId: config?.shopId || process.env.YUKASSA_SHOP_ID || '',
      secretKey: config?.secretKey || process.env.YUKASSA_SECRET_KEY || '',
      apiUrl: config?.apiUrl || 'https://api.yookassa.ru/v3',
    };

    this.apiUrl = this.config.apiUrl!;

    if (!this.config.shopId || !this.config.secretKey) {
      throw new Error('YuKassa credentials not configured');
    }
  }

  /**
   * Создать платежную сессию в ЮKassa
   * 
   * @param amount - Сумма в копейках (например, 1000 = 10.00 руб)
   * @param currency - Валюта (обычно 'RUB')
   * @param userId - ID пользователя
   * @param orderId - ID заказа
   * @param serviceId - ID услуги (опционально)
   * @param locale - Язык интерфейса (опционально)
   * @returns Платежная сессия с URL для перенаправления
   */
  async createSession(
    amount: number,
    currency: string,
    userId: string,
    orderId: string,
    serviceId?: string,
    locale?: string
  ): Promise<PaymentSession> {
    try {
      const lang = locale || 'ru';
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      // Формируем сумму в формате ЮKassa (рубли с копейками)
      const amountValue = (amount / 100).toFixed(2);

      // Генерируем идемпотентный ключ для предотвращения дублирования платежей
      const idempotenceKey = crypto
        .createHash('sha256')
        .update(`${orderId}-${Date.now()}`)
        .digest('hex');

      // Создаем Basic Auth заголовок
      const authHeader = Buffer.from(
        `${this.config.shopId}:${this.config.secretKey}`
      ).toString('base64');

      // Формируем метаданные
      const metadata: Record<string, string> = {
        order_id: orderId,
        user_id: userId,
      };
      
      if (serviceId) {
        metadata.service_id = serviceId;
      }

      // Отправляем запрос к API ЮKassa
      const response = await fetch(`${this.apiUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`,
          'Idempotence-Key': idempotenceKey,
        },
        body: JSON.stringify({
          amount: {
            value: amountValue,
            currency: currency,
          },
          confirmation: {
            type: 'redirect',
            return_url: `${baseUrl}/${lang}/payment/success?orderId=${orderId}&serviceId=${serviceId || ''}&amount=${amountValue} ${currency}`,
          },
          capture: true,
          description: `Оплата заказа ${orderId}`,
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `YuKassa API error: ${errorData.description || response.statusText}`
        );
      }

      const data: YuKassaPaymentResponse = await response.json();

      return {
        id: data.id,
        url: data.confirmation.confirmation_url,
        expiresAt: new Date(data.expires_at),
      };
    } catch (error) {
      console.error('YuKassa createSession error:', error);
      throw new Error(
        `Failed to create YuKassa payment session: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Верифицировать подпись вебхука от ЮKassa
   * 
   * ЮKassa не использует подпись в заголовках, вместо этого рекомендуется
   * проверять IP-адрес отправителя или использовать Basic Auth
   * 
   * Для упрощения в development режиме всегда возвращаем true
   * В production следует проверять IP-адрес или использовать другие методы
   * 
   * @param payload - Тело вебхука
   * @param signature - Подпись (не используется ЮKassa)
   * @returns true если вебхук валиден
   */
  verifyWebhook(payload: any, signature: string): boolean {
    // ЮKassa не использует подпись в заголовках
    // Рекомендуется проверять IP-адрес отправителя
    // Список IP-адресов ЮKassa: https://yookassa.ru/developers/using-api/webhooks
    
    // В production следует добавить проверку IP
    if (process.env.NODE_ENV === 'production') {
      // TODO: Добавить проверку IP-адреса отправителя
      console.warn('YuKassa webhook IP verification not implemented');
    }

    // Базовая валидация структуры payload
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    if (!payload.type || !payload.event || !payload.object) {
      return false;
    }

    return true;
  }

  /**
   * Обработать вебхук от ЮKassa
   * 
   * @param payload - Тело вебхука
   * @returns Результат обработки платежа
   */
  async processWebhook(payload: any): Promise<PaymentResult> {
    try {
      const webhookData = payload as YuKassaWebhookPayload;

      // Проверяем тип события
      if (webhookData.type !== 'notification') {
        throw new Error(`Unsupported webhook type: ${webhookData.type}`);
      }

      const payment = webhookData.object;
      const orderId = payment.metadata?.order_id;

      if (!orderId) {
        throw new Error('Order ID not found in webhook metadata');
      }

      // Определяем статус платежа
      let status: 'completed' | 'failed';
      
      if (payment.status === 'succeeded' && payment.paid) {
        status = 'completed';
      } else if (payment.status === 'canceled') {
        status = 'failed';
      } else {
        // Для других статусов (pending, waiting_for_capture) не обрабатываем
        throw new Error(`Unhandled payment status: ${payment.status}`);
      }

      // Парсим сумму
      const amount = Math.round(parseFloat(payment.amount.value) * 100);

      return {
        orderId,
        status,
        amount,
        currency: payment.amount.currency,
        externalId: payment.id,
      };
    } catch (error) {
      console.error('YuKassa processWebhook error:', error);
      throw new Error(
        `Failed to process YuKassa webhook: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Получить информацию о платеже из ЮKassa
   * 
   * @param paymentId - ID платежа в ЮKassa
   * @returns Информация о платеже
   */
  async getPaymentInfo(paymentId: string): Promise<YuKassaPaymentResponse> {
    try {
      const authHeader = Buffer.from(
        `${this.config.shopId}:${this.config.secretKey}`
      ).toString('base64');

      const response = await fetch(`${this.apiUrl}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `YuKassa API error: ${errorData.description || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('YuKassa getPaymentInfo error:', error);
      throw new Error(
        `Failed to get YuKassa payment info: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
