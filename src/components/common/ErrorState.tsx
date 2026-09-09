import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { useStore } from '../../context/StoreContext';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content. Please try again.',
  onRetry,
}) => {
  const { isPremium } = useStore();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
          isPremium ? 'bg-amber-950/40 text-[#D4AF37]' : 'bg-red-50 text-red-500'
        }`}
      >
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${isPremium ? 'font-luxury text-white' : 'text-gray-900'}`}>
        {title}
      </h3>
      <p className={`text-sm mb-6 ${isPremium ? 'text-zinc-400' : 'text-gray-600'}`}>
        {message}
      </p>
      {onRetry && (
        <Button variant={isPremium ? 'outline' : 'primary'} size="sm" onClick={onRetry} leftIcon={<RotateCcw className="w-4 h-4 mr-1" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
