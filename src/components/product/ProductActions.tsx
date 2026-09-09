import React, { useState } from 'react';
import { Product } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Button } from '../common/Button';
import { ShoppingBag, Heart, Check, Zap } from 'lucide-react';

interface ProductActionsProps {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  onValidationFail?: () => void;
  onProceedToCheckout?: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  selectedSize,
  selectedColor,
  onValidationFail,
  onProceedToCheckout,
}) => {
  const { isPremium } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [isAdded, setIsAdded] = useState(false);
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = async () => {
    // If product has sizes and none selected, fail validation
    if (product.sizes.length > 0 && !selectedSize) {
      if (onValidationFail) onValidationFail();
      return;
    }

    await addToCart(product, 1, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  const handleBuyNow = async () => {
    if (product.sizes.length > 0 && !selectedSize) {
      if (onValidationFail) onValidationFail();
      return;
    }
    await addToCart(product, 1, selectedSize, selectedColor);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Add to Bag Button */}
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          leftIcon={
            isAdded ? (
              <Check className="w-5 h-5 mr-1 text-emerald-400" />
            ) : (
              <ShoppingBag className="w-5 h-5 mr-1" />
            )
          }
        >
          {isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}
        </Button>

        {/* Buy Now Button */}
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          leftIcon={<Zap className="w-5 h-5 mr-1" />}
        >
          BUY NOW
        </Button>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`px-5 py-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-500 text-white border-rose-500'
              : isPremium
              ? 'border-[#383845] bg-[#181820] text-zinc-300 hover:text-white hover:border-[#D4AF37]'
              : 'border-zinc-300 bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
