'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

interface PersonalizedGreetingProps {
  userName?: string;
  arcanaNumber?: number;
  arcanaTitle?: string;
}

export default function PersonalizedGreeting({ userName, arcanaNumber, arcanaTitle }: PersonalizedGreetingProps) {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!userName || !arcanaNumber) return null;

  // Цвет аватара зависит от аркана
  const getAvatarColor = (arcana: number) => {
    const colors = [
      'from-red-500 to-orange-500',      // 1-5
      'from-yellow-500 to-amber-500',    // 6-10
      'from-green-500 to-emerald-500',   // 11-15
      'from-blue-500 to-cyan-500',       // 16-20
      'from-purple-500 to-violet-500',   // 21-22
    ];
    const index = Math.floor((arcana - 1) / 5);
    return colors[Math.min(index, colors.length - 1)];
  };

  return (
    <div 
      className={`bg-gradient-to-r from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-6 border border-purple-400/30 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Аватар-иконка ведьмы */}
        <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${getAvatarColor(arcanaNumber)} p-1 animate-breathing-glow`}>
          <div className="w-full h-full rounded-full bg-purple-950/80 flex items-center justify-center">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
              {/* Силуэт ведьмы с полумесяцем */}
              <path d="M12 2C11.5 2 11 2.19 10.59 2.59L8 5.17V8C8 9.1 8.9 10 10 10H14C15.1 10 16 9.1 16 8V5.17L13.41 2.59C13 2.19 12.5 2 12 2M12 4L14 6V8H10V6L12 4M12 11C10.34 11 9 12.34 9 14V16C9 17.66 10.34 19 12 19C13.66 19 15 17.66 15 16V14C15 12.34 13.66 11 12 11M7 14C5.9 14 5 14.9 5 16V18C5 19.1 5.9 20 7 20C8.1 20 9 19.1 9 18V16C9 14.9 8.1 14 7 14M17 14C15.9 14 15 14.9 15 16V18C15 19.1 15.9 20 17 20C18.1 20 19 19.1 19 18V16C19 14.9 18.1 14 17 14M12 20C10.9 20 10 20.9 10 22H14C14 20.9 13.1 20 12 20Z" />
              {/* Полумесяц */}
              <path d="M19 2C18 2 17 2.5 17 3.5C17 4.5 18 5 19 5C20 5 21 4.5 21 3.5C21 2.5 20 2 19 2M19 3C19.5 3 20 3.2 20 3.5C20 3.8 19.5 4 19 4C18.5 4 18 3.8 18 3.5C18 3.2 18.5 3 19 3Z" opacity="0.7" />
            </svg>
          </div>
        </div>

        {/* Приветствие */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-pulse">✨</span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {locale === 'ru' ? `С возвращением, ${userName}` : `Welcome back, ${userName}`}
            </h3>
            <span className="text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>✨</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathing-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
          }
          50% {
            box-shadow: 0 0 25px rgba(251, 191, 36, 0.6);
          }
        }
        
        .animate-breathing-glow {
          animation: breathing-glow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
