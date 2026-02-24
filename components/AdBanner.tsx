'use client';

import { useState, useEffect } from 'react';

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
  bgGradient: string;
}

const ads: Ad[] = [
  {
    id: 1,
    title: '🔮 Персональный расчет судьбы',
    description: 'Получите детальный анализ вашей матрицы судьбы от профессионального нумеролога',
    image: '✨',
    link: '#',
    bgGradient: 'from-purple-600 via-pink-600 to-red-600',
  },
  {
    id: 2,
    title: '📚 Курс по нумерологии',
    description: 'Изучите тайны чисел и научитесь делать расчеты самостоятельно',
    image: '🎓',
    link: '#',
    bgGradient: 'from-blue-600 via-indigo-600 to-purple-600',
  },
  {
    id: 3,
    title: '🎯 Консультация эксперта',
    description: 'Индивидуальная консультация с опытным нумерологом онлайн',
    image: '💫',
    link: '#',
    bgGradient: 'from-amber-600 via-orange-600 to-red-600',
  },
];

export default function AdBanner() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        setIsAnimating(false);
      }, 600);
    }, 10000); // Change ad every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const currentAd = ads[currentAdIndex];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-amber-500/40">
        {/* Background gradient with slide animation */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentAd.bgGradient} opacity-90 transition-transform duration-600 ${
            isAnimating ? '-translate-x-full' : 'translate-x-0'
          }`}
        />
        
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '20%', left: '10%' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '60%', left: '80%', animationDelay: '1s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full animate-twinkle" style={{ top: '40%', left: '50%', animationDelay: '2s' }} />
        </div>

        {/* Content with slide animation */}
        <div
          className={`relative z-10 px-6 sm:px-8 py-8 sm:py-12 transition-all duration-600 ${
            isAnimating ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Icon */}
            <div className="text-6xl sm:text-7xl animate-pulse">
              {currentAd.image}
            </div>

            {/* Text content */}
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {currentAd.title}
              </h3>
              <p className="text-white/90 text-base sm:text-lg">
                {currentAd.description}
              </p>
            </div>

            {/* CTA Button */}
            {currentAd.link && (
              <a
                href={currentAd.link}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-amber-400 hover:scale-105 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base whitespace-nowrap"
              >
                Узнать больше →
              </a>
            )}
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => {
                    setCurrentAdIndex(index);
                    setIsAnimating(false);
                  }, 500);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentAdIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
