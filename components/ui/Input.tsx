import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  error,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  id,
  name,
}) => {
  const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'w-full px-4 py-2 text-base border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] bg-white/10 backdrop-blur-sm text-white placeholder-purple-300';
  
  const stateStyles = error
    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
    : 'border-purple-400/30 focus:ring-[#FFD700] focus:border-[#FFD700] hover:border-purple-400/50';
  
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-purple-200"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`${baseStyles} ${stateStyles}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      
      {error && (
        <span
          id={`${inputId}-error`}
          className="text-sm text-red-400"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
