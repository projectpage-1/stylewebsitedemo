import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { INITIAL_CATEGORIES } from '../../data/categoryData';
import { Home, Grid, Heart, ShoppingBag, User, X, ChevronRight } from 'lucide-react';

interface MobileNavProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onNavigate, activeRoute }) => {
  const { isPremium } = useStore();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  return (
    <>
      {/* Bottom App Navigation Bar for Mobile */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t transition-colors duration-300 pb-safe ${
          isPremium
            ? 'bg-[#101014]/95 backdrop-blur-lg border-zinc-800 text-zinc-400'
            : 'bg-white/95 backdrop-blur-lg border-zinc-200 text-zinc-600'
        }`}
      >
        <div className="flex items-center justify-around h-15 px-2">
          <button
            onClick={() => onNavigate('/')}
            className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold cursor-pointer ${
              activeRoute === '/'
                ? isPremium
                  ? 'text-[#D4AF37]'
                  : 'text-zinc-950'
                : 'hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setIsCategoryDrawerOpen(true)}
            className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold cursor-pointer ${
              activeRoute.startsWith('/category')
                ? isPremium
                  ? 'text-[#D4AF37]'
                  : 'text-zinc-950'
                : 'hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-5 h-5 mb-0.5" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => onNavigate('/wishlist')}
            className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold cursor-pointer ${
              activeRoute === '/wishlist'
                ? isPremium
                  ? 'text-[#D4AF37]'
                  : 'text-zinc-950'
                : 'hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
            <span>Wishlist</span>
          </button>

          <button
            onClick={() => onNavigate('/cart')}
            className={`relative flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold cursor-pointer ${
              activeRoute === '/cart'
                ? isPremium
                  ? 'text-[#D4AF37]'
                  : 'text-zinc-950'
                : 'hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {cartCount > 0 && (
              <span
                className={`absolute top-0.5 right-3 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center ${
                  isPremium ? 'bg-[#D4AF37] text-black' : 'bg-zinc-900'
                }`}
              >
                {cartCount}
              </span>
            )}
            <span>Bag</span>
          </button>

          <button
            onClick={() => onNavigate('/account')}
            className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-semibold cursor-pointer ${
              activeRoute === '/account'
                ? isPremium
                  ? 'text-[#D4AF37]'
                  : 'text-zinc-950'
                : 'hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Slide-out Category Drawer */}
      {isCategoryDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsCategoryDrawerOpen(false)}
          />

          <div
            className={`relative w-4/5 max-w-sm h-full overflow-y-auto p-5 transition-transform z-10 ${
              isPremium
                ? 'bg-[#15151A] text-zinc-200 border-r border-zinc-800'
                : 'bg-white text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <h3 className={`text-lg font-bold ${isPremium ? 'font-luxury text-[#E5C158]' : ''}`}>
                Explore Categories
              </h3>
              <button
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {INITIAL_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl p-3 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
                >
                  <button
                    onClick={() => {
                      setIsCategoryDrawerOpen(false);
                      onNavigate(`/category/${cat.id}`);
                    }}
                    className="w-full flex items-center justify-between font-bold text-sm tracking-wide text-left cursor-pointer"
                  >
                    <span>{cat.title}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                  </button>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setIsCategoryDrawerOpen(false);
                          onNavigate(`/category/${cat.id}?subcategory=${sub.id}`);
                        }}
                        className={`text-[11px] px-2 py-1 rounded-md font-medium cursor-pointer ${
                          isPremium
                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
              <p>Style Zone Fashion Marketplace</p>
              <p className="mt-1">Normal & Premium Stores</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
