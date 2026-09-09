import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpDown } from 'lucide-react';

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'discount-desc'
  | 'newest';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const { isPremium } = useStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
        Sort by:
      </span>
      <div className="relative inline-block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className={`appearance-none text-xs font-bold pl-7 pr-8 py-2 rounded-xl border outline-hidden transition-all cursor-pointer ${
            isPremium
              ? 'bg-[#181820] text-zinc-200 border-[#2E2E38] focus:border-[#D4AF37]'
              : 'bg-white text-zinc-800 border-zinc-200 focus:border-zinc-400'
          }`}
        >
          <option value="recommended">Featured / Recommended</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Customer Rating</option>
          <option value="discount-desc">Highest Discount</option>
          <option value="newest">New Arrivals</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
};
