import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types/product';

interface WishlistPageProps {
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  onNavigate,
  onSelectProduct,
}) => {
  const { items, itemCount, moveToBag } = useWishlist();
  const { isPremium } = useStore();

  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-md mx-auto">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${
            isPremium
              ? 'bg-[#1D1D26] text-[#D4AF37] border border-[#D4AF37]/30'
              : 'bg-rose-50 text-rose-500'
          }`}
        >
          <Heart className="w-10 h-10" />
        </div>
        <h2
          className={`text-2xl font-extrabold tracking-tight mb-2 ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Your Wishlist is Empty
        </h2>
        <p className={`text-sm mb-8 ${isPremium ? 'text-zinc-400' : 'text-zinc-600'}`}>
          Save styles you covet to easily monitor price drops and rapid inventory updates.
        </p>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          onClick={() => onNavigate('/')}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Discover Fashion Trends
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900'
            }`}
          >
            My Saved Wishlist ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated garments reserved for your wardrobe
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col justify-between">
            <ProductCard
              product={item.product}
              onClick={() => onSelectProduct(item.product)}
            />
            <button
              onClick={() => moveToBag(item.product)}
              className={`mt-2 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isPremium
                  ? 'bg-zinc-800 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-zinc-950 font-luxury'
                  : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move to Bag</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
