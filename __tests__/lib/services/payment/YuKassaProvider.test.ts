/**
 * Unit Tests for YuKassaProvider
 */

import { YuKassaProvider } from '@/lib/services/payment/YuKassaProvider';

// Mock fetch globally
global.fetch = jest.fn();

describe('YuKassaProvider', () => {
  let provider: YuKassaProvider;
  const mockConfig = {
    shopId: 'test_shop_id',
    secretKey: 'test_secret_key',
    apiUrl: 'https://api.yookassa.ru/v3',
  };

  beforeEach(() => {
    provider = new YuKassaProvider(mockConfig);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('должен создавать экземпляр с переданной конфигурацией', () => {
      expect(provider).toBeInstanceOf(YuKassaProvider);
    });

    it('должен выбрасывать ошибку если не указаны credentials', () => {
      expect(() => {
        new YuKassaProvider({ shopId: '', secretKey: '' });
      }).toThrow('YuKassa credentials not configured');
    });

    it('должен использовать переменные окружения если конфигурация не передана', () => {
      process.env.YUKASSA_SHOP_ID = 'env_shop_id';
      process.env.YUKASSA_SECRET_KEY = 'env_secret_key';
      
      const envProvider = new YuKassaProvider();
      expect(envProvider).toBeInstanceOf(YuKassaProvider);
      
      delete process.env.YUKASSA_SHOP_ID;
      delete process.env.YUKASSA_SECRET_KEY;
    });
  });

  describe('createSession', () => {
    it('должен создавать платежную сессию', async () => {
      const mockResponse = {
        id: 'payment_123',
        status: 'pending',
        confirmation: {
          type: 'redirect',
          confirmation_url: 'https://yookassa.ru/checkout/payment_123',
        },
        expires_at: '2024-12-31T23:59:59.000Z',
        amount: {
          value: '10.00',
          currency: 'RUB',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const session = await provider.createSession(
        1000,      // 10.00 руб в копейках
        'RUB',
        'user123',
        'order456'
      );

      expect(session).toEqual({
        id: 'payment_123',
        url: 'https://yookassa.ru/checkout/payment_123',
        expiresAt: new Date('2024-12-31T23:59:59.000Z'),
      });

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.yookassa.ru/v3/payments',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.stringContaining('Basic'),
            'Idempotence-Key': expect.any(String),
          }),
        })
      );
    });

    it('должен правильно форматировать сумму', async () => {
      const mockResponse = {
        id: 'payment_123',
        status: 'pending',
        confirmation: {
          type: 'redirect',
          confirmation_url: 'https://yookassa.ru/checkout/payment_123',
        },
        expires_at: '2024-12-31T23:59:59.000Z',
        amount: {
          value: '123.45',
          currency: 'RUB',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await provider.createSession(12345, 'RUB', 'user123', 'order456');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.amount.value).toBe('123.45');
    });

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: async () => ({ description: 'Invalid amount' }),
      });

      await expect(
        provider.createSession(1000, 'RUB', 'user123', 'order456')
      ).rejects.toThrow('YuKassa API error: Invalid amount');
    });

    it('должен включать metadata в запрос', async () => {
      const mockResponse = {
        id: 'payment_123',
        status: 'pending',
        confirmation: {
          type: 'redirect',
          confirmation_url: 'https://yookassa.ru/checkout/payment_123',
        },
        expires_at: '2024-12-31T23:59:59.000Z',
        amount: {
          value: '10.00',
          currency: 'RUB',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await provider.createSession(1000, 'RUB', 'user123', 'order456');

      const callArgs = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      
      expect(body.metadata).toEqual({
        order_id: 'order456',
        user_id: 'user123',
      });
    });
  });

  describe('verifyWebhook', () => {
    it('должен возвращать true для валидного payload', () => {
      const validPayload = {
        type: 'notification',
        event: 'payment.succeeded',
        object: {
          id: 'payment_123',
          status: 'succeeded',
          paid: true,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      const result = provider.verifyWebhook(validPayload, '');
      expect(result).toBe(true);
    });

    it('должен возвращать false для невалидного payload', () => {
      const invalidPayload = {
        type: 'notification',
        // Отсутствует event и object
      };

      const result = provider.verifyWebhook(invalidPayload, '');
      expect(result).toBe(false);
    });

    it('должен возвращать false для null payload', () => {
      const result = provider.verifyWebhook(null, '');
      expect(result).toBe(false);
    });

    it('должен возвращать false для пустого объекта', () => {
      const result = provider.verifyWebhook({}, '');
      expect(result).toBe(false);
    });
  });

  describe('processWebhook', () => {
    it('должен обрабатывать успешный платеж', async () => {
      const webhookPayload = {
        type: 'notification',
        event: 'payment.succeeded',
        object: {
          id: 'payment_123',
          status: 'succeeded',
          paid: true,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result).toEqual({
        orderId: 'order456',
        status: 'completed',
        amount: 1000,
        currency: 'RUB',
        externalId: 'payment_123',
      });
    });

    it('должен обрабатывать отмененный платеж', async () => {
      const webhookPayload = {
        type: 'notification',
        event: 'payment.canceled',
        object: {
          id: 'payment_123',
          status: 'canceled',
          paid: false,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result).toEqual({
        orderId: 'order456',
        status: 'failed',
        amount: 1000,
        currency: 'RUB',
        externalId: 'payment_123',
      });
    });

    it('должен правильно конвертировать сумму из рублей в копейки', async () => {
      const webhookPayload = {
        type: 'notification',
        event: 'payment.succeeded',
        object: {
          id: 'payment_123',
          status: 'succeeded',
          paid: true,
          amount: {
            value: '123.45',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      const result = await provider.processWebhook(webhookPayload);

      expect(result.amount).toBe(12345);
    });

    it('должен выбрасывать ошибку если отсутствует order_id', async () => {
      const webhookPayload = {
        type: 'notification',
        event: 'payment.succeeded',
        object: {
          id: 'payment_123',
          status: 'succeeded',
          paid: true,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {},
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Order ID not found in webhook metadata');
    });

    it('должен выбрасывать ошибку для неподдерживаемого типа вебхука', async () => {
      const webhookPayload = {
        type: 'refund',
        event: 'refund.succeeded',
        object: {
          id: 'refund_123',
          status: 'succeeded',
          paid: false,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Unsupported webhook type: refund');
    });

    it('должен выбрасывать ошибку для необработанного статуса платежа', async () => {
      const webhookPayload = {
        type: 'notification',
        event: 'payment.waiting_for_capture',
        object: {
          id: 'payment_123',
          status: 'waiting_for_capture',
          paid: false,
          amount: {
            value: '10.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      await expect(
        provider.processWebhook(webhookPayload)
      ).rejects.toThrow('Unhandled payment status: waiting_for_capture');
    });
  });

  describe('getPaymentInfo', () => {
    it('должен получать информацию о платеже', async () => {
      const mockResponse = {
        id: 'payment_123',
        status: 'succeeded',
        paid: true,
        amount: {
          value: '10.00',
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          confirmation_url: 'https://yookassa.ru/checkout/payment_123',
        },
        expires_at: '2024-12-31T23:59:59.000Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const info = await provider.getPaymentInfo('payment_123');

      expect(info).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.yookassa.ru/v3/payments/payment_123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Basic'),
          }),
        })
      );
    });

    it('должен выбрасывать ошибку при неудачном запросе', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        json: async () => ({ description: 'Payment not found' }),
      });

      await expect(
        provider.getPaymentInfo('payment_123')
      ).rejects.toThrow('YuKassa API error: Payment not found');
    });
  });
});
