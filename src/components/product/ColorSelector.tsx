import React from 'react';
import { ProductColor } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { Check } from 'lucide-react';

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor?: string;
  onSelectColor: (colorName: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  const { isPremium } = useStore();

  if (colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Color: <strong className="text-zinc-900 dark:text-zinc-100">{selectedColor || colors[0]?.name}</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {colors.map((c) => {
          const isSelected = selectedColor === c.name;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectColor(c.name)}
              className={`group relative rounded-xl p-1.5 transition-all duration-200 flex items-center gap-2 cursor-pointer border text-left ${
                isSelected
                  ? isPremium
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-1 ring-[#D4AF37] shadow-sm'
                    : 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950 shadow-xs'
                  : isPremium
                  ? 'border-[#2A2A35] bg-[#15151D] hover:border-zinc-600'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              }`}
              title={c.name}
            >
              {c.imageUrl ? (
                <div className="w-8 h-10 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                  <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <span
                  className="w-5 h-5 rounded-full border border-black/20 shadow-xs block shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
              )}

              <div className="pr-1.5">
                <span className="text-xs font-semibold block leading-tight">{c.name}</span>
                {isSelected && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3 inline" /> Selected
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
