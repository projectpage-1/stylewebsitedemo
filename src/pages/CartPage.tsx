import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCheckout } from '../context/CheckoutContext';
import { useStore } from '../context/StoreContext';
import { CartItemRow } from '../components/cart/CartItemRow';
import { LuckyDrawCartUpsell } from '../components/cart/LuckyDrawCartUpsell';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyCart } from '../components/cart/EmptyCart';
import { ChevronRight } from 'lucide-react';

interface CartPageProps {
  onNavigate: (route: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, itemCount } = useCart();
  const { moveToBag, toggleWishlist } = useWishlist();
  const {
    priceBreakdown,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess,
    isCampaignEligible,
    activeCampaign,
  } = useCheckout();
  const { isPremium } = useStore();

  if (items.length === 0) {
    return <EmptyCart onContinueShopping={() => onNavigate('/')} />;
  }

  const handleMoveToWishlist = (item: any) => {
    toggleWishlist(item.product);
    removeFromCart(item.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6">
        <button onClick={() => onNavigate('/')} className="hover:underline cursor-pointer">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Shopping Bag</span>
      </div>

      <div className="flex items-baseline justify-between pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800">
        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Shopping Bag ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
        </h1>
      </div>

      {/* Two Column Layout (Items List vs Summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
              onRemove={() => removeFromCart(item.id)}
              onMoveToWishlist={() => handleMoveToWishlist(item)}
            />
          ))}
        </div>

        {/* Right Column: Lucky Draw Campaign Upsell & Price Summary */}
        <div className="space-y-6">
          <LuckyDrawCartUpsell onContinueShopping={() => onNavigate('/')} />

          <CartSummary
            breakdown={priceBreakdown}
            onProceedToCheckout={() => onNavigate('/checkout')}
            isEligibleForCampaign={isCampaignEligible}
            campaignName={activeCampaign?.name}
            itemCount={itemCount}
          />
        </div>
      </div>
    </div>
  );
};
