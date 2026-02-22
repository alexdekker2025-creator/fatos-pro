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
 * Расширенная статистика платформы с временными рядами
 */
export interface EnhancedPlatformStatistics extends PlatformStatistics {
  activeUsers7Days: number;
  activeUsers30Days: number;
  emailVerificationRate: number;
  twoFactorAdoptionRate: number;
  blockedUsersCount: number;
  userGrowthData: TimeSeriesDataPoint[];
  calculationTrendsData: TimeSeriesDataPoint[];
  revenueTrendsData: TimeSeriesDataPoint[];
  oauthUsageData: CategoryDataPoint[];
  generatedAt: string;
  timeRange: string;
}

/**
 * Точка данных временного ряда
 */
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

/**
 * Точка данных категории
 */
export interface CategoryDataPoint {
  category: string;
  value: number;
  percentage?: number;
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
   * Получить расширенную статистику платформы с временными рядами
   * 
   * @param timeRange - Временной диапазон (7d, 30d, 90d, all, custom)
   * @param startDate - Начальная дата для custom диапазона
   * @param endDate - Конечная дата для custom диапазона
   * @returns Расширенная статистика
   */
  async getEnhancedStatistics(
    timeRange: '7d' | '30d' | '90d' | 'all' | 'custom' = '30d',
    startDate?: Date,
    endDate?: Date
  ): Promise<EnhancedPlatformStatistics> {
    // Определяем временные границы
    let rangeStart: Date;
    let rangeEnd: Date = new Date();

    if (timeRange === 'custom' && startDate && endDate) {
      rangeStart = startDate;
      rangeEnd = endDate;
    } else if (timeRange === 'all') {
      rangeStart = new Date(0); // Начало эпохи Unix
    } else {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      rangeStart = new Date();
      rangeStart.setDate(rangeStart.getDate() - days);
    }

    // Даты для активных пользователей
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Параллельные запросы для базовой статистики
    const [
      totalUsers,
      totalCalculations,
      totalOrders,
      completedOrders,
      totalArticles,
      recentUsers,
      recentCalculations,
      orders,
      blockedUsersCount,
      emailVerifiedCount,
      twoFactorEnabledCount,
      activeUsers7DaysCount,
      activeUsers30DaysCount,
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
        select: { amount: true, createdAt: true },
      }),
      prisma.user.count({ where: { isBlocked: true } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { twoFactorEnabled: true } }),
      // Активные пользователи - те, у кого есть сессия в последние 7 дней
      prisma.user.count({
        where: {
          sessions: {
            some: {
              createdAt: { gte: sevenDaysAgo }
            }
          }
        }
      }),
      // Активные пользователи - те, у кого есть сессия в последние 30 дней
      prisma.user.count({
        where: {
          sessions: {
            some: {
              createdAt: { gte: thirtyDaysAgo }
            }
          }
        }
      }),
    ]);

    // Вычисляем общий доход
    const totalRevenue = orders.reduce((sum: number, order: { amount: any }) => {
      return sum + Number(order.amount);
    }, 0);

    // Вычисляем проценты
    const emailVerificationRate = totalUsers > 0 
      ? Math.round((emailVerifiedCount / totalUsers) * 100 * 100) / 100 
      : 0;
    const twoFactorAdoptionRate = totalUsers > 0 
      ? Math.round((twoFactorEnabledCount / totalUsers) * 100 * 100) / 100 
      : 0;

    // Генерируем данные временных рядов для роста пользователей
    const userGrowthData = await this.generateUserGrowthData(rangeStart, rangeEnd);

    // Генерируем данные временных рядов для трендов расчетов
    const calculationTrendsData = await this.generateCalculationTrendsData(rangeStart, rangeEnd);

    // Генерируем данные временных рядов для трендов доходов
    const revenueTrendsData = await this.generateRevenueTrendsData(rangeStart, rangeEnd);

    // Генерируем данные использования OAuth
    const oauthUsageData = await this.generateOAuthUsageData();

    return {
      // Базовая статистика
      totalUsers,
      totalCalculations,
      totalOrders,
      completedOrders,
      totalRevenue,
      totalArticles,
      recentUsers,
      recentCalculations,
      
      // Новые метрики
      activeUsers7Days: activeUsers7DaysCount,
      activeUsers30Days: activeUsers30DaysCount,
      emailVerificationRate,
      twoFactorAdoptionRate,
      blockedUsersCount,
      
      // Данные временных рядов
      userGrowthData,
      calculationTrendsData,
      revenueTrendsData,
      oauthUsageData,
      
      // Метаданные
      generatedAt: new Date().toISOString(),
      timeRange: timeRange === 'custom' ? `${startDate?.toISOString()}_${endDate?.toISOString()}` : timeRange,
    };
  }

  /**
   * Генерировать данные роста пользователей
   */
  private async generateUserGrowthData(startDate: Date, endDate: Date): Promise<TimeSeriesDataPoint[]> {
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Группируем по датам
    const dataByDate = new Map<string, number>();
    
    users.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      dataByDate.set(dateKey, (dataByDate.get(dateKey) || 0) + 1);
    });

    // Преобразуем в массив с накопительным итогом
    let cumulativeCount = 0;
    const result: TimeSeriesDataPoint[] = [];
    
    // Получаем начальное количество пользователей до startDate
    const initialCount = await prisma.user.count({
      where: {
        createdAt: {
          lt: startDate,
        }
      }
    });
    cumulativeCount = initialCount;

    // Создаем точки данных для каждого дня в диапазоне
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dailyCount = dataByDate.get(dateKey) || 0;
      cumulativeCount += dailyCount;
      
      result.push({
        date: dateKey,
        value: cumulativeCount,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  /**
   * Генерировать данные трендов расчетов
   */
  private async generateCalculationTrendsData(startDate: Date, endDate: Date): Promise<TimeSeriesDataPoint[]> {
    const calculations = await prisma.calculation.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Группируем по датам
    const dataByDate = new Map<string, number>();
    
    calculations.forEach(calc => {
      const dateKey = calc.createdAt.toISOString().split('T')[0];
      dataByDate.set(dateKey, (dataByDate.get(dateKey) || 0) + 1);
    });

    // Создаем точки данных для каждого дня в диапазоне
    const result: TimeSeriesDataPoint[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dailyCount = dataByDate.get(dateKey) || 0;
      
      result.push({
        date: dateKey,
        value: dailyCount,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  /**
   * Генерировать данные трендов доходов
   */
  private async generateRevenueTrendsData(startDate: Date, endDate: Date): Promise<TimeSeriesDataPoint[]> {
    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      }
    });

    // Группируем по датам
    const dataByDate = new Map<string, number>();
    
    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      const currentAmount = dataByDate.get(dateKey) || 0;
      dataByDate.set(dateKey, currentAmount + Number(order.amount));
    });

    // Создаем точки данных для каждого дня в диапазоне
    const result: TimeSeriesDataPoint[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dailyRevenue = dataByDate.get(dateKey) || 0;
      
      result.push({
        date: dateKey,
        value: Math.round(dailyRevenue * 100) / 100, // Округляем до 2 знаков
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  }

  /**
   * Генерировать данные использования OAuth
   */
  private async generateOAuthUsageData(): Promise<CategoryDataPoint[]> {
    const oauthProviders = await prisma.oAuthProvider.groupBy({
      by: ['provider'],
      _count: {
        provider: true,
      }
    });

    const totalOAuthUsers = oauthProviders.reduce((sum, p) => sum + p._count.provider, 0);

    return oauthProviders.map(p => ({
      category: p.provider,
      value: p._count.provider,
      percentage: totalOAuthUsers > 0 
        ? Math.round((p._count.provider / totalOAuthUsers) * 100 * 100) / 100 
        : 0,
    }));
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
