import React from 'react';
import { CartItem } from '../../types/cart';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Minus, Plus, Trash2, Heart, Crown } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onMoveToWishlist: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
}) => {
  const { isPremium } = useStore();
  const { product, quantity, selectedSize, selectedColor, price } = item;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        isPremium
          ? 'bg-[#15151C] border-[#2A2A35]'
          : 'bg-white border-zinc-200 shadow-2xs'
      }`}
    >
      {/* Product Visual & Details */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-20 h-26 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />
          {item.storeType === 'premium' && (
            <div className="absolute top-1 left-1 p-0.5 rounded bg-black/80 text-[#D4AF37]">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider ${
              isPremium ? 'text-[#D4AF37] font-luxury' : 'text-zinc-500'
            }`}
          >
            {product.brand}
          </span>
          <h4
            className={`text-sm font-bold line-clamp-1 ${
              isPremium ? 'text-zinc-100' : 'text-zinc-900'
            }`}
          >
            {product.name}
          </h4>

          {/* Variants Info */}
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            {selectedSize && (
              <span>
                Size: <strong className="text-zinc-800 dark:text-zinc-200">{selectedSize}</strong>
              </span>
            )}
            {selectedColor && (
              <span>
                Color: <strong className="text-zinc-800 dark:text-zinc-200">{selectedColor}</strong>
              </span>
            )}
          </div>

          {/* Pricing unit */}
          <div className="flex items-baseline gap-2 pt-1">
            <span
              className={`text-sm font-extrabold ${
                isPremium ? 'text-white font-luxury' : 'text-zinc-900'
              }`}
            >
              {formatCurrency(price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity Modifiers & Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
        {/* Total for this line item */}
        <span
          className={`text-base font-black ${
            isPremium ? 'text-[#F3E5AB] font-luxury' : 'text-zinc-900'
          }`}
        >
          {formatCurrency(price * quantity)}
        </span>

        <div className="flex items-center gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 text-xs font-bold">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Move to Wishlist */}
          <button
            onClick={onMoveToWishlist}
            className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Save for Later"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="p-2 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
