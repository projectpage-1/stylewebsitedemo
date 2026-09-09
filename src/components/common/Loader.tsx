import React from 'react';
import { useStore } from '../../context/StoreContext';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({ message = 'Loading Style Zone...', size = 'md' }) => {
  const { isPremium } = useStore();

  const spinnerSizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className={`rounded-full animate-spin ${spinnerSizes} ${
          isPremium
            ? 'border-[#D4AF37]/20 border-t-[#D4AF37]'
            : 'border-blue-200 border-t-blue-600'
        }`}
      />
      {message && (
        <p
          className={`mt-4 text-sm font-medium tracking-wide ${
            isPremium ? 'text-zinc-400 font-luxury' : 'text-gray-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};
