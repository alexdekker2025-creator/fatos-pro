import React from 'react';

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 active:bg-purple-800',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800',
    outline: 'bg-transparent border-2 border-white/30 text-white hover:bg-white/10 focus:ring-purple-500 active:bg-white/20',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px] min-w-[36px]',
    md: 'px-4 py-2 text-base min-h-[44px] min-w-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px] min-w-[52px]',
  };
  
  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
