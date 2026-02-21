'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import PaymentModal from './PaymentModal';
import GiftCertificateModal, { GiftData } from './GiftCertificateModal';
import ConsultationModal, { ConsultationData } from './ConsultationModal';

interface PremiumService {
  id: string;
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
  features: {
    basic: string[];
    full?: string[];
  };
  buttonTextRu: string;
  buttonTextEn: string;
}

const services: PremiumService[] = [
  {
    id: 'destiny_matrix',
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
    features: {
      basic: [
        'Базовый расчёт матрицы',
        'Основные арканы',
        'Кармические задачи',
        'Таланты и способности'
      ],
      full: [
        'Всё из базового',
        'Полная расшифровка всех позиций',
        'Детальный анализ отношений',
        'Рекомендации по развитию',
        'Кармические долги'
      ]
    },
    buttonTextRu: 'Рассчитать матрицу',
    buttonTextEn: 'Calculate Matrix'
  },
  {
    id: 'child_numerology',
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
    features: {
      basic: [
        'Характер ребёнка',
        'Скрытые таланты',
        'Основные страхи',
        'Рекомендации родителям'
      ],
      full: [
        'Всё из базового',
        'Отношения с родителями',
        'Выбор профессии',
        'Здоровье и энергия',
        'План развития по возрастам'
      ]
    },
    buttonTextRu: 'Узнать ребёнка',
    buttonTextEn: 'Discover Your Child'
  },
  {
    id: 'compatibility',
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
    features: {
      basic: [
        'Совместимость по датам',
        'Сильные стороны пары',
        'Зоны конфликтов',
        'Базовые рекомендации'
      ],
      full: [
        'Всё из базового',
        'Кармические связи',
        'Сексуальная совместимость',
        'Финансовая совместимость',
        'Прогноз отношений',
        'Детальные рекомендации'
      ]
    },
    buttonTextRu: 'Проверить совместимость',
    buttonTextEn: 'Check Compatibility'
  },
  {
    id: 'money_numerology',
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
    features: {
      basic: [
        'Расчёт денежного кода',
        'Основные блоки',
        'Кармические долги',
        'Базовые рекомендации'
      ],
      full: [
        'Всё из базового',
        'Детальный анализ блоков',
        'Благоприятные периоды',
        'Способы активации',
        'Инвестиционный потенциал',
        'Персональные практики'
      ]
    },
    buttonTextRu: 'Активировать деньги',
    buttonTextEn: 'Activate Money'
  },
  {
    id: 'yearly_forecast',
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
    features: {
      basic: [
        'Прогноз на 12 месяцев',
        'Ключевые события',
        'Благоприятные периоды',
        'Предупреждения'
      ],
      full: [
        'Всё из базового',
        'Детальный прогноз по месяцам',
        'Финансовый прогноз',
        'Прогноз отношений',
        'Здоровье и энергия',
        'Рекомендации по месяцам'
      ]
    },
    buttonTextRu: 'Узнать будущее',
    buttonTextEn: 'Discover Future'
  },
  {
    id: 'pythagorean_full',
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
    features: {
      basic: [
        'Построение квадрата',
        'Разбор всех ячеек',
        'Основные линии',
        'Характер и темперамент'
      ],
      full: [
        'Всё из базового',
        'Все 8 линий квадрата',
        'Пустые ячейки',
        'Переизбыток цифр',
        'Совместимость с другими',
        'Рекомендации по развитию'
      ]
    },
    buttonTextRu: 'Построить квадрат',
    buttonTextEn: 'Build Square'
  },
  {
    id: 'pro_access',
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
    features: {
      basic: [
        'Разовый отчёт',
        'Все расчёты',
        'Профессиональный формат',
        'Без воды'
      ],
      full: [
        'До 30 отчётов/месяц',
        'Все типы расчётов',
        'White Label (опционально)',
        'Приоритетная поддержка',
        'API доступ'
      ]
    },
    buttonTextRu: 'Начать работать',
    buttonTextEn: 'Start Working'
  },
  {
    id: 'gift_certificate',
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
    features: {
      basic: [
        'Красивая электронная открытка',
        'Уникальный код активации',
        'Базовый отчёт на выбор',
        'Персональное поздравление'
      ],
      full: [
        'Всё из базового',
        'Полный отчёт любого типа',
        'Премиум дизайн открытки',
        'Видео-поздравление',
        'Срок действия 1 год'
      ]
    },
    buttonTextRu: 'Подарить',
    buttonTextEn: 'Gift Now'
  },
  {
    id: 'consultation',
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
    features: {
      basic: [
        'Онлайн-консультация 60 минут',
        'Разбор вашей матрицы судьбы',
        'Ответы на 3 вопроса',
        'Запись консультации',
        'Краткие рекомендации'
      ],
      full: [
        'Всё из базового',
        'Консультация 90 минут',
        'Неограниченное количество вопросов',
        'Детальный письменный отчёт',
        'Персональные практики',
        'Поддержка 30 дней после консультации'
      ]
    },
    buttonTextRu: 'Записаться',
    buttonTextEn: 'Book Now'
  }
];

// Keep as fallback
const defaultServices = services;

export default function PremiumServices() {
  const locale = useLocale();
  const [services, setServices] = useState<PremiumService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<PremiumService | null>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'full'>('basic');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);

  // Load services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        // Map database format to component format
        const mappedServices: PremiumService[] = data.services.map((s: any) => ({
          id: s.serviceId,
          titleRu: s.titleRu,
          titleEn: s.titleEn,
          descriptionRu: s.descriptionRu,
          descriptionEn: s.descriptionEn,
          hookRu: s.hookRu,
          hookEn: s.hookEn,
          priceBasicRUB: s.priceBasicRUB,
          priceBasicUSD: s.priceBasicUSD,
          priceFullRUB: s.priceFullRUB,
          priceFullUSD: s.priceFullUSD,
          icon: s.icon,
          color: s.color,
          features: {
            basic: s.featuresBasic,
            full: s.featuresFull,
          },
          buttonTextRu: s.buttonTextRu,
          buttonTextEn: s.buttonTextEn,
        }));
        
        // If API returns empty array, use fallback
        if (mappedServices.length === 0) {
          setServices(defaultServices);
        } else {
          setServices(mappedServices);
        }
      } else {
        // API error, use fallback
        setServices(defaultServices);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to hardcoded services if API fails
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (service: PremiumService, tier: 'basic' | 'full') => {
    setSelectedService(service);
    setSelectedTier(tier);
    
    // If it's a gift certificate, show gift modal first
    if (service.id === 'gift_certificate') {
      setIsGiftModalOpen(true);
    } 
    // If it's a consultation, show consultation modal first
    else if (service.id === 'consultation') {
      setIsConsultationModalOpen(true);
    } 
    else {
      setIsPaymentModalOpen(true);
    }
  };

  const handleGiftDataSubmit = (data: GiftData) => {
    setGiftData(data);
    setIsGiftModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handleConsultationDataSubmit = (data: ConsultationData) => {
    setConsultationData(data);
    setIsConsultationModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    setIsGiftModalOpen(false);
    setIsConsultationModalOpen(false);
    setSelectedService(null);
    setGiftData(null);
    setConsultationData(null);
  };

  // Prepare service for payment modal
  const getPaymentService = () => {
    if (!selectedService) return null;
    
    const isBasic = selectedTier === 'basic';
    return {
      id: `${selectedService.id}_${selectedTier}`,
      titleKey: locale === 'ru' 
        ? `${selectedService.titleRu} (${isBasic ? 'Базовый' : 'Полный'})`
        : `${selectedService.titleEn} (${isBasic ? 'Basic' : 'Full'})`,
      priceRUB: isBasic ? selectedService.priceBasicRUB : (selectedService.priceFullRUB || selectedService.priceBasicRUB),
      priceEUR: isBasic ? selectedService.priceBasicUSD : (selectedService.priceFullUSD || selectedService.priceBasicUSD),
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-12 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFD700] mb-4 drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
          {locale === 'ru' ? 'Премиум услуги' : 'Premium Services'}
        </h2>
        <p className="text-purple-200 text-lg sm:text-xl max-w-3xl mx-auto">
          {locale === 'ru' 
            ? 'Глубокий анализ вашей судьбы и предназначения'
            : 'Deep analysis of your destiny and purpose'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
          <p className="text-purple-200 mt-4">{locale === 'ru' ? 'Загрузка...' : 'Loading...'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
          <div
            key={service.id}
            className="glass-strong rounded-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up border border-purple-400/30 flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className="text-5xl mb-4 text-center animate-float">
              {service.icon}
            </div>

            {/* Service Title */}
            <h3 className="text-2xl sm:text-3xl font-bold text-[#FFD700] mb-2 text-center">
              {locale === 'ru' ? service.titleRu : service.titleEn}
            </h3>

            {/* Hook */}
            <p className="text-purple-300 italic text-center mb-4 min-h-[48px] text-sm">
              &ldquo;{locale === 'ru' ? service.hookRu : service.hookEn}&rdquo;
            </p>

            {/* Service Description */}
            <p className="text-purple-200 mb-6 text-center">
              {locale === 'ru' ? service.descriptionRu : service.descriptionEn}
            </p>

            {/* Pricing Tiers */}
            <div className="space-y-4 mb-6 flex-grow">
              {/* Basic Tier */}
              <div className="glass rounded-lg p-4 border border-purple-400/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-white">
                    {locale === 'ru' ? 'Базовый' : 'Basic'}
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#FFD700]">
                      {service.priceBasicRUB} ₽
                    </div>
                    <div className="text-xs text-purple-300">
                      ${service.priceBasicUSD}
                    </div>
                  </div>
                </div>
                <ul className="space-y-1 mb-3">
                  {service.features.basic.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start text-purple-200 text-sm">
                      <span className="text-green-400 mr-2 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuyClick(service, 'basic')}
                  className={`w-full py-2 px-4 rounded-lg transition-all text-sm font-semibold bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}
                >
                  {locale === 'ru' ? 'Купить' : 'Buy'}
                </button>
              </div>

              {/* Full Tier */}
              {service.priceFullRUB && (
                <div className="glass rounded-lg p-4 border-2 border-[#FFD700]/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#FFD700] text-[#2D1B4E] text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {locale === 'ru' ? 'ПОЛНЫЙ' : 'FULL'}
                  </div>
                  <div className="flex justify-between items-center mb-3 mt-2">
                    <span className="font-semibold text-white">
                      {locale === 'ru' ? 'Полный' : 'Full'}
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#FFD700]">
                        {service.priceFullRUB} ₽
                      </div>
                      <div className="text-xs text-purple-300">
                        ${service.priceFullUSD}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {service.features.full?.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start text-purple-200 text-sm">
                        <span className="text-[#FFD700] mr-2 flex-shrink-0">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleBuyClick(service, 'full')}
                    className="w-full py-2 px-4 rounded-lg transition-all text-sm font-semibold bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#2D1B4E] shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  >
                    {locale === 'ru' ? 'Купить полный' : 'Buy Full'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Gift Certificate Modal */}
      {selectedService?.id === 'gift_certificate' && (
        <GiftCertificateModal
          isOpen={isGiftModalOpen}
          onClose={() => {
            setIsGiftModalOpen(false);
            setSelectedService(null);
          }}
          tier={selectedTier}
          onProceedToPayment={handleGiftDataSubmit}
        />
      )}

      {/* Consultation Modal */}
      {selectedService?.id === 'consultation' && (
        <ConsultationModal
          isOpen={isConsultationModalOpen}
          onClose={() => {
            setIsConsultationModalOpen(false);
            setSelectedService(null);
          }}
          tier={selectedTier}
          onProceedToPayment={handleConsultationDataSubmit}
        />
      )}

      {/* Payment Modal */}
      {selectedService && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedService(null);
            setGiftData(null);
            setConsultationData(null);
          }}
          service={getPaymentService()!}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
