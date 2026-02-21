/**
 * Тесты для API эндпоинтов управления статьями
 */

import { GET, POST } from '@/app/api/admin/articles/route';
import { PUT, DELETE } from '@/app/api/admin/articles/[id]/route';
import { AdminService } from '@/lib/services/admin';
import { AuthService } from '@/lib/services/auth';
import { NextRequest } from 'next/server';

// Моки
jest.mock('@/lib/services/admin');
jest.mock('@/lib/services/auth');

const mockAdminService = AdminService as jest.MockedClass<typeof AdminService>;
const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Admin Articles API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/articles', () => {
    it('должен вернуть 401 если нет сессии', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles');
      
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('должен вернуть 403 если пользователь не администратор', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
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

    it('должен вернуть список статей для администратора', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles?limit=10', {
        headers: {
          cookie: 'session=valid_token',
        },
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockArticles = {
        articles: [
          {
            id: 'article1',
            title: 'Test Article',
            content: 'Content',
            category: 'destiny_number',
            language: 'ru',
            relatedValue: '1',
            publishedAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        total: 1,
        limit: 10,
        offset: 0,
      };

      mockAdminService.prototype.getArticles.mockResolvedValue(mockArticles);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.articles).toHaveLength(1);
      expect(data.total).toBe(1);
    });
  });

  describe('POST /api/admin/articles', () => {
    it('должен создать статью для администратора', async () => {
      const articleData = {
        title: 'New Article',
        content: 'Article content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: '1',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'session=valid_token',
        },
        body: JSON.stringify(articleData),
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockArticle = {
        id: 'article1',
        ...articleData,
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      mockAdminService.prototype.createArticle.mockResolvedValue(mockArticle);

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe('New Article');
      expect(mockAdminService.prototype.createArticle).toHaveBeenCalledWith(
        articleData,
        'admin123'
      );
    });
  });

  describe('PUT /api/admin/articles/[id]', () => {
    it('должен обновить статью для администратора', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      const request = new NextRequest('http://localhost:3000/api/admin/articles/article1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'session=valid_token',
        },
        body: JSON.stringify(updateData),
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      const mockArticle = {
        id: 'article1',
        title: 'Updated Title',
        content: 'Content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: '1',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      mockAdminService.prototype.updateArticle.mockResolvedValue(mockArticle);

      const response = await PUT(request, { params: { id: 'article1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated Title');
    });

    it('должен вернуть 404 если статья не найдена', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles/nonexistent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          cookie: 'session=valid_token',
        },
        body: JSON.stringify({ title: 'Updated' }),
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      mockAdminService.prototype.updateArticle.mockRejectedValue(
        new Error('Article not found')
      );

      const response = await PUT(request, { params: { id: 'nonexistent' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Article not found');
    });
  });

  describe('DELETE /api/admin/articles/[id]', () => {
    it('должен удалить статью для администратора', async () => {
      const request = new NextRequest('http://localhost:3000/api/admin/articles/article1', {
        method: 'DELETE',
        headers: {
          cookie: 'session=valid_token',
        },
      });

      mockAuthService.prototype.verifySession.mockResolvedValue({
        userId: 'admin123',
        expiresAt: new Date(Date.now() + 86400000),
      });

      mockAdminService.prototype.isAdmin.mockResolvedValue(true);

      mockAdminService.prototype.deleteArticle.mockResolvedValue(undefined);

      const response = await DELETE(request, { params: { id: 'article1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockAdminService.prototype.deleteArticle).toHaveBeenCalledWith(
        'article1',
        'admin123'
      );
    });
  });
});
