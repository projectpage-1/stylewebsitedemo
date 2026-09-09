import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types/product';
import { WishlistItem } from '../types/wishlist';
import { wishlistService } from '../services/wishlistService';
import { useCart } from './CartContext';
import { useStore } from './StoreContext';

/**
 * Interface representing all exposed operations and values in WishlistContext.
 */
interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  toggleWishlist: (product: Product) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => Promise<void>;
  moveToBag: (product: Product, size?: string, color?: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

/**
 * WishlistProvider component:
 * Maintains isolated wishlists for Normal and Premium stores.
 * When switching between stores, the wishlist automatically swaps items.
 */
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeType } = useStore();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { addToCart } = useCart();

  /**
   * Effect: Automatically refresh the wishlist items whenever storeType changes.
   */
  useEffect(() => {
    wishlistService.getWishlist(storeType).then(setItems);
  }, [storeType]);

  /**
   * Toggles an item in the wishlist for its corresponding store.
   */
  const toggleWishlist = async (product: Product): Promise<boolean> => {
    const { items: updated, added } = await wishlistService.toggleWishlist(product);
    if ((product.storeType || 'normal') === storeType) {
      setItems([...updated]);
    }
    return added;
  };

  /**
   * Checks if a product exists in the current store's wishlist.
   */
  const isInWishlist = (productId: string): boolean => {
    return items.some((i) => i.productId === productId);
  };

  /**
   * Removes a product from the active store's wishlist.
   */
  const removeFromWishlist = async (productId: string) => {
    const updated = await wishlistService.removeFromWishlist(productId, storeType);
    setItems([...updated]);
  };

  /**
   * Moves an item from the active wishlist to the active shopping bag,
   * then removes it from the wishlist.
   */
  const moveToBag = async (product: Product, size?: string, color?: string) => {
    const selectedSize = size || (product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedColor = color || (product.colors.length > 0 ? product.colors[0].name : undefined);
    await addToCart(product, 1, selectedSize, selectedColor);
    await removeFromWishlist(product.id);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToBag,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * Hook to access the active store's wishlist.
 */
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

