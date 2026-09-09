/**
 * ============================================================================
 * Style Zone Marketplace - Product Type Definitions (product.ts)
 * ============================================================================
 * Defines core domain models for:
 * - Products, pricing, brands, and categories
 * - Color variants with dedicated imagery
 * - Size options and inventory management
 * - Customer reviews and ratings
 * - Store segment isolation (Normal Store vs Haute Couture Premium Store)
 * ============================================================================
 */

/** Store segment: 'normal' for everyday garments, 'premium' for luxury couture */
export type StoreType = 'normal' | 'premium';

/** SKU-level variant details */
export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  sku: string;
  stock: number;
  priceModifier?: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
  toneDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  details?: string[];
  price: number;
  originalPrice?: number;
  discount: number; // percentage, e.g. 20
  categoryId: string;
  subcategoryId?: string;
  gender?: 'men' | 'women' | 'kids' | 'unisex';
  storeType: StoreType;
  images: string[];
  colorImages?: Record<string, string>;
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  sizes: string[];
  colors: ProductColor[];
  variants?: ProductVariant[];
  stock: number;
  isNewArrival?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  tags?: string[];
}

export type SortOption =
  | 'recommended'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'discount-desc';

export interface ProductFilterState {
  categoryId?: string;
  subcategoryId?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  minRating?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
  storeType?: StoreType;
  searchQuery?: string;
}
