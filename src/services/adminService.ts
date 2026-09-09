/**
 * ============================================================================
 * Style Zone Marketplace - Admin Service (adminService.ts)
 * ============================================================================
 * This service manages administrator operations including:
 * 1. Product Catalog Management (CRUD operations with store separation)
 * 2. Lucky Draw Campaigns (Car, Bike, Smartphone, Custom giveaways)
 * 3. Festival Sales Management (Diwali, Dussehra, Navratri, Pongal, etc.)
 * 4. Promotional Coupons & Discount Vouchers
 * 5. Category Taxonomy & Subcategory Hierarchy
 * 6. Order Status Fulfillment Pipeline (Pending -> Shipped -> Delivered)
 *
 * Designed specifically for Indian e-commerce operations with persistent
 * browser storage fallback and real-time reactive updates.
 * ============================================================================
 */

import { INITIAL_CATEGORIES } from '../data/categoryData';
import { INITIAL_BANNERS, INITIAL_CAMPAIGNS, INITIAL_COUPONS } from '../data/homeData';
import { Banner, PremiumCampaign, FestivalSale } from '../types/banner';
import { Category } from '../types/category';
import { Coupon } from '../types/coupon';
import { Order } from '../types/order';
import { Product, StoreType } from '../types/product';
import { getStoredOrders } from './orderService';
import { getStoredProducts, saveStoredProducts } from './productService';

/** Local storage keys for persistent admin settings */
const STORAGE_KEY_CATEGORIES = 'sz_categories_db';
const STORAGE_KEY_BANNERS = 'sz_banners_db';
const STORAGE_KEY_COUPONS = 'sz_coupons_db';
const STORAGE_KEY_CAMPAIGNS = 'sz_campaigns_db';
const STORAGE_KEY_FESTIVALS = 'sz_festivals_db';

/** Default festive sales for Indian shopping season */
export const INITIAL_FESTIVALS: FestivalSale[] = [
  {
    id: 'fest-diwali-2026',
    title: 'Grand Diwali Festive Dhamaka',
    festivalName: 'Diwali',
    storeScope: 'both',
    discountPercentage: 40,
    badgeText: 'FESTIVE 40% OFF',
    bannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Light up your wardrobe with traditional silks, festive kurtas & exclusive couture!',
    startDate: '2026-10-15',
    endDate: '2026-11-15',
    isActive: true,
  },
  {
    id: 'fest-dussehra-2026',
    title: 'Dussehra Mega Fashion Utsav',
    festivalName: 'Dussehra',
    storeScope: 'both',
    discountPercentage: 35,
    badgeText: 'UTSAV 35% OFF',
    bannerImage: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Celebrate victory of style with handcrafted festive ethnic wear and sharp casuals!',
    startDate: '2026-09-20',
    endDate: '2026-10-10',
    isActive: false,
  },
];

export const getStoredCategories = (): Category[] => {
  const local = localStorage.getItem(STORAGE_KEY_CATEGORIES);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
};

export const saveStoredCategories = (cats: Category[]): void => {
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
};

export const getStoredBanners = (): Banner[] => {
  const local = localStorage.getItem(STORAGE_KEY_BANNERS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(INITIAL_BANNERS));
  return INITIAL_BANNERS;
};

export const saveStoredBanners = (banners: Banner[]): void => {
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners));
};

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  normalStoreRevenue: number;
  premiumStoreRevenue: number;
  lowStockProducts: number;
  activeCampaignsCount: number;
}

export const adminService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    return getStoredProducts();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    return this.saveProduct(product);
  },

  async updateProduct(productId: string, product: Partial<Product>): Promise<Product> {
    return this.saveProduct({ ...product, id: productId });
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    const products = getStoredProducts();
    if (product.id) {
      const idx = products.findIndex((p) => p.id === product.id);
      if (idx > -1) {
        products[idx] = { ...products[idx], ...product } as Product;
        saveStoredProducts(products);
        return products[idx];
      }
    }

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      name: product.name || 'Untitled Garment',
      brand: product.brand || 'STYLE ZONE',
      description: product.description || '',
      price: product.price || 999,
      originalPrice: product.originalPrice || 1999,
      discount: product.discount || 50,
      categoryId: product.categoryId || 'men',
      subcategoryId: product.subcategoryId,
      storeType: product.storeType || 'normal',
      images: product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
      ],
      rating: 4.5,
      reviewCount: 1,
      sizes: product.sizes || ['S', 'M', 'L', 'XL'],
      colors: product.colors || [{ name: 'Default', hex: '#111111' }],
      colorImages: product.colorImages || {},
      stock: product.stock !== undefined ? product.stock : 25,
      isFeatured: product.isFeatured || false,
      isTrending: product.isTrending || false,
      isNewArrival: product.isNewArrival || true,
    };

    products.unshift(newProd);
    saveStoredProducts(products);
    return newProd;
  },

  async deleteProduct(productId: string): Promise<void> {
    const products = getStoredProducts().filter((p) => p.id !== productId);
    saveStoredProducts(products);
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    return getStoredCategories();
  },

  async saveCategory(category: Partial<Category>): Promise<Category> {
    const cats = getStoredCategories();
    if (category.id) {
      const idx = cats.findIndex((c) => c.id === category.id);
      if (idx > -1) {
        cats[idx] = { ...cats[idx], ...category } as Category;
        saveStoredCategories(cats);
        return cats[idx];
      }
    }

    const newCat: Category = {
      id: category.id || `cat_${Date.now()}`,
      name: category.name || 'New Category',
      title: category.title || `${category.name} Collection`,
      description: category.description || '',
      image: category.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
      iconName: category.iconName || 'Sparkles',
      storeType: category.storeType || 'both',
      order: category.order || cats.length + 1,
      isActive: category.isActive !== undefined ? category.isActive : true,
      subcategories: category.subcategories || [],
    };

    cats.push(newCat);
    saveStoredCategories(cats);
    return newCat;
  },

  async deleteCategory(categoryId: string): Promise<void> {
    const cats = getStoredCategories().filter((c) => c.id !== categoryId);
    saveStoredCategories(cats);
  },

  // BANNERS
  async getBanners(): Promise<Banner[]> {
    return getStoredBanners();
  },

  async saveBanner(banner: Partial<Banner>): Promise<Banner> {
    const banners = getStoredBanners();
    if (banner.id) {
      const idx = banners.findIndex((b) => b.id === banner.id);
      if (idx > -1) {
        banners[idx] = { ...banners[idx], ...banner } as Banner;
        saveStoredBanners(banners);
        return banners[idx];
      }
    }

    const newBanner: Banner = {
      id: `banner_${Date.now()}`,
      title: banner.title || 'New Campaign Title',
      subtitle: banner.subtitle || 'Catchy subtitle for the campaign',
      badge: banner.badge,
      ctaText: banner.ctaText || 'SHOP NOW',
      linkUrl: banner.linkUrl || '/category/men',
      image: banner.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop',
      storeType: banner.storeType || 'normal',
      order: banner.order || banners.length + 1,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    };

    banners.push(newBanner);
    saveStoredBanners(banners);
    return newBanner;
  },

  async deleteBanner(bannerId: string): Promise<void> {
    const banners = getStoredBanners().filter((b) => b.id !== bannerId);
    saveStoredBanners(banners);
  },

  // COUPONS
  async getCoupons(): Promise<Coupon[]> {
    const local = localStorage.getItem(STORAGE_KEY_COUPONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(INITIAL_COUPONS));
    return INITIAL_COUPONS;
  },

  async createCoupon(coupon: any): Promise<Coupon> {
    return this.saveCoupon({
      ...coupon,
      discountType: coupon.type || coupon.discountType || 'percentage',
      discountValue: coupon.value || coupon.discountValue || 10,
      title: coupon.description || coupon.title || 'Special Promotion',
    });
  },

  async saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const coupons = await this.getCoupons();
    if (coupon.id) {
      const idx = coupons.findIndex((c) => c.id === coupon.id);
      if (idx > -1) {
        coupons[idx] = { ...coupons[idx], ...coupon } as Coupon;
        localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
        return coupons[idx];
      }
    }

    const newCpn: Coupon = {
      id: `cpn_${Date.now()}`,
      code: (coupon.code || 'SALE').toUpperCase(),
      title: coupon.title || 'Special Promotion',
      description: coupon.description || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      maxDiscount: coupon.maxDiscount,
      minOrderValue: coupon.minOrderValue || 999,
      storeType: coupon.storeType || 'both',
      validFrom: coupon.validFrom || new Date().toISOString().split('T')[0],
      validUntil: coupon.validUntil || '2026-12-31',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    };

    coupons.push(newCpn);
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
    return newCpn;
  },

  async deleteCoupon(couponId: string): Promise<void> {
    const coupons = (await this.getCoupons()).filter((c) => c.id !== couponId);
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
  },

  // CAMPAIGNS (Section 16: Admin can configure campaigns without modifying React source code)
  async getPremiumCampaign(): Promise<PremiumCampaign | null> {
    const campaigns = await this.getCampaigns();
    return campaigns.find((c) => c.store === 'premium') || campaigns[0] || null;
  },

  async updatePremiumCampaign(updates: Partial<PremiumCampaign>): Promise<PremiumCampaign> {
    const current = await this.getPremiumCampaign();
    if (current) {
      return this.saveCampaign({ ...current, ...updates });
    }
    return this.saveCampaign(updates);
  },

  async getCampaigns(): Promise<PremiumCampaign[]> {
    const local = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
    return INITIAL_CAMPAIGNS;
  },

  async saveCampaign(campaign: Partial<PremiumCampaign>): Promise<PremiumCampaign> {
    const campaigns = await this.getCampaigns();
    if (campaign.id) {
      const idx = campaigns.findIndex((c) => c.id === campaign.id);
      if (idx > -1) {
        campaigns[idx] = { ...campaigns[idx], ...campaign } as PremiumCampaign;
        localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
        return campaigns[idx];
      }
    }

    const newCamp: PremiumCampaign = {
      id: `camp_${Date.now()}`,
      name: campaign.name || 'NEW LUCKY DRAW CAMPAIGN',
      code: campaign.code || 'LUCKYDRAW',
      store: campaign.store || 'premium',
      storeScope: campaign.storeScope || campaign.store || 'premium',
      type: campaign.type || 'bike',
      minOrderValue: campaign.minOrderValue || 2500,
      startDate: campaign.startDate || new Date().toISOString().split('T')[0],
      endDate: campaign.endDate || '2026-12-31',
      eligibilityRules: campaign.eligibilityRules || 'Eligible for qualifying orders above the minimum order value.',
      benefit: campaign.benefit || 'Lucky Draw Entry Pass & Exclusive Gift Ticket',
      giftTitle: campaign.giftTitle || 'Lucky Draw Ticket Pass',
      giftImageUrl: campaign.giftImageUrl || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop',
      couponPrefix: campaign.couponPrefix || 'SZ-LUCKY',
      drawDate: campaign.drawDate || '30th April 2026',
      usageLimit: campaign.usageLimit || 5000,
      isActive: campaign.isActive !== undefined ? campaign.isActive : true,
    };

    campaigns.push(newCamp);
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
    return newCamp;
  },

  async deleteCampaign(campaignId: string): Promise<void> {
    const campaigns = (await this.getCampaigns()).filter((c) => c.id !== campaignId);
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
  },

  // FESTIVAL SALES & OFFERS (Diwali, Dussehra, Holi, etc.)
  async getFestivalSales(): Promise<FestivalSale[]> {
    const local = localStorage.getItem(STORAGE_KEY_FESTIVALS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEY_FESTIVALS, JSON.stringify(INITIAL_FESTIVALS));
    return INITIAL_FESTIVALS;
  },

  async saveFestivalSale(sale: Partial<FestivalSale>): Promise<FestivalSale> {
    const sales = await this.getFestivalSales();
    if (sale.id) {
      const idx = sales.findIndex((s) => s.id === sale.id);
      if (idx > -1) {
        sales[idx] = { ...sales[idx], ...sale } as FestivalSale;
        localStorage.setItem(STORAGE_KEY_FESTIVALS, JSON.stringify(sales));
        return sales[idx];
      }
    }

    const newSale: FestivalSale = {
      id: `fest_${Date.now()}`,
      title: sale.title || 'Special Festival Sale',
      festivalName: sale.festivalName || 'Diwali',
      storeScope: sale.storeScope || 'both',
      discountPercentage: sale.discountPercentage || 30,
      badgeText: sale.badgeText || 'FESTIVE OFFER',
      bannerImage: sale.bannerImage || 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
      tagline: sale.tagline || 'Exclusive festive deals on apparel and luxury wardrobe.',
      startDate: sale.startDate || new Date().toISOString().split('T')[0],
      endDate: sale.endDate || '2026-12-31',
      isActive: sale.isActive !== undefined ? sale.isActive : true,
    };

    sales.push(newSale);
    localStorage.setItem(STORAGE_KEY_FESTIVALS, JSON.stringify(sales));
    return newSale;
  },

  async deleteFestivalSale(saleId: string): Promise<void> {
    const sales = (await this.getFestivalSales()).filter((s) => s.id !== saleId);
    localStorage.setItem(STORAGE_KEY_FESTIVALS, JSON.stringify(sales));
  },

  async getActiveFestivalSale(storeType?: StoreType): Promise<FestivalSale | null> {
    const sales = await this.getFestivalSales();
    const active = sales.filter((s) => s.isActive);
    if (!active.length) return null;
    if (!storeType) return active[0];
    return active.find((s) => s.storeScope === 'both' || s.storeScope === storeType) || active[0];
  },

  // ORDERS & ANALYTICS
  async getOrders(): Promise<Order[]> {
    return getStoredOrders();
  },

  async getDashboardStats(): Promise<AdminStats> {
    const products = getStoredProducts();
    const orders = getStoredOrders();
    const campaigns = await this.getCampaigns();

    const totalSales = orders.reduce((sum, o) => sum + o.priceBreakdown.finalPayableAmount, 0);
    const normalStoreRevenue = orders
      .filter((o) => o.storeType === 'normal')
      .reduce((sum, o) => sum + o.priceBreakdown.finalPayableAmount, 0);
    const premiumStoreRevenue = orders
      .filter((o) => o.storeType === 'premium')
      .reduce((sum, o) => sum + o.priceBreakdown.finalPayableAmount, 0);
    const lowStockProducts = products.filter((p) => p.stock < 10).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSales,
      normalStoreRevenue,
      premiumStoreRevenue,
      lowStockProducts,
      activeCampaignsCount: campaigns.filter((c) => c.isActive).length,
    };
  },
};
