import React from 'react';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  footer,
  variant = 'default',
}) => {
  const baseStyles = 'rounded-lg overflow-hidden transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-gradient-to-br from-purple-950/80 via-indigo-950/80 to-purple-900/80 backdrop-blur-sm border-2 border-purple-500/30',
    bordered: 'bg-gradient-to-br from-purple-950/80 via-indigo-950/80 to-purple-900/80 backdrop-blur-sm border-2 border-amber-500/50',
    elevated: 'bg-gradient-to-br from-purple-950/90 via-indigo-950/90 to-purple-900/90 backdrop-blur-sm border-2 border-purple-500/40 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-amber-500/60',
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-purple-500/30 bg-purple-900/30">
          <h3 className="text-lg font-semibold text-amber-400">{title}</h3>
        </div>
      )}
      
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-purple-500/30 bg-purple-900/30">
          {footer}
        </div>
      )}
    </div>
  );
};
