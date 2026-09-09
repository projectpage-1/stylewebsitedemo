import React from 'react';
import { Category } from '../../types/category';
import { useStore } from '../../context/StoreContext';
import { CategoryCarousel } from './CategoryCarousel';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  const { isPremium } = useStore();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <span
          className={`text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${
            isPremium
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-luxury'
              : 'bg-zinc-100 text-zinc-700'
          }`}
        >
          {isPremium ? 'HAUTE ATELIER DEPARTMENTS' : 'CURATED COLLECTIONS'}
        </span>
        <h2
          className={`text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Explore by Category
        </h2>
        <p className={`text-sm max-w-xl mx-auto mt-2 ${isPremium ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Discover trending silhouettes and timeless fashion crafted for every occasion.
        </p>
      </div>

      {/* 1. Category Icon/Navigation Row (Horizontally scrolls on mobile, Layout 3 style) */}
      <div className="mb-10">
        <CategoryCarousel
          categories={categories}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* 2. Category Image Cards (Matching exact categoryId with icon) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {categories.map((cat) => (
          <div
            key={`card-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between ${
              isPremium
                ? 'bg-[#16161C] border border-[#2E2E38] hover:border-[#D4AF37]/60 shadow-lg shadow-black/50'
                : 'bg-white border border-zinc-200 hover:border-zinc-400 shadow-xs hover:shadow-md'
            }`}
          >
            {/* Image Container with strict aspect ratio and object-fit: cover */}
            <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-zinc-800">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isPremium
                    ? 'from-[#101014] via-[#101014]/40 to-transparent'
                    : 'from-black/70 via-black/20 to-transparent'
                }`}
              />

              {/* Category ID Indicator Badge for Verification */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/10">
                  ID: {cat.id}
                </span>
              </div>

              {/* Overlay Content */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-300">
                  {cat.name}
                </span>
                <h3 className={`text-lg font-bold ${isPremium ? 'font-luxury text-[#F3E5AB]' : ''}`}>
                  {cat.title}
                </h3>
              </div>
            </div>

            {/* Description & Action Footer */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <p className={`text-xs line-clamp-2 mb-3 leading-relaxed ${isPremium ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {cat.description}
              </p>

              <div
                className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider pt-2 border-t ${
                  isPremium
                    ? 'border-zinc-800 text-[#D4AF37] group-hover:text-amber-300'
                    : 'border-zinc-100 text-zinc-900 group-hover:text-blue-600'
                }`}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
