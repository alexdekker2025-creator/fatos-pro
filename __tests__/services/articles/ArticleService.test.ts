/**
 * Unit тесты для ArticleService
 */

import { ArticleService } from '@/lib/services/articles/ArticleService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('ArticleService', () => {
  let articleService: ArticleService;

  beforeEach(() => {
    articleService = new ArticleService();
    jest.clearAllMocks();
  });

  describe('getArticlesByRelatedValue', () => {
    it('должен получить статьи по relatedValue', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          content: 'Test content',
          category: 'destiny_number',
          language: 'ru',
          relatedValue: 'destiny_5',
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.article.findMany as jest.Mock).mockResolvedValue(mockArticles);

      const result = await articleService.getArticlesByRelatedValue('destiny_5', 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'destiny_5',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticles);
    });

    it('должен использовать язык по умолчанию (ru)', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      await articleService.getArticlesByRelatedValue('destiny_5');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'destiny_5',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
    });

    it('должен вернуть пустой массив, если статьи не найдены', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      const result = await articleService.getArticlesByRelatedValue('destiny_999', 'ru');

      expect(result).toEqual([]);
    });
  });

  describe('getDestinyNumberArticle', () => {
    it('должен получить статью для числа судьбы', async () => {
      const mockArticle = {
        id: '1',
        title: 'Destiny 5',
        content: 'Content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: 'destiny_5',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

      const result = await articleService.getDestinyNumberArticle(5, 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'destiny_5',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticle);
    });

    it('должен вернуть null, если статья не найдена', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      const result = await articleService.getDestinyNumberArticle(999, 'ru');

      expect(result).toBeNull();
    });

    it('должен работать с мастер-числами', async () => {
      const mockArticle = {
        id: '1',
        title: 'Destiny 11',
        content: 'Content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: 'destiny_11',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

      const result = await articleService.getDestinyNumberArticle(11, 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'destiny_11',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticle);
    });
  });

  describe('getMatrixPositionArticle', () => {
    it('должен получить статью для позиции матрицы', async () => {
      const mockArticle = {
        id: '1',
        title: 'Day Number 5',
        content: 'Content',
        category: 'matrix_position',
        language: 'ru',
        relatedValue: 'matrix_dayNumber_5',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

      const result = await articleService.getMatrixPositionArticle('dayNumber', 5, 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'matrix_dayNumber_5',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticle);
    });

    it('должен вернуть null, если статья не найдена', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      const result = await articleService.getMatrixPositionArticle('dayNumber', 999, 'ru');

      expect(result).toBeNull();
    });
  });

  describe('getSquareCellArticle', () => {
    it('должен получить статью для ячейки квадрата', async () => {
      const mockArticle = {
        id: '1',
        title: 'Square 1 (3)',
        content: 'Content',
        category: 'square_cell',
        language: 'ru',
        relatedValue: 'square_1_3',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

      const result = await articleService.getSquareCellArticle(1, 3, 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'square_1_3',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticle);
    });

    it('должен вернуть null, если статья не найдена', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      const result = await articleService.getSquareCellArticle(1, 999, 'ru');

      expect(result).toBeNull();
    });

    it('должен работать с нулевым количеством', async () => {
      const mockArticle = {
        id: '1',
        title: 'Square 1 (0)',
        content: 'Content',
        category: 'square_cell',
        language: 'ru',
        relatedValue: 'square_1_0',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

      const result = await articleService.getSquareCellArticle(1, 0, 'ru');

      expect(prisma.article.findMany).toHaveBeenCalledWith({
        where: {
          relatedValue: 'square_1_0',
          language: 'ru',
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(result).toEqual(mockArticle);
    });
  });

  describe('getArticlesForCalculation', () => {
    it('должен получить все статьи для результатов расчетов', async () => {
      const mockDestinyArticle = {
        id: '1',
        title: 'Destiny 5',
        content: 'Content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: 'destiny_5',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      const mockMatrixArticle = {
        id: '2',
        title: 'Day Number 5',
        content: 'Content',
        category: 'matrix_position',
        language: 'ru',
        relatedValue: 'matrix_dayNumber_5',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSquareArticle = {
        id: '3',
        title: 'Square 1 (3)',
        content: 'Content',
        category: 'square_cell',
        language: 'ru',
        relatedValue: 'square_1_3',
        publishedAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.article.findMany as jest.Mock)
        .mockResolvedValueOnce([mockDestinyArticle])
        .mockResolvedValueOnce([mockMatrixArticle])
        .mockResolvedValueOnce([mockSquareArticle]);

      const results = {
        destinyNumber: { value: 5 },
        matrix: { positions: new Map([['dayNumber', 5]]) },
        square: { digitCounts: new Map([[1, 3]]) },
      };

      const result = await articleService.getArticlesForCalculation(results, 'ru');

      expect(result.destinyArticle).toEqual(mockDestinyArticle);
      expect(result.matrixArticles.get('dayNumber')).toEqual(mockMatrixArticle);
      expect(result.squareArticles.get(1)).toEqual(mockSquareArticle);
    });

    it('должен вернуть null для отсутствующих статей', async () => {
      (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

      const results = {
        destinyNumber: { value: 999 },
        matrix: { positions: new Map([['dayNumber', 999]]) },
        square: { digitCounts: new Map([[1, 999]]) },
      };

      const result = await articleService.getArticlesForCalculation(results, 'ru');

      expect(result.destinyArticle).toBeNull();
      expect(result.matrixArticles.get('dayNumber')).toBeNull();
      expect(result.squareArticles.get(1)).toBeNull();
    });

    it('должен обработать пустые результаты', async () => {
      const results = {};

      const result = await articleService.getArticlesForCalculation(results, 'ru');

      expect(result.destinyArticle).toBeNull();
      expect(result.matrixArticles.size).toBe(0);
      expect(result.squareArticles.size).toBe(0);
    });
  });
});
