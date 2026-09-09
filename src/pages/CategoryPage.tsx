/**
 * ============================================================================
 * Style Zone Marketplace - Category Browsing Page (CategoryPage.tsx)
 * ============================================================================
 * Allows customers to browse catalog categories and subcategories:
 * - Strict Store Separation: Premium vs Normal store isolation
 * - Faceted Filtering: Brands, Price Range (₹), Minimum Discount, Customer Ratings
 * - Sorting: Recommended, Price Low to High, Price High to Low, New Arrivals
 * - Mobile-friendly responsive drawer for filters
 * ============================================================================
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { productService } from '../services/productService';
import { INITIAL_CATEGORIES } from '../data/categoryData';
import { CategoryHeader } from '../components/category/CategoryHeader';
import { FilterSidebar, FilterState } from '../components/category/FilterSidebar';
import { SortDropdown, SortOption } from '../components/category/SortDropdown';
import { ProductGrid } from '../components/product/ProductGrid';
import { Product } from '../types/product';
import { Filter, X } from 'lucide-react';
import { Button } from '../components/common/Button';

interface CategoryPageProps {
  categoryId: string;
  initialSubcategoryId?: string;
  onSelectProduct: (product: Product) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryId,
  initialSubcategoryId,
  onSelectProduct,
}) => {
  const { storeType, isPremium } = useStore();

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | undefined>(
    initialSubcategoryId
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    minDiscount: undefined,
    minRating: undefined,
  });

  // Sync subcategory if prop changes
  useEffect(() => {
    setSelectedSubcategoryId(initialSubcategoryId);
  }, [initialSubcategoryId]);

  // Find category metadata
  const currentCategory =
    INITIAL_CATEGORIES.find((c) => c.id === categoryId) || INITIAL_CATEGORIES[0];

  // Fetch products
  useEffect(() => {
    setIsLoading(true);
    productService
      .getProducts({
        categoryId,
        subcategoryId: selectedSubcategoryId,
        storeType,
      })
      .then((data) => {
        setProducts(data);
      })
      .finally(() => setIsLoading(false));
  }, [categoryId, selectedSubcategoryId, storeType]);

  // Extract unique brands for filtering
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => brandSet.add(p.brand));
    return Array.from(brandSet).sort();
  }, [products]);

  // Client-side filtering & sorting with strict storeType isolation
  const filteredProducts = useMemo(() => {
    // Strictly isolate products by current storeType
    let list = products.filter((p) => p.storeType === storeType);

    // Brand filter
    if (filters.brands.length > 0) {
      list = list.filter((p) => filters.brands.includes(p.brand));
    }

    // Price range
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= (filters.minPrice || 0));
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }

    // Discount
    if (filters.minDiscount !== undefined) {
      list = list.filter((p) => p.discount >= (filters.minDiscount || 0));
    }

    // Rating
    if (filters.minRating !== undefined) {
      list = list.filter((p) => p.rating >= (filters.minRating || 0));
    }

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-desc':
        list.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
        list.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // recommended / featured first
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, filters, sortOption]);

  const handleResetFilters = () => {
    setFilters({
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
      minRating: undefined,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Category Header */}
      <CategoryHeader
        category={currentCategory}
        subcategories={currentCategory.subcategories}
        selectedSubcategoryId={selectedSubcategoryId}
        onSelectSubcategory={(subId) => setSelectedSubcategoryId(subId)}
        productCount={filteredProducts.length}
      />

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            availableBrands={availableBrands}
            filters={filters}
            onFilterChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Product Catalog Display Area */}
        <div className="flex-1">
          {/* Top Bar: Mobile filter toggle & Sort Dropdown */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {filters.brands.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center">
                  {filters.brands.length}
                </span>
              )}
            </button>

            <span className="text-xs text-zinc-500 hidden sm:inline">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            <SortDropdown value={sortOption} onChange={setSortOption} />
          </div>

          {/* Product Cards Grid */}
          <ProductGrid
            products={filteredProducts}
            onSelectProduct={onSelectProduct}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Mobile Filters Slide-over Sheet */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div
            className={`relative w-4/5 max-w-sm ml-auto h-full overflow-y-auto p-5 z-10 ${
              isPremium ? 'bg-[#15151C] text-white' : 'bg-white text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Filter Items</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              availableBrands={availableBrands}
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />

            <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Button
                variant={isPremium ? 'luxury' : 'primary'}
                fullWidth
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters ({filteredProducts.length} Results)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
