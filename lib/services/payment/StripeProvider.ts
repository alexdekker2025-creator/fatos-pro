/**
 * Stripe Payment Provider
 * 
 * Реализация провайдера для платежной системы Stripe
 * Документация API: https://stripe.com/docs/api
 */

import crypto from 'crypto';
import { PaymentProvider, PaymentSession, PaymentResult } from './types';

/**
 * Конфигурация Stripe
 */
interface StripeConfig {
  /** Secret API Key */
  secretKey: string;
  /** Webhook Secret для верификации подписи */
  webhookSecret: string;
  /** URL API Stripe */
  apiUrl?: string;
}

/**
 * Ответ от API Stripe при создании checkout session
 */
interface StripeCheckoutSessionResponse {
  id: string;
  url: string;
  expires_at: number;
  amount_total: number;
  currency: string;
  metadata?: {
    order_id?: string;
    user_id?: string;
  };
}

/**
 * Данные вебхука от Stripe
 */
interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      object: string;
      amount_total?: number;
      currency?: string;
      payment_status?: string;
      metadata?: {
        order_id?: string;
        user_id?: string;
      };
    };
  };
}

/**
 * Провайдер для работы со Stripe
 */
export class StripeProvider implements PaymentProvider {
  private config: StripeConfig;
  private apiUrl: string;

  constructor(config?: Partial<StripeConfig>) {
    this.config = {
      secretKey: config?.secretKey || process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: config?.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || '',
      apiUrl: config?.apiUrl || 'https://api.stripe.com/v1',
    };

    this.apiUrl = this.config.apiUrl!;

    if (!this.config.secretKey) {
      throw new Error('Stripe secret key not configured');
    }

    if (!this.config.webhookSecret) {
      console.warn('Stripe webhook secret not configured - webhook verification will fail');
    }
  }

  /**
   * Создать платежную сессию в Stripe
   * 
   * @param amount - Сумма в центах (например, 1000 = $10.00)
   * @param currency - Валюта (например, 'usd', 'eur')
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
      
      // Формируем данные для создания Checkout Session
      const params = new URLSearchParams({
        'mode': 'payment',
        'success_url': `${baseUrl}/${lang}/payment/success?orderId=${orderId}&serviceId=${serviceId || ''}&amount=${amount / 100} ${currency.toUpperCase()}`,
        'cancel_url': `${baseUrl}/${lang}/payment/cancel`,
        'line_items[0][price_data][currency]': currency.toLowerCase(),
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][price_data][product_data][name]': 'Premium Features',
        'line_items[0][quantity]': '1',
        'metadata[order_id]': orderId,
        'metadata[user_id]': userId,
      });

      if (serviceId) {
        params.append('metadata[service_id]', serviceId);
      }

      // Отправляем запрос к API Stripe
      const response = await fetch(`${this.apiUrl}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Stripe API error: ${errorData.error?.message || response.statusText}`
        );
      }

      const data: StripeCheckoutSessionResponse = await response.json();

      return {
        id: data.id,
        url: data.url,
        expiresAt: new Date(data.expires_at * 1000), // Stripe использует Unix timestamp
      };
    } catch (error) {
      console.error('Stripe createSession error:', error);
      throw new Error(
        `Failed to create Stripe payment session: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Верифицировать подпись вебхука от Stripe
   * 
   * Stripe использует HMAC SHA256 для подписи вебхуков
   * Подпись передается в заголовке Stripe-Signature
   * 
   * @param payload - Тело вебхука (raw body)
   * @param signature - Подпись из заголовка Stripe-Signature
   * @returns true если подпись валидна
   */
  verifyWebhook(payload: any, signature: string): boolean {
    try {
      if (!this.config.webhookSecret) {
        console.error('Stripe webhook secret not configured');
        return false;
      }

      if (!signature) {
        console.error('Stripe signature header missing');
        return false;
      }

      // Парсим заголовок Stripe-Signature
      // Формат: t=timestamp,v1=signature
      const signatureParts = signature.split(',').reduce((acc, part) => {
        const [key, value] = part.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const timestamp = signatureParts.t;
      const expectedSignature = signatureParts.v1;

      if (!timestamp || !expectedSignature) {
        console.error('Invalid Stripe signature format');
        return false;
      }

      // Проверяем timestamp (не старше 5 минут)
      const currentTime = Math.floor(Date.now() / 1000);
      const timestampAge = currentTime - parseInt(timestamp, 10);
      
      if (timestampAge > 300) { // 5 минут
        console.error('Stripe webhook timestamp too old');
        return false;
      }

      // Вычисляем ожидаемую подпись
      const payloadString = typeof payload === 'string' 
        ? payload 
        : JSON.stringify(payload);
      
      const signedPayload = `${timestamp}.${payloadString}`;
      const computedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(signedPayload, 'utf8')
        .digest('hex');

      // Сравниваем подписи (защита от timing attacks)
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(computedSignature)
      );
    } catch (error) {
      console.error('Stripe webhook verification error:', error);
      return false;
    }
  }

  /**
   * Обработать вебхук от Stripe
   * 
   * @param payload - Тело вебхука
   * @returns Результат обработки платежа
   */
  async processWebhook(payload: any): Promise<PaymentResult> {
    try {
      const event = payload as StripeWebhookEvent;

      // Обрабатываем только события checkout.session.completed и checkout.session.async_payment_failed
      if (
        event.type !== 'checkout.session.completed' &&
        event.type !== 'checkout.session.async_payment_failed'
      ) {
        throw new Error(`Unsupported webhook event type: ${event.type}`);
      }

      const session = event.data.object;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        throw new Error('Order ID not found in webhook metadata');
      }

      // Определяем статус платежа
      let status: 'completed' | 'failed';
      
      if (
        event.type === 'checkout.session.completed' &&
        session.payment_status === 'paid'
      ) {
        status = 'completed';
      } else if (event.type === 'checkout.session.async_payment_failed') {
        status = 'failed';
      } else {
        // Для других статусов не обрабатываем
        throw new Error(
          `Unhandled payment status: ${session.payment_status} for event ${event.type}`
        );
      }

      return {
        orderId,
        status,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        externalId: session.id,
      };
    } catch (error) {
      console.error('Stripe processWebhook error:', error);
      throw new Error(
        `Failed to process Stripe webhook: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Получить информацию о checkout session из Stripe
   * 
   * @param sessionId - ID checkout session
   * @returns Информация о сессии
   */
  async getSessionInfo(sessionId: string): Promise<StripeCheckoutSessionResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}/checkout/sessions/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.secretKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Stripe API error: ${errorData.error?.message || response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Stripe getSessionInfo error:', error);
      throw new Error(
        `Failed to get Stripe session info: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }
}
