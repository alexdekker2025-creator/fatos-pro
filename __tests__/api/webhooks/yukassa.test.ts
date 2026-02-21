/**
 * Unit-тесты для API-эндпоинта вебхуков ЮKassa
 * POST /api/webhooks/yukassa
 */

import { POST } from '@/app/api/webhooks/yukassa/route';
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
    url: 'http://localhost:3000/api/webhooks/yukassa',
  } as any;
}

describe('POST /api/webhooks/yukassa', () => {
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
            order_id: 'order123',
          },
        },
      };

      const existingOrder = {
        id: 'order123',
        userId: 'user123',
        amount: 1000,
        currency: 'RUB',
        status: 'PENDING',
        paymentProvider: 'yukassa',
        externalId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedOrder = {
        ...existingOrder,
        status: 'COMPLETED',
        externalId: 'payment_123',
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order123',
        status: 'completed',
        amount: 1000,
        currency: 'RUB',
        externalId: 'payment_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);

      const request = createMockRequest(webhookPayload);

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Webhook processed successfully');

      expect(mockProvider.verifyWebhook).toHaveBeenCalledWith(webhookPayload, '');
      expect(mockProvider.processWebhook).toHaveBeenCalledWith(webhookPayload);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order123' },
      });
      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order123' },
        data: {
          status: 'COMPLETED',
          externalId: 'payment_123',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('должен обновить статус заказа на FAILED при отмене платежа', async () => {
      // Arrange
      const webhookPayload = {
        type: 'notification',
        event: 'payment.canceled',
        object: {
          id: 'payment_456',
          status: 'canceled',
          paid: false,
          amount: {
            value: '20.00',
            currency: 'RUB',
          },
          metadata: {
            order_id: 'order456',
          },
        },
      };

      const existingOrder = {
        id: 'order456',
        userId: 'user456',
        amount: 2000,
        currency: 'RUB',
        status: 'PENDING',
        paymentProvider: 'yukassa',
        externalId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order456',
        status: 'failed',
        amount: 2000,
        currency: 'RUB',
        externalId: 'payment_456',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue({
        ...existingOrder,
        status: 'FAILED',
        externalId: 'payment_456',
      });

      const request = createMockRequest(webhookPayload);

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
          externalId: 'payment_456',
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('Идемпотентность', () => {
    it('должен вернуть 200 OK если заказ уже обработан', async () => {
      // Arrange
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
            order_id: 'order123',
          },
        },
      };

      const existingOrder = {
        id: 'order123',
        userId: 'user123',
        amount: 1000,
        currency: 'RUB',
        status: 'COMPLETED', // Уже обработан
        paymentProvider: 'yukassa',
        externalId: 'payment_123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'order123',
        status: 'completed',
        amount: 1000,
        currency: 'RUB',
        externalId: 'payment_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);

      const request = createMockRequest(webhookPayload);

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
    it('должен вернуть 401 если подпись вебхука невалидна', async () => {
      // Arrange
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
            order_id: 'order123',
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(false);

      const request = createMockRequest(webhookPayload);

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
            order_id: 'nonexistent_order',
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockResolvedValue({
        orderId: 'nonexistent_order',
        status: 'completed',
        amount: 1000,
        currency: 'RUB',
        externalId: 'payment_123',
      });
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      const request = createMockRequest(webhookPayload);

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
            order_id: 'order123',
          },
        },
      };

      mockProvider.verifyWebhook.mockReturnValue(true);
      mockProvider.processWebhook.mockRejectedValue(new Error('Processing error'));

      const request = createMockRequest(webhookPayload);

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
      type: 'notification',
      event: 'payment.succeeded',
      object: {
        id: 'payment123',
        status: 'succeeded',
        paid: true,
        amount: {
          value: '490.00',
          currency: 'RUB',
        },
        metadata: {
          order_id: 'order123',
          user_id: 'user123',
          service_id: 'full_pythagorean',
        },
      },
    };

    const existingOrder = {
      id: 'order123',
      userId: 'user123',
      amount: 49000,
      currency: 'RUB',
      status: 'PENDING',
      paymentProvider: 'yukassa',
      serviceId: 'full_pythagorean',
      externalId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedOrder = {
      ...existingOrder,
      status: 'COMPLETED',
      externalId: 'payment123',
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
      externalId: 'payment123',
    });
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(existingOrder);
    (prisma.order.update as jest.Mock).mockResolvedValue(updatedOrder);
    (prisma.purchase.create as jest.Mock).mockResolvedValue(createdPurchase);

    const request = createMockRequest(webhookPayload);

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
