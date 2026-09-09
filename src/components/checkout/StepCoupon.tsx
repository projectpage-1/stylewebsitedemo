import React from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { CouponBox } from '../cart/CouponBox';
import { Button } from '../common/Button';
import { AVAILABLE_COUPONS } from '../../data/homeData';
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';

export const StepCoupon: React.FC = () => {
  const {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess,
    nextStep,
    prevStep,
  } = useCheckout();
  const { isPremium, storeType } = useStore();

  const relevantCoupons = AVAILABLE_COUPONS.filter(
    (c) => c.storeType === 'both' || c.storeType === storeType
  );

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h3
          className={`text-lg font-bold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Coupons & Promotional Benefits
        </h3>
        <p className="text-xs text-zinc-400">
          Apply savings vouchers directly to your final order calculation
        </p>
      </div>

      <CouponBox
        appliedCoupon={appliedCoupon}
        onApply={applyCoupon}
        onRemove={removeCoupon}
        error={couponError}
        successMessage={couponSuccess}
      />

      {/* Available Coupon Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Available Offers for Your Cart
        </h4>
        <div className="space-y-2.5">
          {relevantCoupons.map((c) => (
            <div
              key={c.code}
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                isPremium
                  ? 'bg-[#15151C] border-[#2A2A35]'
                  : 'bg-white border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Tag className={`w-3.5 h-3.5 ${isPremium ? 'text-[#D4AF37]' : 'text-blue-600'}`} />
                  <span className="font-mono font-bold text-xs">{c.code}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">{c.description}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Min Order: ₹{c.minOrderValue} • Expires: {new Date(c.validUntil || c.expiryDate || '2026-12-31').toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => applyCoupon(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  appliedCoupon?.code === c.code
                    ? 'bg-emerald-500 text-white'
                    : isPremium
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30'
                    : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                }`}
              >
                {appliedCoupon?.code === c.code ? 'Applied' : 'Apply'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4 mr-1" />}>
          Back
        </Button>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          onClick={nextStep}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          {storeType === 'premium' ? 'Check Campaign Eligibility' : 'Review Final Order'}
        </Button>
      </div>
    </div>
  );
};
