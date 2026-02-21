/**
 * Тесты для API эндпоинта статистики
 */

import { GET } from '@/app/api/admin/statistics/route';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';
import { NextRequest } from 'next/server';

// Моки
jest.mock('@/lib/services/admin');
jest.mock('@/lib/services/auth');

const mockAdminService = AdminService as jest.MockedClass<typeof AdminService>;
const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Admin Statistics API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/statistics', () => {
    it('должен вернуть 401 если нет сессии', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/statistics');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('должен вернуть 403 если пользователь не администратор', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
        headers: {
          cookie: 'session=valid_token',
        },
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'user123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(false);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden: Admin access required');
    });

    it('должен вернуть статистику для администратора', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/statistics', {
        headers: {
          cookie: 'session=valid_token',
        },
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockStatistics = {
        totalUsers: 1250,
        totalCalculations: 5430,
        totalOrders: 320,
        completedOrders: 305,
        totalRevenue: 152500.00,
        totalArticles: 45,
        recentUsers: 87,
        recentCalculations: 432,
      };

      mockAdminService.prototype.getStatistics.mockResolvedValue(mockStatistics);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.totalUsers).toBe(1250);
      expect(data.totalRevenue).toBe(152500.00);
      expect(data.totalArticles).toBe(45);
    });
  });
});
