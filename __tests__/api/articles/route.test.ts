/**
 * Unit тесты для GET /api/articles
 */

import { GET } from '@/app/api/articles/route';
import { NextRequest } from 'next/server';

// Mock ArticleService
jest.mock('@/lib/services/articles', () => {
  const mockGetArticlesByRelatedValue = jest.fn();
  return {
    ArticleService: jest.fn().mockImplementation(() => ({
      getArticlesByRelatedValue: mockGetArticlesByRelatedValue,
    })),
    mockGetArticlesByRelatedValue,
  };
});

import { mockGetArticlesByRelatedValue } from '@/lib/services/articles';

describe('GET /api/articles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен вернуть статьи по relatedValue', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Test Article',
        content: 'Test content',
        category: 'destiny_number',
        language: 'ru',
        relatedValue: 'destiny_5',
        publishedAt: new Date('2026-02-21T02:01:58.157Z'),
        updatedAt: new Date('2026-02-21T02:01:58.157Z'),
      },
    ];

    mockGetArticlesByRelatedValue.mockResolvedValue(mockArticles);

    const request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_5&language=ru'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles).toHaveLength(1);
    expect(data.articles[0].id).toBe('1');
    expect(data.articles[0].title).toBe('Test Article');
    expect(data.articles[0].relatedValue).toBe('destiny_5');
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('destiny_5', 'ru');
  });

  it('должен использовать язык по умолчанию (ru)', async () => {
    mockGetArticlesByRelatedValue.mockResolvedValue([]);

    const request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_5'
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('destiny_5', 'ru');
  });

  it('должен вернуть 400, если relatedValue не указан', async () => {
    const request = new NextRequest('http://localhost:3000/api/articles');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('relatedValue is required');
    expect(mockGetArticlesByRelatedValue).not.toHaveBeenCalled();
  });

  it('должен вернуть 500 при ошибке сервера', async () => {
    mockGetArticlesByRelatedValue.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_5'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch articles');
  });

  it('должен работать с разными языками', async () => {
    mockGetArticlesByRelatedValue.mockResolvedValue([]);

    const request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_5&language=en'
    );

    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('destiny_5', 'en');
  });

  it('должен работать с разными типами relatedValue', async () => {
    mockGetArticlesByRelatedValue.mockResolvedValue([]);

    // Destiny number
    let request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_11'
    );
    await GET(request);
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('destiny_11', 'ru');

    // Matrix position
    request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=matrix_dayNumber_5'
    );
    await GET(request);
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('matrix_dayNumber_5', 'ru');

    // Square cell
    request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=square_1_3'
    );
    await GET(request);
    expect(mockGetArticlesByRelatedValue).toHaveBeenCalledWith('square_1_3', 'ru');
  });

  it('должен вернуть пустой массив, если статьи не найдены', async () => {
    mockGetArticlesByRelatedValue.mockResolvedValue([]);

    const request = new NextRequest(
      'http://localhost:3000/api/articles?relatedValue=destiny_999'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.articles).toEqual([]);
  });
});
