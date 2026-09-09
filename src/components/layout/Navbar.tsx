import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_CATEGORIES } from '../../data/categoryData';
import { ChevronDown, Flame, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
  activeCategoryId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeCategoryId }) => {
  const { isPremium } = useStore();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  return (
    <nav
      className={`hidden md:block w-full border-b transition-colors duration-300 relative z-30 ${
        isPremium
          ? 'bg-[#121216] border-[#222228] text-zinc-300'
          : 'bg-white border-zinc-200 text-zinc-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Main category navigation items */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {INITIAL_CATEGORIES.map((cat) => {
              const isActive = activeCategoryId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(cat.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className={`flex items-center gap-1 px-3 py-2 text-xs lg:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer rounded-md ${
                      isActive
                        ? isPremium
                          ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                          : 'text-zinc-950 font-black border-b-2 border-zinc-900 rounded-b-none'
                        : isPremium
                        ? 'hover:text-[#D4AF37] hover:bg-white/5'
                        : 'hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Mega Menu Dropdown */}
                  {hoveredCategory === cat.id && (
                    <div
                      className={`absolute top-full left-0 w-64 p-4 rounded-xl shadow-2xl border transition-all z-50 ${
                        isPremium
                          ? 'bg-[#18181F] border-[#2E2E38] text-zinc-300 shadow-black/80'
                          : 'bg-white border-zinc-200 text-zinc-700 shadow-zinc-300/50'
                      }`}
                    >
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                        {cat.title}
                      </p>
                      <div className="space-y-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setHoveredCategory(null);
                              onNavigate(`/category/${cat.id}?subcategory=${sub.id}`);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                              isPremium
                                ? 'hover:bg-white/5 hover:text-[#D4AF37]'
                                : 'hover:bg-zinc-100 hover:text-zinc-950'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                          onClick={() => {
                            setHoveredCategory(null);
                            onNavigate(`/category/${cat.id}`);
                          }}
                          className="text-xs font-semibold text-blue-600 dark:text-[#D4AF37] hover:underline"
                        >
                          View All {cat.name} →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick highlight tags */}
          <div className="flex items-center space-x-3 text-xs font-semibold tracking-wide">
            {isPremium ? (
              <div className="flex items-center gap-1.5 text-[#D4AF37] px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-luxury">Curated Private Atelier</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Curated Fashion Trends</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
