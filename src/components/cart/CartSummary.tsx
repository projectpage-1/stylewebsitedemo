import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PriceBreakdown } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../common/Button';
import { ShieldCheck, ArrowRight, Sparkles, Smartphone } from 'lucide-react';

interface CartSummaryProps {
  breakdown: PriceBreakdown;
  onProceedToCheckout: () => void;
  isEligibleForCampaign?: boolean;
  campaignName?: string;
  itemCount: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  breakdown,
  onProceedToCheckout,
  isEligibleForCampaign = false,
  campaignName,
  itemCount,
}) => {
  const { isPremium, storeType } = useStore();

  return (
    <div
      className={`p-6 rounded-2xl border transition-all space-y-5 ${
        isPremium
          ? 'bg-[#15151C] border-[#2A2A35]'
          : 'bg-white border-zinc-200 shadow-xs'
      }`}
    >
      <h3
        className={`text-sm font-bold uppercase tracking-wider pb-3 border-b ${
          isPremium ? 'border-zinc-800 text-white font-luxury' : 'border-zinc-100 text-zinc-900'
        }`}
      >
        Order Price Details ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
      </h3>

      {/* Lucky Draw Active Eligibility Banner */}
      {breakdown.subtotal >= 2500 && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#AA7C11]/10 border border-[#D4AF37]/40 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/30 text-[#F3E5AB]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#F3E5AB] font-luxury">
                {breakdown.subtotal >= 5000
                  ? 'Lucky Draw: Super Bike Pass Unlocked!'
                  : 'Lucky Draw: 5G Mobile Pass Unlocked!'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 mt-0.5">
              {breakdown.subtotal >= 5000
                ? 'Your order qualifies for both the Super Bike & 5G Smartphone lucky draws.'
                : 'Your order qualifies for the 5G Smartphone lucky draw.'}
            </p>
          </div>
        </div>
      )}

      {/* Line item breakdown */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Total MRP Value</span>
          <span className="font-semibold text-zinc-400 line-through">
            {formatCurrency(breakdown.totalMrp)}
          </span>
        </div>

        <div className="flex items-center justify-between text-emerald-500">
          <span>Catalog Bag Discount</span>
          <span className="font-semibold">-{formatCurrency(breakdown.productDiscount)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Bag Subtotal</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {formatCurrency(breakdown.subtotal)}
          </span>
        </div>

        {breakdown.couponDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-500">
            <span>Coupon Discount</span>
            <span className="font-semibold">-{formatCurrency(breakdown.couponDiscount)}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-zinc-500">Delivery Fee</span>
          <span className="font-semibold">
            {breakdown.deliveryCharge === 0 ? (
              <span className="text-emerald-500 font-bold uppercase text-[11px]">FREE</span>
            ) : (
              formatCurrency(breakdown.deliveryCharge)
            )}
          </span>
        </div>

        {breakdown.convenienceFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Platform Handling Fee</span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {formatCurrency(breakdown.convenienceFee)}
            </span>
          </div>
        )}
      </div>

      {/* Final Total Amount */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Total Payable
          </span>
          <span className="text-[10px] text-zinc-500">Inclusive of GST</span>
        </div>
        <span
          className={`text-2xl font-black ${
            isPremium ? 'text-[#F3E5AB] font-luxury' : 'text-zinc-900'
          }`}
        >
          {formatCurrency(breakdown.finalPayableAmount)}
        </span>
      </div>

      {/* Free Delivery Target Alert (for Normal store) */}
      {storeType === 'normal' && breakdown.subtotal < 999 && (
        <div className="text-[11px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 p-2.5 rounded-xl text-center">
          Add <strong>{formatCurrency(999 - breakdown.subtotal)}</strong> more to get{' '}
          <strong className="text-emerald-600">FREE Standard Delivery</strong>!
        </div>
      )}

      {/* CTA Button */}
      <Button
        variant={isPremium ? 'luxury' : 'primary'}
        size="lg"
        fullWidth
        onClick={onProceedToCheckout}
        rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
      >
        PROCEED TO CHECKOUT
      </Button>

      {/* Trust reassurance badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Safe & Secure 256-Bit SSL Checkout</span>
      </div>
    </div>
  );
};
