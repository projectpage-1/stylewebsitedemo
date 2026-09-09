import { Product, StoreType } from '../types/product';
import { WishlistItem } from '../types/wishlist';

/**
 * Storage keys for separate store wishlists.
 */
const STORAGE_KEY_WISHLIST_NORMAL = 'sz_wishlist_items_normal';
const STORAGE_KEY_WISHLIST_PREMIUM = 'sz_wishlist_items_premium';
const STORAGE_KEY_LEGACY = 'sz_wishlist_items';

/**
 * Helper to fetch stored wishlist items for the specific store.
 * @param storeType - 'normal' | 'premium'
 */
export const getStoredWishlist = (storeType: StoreType = 'normal'): WishlistItem[] => {
  const key = storeType === 'premium' ? STORAGE_KEY_WISHLIST_PREMIUM : STORAGE_KEY_WISHLIST_NORMAL;
  const local = localStorage.getItem(key);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }

  // Handle migration from legacy single key
  const legacy = localStorage.getItem(STORAGE_KEY_LEGACY);
  if (legacy) {
    try {
      const parsed: WishlistItem[] = JSON.parse(legacy);
      const filtered = parsed.filter(
        (item) => (item.product?.storeType || 'normal') === storeType
      );
      if (filtered.length > 0) {
        localStorage.setItem(key, JSON.stringify(filtered));
        return filtered;
      }
    } catch {
      // ignore
    }
  }

  return [];
};

/**
 * Helper to save stored wishlist items for the specific store.
 */
export const saveStoredWishlist = (items: WishlistItem[], storeType: StoreType = 'normal'): void => {
  const key = storeType === 'premium' ? STORAGE_KEY_WISHLIST_PREMIUM : STORAGE_KEY_WISHLIST_NORMAL;
  localStorage.setItem(key, JSON.stringify(items));
};

/**
 * Wishlist Service: Handles wishlist addition, deletion, and checks per store.
 */
export const wishlistService = {
  /**
   * Retrieves wishlist items for the active store type.
   */
  async getWishlist(storeType: StoreType = 'normal'): Promise<WishlistItem[]> {
    return getStoredWishlist(storeType);
  },

  /**
   * Toggles product in the wishlist corresponding to the product's storeType.
   * If item exists, removes it. If not, adds it.
   */
  async toggleWishlist(product: Product): Promise<{ items: WishlistItem[]; added: boolean }> {
    const targetStore: StoreType = product.storeType || 'normal';
    const items = getStoredWishlist(targetStore);
    const existingIndex = items.findIndex((i) => i.productId === product.id);

    let added = false;
    if (existingIndex > -1) {
      items.splice(existingIndex, 1);
      added = false;
    } else {
      items.push({
        id: `wish_${product.id}`,
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
      });
      added = true;
    }

    saveStoredWishlist(items, targetStore);
    return { items, added };
  },

  /**
   * Checks if a product is saved in its store's wishlist.
   */
  async isInWishlist(productId: string, storeType: StoreType = 'normal'): Promise<boolean> {
    const items = getStoredWishlist(storeType);
    return items.some((i) => i.productId === productId);
  },

  /**
   * Removes a product from the specified store's wishlist.
   */
  async removeFromWishlist(productId: string, storeType: StoreType = 'normal'): Promise<WishlistItem[]> {
    const items = getStoredWishlist(storeType).filter((i) => i.productId !== productId);
    saveStoredWishlist(items, storeType);
    return items;
  },
};

