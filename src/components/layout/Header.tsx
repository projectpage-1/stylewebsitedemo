import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { StoreSwitcher } from './StoreSwitcher';
import { SearchSuggestions } from './SearchSuggestions';
import { Product } from '../../types/product';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Crown,
  ShieldCheck,
  Package,
  LogOut,
  SlidersHorizontal,
  Gift,
  MapPin,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  activeRoute: string;
  onOpenMobileMenu?: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  activeRoute = '/',
  onOpenMobileMenu,
  onSelectProduct,
}) => {
  const { isPremium, theme, storeType } = useStore();
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout, login } = useAuth();
  const { selectedLocation, openLocationModal } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchSuggestionsOpen, setIsSearchSuggestionsOpen] = useState(false);
  const [isMobileSuggestionsOpen, setIsMobileSuggestionsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Per user specification: Store switching is allowed only on the main page.
  // When navigating to the product page (or non-main pages), store switcher is hidden!
  const isMainPage = activeRoute === '/' || activeRoute === '' || activeRoute === '/home';

  /**
   * Submits query to navigate to search results page
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchSuggestionsOpen(false);
      setIsMobileSuggestionsOpen(false);
      onNavigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  /**
   * Handles clicking a suggestion item to open product page directly
   */
  const handleSelectProductSuggestion = (product: Product) => {
    setIsSearchSuggestionsOpen(false);
    setIsMobileSuggestionsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    onNavigate(`/product/${product.id}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300">
      {/* Top Promotional Strip */}
      <div
        className={`w-full py-1 px-4 text-center text-xs tracking-wider transition-colors duration-300 ${
          isPremium
            ? 'bg-[#141418] text-[#D4AF37] border-b border-[#2A2A30]'
            : 'bg-zinc-900 text-zinc-100'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            {isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="font-medium font-luxury tracking-widest uppercase">
                  HAUTE COUTURE SUITE • BESPOKE PACKAGING INCLUDED
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>100% GENUINE BRANDS • DIRECT ATELIER SOURCING</span>
              </>
            )}
          </div>

          <div className="mx-auto sm:mx-0 font-medium flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {isPremium ? (
              <span>
                ✨ Grand Lucky Draw: Win Super Bike (Orders ₹5,000+) & Smartphone (Orders ₹2,500+)
              </span>
            ) : (
              <span>
                🎁 Grand Lucky Draw: Win Super Bike on orders ₹5,000+ & Smartphone on ₹2,500+
              </span>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-zinc-400">
            <button
              onClick={() => onNavigate('/admin')}
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className={`${theme.headerBg} border-b shadow-xs transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Store Switcher */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div
              onClick={() => onNavigate('/')}
              className="cursor-pointer group flex flex-col items-start"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-2xl sm:text-3xl font-black tracking-tighter ${
                    isPremium
                      ? 'font-luxury text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059]'
                      : 'text-zinc-900 tracking-tight'
                  }`}
                >
                  STYLE ZONE
                </span>
                {isPremium && (
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    LUXE
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] tracking-[0.25em] uppercase font-semibold -mt-1 ${
                  isPremium ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {isPremium ? 'PREMIUM ATELIER' : 'FASHION MARKETPLACE'}
              </span>
            </div>

            {/* Store Switcher: strictly visible ONLY on the main page (Home) per user mandate */}
            {isMainPage && (
              <div className="flex items-center">
                <StoreSwitcher />
              </div>
            )}

            {/* Delivery Location Selector - Like Swiggy, Blinkit, Flipkart, Amazon */}
            <button
              type="button"
              onClick={openLocationModal}
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer group text-left ${
                isPremium
                  ? 'bg-[#181822] border-[#2E2E3E] hover:border-[#D4AF37]/60 text-zinc-300'
                  : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300 text-zinc-700'
              }`}
              title="Change delivery location on live map"
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  isPremium ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-rose-100 text-rose-600'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-none">
                  Deliver to
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-xs font-bold truncate max-w-[110px] xl:max-w-[150px] ${
                      isPremium ? 'text-zinc-100' : 'text-zinc-900'
                    }`}
                  >
                    {selectedLocation.area}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {selectedLocation.pincode}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
                </div>
              </div>
            </button>
          </div>

          {/* Real Search Bar with Live Suggestions */}
          <div className="flex-1 max-w-lg hidden md:block relative">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setIsSearchSuggestionsOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchSuggestionsOpen(true);
                  }}
                  placeholder={
                    isPremium
                      ? 'Search Armani, Valentino, silk gowns, Swiss watches...'
                      : 'Search 50,000+ shirts, dresses, sneakers, brands...'
                  }
                  className={`w-full pl-10 pr-4 py-2 text-sm rounded-full transition-all outline-hidden ${
                    isPremium
                      ? 'bg-[#18181F] text-white placeholder-zinc-500 border border-zinc-700 focus:border-[#D4AF37]'
                      : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400 border border-transparent focus:border-zinc-300 focus:bg-white'
                  }`}
                />
                <Search
                  className={`absolute left-3.5 top-2.5 w-4 h-4 ${
                    isPremium ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                />
              </div>
            </form>

            <SearchSuggestions
              query={searchQuery}
              isOpen={isSearchSuggestionsOpen}
              activeStore={storeType}
              onSelectProduct={handleSelectProductSuggestion}
              onViewAll={(q) => onNavigate(`/search?q=${encodeURIComponent(q)}`)}
              onClose={() => setIsSearchSuggestionsOpen(false)}
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Mobile Store Switcher */}
            <div className="sm:hidden">
              <StoreSwitcher />
            </div>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('/wishlist')}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                isPremium
                  ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag / Cart */}
            <button
              onClick={() => onNavigate('/cart')}
              className={`relative p-2 rounded-full transition-colors cursor-pointer ${
                isPremium
                  ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                  : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                    isPremium ? 'bg-[#D4AF37] text-black' : 'bg-zinc-900'
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className={`flex items-center gap-1.5 p-1.5 rounded-full transition-colors cursor-pointer ${
                  isPremium
                    ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                    : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-zinc-500"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              {isAccountOpen && (
                <div
                  className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-50 transition-all border ${
                    isPremium
                      ? 'bg-[#18181D] border-[#2A2A30] text-zinc-200'
                      : 'bg-white border-zinc-200 text-zinc-800'
                  }`}
                >
                  {isAuthenticated && user ? (
                    <div className="px-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
                      <p className="text-xs text-zinc-400">Signed in as</p>
                      <p className="text-sm font-bold truncate">{user.fullName}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                        {user.role}
                      </span>
                    </div>
                  ) : null}

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onNavigate('/account');
                    }}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-zinc-400" />
                    <span>My Profile & Addresses</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onNavigate('/orders');
                    }}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-zinc-400" />
                    <span>My Orders</span>
                  </button>

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onNavigate('/admin');
                    }}
                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-amber-500 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Admin Operations Console</span>
                  </button>

                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsAccountOpen(false);
                        login('customer@stylezone.com', 'customer');
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-semibold text-blue-600 dark:text-[#D4AF37] hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                    >
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Location Selector Bar - Tap to choose live GPS location like Blinkit/Swiggy */}
        <div
          onClick={openLocationModal}
          className={`lg:hidden px-4 py-2 flex items-center justify-between border-b cursor-pointer transition-colors ${
            isPremium
              ? 'bg-[#15151C] border-[#2A2A38] text-zinc-300 hover:bg-[#1A1A24]'
              : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                isPremium ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1 truncate text-xs">
              <span className="text-zinc-400 text-[11px]">Deliver to:</span>
              <span
                className={`font-bold truncate ${
                  isPremium ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                {selectedLocation.area}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                ({selectedLocation.pincode})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-[#D4AF37] shrink-0">
            <span>Change</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        {/* Mobile search bar with Live Suggestions */}
        <div className="md:hidden px-4 py-2.5 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsMobileSuggestionsOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsMobileSuggestionsOpen(true);
              }}
              placeholder={
                isPremium
                  ? 'Search Armani, Valentino, silk gowns...'
                  : 'Search shirts, dresses, sneakers...'
              }
              className={`w-full pl-10 pr-4 py-2 text-sm rounded-full outline-hidden ${
                isPremium
                  ? 'bg-[#18181F] text-white placeholder-zinc-500 border border-zinc-700'
                  : 'bg-zinc-100 text-zinc-900 placeholder-zinc-400'
              }`}
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400" />
          </form>

          <SearchSuggestions
            query={searchQuery}
            isOpen={isMobileSuggestionsOpen}
            activeStore={storeType}
            onSelectProduct={handleSelectProductSuggestion}
            onViewAll={(q) => onNavigate(`/search?q=${encodeURIComponent(q)}`)}
            onClose={() => setIsMobileSuggestionsOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};
