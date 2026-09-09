import React from 'react';
import { Category, Subcategory } from '../../types/category';
import { useStore } from '../../context/StoreContext';
import { ChevronRight, Crown } from 'lucide-react';

interface CategoryHeaderProps {
  category: Category;
  subcategories: Subcategory[];
  selectedSubcategoryId?: string;
  onSelectSubcategory: (subId?: string) => void;
  productCount: number;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  subcategories,
  selectedSubcategoryId,
  onSelectSubcategory,
  productCount,
}) => {
  const { isPremium } = useStore();

  return (
    <div className="mb-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3">
        <span>Home</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="capitalize">{category.storeType === 'both' ? 'Catalog' : category.storeType}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{category.name}</span>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isPremium ? 'font-luxury text-white' : 'text-zinc-900'
              }`}
            >
              {category.title}
            </h1>
            {isPremium && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-luxury">
                <Crown className="w-3 h-3" />
                <span>PREMIUM</span>
              </span>
            )}
          </div>
          <p className={`text-xs sm:text-sm ${isPremium ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {category.description} • <strong>{productCount}</strong> styles available
          </p>
        </div>

        {/* Subcategory Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => onSelectSubcategory(undefined)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
              !selectedSubcategoryId
                ? isPremium
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 shadow-sm'
                  : 'bg-zinc-900 text-white shadow-xs'
                : isPremium
                ? 'bg-[#181820] text-zinc-400 hover:text-white border border-[#2E2E38]'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            All Items
          </button>

          {subcategories.map((sub) => {
            const isSelected = selectedSubcategoryId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSelectSubcategory(sub.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isPremium
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 shadow-sm'
                      : 'bg-zinc-900 text-white shadow-xs'
                    : isPremium
                    ? 'bg-[#181820] text-zinc-400 hover:text-white border border-[#2E2E38]'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
