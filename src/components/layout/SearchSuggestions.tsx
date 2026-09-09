import React, { useEffect, useState, useRef } from 'react';
import { Product, StoreType } from '../../types/product';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatCurrency';
import { Search, Crown, Sparkles, ArrowRight, Tag } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  isOpen: boolean;
  activeStore: StoreType;
  onSelectProduct: (product: Product) => void;
  onViewAll: (query: string) => void;
  onClose: () => void;
}

/**
 * SearchSuggestions:
 * Renders real-time live product suggestions underneath the search bar.
 * Connects to productService to query matching products as the customer types.
 */
export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  isOpen,
  activeStore,
  onSelectProduct,
  onViewAll,
  onClose,
}) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Effect: Load catalog products to support fast instant client-side matching.
   */
  useEffect(() => {
    productService.getAllProducts().then(setAllProducts);
  }, []);

  /**
   * Effect: Handle clicks outside the suggestions popover to close it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // STRICT STORE SEPARATION: Only products belonging to the active store are searched and displayed.
  // When in premium store, normal store products are completely excluded.
  const matchingProducts = trimmed
    ? allProducts.filter((p) => {
        const itemStore = p.storeType || 'normal';
        if (itemStore !== activeStore) return false;

        const nameMatch = p.name.toLowerCase().includes(trimmed);
        const brandMatch = p.brand.toLowerCase().includes(trimmed);
        const catMatch = p.categoryId.toLowerCase().includes(trimmed);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(trimmed));
        return nameMatch || brandMatch || catMatch || tagMatch;
      })
    : [];

  const displayedSuggestions = matchingProducts.slice(0, 5);
  const isPremium = activeStore === 'premium';

  // Popular search suggestions when search bar is focused but query is short
  const trendingSearches = isPremium
    ? ['Armani Suit', 'Silk Evening Gown', 'Swiss Chronograph', 'Cashmere Blazer', 'Italian Leather']
    : ['Cotton Oxford Shirt', 'Denim Jacket', 'Running Sneakers', 'Floral Maxi Dress', 'Leather Belt'];

  return (
    <div
      ref={containerRef}
      className={`absolute left-0 right-0 top-full mt-2 rounded-2xl shadow-2xl overflow-hidden z-50 border transition-all ${
        isPremium
          ? 'bg-[#14141B] border-[#2A2A35] text-white shadow-black/80'
          : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
      }`}
    >
      {/* State A: User is typing and has matching products */}
      {trimmed && displayedSuggestions.length > 0 && (
        <div>
          <div
            className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider border-b flex items-center justify-between ${
              isPremium
                ? 'border-[#22222D] text-zinc-400 bg-[#0E0E14]'
                : 'border-zinc-100 text-zinc-500 bg-zinc-50'
            }`}
          >
            <span>Product Suggestions ({matchingProducts.length})</span>
            <span className="text-[10px] text-zinc-400">Click to view detail</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-96 overflow-y-auto">
            {displayedSuggestions.map((product) => {
              const itemIsPremium = product.storeType === 'premium';

              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className={`p-3 flex items-center gap-3.5 transition-colors cursor-pointer group ${
                    isPremium
                      ? 'hover:bg-[#1C1C26]'
                      : 'hover:bg-zinc-50'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-800 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 truncate">
                        {product.brand}
                      </span>
                      {itemIsPremium ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-luxury">
                          <Crown className="w-2.5 h-2.5" />
                          Atelier
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                          Marketplace
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-semibold truncate group-hover:text-blue-500 dark:group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-black text-zinc-900 dark:text-white">
                        {formatCurrency(product.price)}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-zinc-400" />
                </div>
              );
            })}
          </div>

          {/* View all matches footer */}
          <div
            className={`p-3 text-center border-t ${
              isPremium
                ? 'border-[#22222D] bg-[#0E0E14]'
                : 'border-zinc-100 bg-zinc-50'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                onViewAll(trimmed);
                onClose();
              }}
              className={`text-xs font-bold flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg transition-colors cursor-pointer ${
                isPremium
                  ? 'text-[#D4AF37] hover:bg-[#D4AF37]/10 font-luxury'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>See all {matchingProducts.length} results for &quot;{trimmed}&quot;</span>
            </button>
          </div>
        </div>
      )}

      {/* State B: User typed something, but zero matching products */}
      {trimmed && displayedSuggestions.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-xs font-medium text-zinc-400">
            No products found matching &quot;{trimmed}&quot;.
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Try searching for brands like Gucci, Armani, Nike, or categories like shirts, dresses.
          </p>
        </div>
      )}

      {/* State C: Search bar focused with empty input -> Show Trending Keywords */}
      {!trimmed && (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular & Trending Styles</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  onViewAll(term);
                  onClose();
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isPremium
                    ? 'bg-[#1C1C24] border-zinc-700 text-zinc-300 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                <Tag className="w-3 h-3 text-zinc-400" />
                <span>{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
