/**
 * Property-based тесты для ArticleService
 * 
 * Feature: fatos-pro-platform, Property 17: Связывание статей с нумерологическими значениями
 * Валидирует: Требования 12.3, 12.4
 */

import fc from 'fast-check';
import { ArticleService } from '@/lib/services/articles/ArticleService';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    article: {
      findMany: jest.fn(),
    },
  },
}));

describe('ArticleService Property Tests', () => {
  let articleService: ArticleService;

  beforeEach(() => {
    articleService = new ArticleService();
    jest.clearAllMocks();
  });

  describe('Property 17: Связывание статей с нумерологическими значениями', () => {
    /**
     * Свойство: Для любой статьи с указанным relatedValue, система должна 
     * отображать эту статью при просмотре результатов расчетов, содержащих 
     * соответствующее значение.
     * 
     * Валидирует: Требования 12.3, 12.4
     */

    it('должен связывать статьи с числами судьбы для всех допустимых значений', async () => {
      await fc.assert(
        fc.asyncProperty(
          // Генерируем допустимые числа судьбы: 1-9, 11, 22, 33
          fc.oneof(
            fc.integer({ min: 1, max: 9 }),
            fc.constantFrom(11, 22, 33)
          ),
          fc.constantFrom('ru', 'en'),
          async (destinyNumber, language) => {
            const mockArticle = {
              id: `article-${destinyNumber}`,
              title: `Destiny ${destinyNumber}`,
              content: 'Test content',
              category: 'destiny_number',
              language,
              relatedValue: `destiny_${destinyNumber}`,
              publishedAt: new Date(),
              updatedAt: new Date(),
            };

            (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

            const result = await articleService.getDestinyNumberArticle(destinyNumber, language);

            // Проверяем, что запрос был выполнен с правильным relatedValue
            expect(prisma.article.findMany).toHaveBeenCalledWith({
              where: {
                relatedValue: `destiny_${destinyNumber}`,
                language,
              },
              orderBy: {
                publishedAt: 'desc',
              },
            });

            // Проверяем, что статья связана с правильным значением
            expect(result).not.toBeNull();
            expect(result?.relatedValue).toBe(`destiny_${destinyNumber}`);
            expect(result?.language).toBe(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('должен связывать статьи с позициями матрицы судьбы для всех допустимых комбинаций', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom(
            'dayNumber',
            'monthNumber',
            'yearNumber',
            'lifePathNumber',
            'personalityNumber',
            'soulNumber',
            'powerNumber',
            'karmicNumber'
          ),
          fc.oneof(
            fc.integer({ min: 1, max: 9 }),
            fc.constantFrom(11, 22, 33)
          ),
          fc.constantFrom('ru', 'en'),
          async (positionName, value, language) => {
            const mockArticle = {
              id: `article-${positionName}-${value}`,
              title: `Matrix ${positionName} ${value}`,
              content: 'Test content',
              category: 'matrix_position',
              language,
              relatedValue: `matrix_${positionName}_${value}`,
              publishedAt: new Date(),
              updatedAt: new Date(),
            };

            (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

            const result = await articleService.getMatrixPositionArticle(
              positionName,
              value,
              language
            );

            // Проверяем, что запрос был выполнен с правильным relatedValue
            expect(prisma.article.findMany).toHaveBeenCalledWith({
              where: {
                relatedValue: `matrix_${positionName}_${value}`,
                language,
              },
              orderBy: {
                publishedAt: 'desc',
              },
            });

            // Проверяем, что статья связана с правильным значением
            expect(result).not.toBeNull();
            expect(result?.relatedValue).toBe(`matrix_${positionName}_${value}`);
            expect(result?.language).toBe(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('должен связывать статьи с ячейками квадрата Пифагора для всех допустимых комбинаций', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 1, max: 9 }), // Цифры 1-9
          fc.integer({ min: 0, max: 10 }), // Количество повторений 0-10
          fc.constantFrom('ru', 'en'),
          async (digit, count, language) => {
            const mockArticle = {
              id: `article-square-${digit}-${count}`,
              title: `Square ${digit} (${count})`,
              content: 'Test content',
              category: 'square_cell',
              language,
              relatedValue: `square_${digit}_${count}`,
              publishedAt: new Date(),
              updatedAt: new Date(),
            };

            (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

            const result = await articleService.getSquareCellArticle(digit, count, language);

            // Проверяем, что запрос был выполнен с правильным relatedValue
            expect(prisma.article.findMany).toHaveBeenCalledWith({
              where: {
                relatedValue: `square_${digit}_${count}`,
                language,
              },
              orderBy: {
                publishedAt: 'desc',
              },
            });

            // Проверяем, что статья связана с правильным значением
            expect(result).not.toBeNull();
            expect(result?.relatedValue).toBe(`square_${digit}_${count}`);
            expect(result?.language).toBe(language);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('должен возвращать статьи для всех результатов расчетов с правильными связями', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            destinyNumber: fc.oneof(
              fc.integer({ min: 1, max: 9 }),
              fc.constantFrom(11, 22, 33)
            ),
            matrixPositions: fc.array(
              fc.record({
                name: fc.constantFrom('dayNumber', 'monthNumber', 'yearNumber'),
                value: fc.oneof(
                  fc.integer({ min: 1, max: 9 }),
                  fc.constantFrom(11, 22, 33)
                ),
              }),
              { minLength: 1, maxLength: 3 }
            ),
            squareCells: fc.array(
              fc.record({
                digit: fc.integer({ min: 1, max: 9 }),
                count: fc.integer({ min: 0, max: 5 }),
              }),
              { minLength: 1, maxLength: 3 }
            ),
          }),
          fc.constantFrom('ru', 'en'),
          async (calculationData, language) => {
            // Создаем моки для всех статей
            const mockArticles: any[] = [];

            // Мок для числа судьбы
            mockArticles.push({
              id: `destiny-${calculationData.destinyNumber}`,
              title: `Destiny ${calculationData.destinyNumber}`,
              content: 'Content',
              category: 'destiny_number',
              language,
              relatedValue: `destiny_${calculationData.destinyNumber}`,
              publishedAt: new Date(),
              updatedAt: new Date(),
            });

            // Моки для позиций матрицы
            calculationData.matrixPositions.forEach((pos) => {
              mockArticles.push({
                id: `matrix-${pos.name}-${pos.value}`,
                title: `Matrix ${pos.name} ${pos.value}`,
                content: 'Content',
                category: 'matrix_position',
                language,
                relatedValue: `matrix_${pos.name}_${pos.value}`,
                publishedAt: new Date(),
                updatedAt: new Date(),
              });
            });

            // Моки для ячеек квадрата
            calculationData.squareCells.forEach((cell) => {
              mockArticles.push({
                id: `square-${cell.digit}-${cell.count}`,
                title: `Square ${cell.digit} (${cell.count})`,
                content: 'Content',
                category: 'square_cell',
                language,
                relatedValue: `square_${cell.digit}_${cell.count}`,
                publishedAt: new Date(),
                updatedAt: new Date(),
              });
            });

            // Настраиваем мок для возврата соответствующих статей
            (prisma.article.findMany as jest.Mock).mockImplementation(({ where }) => {
              return Promise.resolve(
                mockArticles.filter(
                  (article) =>
                    article.relatedValue === where.relatedValue &&
                    article.language === where.language
                )
              );
            });

            // Подготавливаем результаты расчетов
            const results = {
              destinyNumber: { value: calculationData.destinyNumber },
              matrix: {
                positions: new Map(
                  calculationData.matrixPositions.map((pos) => [pos.name, pos.value])
                ),
              },
              square: {
                digitCounts: new Map(
                  calculationData.squareCells.map((cell) => [cell.digit, cell.count])
                ),
              },
            };

            // Получаем статьи для расчетов
            const articlesResult = await articleService.getArticlesForCalculation(
              results,
              language
            );

            // Проверяем, что статья для числа судьбы связана правильно
            expect(articlesResult.destinyArticle).not.toBeNull();
            expect(articlesResult.destinyArticle?.relatedValue).toBe(
              `destiny_${calculationData.destinyNumber}`
            );

            // Проверяем, что статьи для позиций матрицы связаны правильно
            calculationData.matrixPositions.forEach((pos) => {
              const article = articlesResult.matrixArticles.get(pos.name);
              expect(article).not.toBeNull();
              expect(article?.relatedValue).toBe(`matrix_${pos.name}_${pos.value}`);
            });

            // Проверяем, что статьи для ячеек квадрата связаны правильно
            calculationData.squareCells.forEach((cell) => {
              const article = articlesResult.squareArticles.get(cell.digit);
              expect(article).not.toBeNull();
              expect(article?.relatedValue).toBe(`square_${cell.digit}_${cell.count}`);
            });
          }
        ),
        { numRuns: 50 } // Меньше итераций из-за сложности теста
      );
    });

    it('должен корректно обрабатывать отсутствующие статьи для любых значений', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('ru', 'en'),
          async (relatedValue, language) => {
            // Мок возвращает пустой массив (статья не найдена)
            (prisma.article.findMany as jest.Mock).mockResolvedValue([]);

            const result = await articleService.getArticlesByRelatedValue(
              relatedValue,
              language
            );

            // Проверяем, что система корректно обрабатывает отсутствие статей
            expect(result).toEqual([]);
            expect(prisma.article.findMany).toHaveBeenCalledWith({
              where: {
                relatedValue,
                language,
              },
              orderBy: {
                publishedAt: 'desc',
              },
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('должен сохранять идемпотентность при повторных запросах одних и тех же статей', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            fc.integer({ min: 1, max: 9 }),
            fc.constantFrom(11, 22, 33)
          ),
          fc.constantFrom('ru', 'en'),
          async (destinyNumber, language) => {
            const mockArticle = {
              id: `article-${destinyNumber}`,
              title: `Destiny ${destinyNumber}`,
              content: 'Test content',
              category: 'destiny_number',
              language,
              relatedValue: `destiny_${destinyNumber}`,
              publishedAt: new Date(),
              updatedAt: new Date(),
            };

            (prisma.article.findMany as jest.Mock).mockResolvedValue([mockArticle]);

            // Выполняем запрос дважды
            const result1 = await articleService.getDestinyNumberArticle(
              destinyNumber,
              language
            );
            const result2 = await articleService.getDestinyNumberArticle(
              destinyNumber,
              language
            );

            // Проверяем идемпотентность - результаты должны быть идентичны
            expect(result1).toEqual(result2);
            expect(result1?.relatedValue).toBe(result2?.relatedValue);
            expect(result1?.id).toBe(result2?.id);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
