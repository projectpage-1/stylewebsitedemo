import React from 'react';
import { Category } from '../../types/category';
import { useStore } from '../../context/StoreContext';
import { Shirt, Sparkles, Smile, Footprints, Watch } from 'lucide-react';

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'shirt':
      return Shirt;
    case 'sparkles':
      return Sparkles;
    case 'smile':
      return Smile;
    case 'footprints':
      return Footprints;
    case 'watch':
      return Watch;
    default:
      return Sparkles;
  }
};

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { isPremium } = useStore();

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center justify-start md:justify-center gap-3 sm:gap-6 min-w-max px-2">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.iconName);
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                isSelected
                  ? isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-bold shadow-md shadow-[#D4AF37]/20 scale-105'
                    : 'bg-zinc-900 text-white font-bold shadow-sm scale-105'
                  : isPremium
                  ? 'bg-[#181820] text-zinc-300 hover:bg-[#22222C] border border-[#2E2E38]'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  isSelected
                    ? isPremium
                      ? 'bg-black/20 text-zinc-950'
                      : 'bg-white/20 text-white'
                    : isPremium
                    ? 'text-[#D4AF37]'
                    : 'text-zinc-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
