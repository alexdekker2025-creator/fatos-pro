/**
 * Admin Service
 * 
 * Сервис для управления административными функциями платформы
 */

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * Схема валидации для создания статьи
 */
export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  language: z.enum(['ru', 'en'], { errorMap: () => ({ message: 'Language must be ru or en' }) }),
  relatedValue: z.string().optional(),
});

/**
 * Схема валидации для обновления статьи
 */
export const UpdateArticleSchema = CreateArticleSchema.partial();

/**
 * Тип данных для создания статьи
 */
export type CreateArticleData = z.infer<typeof CreateArticleSchema>;

/**
 * Тип данных для обновления статьи
 */
export type UpdateArticleData = z.infer<typeof UpdateArticleSchema>;

/**
 * Статистика платформы
 */
export interface PlatformStatistics {
  totalUsers: number;
  totalCalculations: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalArticles: number;
  recentUsers: number; // За последние 30 дней
  recentCalculations: number; // За последние 30 дней
}

/**
 * Сервис администрирования
 */
export class AdminService {
  /**
   * Проверить, является ли пользователь администратором
   * 
   * @param userId - ID пользователя
   * @returns true если пользователь администратор
   */
  async isAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  }

  /**
   * Создать статью
   * 
   * @param data - Данные статьи
   * @param adminId - ID администратора
   * @returns Созданная статья
   */
  async createArticle(data: CreateArticleData, adminId: string) {
    // Валидируем данные
    const validatedData = CreateArticleSchema.parse(data);

    // Создаем статью
    const article = await prisma.article.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        language: validatedData.language,
        relatedValue: validatedData.relatedValue || null,
      },
    });

    // Логируем действие
    await this.logAction(adminId, 'CREATE_ARTICLE', {
      articleId: article.id,
      title: article.title,
      category: article.category,
    });

    return article;
  }

  /**
   * Обновить статью
   * 
   * @param articleId - ID статьи
   * @param data - Данные для обновления
   * @param adminId - ID администратора
   * @returns Обновленная статья
   */
  async updateArticle(articleId: string, data: UpdateArticleData, adminId: string) {
    // Валидируем данные
    const validatedData = UpdateArticleSchema.parse(data);

    // Проверяем существование статьи
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      throw new Error('Article not found');
    }

    // Обновляем статью
    const article = await prisma.article.update({
      where: { id: articleId },
      data: validatedData,
    });

    // Логируем действие
    await this.logAction(adminId, 'UPDATE_ARTICLE', {
      articleId: article.id,
      title: article.title,
      changes: validatedData,
    });

    return article;
  }

  /**
   * Удалить статью
   * 
   * @param articleId - ID статьи
   * @param adminId - ID администратора
   */
  async deleteArticle(articleId: string, adminId: string) {
    // Проверяем существование статьи
    const existingArticle = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!existingArticle) {
      throw new Error('Article not found');
    }

    // Удаляем статью
    await prisma.article.delete({
      where: { id: articleId },
    });

    // Логируем действие
    await this.logAction(adminId, 'DELETE_ARTICLE', {
      articleId,
      title: existingArticle.title,
    });
  }

  /**
   * Получить список статей
   * 
   * @param filters - Фильтры для поиска
   * @returns Список статей
   */
  async getArticles(filters?: {
    category?: string;
    language?: string;
    relatedValue?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.language) {
      where.language = filters.language;
    }

    if (filters?.relatedValue) {
      where.relatedValue = filters.relatedValue;
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    const total = await prisma.article.count({ where });

    return {
      articles,
      total,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    };
  }

  /**
   * Получить статистику платформы
   * 
   * @returns Статистика
   */
  async getStatistics(): Promise<PlatformStatistics> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Параллельные запросы для оптимизации
    const [
      totalUsers,
      totalCalculations,
      totalOrders,
      completedOrders,
      totalArticles,
      recentUsers,
      recentCalculations,
      orders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.calculation.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.article.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.calculation.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.order.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }),
    ]);

    // Вычисляем общий доход
    const totalRevenue = orders.reduce((sum: number, order: { amount: any }) => {
      return sum + Number(order.amount);
    }, 0);

    return {
      totalUsers,
      totalCalculations,
      totalOrders,
      completedOrders,
      totalRevenue,
      totalArticles,
      recentUsers,
      recentCalculations,
    };
  }

  /**
   * Логировать действие администратора
   * 
   * @param adminId - ID администратора
   * @param action - Действие
   * @param details - Детали действия
   */
  async logAction(adminId: string, action: string, details?: any) {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        details: details || {},
      },
    });
  }

  /**
   * Получить логи действий администратора
   * 
   * @param filters - Фильтры
   * @returns Логи
   */
  async getAdminLogs(filters?: {
    adminId?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters?.adminId) {
      where.adminId = filters.adminId;
    }

    if (filters?.action) {
      where.action = filters.action;
    }

    const logs = await prisma.adminLog.findMany({
      where,
      include: {
        admin: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    const total = await prisma.adminLog.count({ where });

    return {
      logs,
      total,
      limit: filters?.limit || 50,
      offset: filters?.offset || 0,
    };
  }
}
