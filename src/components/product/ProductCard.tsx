import React from 'react';
import { Product } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Heart, Star, ShoppingBag, Crown } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { isPremium } = useStore();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);

  const isLiked = isInWishlist(product.id);

  const activeImage = React.useMemo(() => {
    if (selectedColor && product.colorImages && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    const colorObj = product.colors.find((c) => c.name === selectedColor);
    if (colorObj?.imageUrl) {
      return colorObj.imageUrl;
    }
    return product.images[0];
  }, [selectedColor, product]);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If product requires size, navigate to detail to pick size, else add first size/directly
    if (product.sizes.length > 1) {
      onClick();
    } else {
      const size = product.sizes.length === 1 ? product.sizes[0] : undefined;
      const color = selectedColor || (product.colors.length > 0 ? product.colors[0].name : undefined);
      addToCart(product, 1, size, color);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between ${
        isPremium
          ? 'bg-[#15151A] border border-[#2A2A33] hover:border-[#D4AF37]/60 hover:shadow-xl hover:shadow-black/70'
          : 'bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md'
      }`}
    >
      {/* Image Gallery Stage with strict aspect-ratio & object-fit: cover */}
      <div className="relative w-full aspect-3/4 overflow-hidden bg-zinc-900">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Store Type Badge */}
        {product.storeType === 'premium' && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs border border-[#D4AF37]/50 text-[#F3E5AB] text-[10px] font-bold uppercase tracking-wider font-luxury">
            <Crown className="w-3 h-3 text-[#D4AF37]" />
            <span>LUXE</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                isPremium
                  ? 'bg-[#D4AF37] text-zinc-950 font-luxury'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {product.discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Icon Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-transform active:scale-90 cursor-pointer ${
            isLiked
              ? 'bg-rose-500 text-white'
              : isPremium
              ? 'bg-black/50 text-white hover:bg-black/80 hover:text-rose-400'
              : 'bg-white/80 text-zinc-700 hover:bg-white hover:text-rose-500 shadow-xs'
          }`}
          title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay on hover (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg backdrop-blur-md cursor-pointer transition-colors ${
              isPremium
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 hover:brightness-110 font-luxury'
                : 'bg-zinc-900 text-white hover:bg-black'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.sizes.length > 1 ? 'Select Size' : 'Quick Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Brand and Rating */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider truncate ${
                isPremium ? 'text-[#D4AF37] font-luxury' : 'text-zinc-500'
              }`}
            >
              {product.brand}
            </span>
            <div className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded">
              <Star className="w-3 h-3 fill-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            className={`text-xs sm:text-sm font-semibold line-clamp-1 mb-1.5 ${
              isPremium ? 'text-zinc-200' : 'text-zinc-900'
            }`}
          >
            {product.name}
          </h3>

          {/* Interactive Color Dots */}
          {product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2 py-0.5" onClick={(e) => e.stopPropagation()}>
              {product.colors.slice(0, 4).map((col) => {
                const isCurActive = (selectedColor || product.colors[0]?.name) === col.name;
                return (
                  <button
                    key={col.name}
                    type="button"
                    title={col.name}
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer border ${
                      isCurActive ? 'scale-125 ring-2 ring-amber-500 border-white' : 'border-black/20 hover:scale-110'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                );
              })}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-zinc-400 font-medium">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span
            className={`text-sm sm:text-base font-extrabold ${
              isPremium ? 'text-white font-luxury' : 'text-zinc-900'
            }`}
          >
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
