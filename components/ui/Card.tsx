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
    default: 'bg-white',
    bordered: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
};
