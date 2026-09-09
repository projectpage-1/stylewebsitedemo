import React from 'react';
import { useStore } from '../../context/StoreContext';
import { RotateCcw, Check } from 'lucide-react';

export interface FilterState {
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  minRating?: number;
}

interface FilterSidebarProps {
  availableBrands: string[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  availableBrands,
  filters,
  onFilterChange,
  onReset,
}) => {
  const { isPremium } = useStore();

  const handleBrandToggle = (brand: string) => {
    const isSelected = filters.brands.includes(brand);
    const updated = isSelected
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: updated });
  };

  const handlePricePreset = (min?: number, max?: number) => {
    onFilterChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const pricePresets = [
    { label: 'Under ₹1,500', min: 0, max: 1500 },
    { label: '₹1,500 – ₹5,000', min: 1500, max: 5000 },
    { label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
    { label: 'Above ₹15,000 (Luxury)', min: 15000, max: undefined },
  ];

  return (
    <aside
      className={`w-full p-5 rounded-2xl border transition-all ${
        isPremium
          ? 'bg-[#14141A] border-[#2A2A35] text-zinc-300'
          : 'bg-white border-zinc-200 text-zinc-700'
      }`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-5">
        <h3 className={`text-sm font-bold uppercase tracking-wider ${isPremium ? 'text-white' : 'text-zinc-900'}`}>
          Filter Selection
        </h3>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-rose-500 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Brands Module */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Brands
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {availableBrands.map((brand) => {
              const checked = filters.brands.includes(brand);
              return (
                <label
                  key={brand}
                  className="flex items-center justify-between text-xs cursor-pointer hover:text-zinc-950 dark:hover:text-white"
                >
                  <span>{brand}</span>
                  <div
                    onClick={() => handleBrandToggle(brand)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors border ${
                      checked
                        ? isPremium
                          ? 'bg-[#D4AF37] border-[#D4AF37] text-zinc-950'
                          : 'bg-zinc-900 border-zinc-900 text-white'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Ranges */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Price Range
          </h4>
          <div className="space-y-1.5">
            {pricePresets.map((p, idx) => {
              const isSelected =
                filters.minPrice === p.min && filters.maxPrice === p.max;
              return (
                <button
                  key={idx}
                  onClick={() =>
                    isSelected
                      ? handlePricePreset(undefined, undefined)
                      : handlePricePreset(p.min, p.max)
                  }
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? isPremium
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold'
                        : 'bg-zinc-100 text-zinc-950 font-bold'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{p.label}</span>
                  {isSelected && <span className="text-[10px]">●</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Discount Minimum */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Minimum Discount
          </h4>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 30, 50].map((d) => {
              const isSelected = filters.minDiscount === d;
              return (
                <button
                  key={d}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      minDiscount: isSelected ? undefined : d,
                    })
                  }
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                    isSelected
                      ? isPremium
                        ? 'bg-[#D4AF37] text-zinc-950'
                        : 'bg-zinc-900 text-white'
                      : isPremium
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {d}%+ Off
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating Minimum */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Customer Rating
          </h4>
          <button
            onClick={() =>
              onFilterChange({
                ...filters,
                minRating: filters.minRating === 4 ? undefined : 4,
              })
            }
            className={`w-full text-left text-xs px-2.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer flex items-center justify-between ${
              filters.minRating === 4
                ? isPremium
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'bg-zinc-100 text-zinc-950'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>★ 4.0 Stars & Above</span>
            {filters.minRating === 4 && <span>✓</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
