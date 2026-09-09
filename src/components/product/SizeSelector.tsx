import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Ruler } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize?: string;
  onSelectSize: (size: string) => void;
  error?: string | null;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  error,
}) => {
  const { isPremium } = useStore();

  if (sizes.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Select Size <span className="text-rose-500">*</span>
        </span>
        <button
          type="button"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#D4AF37] hover:underline cursor-pointer"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Size Chart</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`min-w-12 h-11 px-3.5 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 shadow-md shadow-[#D4AF37]/20 font-luxury'
                    : 'bg-zinc-900 text-white shadow-sm'
                  : isPremium
                  ? 'bg-[#1C1C24] text-zinc-300 hover:bg-[#252530] border border-[#2E2E3C]'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};
