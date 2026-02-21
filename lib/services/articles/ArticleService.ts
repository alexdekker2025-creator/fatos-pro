/**
 * Article Service
 * 
 * Сервис для получения статей, связанных с нумерологическими значениями
 */

import { prisma } from '@/lib/prisma';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  relatedValue: string | null;
  publishedAt: Date;
  updatedAt: Date;
}

/**
 * Сервис для работы со статьями
 */
export class ArticleService {
  /**
   * Получить статьи по связанному значению
   * 
   * @param relatedValue - Значение для поиска (например, "destiny_1", "matrix_dayNumber_5")
   * @param language - Язык статей (ru или en)
   * @returns Массив статей
   */
  async getArticlesByRelatedValue(
    relatedValue: string,
    language: string = 'ru'
  ): Promise<Article[]> {
    const articles = await prisma.article.findMany({
      where: {
        relatedValue,
        language,
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });

    return articles;
  }

  /**
   * Получить статью для числа судьбы
   * 
   * @param destinyNumber - Число судьбы (1-9, 11, 22, 33)
   * @param language - Язык статьи
   * @returns Статья или null
   */
  async getDestinyNumberArticle(
    destinyNumber: number,
    language: string = 'ru'
  ): Promise<Article | null> {
    const relatedValue = `destiny_${destinyNumber}`;
    const articles = await this.getArticlesByRelatedValue(relatedValue, language);
    return articles[0] || null;
  }

  /**
   * Получить статью для позиции матрицы судьбы
   * 
   * @param positionName - Название позиции (например, "dayNumber", "lifePathNumber")
   * @param value - Значение позиции (1-9, 11, 22, 33)
   * @param language - Язык статьи
   * @returns Статья или null
   */
  async getMatrixPositionArticle(
    positionName: string,
    value: number,
    language: string = 'ru'
  ): Promise<Article | null> {
    const relatedValue = `matrix_${positionName}_${value}`;
    const articles = await this.getArticlesByRelatedValue(relatedValue, language);
    return articles[0] || null;
  }

  /**
   * Получить статью для ячейки квадрата Пифагора
   * 
   * @param digit - Цифра (1-9)
   * @param count - Количество повторений
   * @param language - Язык статьи
   * @returns Статья или null
   */
  async getSquareCellArticle(
    digit: number,
    count: number,
    language: string = 'ru'
  ): Promise<Article | null> {
    const relatedValue = `square_${digit}_${count}`;
    const articles = await this.getArticlesByRelatedValue(relatedValue, language);
    return articles[0] || null;
  }

  /**
   * Получить все статьи для результатов расчетов
   * 
   * @param results - Результаты расчетов
   * @param language - Язык статей
   * @returns Объект с массивами статей для каждого типа
   */
  async getArticlesForCalculation(
    results: {
      destinyNumber?: { value: number };
      matrix?: { positions: Map<string, number> };
      square?: { digitCounts: Map<number, number> };
    },
    language: string = 'ru'
  ): Promise<{
    destinyArticle: Article | null;
    matrixArticles: Map<string, Article | null>;
    squareArticles: Map<number, Article | null>;
  }> {
    const destinyArticle = results.destinyNumber
      ? await this.getDestinyNumberArticle(results.destinyNumber.value, language)
      : null;

    const matrixArticles = new Map<string, Article | null>();
    if (results.matrix) {
      for (const [positionName, value] of results.matrix.positions.entries()) {
        const article = await this.getMatrixPositionArticle(positionName, value, language);
        matrixArticles.set(positionName, article);
      }
    }

    const squareArticles = new Map<number, Article | null>();
    if (results.square) {
      for (const [digit, count] of results.square.digitCounts.entries()) {
        const article = await this.getSquareCellArticle(digit, count, language);
        squareArticles.set(digit, article);
      }
    }

    return {
      destinyArticle,
      matrixArticles,
      squareArticles,
    };
  }
}
