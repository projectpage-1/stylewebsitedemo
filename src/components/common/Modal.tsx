import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  const { isPremium } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        className={`relative w-full ${widthClasses} z-10 overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
          isPremium
            ? 'bg-[#18181D] border border-[#D4AF37]/30 text-white'
            : 'bg-white border border-gray-200 text-gray-900'
        }`}
      >
        {title && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-b ${
              isPremium ? 'border-zinc-800' : 'border-gray-100'
            }`}
          >
            <h3 className={`text-lg font-bold ${isPremium ? 'font-luxury text-[#E5C158]' : ''}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isPremium
                  ? 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
