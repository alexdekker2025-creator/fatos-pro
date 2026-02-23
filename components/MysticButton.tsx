/**
 * Мистическая кнопка с loading-состоянием
 */

'use client';

import { ButtonHTMLAttributes } from 'react';

interface MysticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function MysticButton({
  loading = false,
  variant = 'primary',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}: MysticButtonProps) {
  const baseClasses = 'relative px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50',
    secondary: 'glass hover:glass-strong text-white border border-purple-400/30 hover:border-purple-400/50',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-red-500/50'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer эффект при наведении */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Контент кнопки */}
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            {/* Мини-загрузчик */}
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="animate-pulse-text">Загрузка...</span>
          </>
        ) : (
          children
        )}
      </span>

      {/* Магическое свечение при loading */}
      {loading && (
        <div className="absolute inset-0 animate-pulse-glow bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 blur-xl" />
      )}
    </button>
  );
}
