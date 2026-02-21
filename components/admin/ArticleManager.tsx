/**
 * Компонент управления статьями
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ArticleForm from './ArticleForm';
import { Button } from '@/components/ui/Button';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  relatedValue: string | null;
  publishedAt: string;
  updatedAt: string;
}

export default function ArticleManager() {
  const t = useTranslations('admin.articles');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    relatedValue: '',
  });

  useEffect(() => {
    loadArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.language) params.append('language', filters.language);
      if (filters.relatedValue) params.append('relatedValue', filters.relatedValue);

      const sessionId = localStorage.getItem('sessionId');
      console.log('Loading articles with params:', params.toString());
      console.log('SessionId:', sessionId);

      const response = await fetch(`/api/admin/articles?${params}`, {
        credentials: 'include',
        headers: sessionId ? {
          'Authorization': `Bearer ${sessionId}`,
        } : {},
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded articles:', data);
        setArticles(data.articles);
      } else {
        const errorText = await response.text();
        console.error('Failed to load articles:', response.status, errorText);
        setError(`Ошибка загрузки: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setShowForm(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete', { default: 'Are you sure you want to delete this article?' }))) {
      return;
    }

    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: sessionId ? {
          'Authorization': `Bearer ${sessionId}`,
        } : {},
      });

      if (response.ok) {
        loadArticles();
      } else {
        alert(t('deleteError', { default: 'Failed to delete article' }));
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert(t('deleteError', { default: 'Failed to delete article' }));
    }
  };

  const handleFormClose = (saved: boolean) => {
    setShowForm(false);
    setEditingArticle(null);
    if (saved) {
      loadArticles();
    }
  };

  if (showForm) {
    return (
      <ArticleForm
        article={editingArticle}
        onClose={handleFormClose}
      />
    );
  }

  if (showHelp) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Справка по Related Value</h2>
          <Button onClick={() => setShowHelp(false)} variant="outline">
            Закрыть
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-amber-500/30">
            <h3 className="text-xl font-semibold text-amber-400 mb-3">🃏 Арканы (Карты)</h3>
            <p className="text-white/80 mb-2">Формат: <code className="bg-black/30 px-2 py-1 rounded">arcana_N</code> где N от 1 до 22</p>
            <div className="text-white/70 text-sm space-y-1">
              <p>• arcana_1 - Маг</p>
              <p>• arcana_2 - Верховная Жрица</p>
              <p>• arcana_22 - Шут</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-xl font-semibold text-purple-400 mb-3">🔢 Числа судьбы</h3>
            <p className="text-white/80 mb-2">Формат: <code className="bg-black/30 px-2 py-1 rounded">N</code> где N = 1-9, 11, 22, 33</p>
            <div className="text-white/70 text-sm space-y-1">
              <p>• 1, 2, 3, ..., 9 - обычные числа</p>
              <p>• 11, 22, 33 - мастер-числа</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">🔮 Матрица судьбы</h3>
            <p className="text-white/80 mb-2">Формат: <code className="bg-black/30 px-2 py-1 rounded">matrix_[позиция]_[значение]</code></p>
            <div className="text-white/70 text-sm space-y-1">
              <p>• matrix_lifePathNumber_5 - Число жизни = 5</p>
              <p>• matrix_soulNumber_3 - Число души = 3</p>
              <p>• matrix_dayNumber_15 - Число дня = 15</p>
              <p>• matrix_monthNumber_8 - Число месяца = 8</p>
              <p>• matrix_yearNumber_7 - Число года = 7</p>
              <p>• matrix_personalityNumber_11 - Число личности = 11</p>
              <p>• matrix_powerNumber_22 - Число силы = 22</p>
              <p>• matrix_karmicNumber_9 - Кармическое число = 9</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
            <h3 className="text-xl font-semibold text-green-400 mb-3">📐 Квадрат Пифагора</h3>
            <p className="text-white/80 mb-2">Формат: <code className="bg-black/30 px-2 py-1 rounded">square_[цифра]_[количество]</code></p>
            <div className="text-white/70 text-sm space-y-1">
              <p>• square_1_0 - Цифра 1 отсутствует (0 раз)</p>
              <p>• square_1_3 - Цифра 1 встречается 3 раза</p>
              <p>• square_5_2 - Цифра 5 встречается 2 раза</p>
              <p>• Цифры: 1-9, Количество: 0-9+</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {t('title', { default: 'Articles' })}
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowHelp(true)} variant="outline">
            📖 Справка
          </Button>
          <Button onClick={handleCreate} variant="primary">
            {t('createNew', { default: 'Create Article' })}
          </Button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            colorScheme: 'dark'
          }}
        >
          <option value="" className="bg-gray-800 text-white">{t('allCategories', { default: 'All Categories' })}</option>
          <option value="destiny_number" className="bg-gray-800 text-white">Destiny Number</option>
          <option value="destiny_matrix" className="bg-gray-800 text-white">Destiny Matrix</option>
          <option value="pythagorean_square" className="bg-gray-800 text-white">Pythagorean Square</option>
          <option value="arcana" className="bg-gray-800 text-white">Arcana (Cards)</option>
          <option value="general" className="bg-gray-800 text-white">General</option>
        </select>

        <select
          value={filters.language}
          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
          className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            colorScheme: 'dark'
          }}
        >
          <option value="" className="bg-gray-800 text-white">{t('allLanguages', { default: 'All Languages' })}</option>
          <option value="ru" className="bg-gray-800 text-white">Русский</option>
          <option value="en" className="bg-gray-800 text-white">English</option>
        </select>

        <input
          type="text"
          value={filters.relatedValue}
          onChange={(e) => setFilters({ ...filters, relatedValue: e.target.value })}
          placeholder={t('relatedValue', { default: 'Related Value' })}
          className="px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Список статей */}
      {loading ? (
        <div className="text-center text-white py-8">
          {t('loading', { default: 'Loading...' })}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-white/70 py-8">
          {t('noArticles', { default: 'No articles found' })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-white/70 text-sm mb-2">
            {t('totalArticles', { default: 'Total articles' })}: {articles.length}
          </div>
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all border border-white/10"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-500/40 text-purple-100 rounded-full text-sm font-medium">
                      {article.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/40 text-blue-100 rounded-full text-sm font-medium">
                      {article.language.toUpperCase()}
                    </span>
                    {article.relatedValue && (
                      <span className="px-3 py-1 bg-amber-500/40 text-amber-100 rounded-full text-sm font-medium">
                        {article.relatedValue}
                      </span>
                    )}
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 mb-2">
                    <p className="text-white/80 text-sm whitespace-pre-wrap line-clamp-3">
                      {article.content}
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-white/50">
                    <span>ID: {article.id.substring(0, 8)}...</span>
                    <span>Обновлено: {new Date(article.updatedAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEdit(article)}
                    variant="secondary"
                    className="text-sm"
                  >
                    {t('edit', { default: 'Edit' })}
                  </Button>
                  <Button
                    onClick={() => handleDelete(article.id)}
                    variant="outline"
                    className="text-sm text-red-300 border-red-300 hover:bg-red-500/20"
                  >
                    {t('delete', { default: 'Delete' })}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
