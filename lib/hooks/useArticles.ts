import { useState, useCallback } from 'react';

export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  relatedValue: string | null;
  publishedAt: string;
  updatedAt: string;
}

export function useArticles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Получить статьи по связанному значению
   */
  const getArticlesByRelatedValue = useCallback(
    async (relatedValue: string, language: string = 'ru'): Promise<Article[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/articles?relatedValue=${encodeURIComponent(relatedValue)}&language=${language}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }

        const data = await response.json();
        return data.articles || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Получить статью для числа судьбы
   */
  const getDestinyNumberArticle = useCallback(
    async (destinyNumber: number, language: string = 'ru'): Promise<Article | null> => {
      const relatedValue = `destiny_${destinyNumber}`;
      const articles = await getArticlesByRelatedValue(relatedValue, language);
      return articles[0] || null;
    },
    [getArticlesByRelatedValue]
  );

  /**
   * Получить статью для позиции матрицы судьбы
   */
  const getMatrixPositionArticle = useCallback(
    async (
      positionName: string,
      value: number,
      language: string = 'ru'
    ): Promise<Article | null> => {
      const relatedValue = `matrix_${positionName}_${value}`;
      const articles = await getArticlesByRelatedValue(relatedValue, language);
      return articles[0] || null;
    },
    [getArticlesByRelatedValue]
  );

  /**
   * Получить статью для ячейки квадрата Пифагора
   */
  const getSquareCellArticle = useCallback(
    async (
      digit: number,
      count: number,
      language: string = 'ru'
    ): Promise<Article | null> => {
      const relatedValue = `square_${digit}_${count}`;
      const articles = await getArticlesByRelatedValue(relatedValue, language);
      return articles[0] || null;
    },
    [getArticlesByRelatedValue]
  );

  return {
    loading,
    error,
    getArticlesByRelatedValue,
    getDestinyNumberArticle,
    getMatrixPositionArticle,
    getSquareCellArticle,
  };
}
