/**
 * Тесты для API эндпоинта логов администратора
 */

import { GET } from '@/app/api/admin/logs/route';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';
import { NextRequest } from 'next/server';

// Моки
jest.mock('@/lib/services/admin');
jest.mock('@/lib/services/auth');

const mockAdminService = AdminService as jest.MockedClass<typeof AdminService>;
const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Admin Logs API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/logs', () => {
    it('должен вернуть 401 если нет сессии', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/logs');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('должен вернуть 403 если пользователь не администратор', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/logs', {
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

    it('должен вернуть логи для администратора', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/logs?limit=20', {
        headers: {
          cookie: 'session=valid_token',
        },
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockLogs = {
        logs: [
          {
            id: 'log1',
            adminId: 'admin123',
            action: 'CREATE_ARTICLE',
            details: {
              articleId: 'article1',
              title: 'Test Article',
              category: 'destiny_number',
            },
            createdAt: new Date(),
            admin: {
              id: 'admin123',
              email: 'admin@fatos.pro',
              name: 'Admin User',
            },
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
      };

      mockAdminService.prototype.getAdminLogs.mockResolvedValue(mockLogs);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.logs).toHaveLength(1);
      expect(data.logs[0].action).toBe('CREATE_ARTICLE');
      expect(data.total).toBe(1);
    });

    it('должен поддерживать фильтрацию по adminId и action', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/admin/logs?adminId=admin123&action=CREATE_ARTICLE',
        {
          headers: {
            cookie: 'session=valid_token',
          },
        }
      );

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockLogs = {
        logs: [],
        total: 0,
        limit: 50,
        offset: 0,
      };

      mockAdminService.prototype.getAdminLogs.mockResolvedValue(mockLogs);

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockAdminService.prototype.getAdminLogs).toHaveBeenCalledWith({
        adminId: 'admin123',
        action: 'CREATE_ARTICLE',
        limit: 50,
        offset: 0,
      });
    });
  });
});
