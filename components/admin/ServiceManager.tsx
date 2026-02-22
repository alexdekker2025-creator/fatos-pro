'use client';

import { useState, useEffect } from 'react';

interface PremiumService {
  id: string;
  serviceId: string;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  hookRu: string;
  hookEn: string;
  priceBasicRUB: number;
  priceBasicUSD: number;
  priceFullRUB?: number;
  priceFullUSD?: number;
  icon: string;
  color: string;
  featuresBasic: string[];
  featuresFull?: string[];
  buttonTextRu: string;
  buttonTextEn: string;
  isActive: boolean;
  sortOrder: number;
}

// Захардкоженные данные как fallback
const defaultServices: PremiumService[] = [
  {
    id: '1',
    serviceId: 'destiny_matrix',
    titleRu: 'Матрица судьбы',
    titleEn: 'Destiny Matrix',
    descriptionRu: 'Кармические задачи, таланты, предназначение',
    descriptionEn: 'Karmic tasks, talents, life purpose',
    hookRu: 'Почему вы повторяете одни и те же сценарии?',
    hookEn: 'Why do you repeat the same patterns?',
    priceBasicRUB: 3500,
    priceBasicUSD: 39,
    priceFullRUB: 5500,
    priceFullUSD: 61,
    icon: '🔮',
    color: 'from-purple-600 to-indigo-700',
    featuresBasic: ['Базовый расчёт матрицы', 'Основные арканы', 'Кармические задачи', 'Таланты и способности'],
    featuresFull: ['Всё из базового', 'Полная расшифровка всех позиций', 'Детальный анализ отношений', 'Рекомендации по развитию', 'Кармические долги'],
    buttonTextRu: 'Рассчитать матрицу',
    buttonTextEn: 'Calculate Matrix',
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '2',
    serviceId: 'child_numerology',
    titleRu: 'Детская нумерология',
    titleEn: 'Child Numerology',
    descriptionRu: 'Таланты, страхи, рекомендации родителям',
    descriptionEn: 'Talents, fears, recommendations for parents',
    hookRu: 'Что ваш ребёнок прячет от вас?',
    hookEn: 'What is your child hiding from you?',
    priceBasicRUB: 2900,
    priceBasicUSD: 32,
    priceFullRUB: 4900,
    priceFullUSD: 54,
    icon: '👶',
    color: 'from-pink-500 to-rose-600',
    featuresBasic: ['Характер ребёнка', 'Скрытые таланты', 'Основные страхи', 'Рекомендации родителям'],
    featuresFull: ['Всё из базового', 'Отношения с родителями', 'Выбор профессии', 'Здоровье и энергия', 'План развития по возрастам'],
    buttonTextRu: 'Узнать ребёнка',
    buttonTextEn: 'Discover Your Child',
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '3',
    serviceId: 'compatibility',
    titleRu: 'Совместимость',
    titleEn: 'Compatibility',
    descriptionRu: 'Отношения, брак, конфликты, кармические связи',
    descriptionEn: 'Relationships, marriage, conflicts, karmic connections',
    hookRu: 'Почему вы ссоритесь?',
    hookEn: 'Why do you argue?',
    priceBasicRUB: 3900,
    priceBasicUSD: 43,
    priceFullRUB: 5900,
    priceFullUSD: 66,
    icon: '💞',
    color: 'from-red-500 to-pink-600',
    featuresBasic: ['Совместимость по датам', 'Сильные стороны пары', 'Зоны конфликтов', 'Базовые рекомендации'],
    featuresFull: ['Всё из базового', 'Кармические связи', 'Сексуальная совместимость', 'Финансовая совместимость', 'Прогноз отношений', 'Детальные рекомендации'],
    buttonTextRu: 'Проверить совместимость',
    buttonTextEn: 'Check Compatibility',
    isActive: true,
    sortOrder: 3,
  },
  {
    id: '4',
    serviceId: 'money_numerology',
    titleRu: 'Денежная нумерология',
    titleEn: 'Money Numerology',
    descriptionRu: 'Денежный код, блоки, кармические долги',
    descriptionEn: 'Money code, blocks, karmic debts',
    hookRu: 'Почему деньги приходят, но не задерживаются?',
    hookEn: 'Why does money come but not stay?',
    priceBasicRUB: 3900,
    priceBasicUSD: 43,
    priceFullRUB: 5900,
    priceFullUSD: 66,
    icon: '💰',
    color: 'from-yellow-500 to-amber-600',
    featuresBasic: ['Расчёт денежного кода', 'Основные блоки', 'Кармические долги', 'Базовые рекомендации'],
    featuresFull: ['Всё из базового', 'Детальный анализ блоков', 'Благоприятные периоды', 'Способы активации', 'Инвестиционный потенциал', 'Персональные практики'],
    buttonTextRu: 'Активировать деньги',
    buttonTextEn: 'Activate Money',
    isActive: true,
    sortOrder: 4,
  },
  {
    id: '5',
    serviceId: 'yearly_forecast',
    titleRu: 'Годовой прогноз',
    titleEn: 'Yearly Forecast',
    descriptionRu: 'Что ждёт в ближайшие 12 месяцев',
    descriptionEn: 'What awaits in the next 12 months',
    hookRu: 'Что принесёт вам этот год?',
    hookEn: 'What will this year bring you?',
    priceBasicRUB: 4900,
    priceBasicUSD: 54,
    priceFullRUB: 6900,
    priceFullUSD: 77,
    icon: '📅',
    color: 'from-blue-500 to-cyan-600',
    featuresBasic: ['Прогноз на 12 месяцев', 'Ключевые события', 'Благоприятные периоды', 'Предупреждения'],
    featuresFull: ['Всё из базового', 'Детальный прогноз по месяцам', 'Финансовый прогноз', 'Прогноз отношений', 'Здоровье и энергия', 'Рекомендации по месяцам'],
    buttonTextRu: 'Узнать будущее',
    buttonTextEn: 'Discover Future',
    isActive: true,
    sortOrder: 5,
  },
  {
    id: '6',
    serviceId: 'pythagorean_full',
    titleRu: 'Квадрат Пифагора',
    titleEn: 'Pythagorean Square',
    descriptionRu: 'Характер, линии силы, пустые ячейки',
    descriptionEn: 'Character, power lines, empty cells',
    hookRu: 'Как цифры управляют вашим характером',
    hookEn: 'How numbers control your character',
    priceBasicRUB: 2900,
    priceBasicUSD: 32,
    priceFullRUB: 4900,
    priceFullUSD: 54,
    icon: '🧮',
    color: 'from-green-500 to-emerald-600',
    featuresBasic: ['Построение квадрата', 'Разбор всех ячеек', 'Основные линии', 'Характер и темперамент'],
    featuresFull: ['Всё из базового', 'Все 8 линий квадрата', 'Пустые ячейки', 'Переизбыток цифр', 'Совместимость с другими', 'Рекомендации по развитию'],
    buttonTextRu: 'Построить квадрат',
    buttonTextEn: 'Build Square',
    isActive: true,
    sortOrder: 6,
  },
  {
    id: '7',
    serviceId: 'pro_access',
    titleRu: 'Профи-доступ',
    titleEn: 'Pro Access',
    descriptionRu: 'Готовые расчёты для работы с клиентами',
    descriptionEn: 'Ready calculations for client work',
    hookRu: 'Хватит считать вручную',
    hookEn: 'Stop calculating manually',
    priceBasicRUB: 500,
    priceBasicUSD: 6,
    priceFullRUB: 2500,
    priceFullUSD: 28,
    icon: '🧠',
    color: 'from-slate-600 to-gray-700',
    featuresBasic: ['Разовый отчёт', 'Все расчёты', 'Профессиональный формат', 'Без воды'],
    featuresFull: ['До 30 отчётов/месяц', 'Все типы расчётов', 'White Label (опционально)', 'Приоритетная поддержка', 'API доступ'],
    buttonTextRu: 'Начать работать',
    buttonTextEn: 'Start Working',
    isActive: true,
    sortOrder: 7,
  },
  {
    id: '8',
    serviceId: 'gift_certificate',
    titleRu: 'Подарочный сертификат',
    titleEn: 'Gift Certificate',
    descriptionRu: 'Подарите близким персональный нумерологический отчёт',
    descriptionEn: 'Gift your loved ones a personal numerology report',
    hookRu: 'Лучший подарок — знание о себе',
    hookEn: 'The best gift is self-knowledge',
    priceBasicRUB: 2900,
    priceBasicUSD: 32,
    priceFullRUB: 5900,
    priceFullUSD: 66,
    icon: '🎁',
    color: 'from-fuchsia-500 to-purple-600',
    featuresBasic: ['Красивая электронная открытка', 'Уникальный код активации', 'Базовый отчёт на выбор', 'Персональное поздравление'],
    featuresFull: ['Всё из базового', 'Полный отчёт любого типа', 'Премиум дизайн открытки', 'Видео-поздравление', 'Срок действия 1 год'],
    buttonTextRu: 'Подарить',
    buttonTextEn: 'Gift Now',
    isActive: true,
    sortOrder: 8,
  },
  {
    id: '9',
    serviceId: 'consultation',
    titleRu: 'Консультация нумеролога',
    titleEn: 'Numerologist Consultation',
    descriptionRu: 'Персональная консультация с профессиональным нумерологом',
    descriptionEn: 'Personal consultation with professional numerologist',
    hookRu: 'Получите ответы на свои вопросы',
    hookEn: 'Get answers to your questions',
    priceBasicRUB: 7000,
    priceBasicUSD: 78,
    priceFullRUB: 12000,
    priceFullUSD: 133,
    icon: '👤',
    color: 'from-violet-600 to-purple-700',
    featuresBasic: ['Онлайн-консультация 60 минут', 'Разбор вашей матрицы судьбы', 'Ответы на 3 вопроса', 'Запись консультации', 'Краткие рекомендации'],
    featuresFull: ['Всё из базового', 'Консультация 90 минут', 'Неограниченное количество вопросов', 'Детальный письменный отчёт', 'Персональные практики', 'Поддержка 30 дней после консультации'],
    buttonTextRu: 'Записаться',
    buttonTextEn: 'Book Now',
    isActive: true,
    sortOrder: 9,
  },
];

export default function ServiceManager() {
  const [services, setServices] = useState<PremiumService[]>(defaultServices);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState<PremiumService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const sessionId = localStorage.getItem('sessionId');
      console.log('[ServiceManager] SessionId:', sessionId ? 'exists' : 'missing');
      
      const response = await fetch('/api/admin/services', {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });

      console.log('[ServiceManager] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[ServiceManager] Loaded services from API:', data.services?.length || 0, 'services');
        console.log('[ServiceManager] First service:', data.services?.[0]);
        
        if (data.services && data.services.length > 0) {
          setServices(data.services);
          setError(null);
        } else {
          console.log('[ServiceManager] API returned empty array, using defaults');
          setError('API вернул пустой массив. Показаны данные по умолчанию.');
          setServices(defaultServices);
        }
      } else {
        const errorText = await response.text();
        console.error('[ServiceManager] API error:', response.status, errorText);
        setError(`API вернул ошибку: ${response.status} - ${errorText}`);
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('[ServiceManager] Error fetching services:', error);
      setError(`Ошибка загрузки: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: PremiumService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleSave = async (service: PremiumService) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        await fetchServices();
        setIsModalOpen(false);
        setEditingService(null);
      } else {
        const errorData = await response.json();
        console.error('Error saving service:', errorData);
        alert(`Ошибка сохранения: ${errorData.error || response.status}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Ошибка сохранения услуги');
    }
  };

  const handleToggleActive = async (service: PremiumService) => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
        body: JSON.stringify({
          ...service,
          isActive: !service.isActive,
        }),
      });

      await fetchServices();
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление премиум услугами</h2>
        {error && (
          <div className="text-yellow-300 text-sm">
            ⚠️ {error}
          </div>
        )}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 text-white">
          <p className="text-xl mb-4">Услуги не найдены</p>
          <p className="text-sm text-gray-300">
            Выполните миграцию: npx prisma migrate dev --name add_premium_services
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Затем заполните базу: npx ts-node prisma/seed-services.ts
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{service.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{service.titleRu}</h3>
                    <p className="text-sm text-gray-500">{service.titleEn}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Базовая цена:</p>
                    <p className="font-semibold">{service.priceBasicRUB} ₽ / ${service.priceBasicUSD}</p>
                  </div>
                  {service.priceFullRUB && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Полная цена:</p>
                      <p className="font-semibold">{service.priceFullRUB} ₽ / ${service.priceFullUSD}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Хук (RU):</p>
                  <p className="italic">&ldquo;{service.hookRu}&rdquo;</p>
                </div>

                <div className="mt-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {service.isActive ? 'Активна' : 'Неактивна'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Порядок: {service.sortOrder}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleToggleActive(service)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    service.isActive
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {service.isActive ? 'Деактивировать' : 'Активировать'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && editingService && (
        <ServiceEditModal
          service={editingService}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingService(null);
          }}
        />
      )}
    </div>
  );
}

// Service Edit Modal Component
function ServiceEditModal({
  service,
  onSave,
  onClose,
}: {
  service: PremiumService;
  onSave: (service: PremiumService) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(service);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-2xl font-bold mb-6">Редактирование услуги</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titles */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название (RU)</label>
              <input
                type="text"
                value={formData.titleRu}
                onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title (EN)</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Hooks */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Хук (RU)</label>
              <input
                type="text"
                value={formData.hookRu}
                onChange={(e) => setFormData({ ...formData, hookRu: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hook (EN)</label>
              <input
                type="text"
                value={formData.hookEn}
                onChange={(e) => setFormData({ ...formData, hookEn: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Базовая (₽)</label>
              <input
                type="number"
                value={formData.priceBasicRUB}
                onChange={(e) => setFormData({ ...formData, priceBasicRUB: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Basic ($)</label>
              <input
                type="number"
                value={formData.priceBasicUSD}
                onChange={(e) => setFormData({ ...formData, priceBasicUSD: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Полная (₽)</label>
              <input
                type="number"
                value={formData.priceFullRUB || ''}
                onChange={(e) => setFormData({ ...formData, priceFullRUB: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Full ($)</label>
              <input
                type="number"
                value={formData.priceFullUSD || ''}
                onChange={(e) => setFormData({ ...formData, priceFullUSD: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Icon and Color */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Иконка (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Цвет (gradient)</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="from-purple-600 to-indigo-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Порядок</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Descriptions (СТАРТ заголовок) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Описание СТАРТ (RU)</label>
              <input
                type="text"
                value={formData.descriptionRu}
                onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Всё, чтобы понять главное"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description START (EN)</label>
              <input
                type="text"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Everything to understand the main thing"
              />
            </div>
          </div>

          {/* Button Text */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Текст кнопки (RU)</label>
              <input
                type="text"
                value={formData.buttonTextRu}
                onChange={(e) => setFormData({ ...formData, buttonTextRu: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Рассчитать матрицу"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Text (EN)</label>
              <input
                type="text"
                value={formData.buttonTextEn}
                onChange={(e) => setFormData({ ...formData, buttonTextEn: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                placeholder="Calculate Matrix"
              />
            </div>
          </div>

          {/* Features Basic (СТАРТ) */}
          <div>
            <label className="block text-sm font-medium mb-2">Описание тарифа СТАРТ (по одному на строку)</label>
            <textarea
              value={formData.featuresBasic.join('\n')}
              onChange={(e) => setFormData({ ...formData, featuresBasic: e.target.value.split('\n').filter(f => f.trim()) })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[120px]"
              placeholder="Вы получите базовый расчёт матрицы&#10;Этого достаточно, чтобы увидеть направление"
            />
            <p className="text-sm text-gray-500 mt-1">Каждая строка = отдельный пункт описания</p>
          </div>

          {/* Features Full (ГЛУБОКИЙ) */}
          <div>
            <label className="block text-sm font-medium mb-2">Описание тарифа ГЛУБОКИЙ (по одному на строку)</label>
            <textarea
              value={formData.featuresFull?.join('\n') || ''}
              onChange={(e) => setFormData({ ...formData, featuresFull: e.target.value.split('\n').filter(f => f.trim()) })}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 min-h-[180px]"
              placeholder="Полная картина вашей судьбы&#10;Всё, что в тарифе «Старт» + полная расшифровка&#10;Детальный разбор теневых зон&#10;Этот вариант выбирают те, кто готов работать всерьёз"
            />
            <p className="text-sm text-gray-500 mt-1">
              Первая строка = заголовок ГЛУБОКИЙ<br/>
              Остальные строки = описание и hook внизу
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
