import React from 'react';
import { useStore } from '../../context/StoreContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'luxury' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const { isPremium } = useStore();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs tracking-wider font-semibold rounded-md gap-1.5',
    md: 'px-5 py-2.5 text-sm tracking-wide font-semibold rounded-lg gap-2',
    lg: 'px-7 py-3.5 text-base tracking-wider font-semibold rounded-xl gap-2.5',
  }[size];

  let variantClasses = '';
  if (isPremium) {
    switch (variant) {
      case 'primary':
      case 'luxury':
        variantClasses =
          'bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-[#0E0E11] hover:brightness-110 shadow-lg shadow-[#D4AF37]/10 active:scale-[0.99] font-luxury';
        break;
      case 'secondary':
        variantClasses =
          'bg-[#212126] text-[#F5F5F7] hover:bg-[#2A2A32] border border-[#3F3F46]';
        break;
      case 'outline':
        variantClasses =
          'bg-transparent text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5';
        break;
      case 'danger':
        variantClasses = 'bg-red-950 text-red-300 border border-red-800 hover:bg-red-900';
        break;
    }
  } else {
    switch (variant) {
      case 'primary':
        variantClasses =
          'bg-gray-900 text-white hover:bg-black active:scale-[0.99] shadow-sm';
        break;
      case 'secondary':
        variantClasses =
          'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200';
        break;
      case 'outline':
        variantClasses =
          'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-50';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100';
        break;
      case 'danger':
        variantClasses = 'bg-red-600 text-white hover:bg-red-700';
        break;
      case 'luxury':
        variantClasses =
          'bg-amber-600 text-white hover:bg-amber-700 shadow-md font-medium';
        break;
    }
  }

  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${variantClasses} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
