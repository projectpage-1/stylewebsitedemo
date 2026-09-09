import { CartItem } from '../types/cart';
import { Product, StoreType } from '../types/product';

/**
 * Storage keys for separate shopping bags:
 * Ensures Normal store products and Premium store products remain in isolated carts.
 */
const STORAGE_KEY_CART_NORMAL = 'sz_cart_items_normal';
const STORAGE_KEY_CART_PREMIUM = 'sz_cart_items_premium';
const STORAGE_KEY_LEGACY = 'sz_cart_items';

/**
 * Helper function to retrieve stored cart items based on the active store type.
 * @param storeType - 'normal' | 'premium'
 * @returns Array of CartItem objects for the specified store.
 */
export const getStoredCart = (storeType: StoreType = 'normal'): CartItem[] => {
  const key = storeType === 'premium' ? STORAGE_KEY_CART_PREMIUM : STORAGE_KEY_CART_NORMAL;
  const local = localStorage.getItem(key);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      return [];
    }
  }

  // Check legacy storage and migrate items to their respective store cart if needed
  const legacy = localStorage.getItem(STORAGE_KEY_LEGACY);
  if (legacy) {
    try {
      const parsed: CartItem[] = JSON.parse(legacy);
      const filtered = parsed.filter(
        (item) => (item.product?.storeType || item.storeType || 'normal') === storeType
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
 * Helper function to persist cart items to localStorage for a specific store.
 * @param items - CartItem array to save
 * @param storeType - 'normal' | 'premium'
 */
export const saveStoredCart = (items: CartItem[], storeType: StoreType = 'normal'): void => {
  const key = storeType === 'premium' ? STORAGE_KEY_CART_PREMIUM : STORAGE_KEY_CART_NORMAL;
  localStorage.setItem(key, JSON.stringify(items));
};

/**
 * Cart Service: Manages bag operations separately for Normal and Premium stores.
 */
export const cartService = {
  /**
   * Generates a unique item identifier based on product ID, size, and color.
   * This prevents duplicate rows when the same product is added with different variants.
   */
  generateItemId(productId: string, size?: string, color?: string): string {
    const s = size ? size.trim().toLowerCase() : 'nosize';
    const c = color ? color.trim().toLowerCase() : 'nocolor';
    return `${productId}_${s}_${c}`;
  },

  /**
   * Retrieves cart items specifically for the active store type.
   * @param storeType - 'normal' | 'premium'
   */
  async getCartItems(storeType: StoreType = 'normal'): Promise<CartItem[]> {
    return getStoredCart(storeType);
  },

  /**
   * Adds an item to the cart corresponding to the product's storeType.
   * Connects to the local store storage and recalculates item quantity.
   */
  async addToCart(
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ): Promise<CartItem[]> {
    const targetStore: StoreType = product.storeType || 'normal';
    const items = getStoredCart(targetStore);
    const itemId = this.generateItemId(product.id, size, color);

    const existingIndex = items.findIndex((i) => i.id === itemId);

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        id: itemId,
        product,
        quantity,
        selectedSize: size,
        selectedColor: color,
        price: product.price,
        originalPrice: product.originalPrice,
        storeType: targetStore,
      });
    }

    saveStoredCart(items, targetStore);
    return items;
  },

  /**
   * Updates quantity for an item in the specified store cart.
   * Removes the item if quantity drops to 0 or below.
   */
  async updateQuantity(
    itemId: string,
    quantity: number,
    storeType: StoreType = 'normal'
  ): Promise<CartItem[]> {
    let items = getStoredCart(storeType);
    if (quantity <= 0) {
      items = items.filter((i) => i.id !== itemId);
    } else {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = quantity;
      }
    }
    saveStoredCart(items, storeType);
    return items;
  },

  /**
   * Removes an item from the specified store cart.
   */
  async removeFromCart(itemId: string, storeType: StoreType = 'normal'): Promise<CartItem[]> {
    const items = getStoredCart(storeType).filter((i) => i.id !== itemId);
    saveStoredCart(items, storeType);
    return items;
  },

  /**
   * Clears all items in the specified store cart.
   */
  async clearCart(storeType: StoreType = 'normal'): Promise<void> {
    saveStoredCart([], storeType);
  },
};

