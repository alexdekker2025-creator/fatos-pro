/**
 * Unit-тесты для API-эндпоинта получения покупок
 */

import { GET } from '@/app/api/purchases/route';
import { AuthService } from '@/lib/services/auth/AuthService';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/services/auth/AuthService');
jest.mock('@/lib/prisma', () => ({
  prisma: {
    purchase: {
      findMany: jest.fn(),
    },
  },
}));

function createMockRequest(headers: Record<string, string> = {}) {
  return {
    headers: {
      get: jest.fn((key: string) => headers[key.toLowerCase()] || null),
    },
    url: 'http://localhost:3000/api/purchases',
  } as any;
}

describe('GET /api/purchases', () => {
  let mockVerifySession: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockVerifySession = jest.fn();
    AuthService.prototype.verifySession = mockVerifySession;
  });

  it('должен вернуть список покупок пользователя', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test' };
    const mockPurchases = [
      {
        id: 'purchase1',
        userId: 'user123',
        serviceId: 'full_pythagorean',
        orderId: 'order1',
        createdAt: new Date('2026-02-21T10:00:00.000Z'),
        expiresAt: null,
      },
      {
        id: 'purchase2',
        userId: 'user123',
        serviceId: 'destiny_matrix',
        orderId: 'order2',
        createdAt: new Date('2026-02-20T10:00:00.000Z'),
        expiresAt: null,
      },
    ];

    mockVerifySession.mockResolvedValue(mockUser);
    (prisma.purchase.findMany as jest.Mock).mockResolvedValue(mockPurchases);

    const request = createMockRequest({
      authorization: 'Bearer valid-session-id',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.purchases).toHaveLength(2);
    expect(data.purchases[0].serviceId).toBe('full_pythagorean');
    expect(data.purchases[1].serviceId).toBe('destiny_matrix');

    expect(prisma.purchase.findMany).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('должен вернуть пустой массив, если у пользователя нет покупок', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test' };

    mockVerifySession.mockResolvedValue(mockUser);
    (prisma.purchase.findMany as jest.Mock).mockResolvedValue([]);

    const request = createMockRequest({
      authorization: 'Bearer valid-session-id',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.purchases).toHaveLength(0);
  });

  it('должен вернуть 401 без заголовка Authorization', async () => {
    const request = createMockRequest();

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Authorization header is required');
  });

  it('должен вернуть 401 с невалидным sessionId', async () => {
    mockVerifySession.mockResolvedValue(null);

    const request = createMockRequest({
      authorization: 'Bearer invalid-session-id',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid or expired session');
  });

  it('должен вернуть 500 при ошибке базы данных', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test' };

    mockVerifySession.mockResolvedValue(mockUser);
    (prisma.purchase.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error')
    );

    const request = createMockRequest({
      authorization: 'Bearer valid-session-id',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Internal server error');
  });

  it('должен правильно форматировать даты в ISO формат', async () => {
    const mockUser = { id: 'user123', email: 'test@example.com', name: 'Test' };
    const createdAt = new Date('2026-02-21T10:00:00.000Z');
    const expiresAt = new Date('2027-02-21T10:00:00.000Z');

    const mockPurchases = [
      {
        id: 'purchase1',
        userId: 'user123',
        serviceId: 'full_pythagorean',
        orderId: 'order1',
        createdAt,
        expiresAt,
      },
    ];

    mockVerifySession.mockResolvedValue(mockUser);
    (prisma.purchase.findMany as jest.Mock).mockResolvedValue(mockPurchases);

    const request = createMockRequest({
      authorization: 'Bearer valid-session-id',
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.purchases[0].createdAt).toBe(createdAt.toISOString());
    expect(data.purchases[0].expiresAt).toBe(expiresAt.toISOString());
  });
});
