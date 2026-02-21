/**
 * Unit Tests for StripeProvider
 */

import crypto from 'crypto';
import { StripeProvider } from '@/lib/services/payment/StripeProvider';

// Mock fetch globally
global.fetch = jest.fn();

describe('StripeProvider', () => {
  let provider: StripeProvider;
  const mockConfig = {
    secretKey: 'sk_test_123',
    webhookSecret: 'whsec_test_123',
    apiUrl: 'https://api.stripe.com/v1',
  };

  beforeEach(() => {
    provider = new StripeProvider(mockConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('должен создавать экземпляр с переданной конфигурацией', () => {
      expect(provider).toBeInstanceOf(StripeProvider);
    });

    it('должен выбрасывать ошибку если не указан secret key', () => {
      expect(() => {
        new StripeProvider({ secretKey: '', webhookSecret: 'test' });
      }).toThrow('Stripe secret key not configured');
    });

    it('должен использовать переменные окружения если конфигурация не передана', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_env_123';
      process.env.STRIPE_WEBHOOK_SECRET = 'whsec_env_123';
      
      const envProvider = new StripeProvider();
      expect(envProvider).toBeInstanceOf(StripeProvider);
      
      delete process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_WEBHOOK_SECRET;
    });

    it('должен выводить предупреждение если не указан webhook secret', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      new StripeProvider({ secretKey: 'sk_test_123', webhookSecret: '' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Stripe webhook secret not configured - webhook verification will fail'
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('createSession', () => {
    it('должен создавать checkout session', async () => {
      const mockResponse = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        expires_at: 1735689599, // Unix timestamp
        amount_total: 1000,
        currency: 'usd',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const session = await provider.createSession(
        1000,      // $10.00 в центах
        'USD',
        'user123',
        'order456'
      );

      expect(session).toEqual({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        expiresAt: new Date(1735689599 * 1000),
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.stripe.com/v1/checkout/sessions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer sk_test_123',
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
      );
    });

    it('должен правильно форматировать параметры', async () => {
      const mockResponse = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        expires_at: 1735689599,
        amount_total: 2500,
        currency: 'eur',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await provider.createSession(2500, 'EUR', 'user123', 'order456');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = callArgs[1].body;
      
      // URL encoded format
      expect(body).toContain('line_items%5B0%5D%5Bprice_data%5D%5Bunit_amount%5D=2500');
      expect(body).toContain('line_items%5B0%5D%5Bprice_data%5D%5Bcurrency%5D=eur');
      expect(body).toContain('metadata%5Border_id%5D=order456');
      expect(body).toContain('metadata%5Buser_id%5D=user123');
    });

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({
          error: { message: 'Invalid amount' }
        }),
      });

      await expect(
        provider.createSession(1000, 'USD', 'user123', 'order456')
      ).rejects.toThrow('Stripe API error: Invalid amount');
    });

    it('должен конвертировать валюту в lowercase', async () => {
      const mockResponse = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        expires_at: 1735689599,
        amount_total: 1000,
        currency: 'gbp',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await provider.createSession(1000, 'GBP', 'user123', 'order456');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = callArgs[1].body;
      
      // URL encoded format
      expect(body).toContain('line_items%5B0%5D%5Bprice_data%5D%5Bcurrency%5D=gbp');
    });
  });

  describe('verifyWebhook', () => {
    it('должен верифицировать валидную подпись', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = JSON.stringify({ type: 'checkout.session.completed' });
      
      // Создаем валидную подпись
      const signedPayload = `${timestamp}.${payload}`;
      const signature = crypto
        .createHmac('sha256', mockConfig.webhookSecret)
        .update(signedPayload, 'utf8')
        .digest('hex');
      
      const stripeSignature = `t=${timestamp},v1=${signature}`;

      const result = provider.verifyWebhook(payload, stripeSignature);
      expect(result).toBe(true);
    });

    it('должен отклонять невалидную подпись', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = JSON.stringify({ type: 'checkout.session.completed' });
      const invalidSignature = `t=${timestamp},v1=invalid_signature`;

      const result = provider.verifyWebhook(payload, invalidSignature);
      expect(result).toBe(false);
    });

    it('должен отклонять старые timestamp (> 5 минут)', () => {
      const oldTimestamp = Math.floor(Date.now() / 1000) - 400; // 6.67 минут назад
      const payload = JSON.stringify({ type: 'checkout.session.completed' });
      
      const signedPayload = `${oldTimestamp}.${payload}`;
      const signature = crypto
        .createHmac('sha256', mockConfig.webhookSecret)
        .update(signedPayload, 'utf8')
        .digest('hex');
      
      const stripeSignature = `t=${oldTimestamp},v1=${signature}`;

      const result = provider.verifyWebhook(payload, stripeSignature);
      expect(result).toBe(false);
    });

    it('должен возвращать false если отсутствует webhook secret', () => {
      const providerWithoutSecret = new StripeProvider({
        secretKey: 'sk_test_123',
        webhookSecret: '',
      });

      const result = providerWithoutSecret.verifyWebhook({}, 't=123,v1=sig');
      expect(result).toBe(false);
    });

    it('должен возвращать false если отсутствует signature header', () => {
      const result = provider.verifyWebhook({}, '');
      expect(result).toBe(false);
    });

    it('должен возвращать false для невалидного формата подписи', () => {
      const result = provider.verifyWebhook({}, 'invalid_format');
      expect(result).toBe(false);
    });

    it('должен обрабатывать payload как объект', () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = { type: 'checkout.session.completed' };
      const payloadString = JSON.stringify(payload);
      
      const signedPayload = `${timestamp}.${payloadString}`;
      const signature = crypto
        .createHmac('sha256', mockConfig.webhookSecret)
        .update(signedPayload, 'utf8')
        .digest('hex');
      
      const stripeSignature = `t=${timestamp},v1=${signature}`;

      const result = provider.verifyWebhook(payload, stripeSignature);
      expect(result).toBe(true);
    });
  });

  describe('processWebhook', () => {
    it('должен обрабатывать успешный платеж', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            amount_total: 1000,
            currency: 'usd',
            payment_status: 'paid',
            metadata: {
              order_id: 'order456',
              user_id: 'user123',
            },
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result).toEqual({
        orderId: 'order456',
        status: 'completed',
        amount: 1000,
        currency: 'usd',
        externalId: 'cs_test_123',
      });
    });

    it('должен обрабатывать неудачный платеж', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'checkout.session.async_payment_failed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            amount_total: 1000,
            currency: 'usd',
            payment_status: 'unpaid',
            metadata: {
              order_id: 'order456',
            },
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result).toEqual({
        orderId: 'order456',
        status: 'failed',
        amount: 1000,
        currency: 'usd',
        externalId: 'cs_test_123',
      });
    });

    it('должен выбрасывать ошибку если отсутствует order_id', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            amount_total: 1000,
            currency: 'usd',
            payment_status: 'paid',
            metadata: {},
          },
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Order ID not found in webhook metadata');
    });

    it('должен выбрасывать ошибку для неподдерживаемого типа события', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            object: 'payment_intent',
            metadata: {
              order_id: 'order456',
            },
          },
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Unsupported webhook event type: payment_intent.succeeded');
    });

    it('должен выбрасывать ошибку для необработанного статуса платежа', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            amount_total: 1000,
            currency: 'usd',
            payment_status: 'unpaid',
            metadata: {
              order_id: 'order456',
            },
          },
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Unhandled payment status: unpaid');
    });

    it('должен использовать значения по умолчанию для отсутствующих полей', async () => {
      const webhookPayload = {
        id: 'evt_123',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            payment_status: 'paid',
            metadata: {
              order_id: 'order456',
            },
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result.amount).toBe(0);
      expect(result.currency).toBe('usd');
    });
  });

  describe('getSessionInfo', () => {
    it('должен получать информацию о checkout session', async () => {
      const mockResponse = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
        expires_at: 1735689599,
        amount_total: 1000,
        currency: 'usd',
        payment_status: 'paid',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const info = await provider.getSessionInfo('cs_test_123');

      expect(info).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.stripe.com/v1/checkout/sessions/cs_test_123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer sk_test_123',
          }),
        })
      );
    });

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: async () => ({
          error: { message: 'Session not found' }
        }),
      });

      await expect(
        provider.getSessionInfo('cs_test_123')
      ).rejects.toThrow('Stripe API error: Session not found');
    });
  });
});
