import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';
import { cartService } from '../services/cartService';
import { useStore } from './StoreContext';

/**
 * Interface definition for Cart Context operations and state.
 */
interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider component:
 * Maintains store-isolated shopping cart state.
 * When the user switches between Normal and Premium stores, this provider automatically
 * swaps the cart contents to display only items belonging to the active store.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { storeType } = useStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  /**
   * Effect: Re-fetch cart items whenever the active storeType changes.
   * This guarantees that Normal products show only in Normal store,
   * and Premium products show only in Premium store.
   */
  useEffect(() => {
    cartService.getCartItems(storeType).then(setItems);
  }, [storeType]);

  // Total quantity of items in the active store's cart
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Monetary subtotal for the active store's cart
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /**
   * Adds an item to the appropriate store cart based on product.storeType.
   * If added to current store, refreshes current store state.
   */
  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    const updated = await cartService.addToCart(product, quantity, size, color);
    if ((product.storeType || 'normal') === storeType) {
      setItems([...updated]);
    }
  };

  /**
   * Updates quantity of a given item within the active store's cart.
   */
  const updateQuantity = async (itemId: string, quantity: number) => {
    const updated = await cartService.updateQuantity(itemId, quantity, storeType);
    setItems([...updated]);
  };

  /**
   * Removes an item from the active store's cart.
   */
  const removeFromCart = async (itemId: string) => {
    const updated = await cartService.removeFromCart(itemId, storeType);
    setItems([...updated]);
  };

  /**
   * Empties the current store's cart.
   */
  const clearCart = async () => {
    await cartService.clearCart(storeType);
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to consume the store-aware cart context.
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

