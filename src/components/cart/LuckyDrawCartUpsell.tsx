import React from 'react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Sparkles, Trophy, Smartphone, Bike, CheckCircle2, ArrowRight } from 'lucide-react';

interface LuckyDrawCartUpsellProps {
  onContinueShopping?: () => void;
}

/**
 * LuckyDrawCartUpsell Component:
 * Realizes the Lucky Draw campaign in the cart:
 * - Orders >= ₹2,500 unlock 1 Flagship 5G Smartphone Lucky Coupon.
 * - Orders >= ₹5,000 unlock 1 Super Bike Lucky Coupon.
 * Dynamically informs customers how much more to add (e.g., if cart is ₹500, says: "Add products worth ₹2,000 more to unlock mobile coupon").
 */
export const LuckyDrawCartUpsell: React.FC<LuckyDrawCartUpsellProps> = ({ onContinueShopping }) => {
  const { subtotal } = useCart();
  const { isPremium } = useStore();

  const MOBILE_THRESHOLD = 2500;
  const BIKE_THRESHOLD = 5000;

  const hasUnlockedMobile = subtotal >= MOBILE_THRESHOLD;
  const hasUnlockedBike = subtotal >= BIKE_THRESHOLD;

  // Calculate remaining amounts and progress percentages
  const neededForMobile = Math.max(0, MOBILE_THRESHOLD - subtotal);
  const neededForBike = Math.max(0, BIKE_THRESHOLD - subtotal);

  const progressPercent = Math.min(100, Math.round((subtotal / BIKE_THRESHOLD) * 100));

  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isPremium
          ? 'bg-gradient-to-br from-[#1A1A26] via-[#14141E] to-[#121218] border-[#D4AF37]/40 shadow-lg shadow-black/40 text-white'
          : 'bg-gradient-to-br from-amber-50/70 via-white to-blue-50/50 border-amber-300 text-zinc-900 shadow-sm'
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`p-1.5 rounded-lg ${
              isPremium ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-amber-500 text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
          </span>
          <div>
            <h3
              className={`text-xs font-black uppercase tracking-wider ${
                isPremium ? 'font-luxury text-[#F3E5AB]' : 'text-amber-700'
              }`}
            >
              LUCKY DRAW CAMPAIGN
            </h3>
            <span className="text-[10px] text-zinc-400">Exclusive Shopping Rewards</span>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
            hasUnlockedBike
              ? 'bg-emerald-500 text-white'
              : hasUnlockedMobile
              ? 'bg-blue-600 text-white'
              : isPremium
              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
              : 'bg-amber-100 text-amber-800'
          }`}
        >
          {hasUnlockedBike
            ? 'Super Bike Pass Unlocked!'
            : hasUnlockedMobile
            ? 'Mobile Pass Unlocked!'
            : 'Lucky Draw Active'}
        </span>
      </div>

      {/* Dynamic Upsell Messaging */}
      <div className="mb-4">
        {!hasUnlockedMobile ? (
          <div>
            <p className="text-sm font-bold leading-snug">
              Add products worth{' '}
              <span className={isPremium ? 'text-[#D4AF37] font-black' : 'text-blue-700 font-black'}>
                {formatCurrency(neededForMobile)}
              </span>{' '}
              more to get a <span className="underline decoration-amber-400">5G Smartphone Lucky Coupon</span>!
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Reach {formatCurrency(BIKE_THRESHOLD)} to also qualify for the Super Bike Lucky Coupon.
            </p>
          </div>
        ) : !hasUnlockedBike ? (
          <div>
            <p className="text-sm font-bold leading-snug flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>5G Mobile Lucky Coupon Unlocked!</span>
            </p>
            <p className="text-xs font-semibold mt-1">
              Add{' '}
              <span className={isPremium ? 'text-[#D4AF37] font-black' : 'text-blue-700 font-black'}>
                {formatCurrency(neededForBike)}
              </span>{' '}
              more to upgrade and claim your{' '}
              <span className="text-amber-500 font-bold">Super Bike Lucky Coupon</span>!
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-black leading-snug flex items-center gap-1.5 text-emerald-500">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Grand Tier Unlocked: Super Bike & 5G Smartphone Passes!</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Your order qualifies for the grand prizes. Your official draw entry codes will be confirmed on checkout.
            </p>
          </div>
        )}
      </div>

      {/* Dual Goal Progress Bar */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-semibold text-zinc-400">
          <span>Current Bag: {formatCurrency(subtotal)}</span>
          <span>Goal: {formatCurrency(BIKE_THRESHOLD)}</span>
        </div>

        <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hasUnlockedBike
                ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500'
                : hasUnlockedMobile
                ? 'bg-gradient-to-r from-blue-500 to-amber-400'
                : 'bg-gradient-to-r from-amber-500 to-blue-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Milestone Pin Indicators */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Milestone 1: Mobile */}
          <div
            className={`p-2 rounded-xl border text-center transition-all ${
              hasUnlockedMobile
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'bg-black/5 dark:bg-white/5 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>₹2,500+</span>
            </div>
            <span className="text-[10px] block mt-0.5">
              {hasUnlockedMobile ? '✓ Mobile Pass Earned' : '5G Mobile Coupon'}
            </span>
          </div>

          {/* Milestone 2: Bike */}
          <div
            className={`p-2 rounded-xl border text-center transition-all ${
              hasUnlockedBike
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 font-bold'
                : 'bg-black/5 dark:bg-white/5 border-zinc-200 dark:border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-center gap-1 text-[11px]">
              <Bike className="w-3.5 h-3.5" />
              <span>₹5,000+</span>
            </div>
            <span className="text-[10px] block mt-0.5">
              {hasUnlockedBike ? '✓ Super Bike Pass Earned' : 'Super Bike Coupon'}
            </span>
          </div>
        </div>
      </div>

      {/* Action to continue shopping if threshold not met */}
      {!hasUnlockedBike && onContinueShopping && (
        <button
          type="button"
          onClick={onContinueShopping}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            isPremium
              ? 'bg-[#2A2A3A] hover:bg-[#343448] text-[#F3E5AB]'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
          }`}
        >
          <span>Explore More Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
