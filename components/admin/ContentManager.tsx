'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ContentPage {
  id: string;
  slug: string;
  titleRu: string;
  titleEn: string;
  contentRu: string;
  contentEn: string;
  isPublished: boolean;
  sortOrder: number;
  updatedAt: string;
}

export default function ContentManager({ sessionId }: { sessionId: string }) {
  const t = useTranslations('admin.content');
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Форма
  const [formData, setFormData] = useState({
    slug: '',
    titleRu: '',
    titleEn: '',
    contentRu: '',
    contentEn: '',
    isPublished: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/content', {
        headers: { 'X-Session-ID': sessionId },
      });

      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page: ContentPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      titleRu: page.titleRu,
      titleEn: page.titleEn,
      contentRu: page.contentRu,
      contentEn: page.contentEn,
      isPublished: page.isPublished,
      sortOrder: page.sortOrder,
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      titleRu: '',
      titleEn: '',
      contentRu: '',
      contentEn: '',
      isPublished: true,
      sortOrder: pages.length,
    });
    setIsCreating(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingPage
        ? `/api/admin/content/${editingPage.id}`
        : '/api/admin/content';
      
      const method = editingPage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPages();
        setEditingPage(null);
        setIsCreating(false);
        alert(editingPage ? t('updateSuccess') : t('createSuccess'));
      } else {
        const error = await response.json();
        alert(error.message || t('saveError'));
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { 'X-Session-ID': sessionId },
      });

      if (response.ok) {
        await fetchPages();
        alert(t('deleteSuccess'));
      } else {
        alert(t('deleteError'));
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert(t('deleteError'));
    }
  };

  const handleCancel = () => {
    setEditingPage(null);
    setIsCreating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка создания */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
        {!isCreating && !editingPage && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t('createNew')}
          </button>
        )}
      </div>

      {/* Форма редактирования/создания */}
      {(isCreating || editingPage) && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {editingPage ? t('editPage') : t('createPage')}
          </h3>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('slug')}
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="about, privacy, terms, faq"
              disabled={!!editingPage}
            />
          </div>

          {/* Заголовок RU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('titleRu')}
            </label>
            <input
              type="text"
              value={formData.titleRu}
              onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Заголовок EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('titleEn')}
            </label>
            <input
              type="text"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Контент RU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contentRu')}
            </label>
            <textarea
              value={formData.contentRu}
              onChange={(e) => setFormData({ ...formData, contentRu: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              placeholder="HTML разметка..."
            />
          </div>

          {/* Контент EN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contentEn')}
            </label>
            <textarea
              value={formData.contentEn}
              onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              placeholder="HTML markup..."
            />
          </div>

          {/* Опубликовано */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
              {t('isPublished')}
            </label>
          </div>

          {/* Порядок сортировки */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sortOrder')}
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving ? t('saving') : t('save')}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Список страниц */}
      {!isCreating && !editingPage && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('slug')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('titleRu')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('titleEn')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.titleRu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.titleEn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        page.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {page.isPublished ? t('published') : t('draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      {t('edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
