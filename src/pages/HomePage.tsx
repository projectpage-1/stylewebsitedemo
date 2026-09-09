/**
 * ============================================================================
 * Style Zone Marketplace - Storefront Home Page (HomePage.tsx)
 * ============================================================================
 * Main customer landing experience providing:
 * 1. Storefront hero carousel with promotional CTAs
 * 2. Real-time Indian Festival Sales banner (Diwali, Dussehra, etc.) managed by Admin
 * 3. Lucky Draw Showcase & Eligibility Tracker (Car, Bike, Smartphone)
 * 4. Interactive Category Navigation Tiles
 * 5. Dynamic Product Showcases (Featured, Trending, New Arrivals) with strict store isolation
 * 6. Mobile-first responsive touch layout
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategorySection } from '../components/home/CategorySection';
import { OfferSection } from '../components/home/OfferSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { ProductGrid } from '../components/product/ProductGrid';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { HOME_BANNERS } from '../data/homeData';
import { INITIAL_CATEGORIES } from '../data/categoryData';
import { Product } from '../types/product';
import { FestivalSale } from '../types/banner';
import { Sparkles, TrendingUp, Flame, ArrowRight, Tag, Calendar, Gift } from 'lucide-react';
import { Button } from '../components/common/Button';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectProduct }) => {
  const { storeType, isPremium } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'new-arrivals'>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFestival, setActiveFestival] = useState<FestivalSale | null>(null);

  useEffect(() => {
    setIsLoading(true);
    // Fetch products strictly by active storeType (Store Isolation)
    productService
      .getProducts({ storeType })
      .then((data) => {
        // Enforce strict storeType isolation
        setProducts(data.filter((p) => p.storeType === storeType));
      })
      .finally(() => setIsLoading(false));

    // Fetch active festival sale (Diwali / Dussehra / etc.)
    adminService.getActiveFestivalSale(storeType).then((sale) => {
      setActiveFestival(sale);
    });
  }, [storeType]);

  // Strict store isolation safeguard
  const displayedProducts = products
    .filter((p) => p.storeType === storeType)
    .filter((p) => {
      if (activeTab === 'featured') return p.isFeatured;
      if (activeTab === 'trending') return p.isTrending;
      return true; // new arrivals
    })
    .slice(0, 8);

  return (
    <div className="space-y-4 pb-16">
      {/* 1. Hero Banner Carousel */}
      <HeroBanner banners={HOME_BANNERS} onNavigate={onNavigate} />

      {/* Indian Festive Sale Banner (Diwali, Dussehra, etc. managed by Admin) */}
      {activeFestival && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
          <div
            onClick={() => onNavigate('/category/all')}
            className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:shadow-xl ${
              isPremium
                ? 'bg-gradient-to-r from-[#1E170A] via-[#2A200B] to-[#14120C] border-[#D4AF37]/50 shadow-[#D4AF37]/10'
                : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border-amber-300 dark:border-amber-900/50'
            }`}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs">
                    {activeFestival.badgeText}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Valid till {activeFestival.endDate}</span>
                  </span>
                </div>

                <h3
                  className={`text-xl sm:text-3xl font-black tracking-tight ${
                    isPremium ? 'text-white font-luxury' : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {activeFestival.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {activeFestival.tagline}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-2xl font-black text-amber-500">
                    UP TO {activeFestival.discountPercentage}% OFF
                  </span>
                  <p className="text-[11px] text-zinc-400">All festive collections & traditional couture</p>
                </div>

                <button
                  type="button"
                  className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md transition-all ${
                    isPremium
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 hover:brightness-110'
                      : 'bg-zinc-900 hover:bg-black text-white dark:bg-zinc-100 dark:text-zinc-950'
                  }`}
                >
                  <span>Shop Festive Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Category Section (Layout 3 Style: Category Icon row + Category Image cards with matching categoryId) */}
      <CategorySection
        categories={INITIAL_CATEGORIES}
        onSelectCategory={(categoryId) => onNavigate(`/category/${categoryId}`)}
      />

      {/* 3. High-Value Offer Cards */}
      <OfferSection onNavigate={onNavigate} />

      {/* 4. Product Showcase Section with Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                isPremium
                  ? 'bg-[#D4AF37]/15 text-[#D4AF37] font-luxury'
                  : 'bg-zinc-100 text-zinc-700'
              }`}
            >
              {isPremium ? 'ATELIER SELECTS' : 'TRENDING MARKETPLACE'}
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 ${
                isPremium ? 'font-luxury text-white' : 'text-zinc-900'
              }`}
            >
              {isPremium ? 'Exclusive Luxury Wardrobe' : 'Handpicked for You'}
            </h2>
          </div>

          {/* Product Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-[#181820] border border-zinc-200 dark:border-[#2C2C38] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'featured'
                  ? isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                    : 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'trending'
                  ? isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                    : 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending</span>
            </button>

            <button
              onClick={() => setActiveTab('new-arrivals')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'new-arrivals'
                  ? isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                    : 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>New In</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <ProductGrid
          products={displayedProducts}
          onSelectProduct={onSelectProduct}
          isLoading={isLoading}
        />

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate('/category/men')}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Explore Complete {isPremium ? 'Luxury Atelier' : 'Marketplace'} Catalog
          </Button>
        </div>
      </section>

      {/* 5. Promotional Campaign Banner (iPhone 16 Pro campaign / Normal mega sale) */}
      <PromoBanner onNavigate={onNavigate} />
    </div>
  );
};
