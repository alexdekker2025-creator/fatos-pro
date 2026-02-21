/**
 * Unit-тесты для API-эндпоинта вебхуков Stripe
 * POST /api/webhooks/stripe
 */

import { POST } from '@/app/api/webhooks/stripe/route';
import { PaymentFactory } from '@/lib/services/payment';
import { prisma } from '@/lib/prisma';

// Мокаем зависимости
jest.mock('@/lib/services/payment');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    purchase: {
      create: jest.fn(),
    },
  },
}));

// Хелпер для создания мок-запроса
function createMockRequest(body: any, headers: Record<string, string> = {}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
    headers: {
      get: jest.fn((key: string) => headers[key.toLowerCase()] || null),
    },
    url: 'http://localhost:3000/api/webhooks/stripe',
  } as any;
}

describe('POST /api/webhooks/stripe', () => {
  let mockProvider: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Мокаем PaymentFactory
    mockProvider = {
      verifyWebhook: jest.fn(),
      processWebhook: jest.fn(),
    };
    (PaymentFactory.getProvider as jest.Mock) = jest.fn().mockReturnValue(mockProvider);
  });

  describe('Успешная обработка вебхука', () => {
    it('должен обновить статус заказа на COMPLETED при успешном платеже', async () => {
      // Arrange
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
              order_id: 'order123',
              user_id: 'user123',
            },
          },
        },
      };

      const existingOrder = {
        id: 'order123',
        userId: 'user123',
        amount: 1000,
        currency: 'USD',
        status: 'PENDING',
        paymentProvider: 'stripe',
        externalId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedOrder = {
        ...existingOrder,
        status: 'COMPLETED',
        externalId: 'cs_test_123',
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order123',
        status: 'completed',
        amount: 1000,
        currency: 'USD',
        externalId: 'cs_test_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=signature_hash',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Webhook processed successfully');

      expect(mockProvider.verifyWebhook).toHaveBeenCalled();
      expect(mockProvider.processWebhook).toHaveBeenCalledWith(webhookPayload);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order123' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order123' },
        data: {
          status: 'COMPLETED',
          externalId: 'cs_test_123',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('должен обновить статус заказа на FAILED при неудачном платеже', async () => {
      // Arrange
      const webhookPayload = {
        id: 'evt_456',
        type: 'checkout.session.async_payment_failed',
        data: {
          object: {
            id: 'cs_test_456',
            object: 'checkout.session',
            amount_total: 2000,
            currency: 'eur',
            payment_status: 'unpaid',
            metadata: {
              order_id: 'order456',
              user_id: 'user456',
            },
          },
        },
      };

      const existingOrder = {
        id: 'order456',
        userId: 'user456',
        amount: 2000,
        currency: 'EUR',
        status: 'PENDING',
        paymentProvider: 'stripe',
        externalId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order456',
        status: 'failed',
        amount: 2000,
        currency: 'EUR',
        externalId: 'cs_test_456',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue({
        ...existingOrder,
        status: 'FAILED',
        externalId: 'cs_test_456',
      });

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=signature_hash',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order456' },
        data: {
          status: 'FAILED',
          externalId: 'cs_test_456',
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Идемпотентность', () => {
    it('должен вернуть 200 OK если заказ уже обработан', async () => {
      // Arrange
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
              order_id: 'order123',
              user_id: 'user123',
            },
          },
        },
      };

      const existingOrder = {
        id: 'order123',
        userId: 'user123',
        amount: 1000,
        currency: 'USD',
        status: 'COMPLETED', // Уже обработан
        paymentProvider: 'stripe',
        externalId: 'cs_test_123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order123',
        status: 'completed',
        amount: 1000,
        currency: 'USD',
        externalId: 'cs_test_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=signature_hash',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Order already processed');

      // Проверяем, что update НЕ был вызван
      expect(prisma.order.update).not.toHaveBeenCalled();
    });
  });

  describe('Ошибки верификации', () => {
    it('должен вернуть 401 если заголовок Stripe-Signature отсутствует', async () => {
      // Arrange
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
              order_id: 'order123',
            },
          },
        },
      };

      const request = createMockRequest(webhookPayload); // Без заголовка

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Missing signature header');

      // Проверяем, что verifyWebhook НЕ был вызван
      expect(mockProvider.verifyWebhook).not.toHaveBeenCalled();
    });

    it('должен вернуть 401 если подпись вебхука невалидна', async () => {
      // Arrange
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
              order_id: 'order123',
            },
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(false);

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=invalid_signature',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid webhook signature');

      // Проверяем, что processWebhook НЕ был вызван
      expect(mockProvider.processWebhook).not.toHaveBeenCalled();
    });
  });

  describe('Ошибки обработки', () => {
    it('должен вернуть 400 если заказ не найден', async () => {
      // Arrange
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
              order_id: 'nonexistent_order',
            },
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'nonexistent_order',
        status: 'completed',
        amount: 1000,
        currency: 'USD',
        externalId: 'cs_test_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=signature_hash',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Order not found');
    });

    it('должен вернуть 500 при ошибке обработки', async () => {
      // Arrange
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
              order_id: 'order123',
            },
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockRejectedValue(new Error('Processing error'));

      const request = createMockRequest(webhookPayload, {
        'stripe-signature': 't=1234567890,v1=signature_hash',
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });
});

  it('должен создать Purchase при успешном платеже с serviceId', async () => {
    // Arrange
    const webhookPayload = {
      id: 'evt_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          object: 'checkout.session',
          amount_total: 49000,
          currency: 'rub',
          payment_status: 'paid',
          metadata: {
            order_id: 'order123',
            user_id: 'user123',
            service_id: 'full_pythagorean',
          },
        },
      },
    };

    const existingOrder = {
      id: 'order123',
      userId: 'user123',
      amount: 49000,
      currency: 'RUB',
      status: 'PENDING',
      paymentProvider: 'stripe',
      serviceId: 'full_pythagorean',
      externalId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedOrder = {
      ...existingOrder,
      status: 'COMPLETED',
      externalId: 'cs_test_123',
      updatedAt: new Date(),
    };

    const createdPurchase = {
      id: 'purchase123',
      userId: 'user123',
      serviceId: 'full_pythagorean',
      orderId: 'order123',
      createdAt: new Date(),
      expiresAt: null,
    };

    mockProvider.verifyWebhook.mockReturnValue(true);
    mockProvider.processWebhook.mockResolvedValue({
      orderId: 'order123',
      status: 'completed',
      amount: 49000,
      currency: 'RUB',
      externalId: 'cs_test_123',
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
    (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);
    (prisma.purchase.create as jest.Mock).mockResolvedValue(createdPurchase);

    const request = createMockRequest(webhookPayload, {
      'stripe-signature': 't=1234567890,v1=signature_hash',
    });

    // Act
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    
    // Проверяем, что Purchase был создан
    expect(prisma.purchase.create).toHaveBeenCalledWith({
      data: {
        userId: 'user123',
        serviceId: 'full_pythagorean',
        orderId: 'order123',
      },
    });
  });
