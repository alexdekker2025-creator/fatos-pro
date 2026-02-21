/**
 * Unit-тесты для API-эндпоинта создания платежа
 */

import { POST } from '@/app/api/payments/create/route';
import { AuthService } from '@/lib/services/auth/AuthService';
import { PaymentFactory } from '@/lib/services/payment';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/services/auth/AuthService');
jest.mock('@/lib/services/payment');
jest.mock('@/lib/prisma', () => ({
  prisma: { order: { create: jest.fn(), update: jest.fn() } },
}));

function createMockRequest(body: any, headers: Record<string, string> = {}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    headers: { get: jest.fn((key: string) => headers[key.toLowerCase()] || null) },
    url: 'http://localhost:3000/api/payments/create',
  } as any;
}

describe('POST /api/payments/create', () => {
  let mockVerifySession: jest.Mock;
  let mockProvider: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifySession = jest.fn();
    AuthService.prototype.verifySession = mockVerifySession;
    mockProvider = { createSession: jest.fn() };
    (PaymentFactory.getRegionFromCountryCode as jest.Mock) = jest.fn();
    (PaymentFactory.getProviderType as jest.Mock) = jest.fn();
    (PaymentFactory.getProvider as jest.Mock) = jest.fn().mockReturnValue(mockProvider);
  });

  it('должен создать заказ для RU региона', async () => {
    mockVerifySession.mockResolvedValue({ id: 'user123', email: 'test@example.com', name: 'Test' });
    (PaymentFactory.getRegionFromCountryCode as jest.Mock).mockReturnValue('RU');
    (PaymentFactory.getProviderType as jest.Mock).mockReturnValue('yukassa');
    mockProvider.createSession.mockResolvedValue({
      id: 'session123', url: 'https://yukassa.ru/checkout/session123', expiresAt: new Date(),
    });
    (prisma.order.create as jest.Mock).mockResolvedValue({
      id: 'order123', userId: 'user123', amount: 1000, currency: 'RUB',
      status: 'PENDING', paymentProvider: 'yukassa', createdAt: new Date(), updatedAt: new Date(),
    });
    (prisma.order.update as jest.Mock).mockResolvedValue({});

    const request = createMockRequest(
      { amount: 1000, currency: 'RUB', countryCode: 'RU' },
      { authorization: 'Bearer valid-session-id' }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it('должен вернуть 401 без заголовка Authorization', async () => {
    const request = createMockRequest({ amount: 1000, currency: 'RUB', countryCode: 'RU' });
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Authorization header is required');
  });
});
