/**
 * Мистический загрузчик в стиле FATOS.pro
 * Используется для отображения состояния загрузки с магическими эффектами
 */

'use client';

interface MysticLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function MysticLoader({ 
  text = 'Загрузка...', 
  size = 'md',
  fullScreen = false 
}: MysticLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Внешнее кольцо с вращением */}
      <div className="relative">
        {/* Магический круг */}
        <div className={`${sizeClasses[size]} relative animate-spin-slow`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Внешний круг */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="10 5"
              className="animate-pulse"
            />
            {/* Средний круг */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
              strokeDasharray="5 3"
              className="animate-pulse"
              style={{ animationDelay: '0.3s' }}
            />
            {/* Внутренний круг */}
            <circle
              cx="50"
              cy="50"
              r="25"
              fill="none"
              stroke="url(#gradient3)"
              strokeWidth="1"
              strokeDasharray="3 2"
              className="animate-pulse"
              style={{ animationDelay: '0.6s' }}
            />
            
            {/* Градиенты */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Центральная звезда */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse-glow">
            <svg className={size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="url(#starGradient)"
                className="drop-shadow-glow"
              />
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Плавающие частицы */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float"
              style={{
                left: `${20 + i * 12}%`,
                top: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Текст загрузки */}
      {text && (
        <div className={`${textSizeClasses[size]} text-purple-200 font-medium animate-pulse-text`}>
          {text}
        </div>
      )}

      {/* Анимированные точки */}
      <div className="flex gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#2D1B4E] via-purple-900 to-indigo-950 flex items-center justify-center z-50">
        <div className="relative">
          {/* Фоновое свечение */}
          <div className="absolute inset-0 blur-3xl bg-purple-500/20 animate-pulse" />
          {content}
        </div>
      </div>
    );
  }

  return content;
}
