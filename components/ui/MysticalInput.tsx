import React from 'react';

export interface MysticalInputProps {
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

export const MysticalInput: React.FC<MysticalInputProps> = ({
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
  
  const baseStyles = 'w-full px-4 py-2 text-base border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] bg-purple-900/30 text-purple-100 placeholder-purple-400/60';
  
  const stateStyles = error
    ? 'border-red-500/60 focus:ring-red-500/50 focus:border-red-400'
    : 'border-purple-500/40 focus:ring-amber-500/50 focus:border-amber-400/60 hover:border-purple-400/60';
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-amber-400/90"
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
          className="text-sm text-red-300"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};
