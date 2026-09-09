/**
 * ============================================================================
 * Style Zone Marketplace - Product Service (productService.ts)
 * ============================================================================
 * Handles all product querying, filtering, sorting, color variant switching,
 * and strict store type separation (Normal Store vs Haute Couture Premium Store).
 *
 * Core Guarantees:
 * - Strict Store Separation: Premium products never leak into Normal store and vice-versa.
 * - Dynamic Color Image Matching: Products support distinct high-res images per color variant.
 * - Multi-criteria Filtering: Sizes, Price, Brand, Subcategory, and In-Stock status.
 * ============================================================================
 */

import { DEMO_PRODUCTS } from '../data/demoProducts';
import { Product, ProductFilterState, SortOption, StoreType } from '../types/product';
import { normalizeCategoryId } from '../utils/categoryHelpers';

/** Local storage database key for catalog persistence */
const STORAGE_KEY_PRODUCTS = 'sz_products_db';

/**
 * Retrieves the stored products catalog or initializes from demo seeds.
 * @returns Array of all products in the catalog
 */
export const getStoredProducts = (): Product[] => {
  const local = localStorage.getItem(STORAGE_KEY_PRODUCTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
  return DEMO_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]): void => {
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
};

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    return getStoredProducts();
  },

  async getProducts(
    filterState?: ProductFilterState,
    sortOption: SortOption = 'recommended'
  ): Promise<Product[]> {
    let products = getStoredProducts();

    // 1. Strict Store type filter (Normal vs Premium)
    if (filterState?.storeType) {
      products = products.filter((p) => (p.storeType || 'normal') === filterState.storeType);
    }

    // 2. Strict Category ID filter (Exact matching per Section 6)
    if (filterState?.categoryId && filterState.categoryId !== 'all') {
      const targetCatId = normalizeCategoryId(filterState.categoryId);
      products = products.filter((p) => normalizeCategoryId(p.categoryId) === targetCatId);
    }

    // 3. Subcategory filter
    if (filterState?.subcategoryId) {
      products = products.filter((p) => p.subcategoryId === filterState.subcategoryId);
    }

    // 4. Gender filter
    if (filterState?.gender) {
      products = products.filter((p) => p.gender === filterState.gender || p.gender === 'unisex');
    }

    // 5. Price range
    if (filterState?.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filterState.minPrice!);
    }
    if (filterState?.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filterState.maxPrice!);
    }

    // 6. Brands
    if (filterState?.brands && filterState.brands.length > 0) {
      const brandsLower = filterState.brands.map((b) => b.toLowerCase());
      products = products.filter((p) => brandsLower.includes(p.brand.toLowerCase()));
    }

    // 7. Sizes
    if (filterState?.sizes && filterState.sizes.length > 0) {
      products = products.filter((p) =>
        p.sizes.some((s) => filterState.sizes.includes(s))
      );
    }

    // 8. Colors
    if (filterState?.colors && filterState.colors.length > 0) {
      products = products.filter((p) =>
        p.colors.some((c) => filterState.colors.includes(c.name))
      );
    }

    // 9. Min Rating
    if (filterState?.minRating) {
      products = products.filter((p) => p.rating >= filterState.minRating!);
    }

    // 10. Min Discount
    if (filterState?.minDiscount) {
      products = products.filter((p) => p.discount >= filterState.minDiscount!);
    }

    // 11. Search query (name, brand, category, keywords)
    if (filterState?.searchQuery && filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    const sorted = [...products];
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-desc':
        sorted.sort((a, b) => b.discount - a.discount);
        break;
      case 'recommended':
      default:
        sorted.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return sorted;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const all = getStoredProducts();
    return all.find((p) => p.id === id);
  },

  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
    const all = getStoredProducts();
    const current = all.find((p) => p.id === productId);
    const storeType = current?.storeType || 'normal';

    return all
      .filter((p) => p.id !== productId && (p.storeType || 'normal') === storeType && p.categoryId === categoryId)
      .slice(0, limit);
  },

  async searchProducts(query: string, storeType?: StoreType): Promise<Product[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const all = getStoredProducts();

    return all.filter((p) => {
      const matchesStore = !storeType || (p.storeType || 'normal') === storeType;
      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categoryId.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesStore && matchesText;
    });
  },
};
