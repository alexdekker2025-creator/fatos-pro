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
    id: 'pythagorean_full',
    titleRu: 'Квадрат Пифагора',
    titleEn: 'Pythagorean Square',
    descriptionRu: 'Ваш цифровой портрет',
    descriptionEn: 'Your digital portrait',
    hookRu: 'Для тех, кто хочет понять себя через цифры',
    hookEn: 'For those who want to understand themselves through numbers',
    priceBasicRUB: 2900,
    priceBasicUSD: 32,
    priceFullRUB: 4900,
    priceFullUSD: 54,
    icon: '🧮',
    color: 'from-green-500 to-emerald-600',
    features: {
      basic: [
        'Готовая таблица 3×3',
        'Краткое значение каждой ячейки',
        'Сильные стороны',
        'Слабые стороны'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Подробная расшифровка каждой ячейки',
        'Линии силы (строки, столбцы, диагонали)',
        'Пустые ячейки',
        'Рекомендации под ваш профиль',
        'Как усилить то, что дано от природы'
      ]
    },
    buttonTextRu: 'Построить квадрат',
    buttonTextEn: 'Build Square'
  },
  {
    id: 'destiny_matrix',
    titleRu: 'Матрица судьбы',
    titleEn: 'Destiny Matrix',
    descriptionRu: 'Всё, чтобы понять главное',
    descriptionEn: 'Everything to understand the main thing',
    hookRu: 'Для тех, кто хочет заглянуть в себя',
    hookEn: 'For those who want to look inside themselves',
    priceBasicRUB: 3500,
    priceBasicUSD: 39,
    priceFullRUB: 5500,
    priceFullUSD: 61,
    icon: '🔮',
    color: 'from-purple-600 to-indigo-700',
    features: {
      basic: [
        'Базовый расчёт матрицы',
        '4 ключевых аркана',
        'Основные кармические задачи',
        'Направление развития'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Полная расшифровка всех арканов (до 12 позиций)',
        'Детальный разбор теневых зон',
        'Предназначение по сферам: деньги, отношения, карьера',
        'Конкретные шаги под вашу дату'
      ]
    },
    buttonTextRu: 'Рассчитать матрицу',
    buttonTextEn: 'Calculate Matrix'
  },
  {
    id: 'money_numerology',
    titleRu: 'Денежная нумерология',
    titleEn: 'Money Numerology',
    descriptionRu: 'Ваш денежный код',
    descriptionEn: 'Your money code',
    hookRu: 'Для тех, кто хочет узнать свой финансовый потенциал',
    hookEn: 'For those who want to know their financial potential',
    priceBasicRUB: 3900,
    priceBasicUSD: 43,
    priceFullRUB: 5900,
    priceFullUSD: 66,
    icon: '💰',
    color: 'from-yellow-500 to-amber-600',
    features: {
      basic: [
        '4 цифры денежного кода',
        'Базовое значение',
        'Финансовый потенциал',
        'Энергия денег'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Полная расшифровка финансовых блоков',
        'Почему деньги утекают',
        'Кармические долги',
        'В какой сфере легче всего зарабатывать',
        'Конкретные шаги по активации кода'
      ]
    },
    buttonTextRu: 'Активировать деньги',
    buttonTextEn: 'Activate Money'
  },
  {
    id: 'yearly_forecast',
    titleRu: 'Годовой прогноз',
    titleEn: 'Yearly Forecast',
    descriptionRu: 'Основные тенденции года',
    descriptionEn: 'Main trends of the year',
    hookRu: 'Для тех, кто хочет заглянуть в будущее',
    hookEn: 'For those who want to look into the future',
    priceBasicRUB: 4900,
    priceBasicUSD: 54,
    priceFullRUB: 6900,
    priceFullUSD: 77,
    icon: '📅',
    color: 'from-blue-500 to-cyan-600',
    features: {
      basic: [
        'Помесячный прогноз (1-2 предложения)',
        'Общая энергия года',
        'Главные события',
        'Планирование дел'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Детальный разбор каждого месяца с акцентом на деньги, отношения и карьеру',
        'Ключевые даты',
        'Периоды риска и возможности',
        'Персонализированные рекомендации'
      ]
    },
    buttonTextRu: 'Узнать будущее',
    buttonTextEn: 'Discover Future'
  },
  {
    id: 'child_numerology',
    titleRu: 'Детская нумерология',
    titleEn: 'Child Numerology',
    descriptionRu: 'Таланты и характер ребёнка',
    descriptionEn: 'Child talents and character',
    hookRu: 'Для родителей, которые хотят быть ближе',
    hookEn: 'For parents who want to be closer',
    priceBasicRUB: 2900,
    priceBasicUSD: 32,
    priceFullRUB: 4900,
    priceFullUSD: 54,
    icon: '👶',
    color: 'from-pink-500 to-rose-600',
    features: {
      basic: [
        'Основные черты характера',
        'Природные способности',
        'Зоны роста',
        'Базовые рекомендации'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Детальный разбор страхов и уязвимостей',
        'Скрытые таланты',
        'Рекомендации под конкретный возраст',
        'Как общаться, чтобы ребёнок доверял',
        'Что делать, если ребёнок закрывается'
      ]
    },
    buttonTextRu: 'Узнать ребёнка',
    buttonTextEn: 'Discover Your Child'
  },
  {
    id: 'compatibility',
    titleRu: 'Совместимость',
    titleEn: 'Compatibility',
    descriptionRu: 'Подходите ли вы друг другу?',
    descriptionEn: 'Are you compatible?',
    hookRu: 'Для тех, кто хочет проверить себя и партнёра',
    hookEn: 'For those who want to check themselves and their partner',
    priceBasicRUB: 3900,
    priceBasicUSD: 43,
    priceFullRUB: 5900,
    priceFullUSD: 66,
    icon: '💞',
    color: 'from-red-500 to-pink-600',
    features: {
      basic: [
        'Общий вывод о совместимости',
        'Основные зоны конфликтов',
        'Краткие рекомендации',
        'Направление отношений'
      ],
      full: [
        'Всё из тарифа «Старт»',
        'Детальный анализ по 5 сферам: энергия, интеллект, быт, эмоции, близость',
        'Прогноз развития отношений',
        'Пошаговые рекомендации под ваш тип пары',
        'Кармические задачи, которые вы пришли решать вдвоём'
      ]
    },
    buttonTextRu: 'Проверить совместимость',
    buttonTextEn: 'Check Compatibility'
  },
  {
    id: 'pro_access',
    titleRu: 'Профи-доступ',
    titleEn: 'Pro Access',
    descriptionRu: 'Для нумерологов',
    descriptionEn: 'For numerologists',
    hookRu: 'Сухие профессиональные данные, минимум воды, только расчёты',
    hookEn: 'Dry professional data, minimum water, only calculations',
    priceBasicRUB: 500,
    priceBasicUSD: 6,
    priceFullRUB: 2500,
    priceFullUSD: 28,
    icon: '🧠',
    color: 'from-slate-600 to-gray-700',
    features: {
      basic: [
        'Разовый отчёт',
        'Для одного клиента',
        'Готовая основа для консультации',
        'Экономия времени'
      ],
      full: [
        'До 30 отчётов/месяц',
        'Единый стиль для всех клиентов',
        'Можно использовать как основу',
        'Экономия времени',
        'Профессиональный формат'
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
        
        // Check if data.services exists and is an array
        if (!data.services || !Array.isArray(data.services)) {
          console.warn('API returned invalid data structure, using fallback');
          setServices(defaultServices);
          return;
        }
        
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
            basic: s.featuresBasic || [],
            full: s.featuresFull || undefined,
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
    <div className="max-w-7xl mx-auto py-8 sm:py-12">
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
          {services && services.length > 0 ? services
            .filter(s => s.id !== 'pro_access' && s.id !== 'gift_certificate' && s.id !== 'consultation')
            .map((service, index) => (
          <div
            key={service.id}
            className="glass-strong rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up border border-purple-400/30 flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className="text-4xl mb-3 text-center animate-float">
              {service.icon}
            </div>

            {/* Service Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFD700] mb-4 text-center">
              {locale === 'ru' ? service.titleRu : service.titleEn}
            </h3>

            {/* Pricing Tiers */}
            <div className="space-y-4 mb-6 flex-grow">
              {/* Basic Tier */}
              <div className="glass rounded-lg p-3 border border-purple-400/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white text-sm">
                    🌿 {locale === 'ru' ? 'СТАРТ' : 'START'}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#FFD700]">
                      {service.priceBasicRUB} ₽
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBuyClick(service, 'basic')}
                  className={`w-full py-2 px-4 rounded-lg transition-all text-sm font-semibold bg-gradient-to-r ${service.color} hover:opacity-90 text-white`}
                >
                  {locale === 'ru' ? 'Скоро доступно' : 'Coming Soon'}
                </button>
              </div>

              {/* Full Tier */}
              {service.priceFullRUB && service.features.full && (
                <div className="glass rounded-lg p-3 border-2 border-[#FFD700]/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#FFD700] text-[#2D1B4E] text-xs font-bold px-2 py-1 rounded-bl-lg">
                    🔥
                  </div>
                  <div className="flex justify-between items-center mb-2 mt-2">
                    <span className="font-semibold text-white text-sm">
                      🔥 {locale === 'ru' ? 'ГЛУБОКИЙ' : 'DEEP'}
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#FFD700]">
                        {service.priceFullRUB} ₽
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBuyClick(service, 'full')}
                    className="w-full py-2 px-4 rounded-lg transition-all text-sm font-semibold bg-gradient-to-r from-[#FFD700] to-amber-500 hover:from-amber-500 hover:to-[#FFD700] text-[#2D1B4E] shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                  >
                    {locale === 'ru' ? 'Скоро доступно' : 'Coming Soon'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12">
            <p className="text-purple-200 text-lg">
              {locale === 'ru' ? 'Услуги временно недоступны' : 'Services temporarily unavailable'}
            </p>
          </div>
        )}
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
