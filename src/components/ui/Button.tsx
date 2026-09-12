import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold rounded-xl gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-school-600 hover:bg-school-700 text-white shadow-sm shadow-school-600/20 active:translate-y-0.5 focus:ring-4 focus:ring-school-100 transition-all duration-150',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 active:translate-y-0.5 focus:ring-4 focus:ring-slate-100 transition-all duration-150',
    outline:
      'border border-slate-300 hover:bg-slate-50 text-slate-700 hover:border-slate-400 active:translate-y-0.5 focus:ring-4 focus:ring-slate-100 transition-all duration-150',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 active:translate-y-0.5 focus:ring-4 focus:ring-rose-100 transition-all duration-150',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:translate-y-0.5 focus:ring-4 focus:ring-emerald-100 transition-all duration-150',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors',
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
