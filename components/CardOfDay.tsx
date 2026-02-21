'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

interface CardOfDayProps {
  arcana: {
    morning: number;
    day: number;
    evening: number;
    night: number;
  };
}

interface ArcanaArticle {
  title: string;
  content: string;
}

export default function CardOfDay({ arcana }: CardOfDayProps) {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [articles, setArticles] = useState<Record<number, ArcanaArticle>>({});
  const [autoFlipped, setAutoFlipped] = useState(false);

  const cards = [
    { key: 'morning', value: arcana.morning, label: locale === 'ru' ? 'Утро' : 'Morning', color: 'from-yellow-400 to-orange-500' },
    { key: 'day', value: arcana.day, label: locale === 'ru' ? 'День' : 'Day', color: 'from-blue-400 to-cyan-500' },
    { key: 'evening', value: arcana.evening, label: locale === 'ru' ? 'Вечер' : 'Evening', color: 'from-purple-400 to-pink-500' },
    { key: 'night', value: arcana.night, label: locale === 'ru' ? 'Ночь' : 'Night', color: 'from-indigo-600 to-purple-700' },
  ];

  // Auto-flip первой карты (День) при загрузке
  useEffect(() => {
    if (!autoFlipped) {
      const timer = setTimeout(() => {
        setFlipped({ day: true });
        setAutoFlipped(true);
      }, 800); // Задержка перед автоматическим переворотом
      
      return () => clearTimeout(timer);
    }
  }, [autoFlipped]);

  // Load arcana descriptions
  useEffect(() => {
    const loadArticles = async () => {
      const arcanaNumbers = [arcana.morning, arcana.day, arcana.evening, arcana.night];
      const uniqueArcanas = [...new Set(arcanaNumbers)];
      
      console.log('Loading articles for arcanas:', uniqueArcanas);
      
      const loadedArticles: Record<number, ArcanaArticle> = {};
      
      for (const num of uniqueArcanas) {
        try {
          const url = `/api/articles?relatedValue=arcana_${num}&language=${locale}`;
          console.log('Fetching:', url);
          
          const response = await fetch(url);
          console.log(`Response for arcana ${num}:`, response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Data for arcana ${num}:`, data);
            
            if (data.articles && data.articles.length > 0) {
              loadedArticles[num] = {
                title: data.articles[0].title,
                content: data.articles[0].content
              };
            } else {
              console.log(`No articles found for arcana ${num}`);
            }
          }
        } catch (error) {
          console.error(`Failed to load article for arcana ${num}:`, error);
        }
      }
      
      console.log('Loaded articles:', loadedArticles);
      setArticles(loadedArticles);
    };

    loadArticles();
  }, [arcana, locale]);

  const handleFlip = (key: string) => {
    setFlipped(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 lg:p-8 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-6 sm:mb-8">
        {t('cardOfDay')}
      </h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {cards.map((card) => {
          const article = articles[card.value];
          
          return (
            <div
              key={card.key}
              className="perspective-1000 relative"
              onClick={() => handleFlip(card.key)}
            >
              {/* Golden glow с пульсацией (breathing effect) */}
              <div className="absolute inset-0 rounded-xl animate-breathing-glow pointer-events-none z-0"></div>
              
              <div
                className={`relative w-full h-80 sm:h-96 lg:h-[28rem] transition-transform duration-700 transform-style-3d cursor-pointer z-10 ${
                  flipped[card.key] ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front of card - обратная сторона в фиолетово-золотой палитре */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 rounded-xl shadow-2xl border-4 border-amber-500/60 hover:border-amber-400/80 transition-all hover:shadow-[0_0_40px_rgba(251,191,36,0.4)] active:scale-95 overflow-hidden relative">
                    {/* Мистическая текстура */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `
                          radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
                          radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 60%)
                        `
                      }}></div>
                    </div>
                    
                    {/* Внутренняя светящаяся рамка */}
                    <div className="absolute inset-3 border-2 border-purple-400/30 rounded-lg shadow-inner"></div>
                    
                    {/* Декоративные углы */}
                    <div className="absolute top-4 left-4 w-12 h-12">
                      <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
                        <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
                        <circle cx="25" cy="25" r="6" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute top-4 right-4 w-12 h-12 transform rotate-90">
                      <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
                        <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
                        <circle cx="25" cy="25" r="6" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 transform -rotate-90">
                      <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
                        <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
                        <circle cx="25" cy="25" r="6" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute bottom-4 right-4 w-12 h-12 transform rotate-180">
                      <svg viewBox="0 0 100 100" className="text-amber-400/70" fill="currentColor">
                        <path d="M0,0 L100,0 L100,15 L15,15 L15,100 L0,100 Z" />
                        <circle cx="25" cy="25" r="6" fill="currentColor" />
                      </svg>
                    </div>
                    
                    {/* Центральный мистический символ */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {/* Внешний круг с узором */}
                        <svg className="w-40 h-40 text-purple-400/40" viewBox="0 0 200 200">
                          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="2" />
                          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
                          
                          {/* Звезда в центре */}
                          <path d="M100,35 L108,68 L142,68 L115,88 L125,122 L100,102 L75,122 L85,88 L58,68 L92,68 Z" 
                                fill="url(#starGradient)" opacity="0.8" />
                          
                          <defs>
                            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="rgb(251, 191, 36)" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.6" />
                            </linearGradient>
                          </defs>
                          
                          {/* Декоративные элементы по кругу */}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <g key={i} transform={`rotate(${angle} 100 100)`}>
                              <circle cx="100" cy="25" r="3" fill="rgb(251, 191, 36)" opacity="0.7" />
                              <path d="M100,28 L97,35 L103,35 Z" fill="rgb(168, 85, 247)" opacity="0.6" />
                            </g>
                          ))}
                        </svg>
                        
                        {/* Центральный символ */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-amber-400 text-5xl animate-pulse">✦</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Светящиеся частицы */}
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-70" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
                    
                    {/* Текст внизу */}
                    <div className="absolute bottom-10 left-0 right-0 text-center">
                      <div className="text-amber-400 text-base sm:text-lg font-semibold tracking-widest mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
                        {card.label}
                      </div>
                      <div className="text-purple-300 text-xs italic">
                        {locale === 'ru' ? 'Нажмите для просмотра' : 'Click to view'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of card - лицевая сторона в фиолетово-золотой палитре */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className={`h-full bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-950 rounded-xl shadow-2xl flex flex-col border-4 border-amber-500/60 p-4 sm:p-6 overflow-hidden relative`}>
                    {/* Мистическая текстура */}
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: `
                        radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.3) 0%, transparent 50%)
                      `
                    }}></div>
                    
                    {/* Внутренняя рамка */}
                    <div className="absolute inset-3 border-2 border-purple-400/20 rounded-lg"></div>
                    
                    {/* Верхняя часть - номер и название */}
                    <div className="flex-shrink-0 text-center relative z-10 mb-4">
                      <div className="inline-block bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full px-6 py-2 mb-3 border-2 border-amber-400/40">
                        <div className="text-5xl sm:text-6xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                          {card.value}
                        </div>
                      </div>
                      <div className="text-amber-400 text-lg sm:text-xl font-bold tracking-wide mb-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                        {card.label}
                      </div>
                      {article && (
                        <div className="text-purple-200 text-sm sm:text-base italic px-2">
                          {article.title}
                        </div>
                      )}
                      
                      {/* Декоративная линия */}
                      <div className="flex items-center justify-center mt-3 mb-2">
                        <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
                        <div className="mx-2 text-amber-400/70">✦</div>
                        <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
                      </div>
                    </div>
                    
                    {/* Центральная часть - описание */}
                    {article && (
                      <div className="flex-1 overflow-y-auto px-2 relative z-10 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
                        <p className="text-purple-100 text-xs sm:text-sm leading-relaxed text-center">
                          {article.content}
                        </p>
                      </div>
                    )}
                    
                    {!article && (
                      <div className="flex-1 flex items-center justify-center relative z-10">
                        <div className="text-purple-300 text-xs sm:text-sm italic">
                          {locale === 'ru' ? 'Загрузка описания...' : 'Loading description...'}
                        </div>
                      </div>
                    )}
                    
                    {/* Нижняя декоративная часть */}
                    <div className="flex-shrink-0 mt-4 relative z-10">
                      <div className="flex items-center justify-center">
                        <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
                        <div className="mx-2 text-amber-400/70 text-xs">✦</div>
                        <div className="h-px bg-purple-400/40 flex-1 max-w-[60px]"></div>
                      </div>
                    </div>
                    
                    {/* Угловые декоративные элементы */}
                    <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-amber-400/50"></div>
                    <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-amber-400/50"></div>
                    <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-amber-400/50"></div>
                    <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-amber-400/50"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        /* Golden glow с пульсацией (breathing effect) */
        @keyframes breathing-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.3),
                        0 0 40px rgba(251, 191, 36, 0.2),
                        0 0 60px rgba(251, 191, 36, 0.1);
            opacity: 0.6;
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.5),
                        0 0 60px rgba(251, 191, 36, 0.3),
                        0 0 90px rgba(251, 191, 36, 0.2);
            opacity: 1;
          }
        }
        
        .animate-breathing-glow {
          animation: breathing-glow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
