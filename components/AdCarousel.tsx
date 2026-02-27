'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Ad {
  id: string;
  title: string;
  description: string;
  bgGradient: string;
  icon: string;
}

function AdCarousel() {
  const t = useTranslations('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const ads: Ad[] = [
    {
      id: 'pro_access',
      title: 'Профи-доступ для нумерологов',
      description: 'Получите доступ ко всем расчетам и инструментам для профессиональной работы',
      bgGradient: 'from-purple-600 to-indigo-600',
      icon: '🎯'
    },
    {
      id: 'premium_1',
      title: t('premiumAd.title'),
      description: t('premiumAd.description'),
      bgGradient: 'from-purple-600 to-pink-600',
      icon: '✨'
    },
    {
      id: 'premium_2',
      title: t('premiumAd.title2'),
      description: t('premiumAd.description2'),
      bgGradient: 'from-indigo-600 to-purple-600',
      icon: '🔮'
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % ads.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides Container */}
      <div className="relative h-48 sm:h-56">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="min-w-full h-full flex-shrink-0"
            >
              <div className={`h-full bg-gradient-to-r ${ad.bgGradient} p-4 sm:p-6 flex flex-col justify-start items-center text-center pt-6 sm:pt-8`}>
                <div className="text-4xl sm:text-5xl mb-2">{ad.icon}</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {ad.title}
                </h3>
                <p className="text-white/90 text-sm sm:text-base max-w-2xl">
                  {ad.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl sm:text-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Next slide"
      >
        ›
      </button>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <Link
          href="#premium"
          className="inline-block px-6 py-2.5 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Узнать больше
        </Link>
      </div>
    </div>
  );
}

export default AdCarousel;
