/**
 * Форма создания/редактирования статьи
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  relatedValue: string | null;
}

interface ArticleFormProps {
  article: Article | null;
  onClose: (saved: boolean) => void;
}

export default function ArticleForm({ article, onClose }: ArticleFormProps) {
  const t = useTranslations('admin.articleForm');
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    category: article?.category || 'destiny_number',
    language: article?.language || 'ru',
    relatedValue: article?.relatedValue || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const url = article
        ? `/api/admin/articles/${article.id}`
        : '/api/admin/articles';
      
      const method = article ? 'PUT' : 'POST';
      const sessionId = localStorage.getItem('sessionId');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(sessionId ? { 'Authorization': `Bearer ${sessionId}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          relatedValue: formData.relatedValue || undefined,
        }),
      });

      if (response.ok) {
        onClose(true);
      } else {
        const data = await response.json();
        setError(data.error || t('saveError', { default: 'Failed to save article' }));
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setError(t('saveError', { default: 'Failed to save article' }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          {article
            ? t('editTitle', { default: 'Edit Article' })
            : t('createTitle', { default: 'Create Article' })}
        </h2>
        <Button onClick={() => onClose(false)} variant="outline">
          {t('cancel', { default: 'Cancel' })}
        </Button>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Заголовок статьи */}
        <div>
          <label className="block text-white mb-2">
            {t('titleLabel', { default: 'Title' })} *
          </label>
          <Input
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
            placeholder={t('titlePlaceholder', { default: 'Enter article title' })}
            required
          />
        </div>

        {/* Категория */}
        <div>
          <label className="block text-white mb-2">
            {t('categoryLabel', { default: 'Category' })} *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              colorScheme: 'dark'
            }}
            required
          >
            <option value="destiny_number" className="bg-gray-800 text-white">Destiny Number</option>
            <option value="destiny_matrix" className="bg-gray-800 text-white">Destiny Matrix</option>
            <option value="pythagorean_square" className="bg-gray-800 text-white">Pythagorean Square</option>
            <option value="arcana" className="bg-gray-800 text-white">Arcana (Cards)</option>
            <option value="general" className="bg-gray-800 text-white">General</option>
          </select>
        </div>

        {/* Язык */}
        <div>
          <label className="block text-white mb-2">
            {t('languageLabel', { default: 'Language' })} *
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
            style={{
              colorScheme: 'dark'
            }}
            required
          >
            <option value="ru" className="bg-gray-800 text-white">Русский</option>
            <option value="en" className="bg-gray-800 text-white">English</option>
          </select>
        </div>

        {/* Связанное значение */}
        <div>
          <label className="block text-white mb-2">
            {t('relatedValueLabel', { default: 'Related Value' })}
          </label>
          <Input
            value={formData.relatedValue}
            onChange={(value) => setFormData({ ...formData, relatedValue: value })}
            placeholder={
              formData.category === 'arcana' 
                ? 'arcana_1, arcana_2, ..., arcana_22'
                : formData.category === 'destiny_matrix'
                ? 'matrix_lifePathNumber_5, matrix_soulNumber_3'
                : formData.category === 'pythagorean_square'
                ? 'square_1_3, square_5_0'
                : t('relatedValuePlaceholder', { default: 'e.g., 1, 11, 22' })
            }
          />
          <div className="text-white/60 text-sm mt-2 space-y-1">
            {formData.category === 'arcana' && (
              <p>💡 Формат: arcana_1 до arcana_22 (номер аркана от 1 до 22)</p>
            )}
            {formData.category === 'destiny_number' && (
              <p>💡 Формат: 1, 2, 3, ..., 9, 11, 22, 33 (число судьбы)</p>
            )}
            {formData.category === 'destiny_matrix' && (
              <p>💡 Формат: matrix_[позиция]_[значение], например matrix_lifePathNumber_5</p>
            )}
            {formData.category === 'pythagorean_square' && (
              <p>💡 Формат: square_[цифра]_[количество], например square_1_3 (цифра 1 встречается 3 раза)</p>
            )}
          </div>
        </div>

        {/* Содержание */}
        {formData.category === 'arcana' ? (
          // Специальная форма для арканов с 4 полями
          <div className="space-y-4">
            <label className="block text-white mb-2 text-lg font-semibold">
              {t('contentLabel', { default: 'Content' })} * (Карта дня)
            </label>
            
            {/* Утро */}
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                🌅 {formData.language === 'ru' ? 'УТРО' : 'MORNING'}
              </label>
              <textarea
                value={(() => {
                  const match = formData.content.match(/🌅 (?:УТРО|MORNING)\n([\s\S]*?)(?=\n\n(?:☀️|$))/);
                  return match ? match[1].trim() : '';
                })()}
                onChange={(e) => {
                  const morning = e.target.value;
                  const dayMatch = formData.content.match(/☀️ (?:ДЕНЬ|DAY)\n([\s\S]*?)(?=\n\n(?:🌇|$))/);
                  const eveningMatch = formData.content.match(/🌇 (?:ВЕЧЕР|EVENING)\n([\s\S]*?)(?=\n\n(?:🌙|$))/);
                  const nightMatch = formData.content.match(/🌙 (?:НОЧЬ|NIGHT)\n([\s\S]*?)$/);
                  
                  const day = dayMatch ? dayMatch[1].trim() : '';
                  const evening = eveningMatch ? eveningMatch[1].trim() : '';
                  const night = nightMatch ? nightMatch[1].trim() : '';
                  
                  const morningLabel = formData.language === 'ru' ? 'УТРО' : 'MORNING';
                  const dayLabel = formData.language === 'ru' ? 'ДЕНЬ' : 'DAY';
                  const eveningLabel = formData.language === 'ru' ? 'ВЕЧЕР' : 'EVENING';
                  const nightLabel = formData.language === 'ru' ? 'НОЧЬ' : 'NIGHT';
                  
                  setFormData({
                    ...formData,
                    content: `🌅 ${morningLabel}\n${morning}\n\n☀️ ${dayLabel}\n${day}\n\n🌇 ${eveningLabel}\n${evening}\n\n🌙 ${nightLabel}\n${night}`
                  });
                }}
                placeholder={formData.language === 'ru' ? 'Описание утра...' : 'Morning description...'}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-y"
                required
              />
            </div>

            {/* День */}
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                ☀️ {formData.language === 'ru' ? 'ДЕНЬ' : 'DAY'}
              </label>
              <textarea
                value={(() => {
                  const match = formData.content.match(/☀️ (?:ДЕНЬ|DAY)\n([\s\S]*?)(?=\n\n(?:🌇|$))/);
                  return match ? match[1].trim() : '';
                })()}
                onChange={(e) => {
                  const day = e.target.value;
                  const morningMatch = formData.content.match(/🌅 (?:УТРО|MORNING)\n([\s\S]*?)(?=\n\n(?:☀️|$))/);
                  const eveningMatch = formData.content.match(/🌇 (?:ВЕЧЕР|EVENING)\n([\s\S]*?)(?=\n\n(?:🌙|$))/);
                  const nightMatch = formData.content.match(/🌙 (?:НОЧЬ|NIGHT)\n([\s\S]*?)$/);
                  
                  const morning = morningMatch ? morningMatch[1].trim() : '';
                  const evening = eveningMatch ? eveningMatch[1].trim() : '';
                  const night = nightMatch ? nightMatch[1].trim() : '';
                  
                  const morningLabel = formData.language === 'ru' ? 'УТРО' : 'MORNING';
                  const dayLabel = formData.language === 'ru' ? 'ДЕНЬ' : 'DAY';
                  const eveningLabel = formData.language === 'ru' ? 'ВЕЧЕР' : 'EVENING';
                  const nightLabel = formData.language === 'ru' ? 'НОЧЬ' : 'NIGHT';
                  
                  setFormData({
                    ...formData,
                    content: `🌅 ${morningLabel}\n${morning}\n\n☀️ ${dayLabel}\n${day}\n\n🌇 ${eveningLabel}\n${evening}\n\n🌙 ${nightLabel}\n${night}`
                  });
                }}
                placeholder={formData.language === 'ru' ? 'Описание дня...' : 'Day description...'}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-y"
                required
              />
            </div>

            {/* Вечер */}
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                🌇 {formData.language === 'ru' ? 'ВЕЧЕР' : 'EVENING'}
              </label>
              <textarea
                value={(() => {
                  const match = formData.content.match(/🌇 (?:ВЕЧЕР|EVENING)\n([\s\S]*?)(?=\n\n(?:🌙|$))/);
                  return match ? match[1].trim() : '';
                })()}
                onChange={(e) => {
                  const evening = e.target.value;
                  const morningMatch = formData.content.match(/🌅 (?:УТРО|MORNING)\n([\s\S]*?)(?=\n\n(?:☀️|$))/);
                  const dayMatch = formData.content.match(/☀️ (?:ДЕНЬ|DAY)\n([\s\S]*?)(?=\n\n(?:🌇|$))/);
                  const nightMatch = formData.content.match(/🌙 (?:НОЧЬ|NIGHT)\n([\s\S]*?)$/);
                  
                  const morning = morningMatch ? morningMatch[1].trim() : '';
                  const day = dayMatch ? dayMatch[1].trim() : '';
                  const night = nightMatch ? nightMatch[1].trim() : '';
                  
                  const morningLabel = formData.language === 'ru' ? 'УТРО' : 'MORNING';
                  const dayLabel = formData.language === 'ru' ? 'ДЕНЬ' : 'DAY';
                  const eveningLabel = formData.language === 'ru' ? 'ВЕЧЕР' : 'EVENING';
                  const nightLabel = formData.language === 'ru' ? 'НОЧЬ' : 'NIGHT';
                  
                  setFormData({
                    ...formData,
                    content: `🌅 ${morningLabel}\n${morning}\n\n☀️ ${dayLabel}\n${day}\n\n🌇 ${eveningLabel}\n${evening}\n\n🌙 ${nightLabel}\n${night}`
                  });
                }}
                placeholder={formData.language === 'ru' ? 'Описание вечера...' : 'Evening description...'}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-y"
                required
              />
            </div>

            {/* Ночь */}
            <div>
              <label className="block text-white mb-2 flex items-center gap-2">
                🌙 {formData.language === 'ru' ? 'НОЧЬ' : 'NIGHT'}
              </label>
              <textarea
                value={(() => {
                  const match = formData.content.match(/🌙 (?:НОЧЬ|NIGHT)\n([\s\S]*?)$/);
                  return match ? match[1].trim() : '';
                })()}
                onChange={(e) => {
                  const night = e.target.value;
                  const morningMatch = formData.content.match(/🌅 (?:УТРО|MORNING)\n([\s\S]*?)(?=\n\n(?:☀️|$))/);
                  const dayMatch = formData.content.match(/☀️ (?:ДЕНЬ|DAY)\n([\s\S]*?)(?=\n\n(?:🌇|$))/);
                  const eveningMatch = formData.content.match(/🌇 (?:ВЕЧЕР|EVENING)\n([\s\S]*?)(?=\n\n(?:🌙|$))/);
                  
                  const morning = morningMatch ? morningMatch[1].trim() : '';
                  const day = dayMatch ? dayMatch[1].trim() : '';
                  const evening = eveningMatch ? eveningMatch[1].trim() : '';
                  
                  const morningLabel = formData.language === 'ru' ? 'УТРО' : 'MORNING';
                  const dayLabel = formData.language === 'ru' ? 'ДЕНЬ' : 'DAY';
                  const eveningLabel = formData.language === 'ru' ? 'ВЕЧЕР' : 'EVENING';
                  const nightLabel = formData.language === 'ru' ? 'НОЧЬ' : 'NIGHT';
                  
                  setFormData({
                    ...formData,
                    content: `🌅 ${morningLabel}\n${morning}\n\n☀️ ${dayLabel}\n${day}\n\n🌇 ${eveningLabel}\n${evening}\n\n🌙 ${nightLabel}\n${night}`
                  });
                }}
                placeholder={formData.language === 'ru' ? 'Описание ночи...' : 'Night description...'}
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-y"
                required
              />
            </div>
          </div>
        ) : (
          // Обычное поле для других категорий
          <div>
            <label className="block text-white mb-2">
              {t('contentLabel', { default: 'Content' })} *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={t('contentPlaceholder', { default: 'Enter article content' })}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[300px] resize-y"
              required
            />
          </div>
        )}

        {/* Ошибка */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex-1"
          >
            {saving
              ? t('saving', { default: 'Saving...' })
              : article
              ? t('update', { default: 'Update' })
              : t('create', { default: 'Create' })}
          </Button>
          <Button
            type="button"
            onClick={() => onClose(false)}
            variant="outline"
            disabled={saving}
          >
            {t('cancel', { default: 'Cancel' })}
          </Button>
        </div>
      </form>
    </div>
  );
}
