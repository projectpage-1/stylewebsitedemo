import React from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { Trophy, Sparkles, Smartphone, Bike, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

/**
 * StepCampaign Component:
 * Displays the Lucky Draw Campaign privilege for Premium Store shoppers:
 * - Orders >= ₹5,000: Super Bike Lucky Coupon pass
 * - Orders >= ₹2,500: 5G Smartphone Lucky Coupon pass
 */
export const StepCampaign: React.FC = () => {
  const { priceBreakdown, nextStep, prevStep } = useCheckout();
  const { isPremium } = useStore();

  const subtotal = priceBreakdown.subtotal;
  const hasUnlockedMobile = subtotal >= 2500;
  const hasUnlockedBike = subtotal >= 5000;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-widest font-luxury mb-1">
          <Trophy className="w-4 h-4" />
          <span>Style Zone Lucky Draw Campaign</span>
        </div>
        <h3
          className={`text-xl font-extrabold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Lucky Draw Entry Status
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Orders above ₹2,500 earn a 5G Mobile Lucky Coupon. Orders above ₹5,000 earn a Super Bike Lucky Coupon!
        </p>
      </div>

      {/* Lucky Draw Cards */}
      <div className="space-y-4">
        {/* Tier 1: Super Bike Draw Card */}
        <div
          className={`p-5 rounded-3xl border relative overflow-hidden transition-all ${
            hasUnlockedBike
              ? 'bg-gradient-to-br from-[#1E1E2C] via-[#242436] to-[#181824] border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
              : 'bg-[#15151C] border-zinc-800'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl ${
                hasUnlockedBike
                  ? 'bg-[#D4AF37] text-zinc-950 font-luxury'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Bike className="w-7 h-7" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#D4AF37] tracking-wider font-luxury">
                  Grand Tier Reward
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  Min. {formatCurrency(5000)}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-1">
                Super Bike Lucky Draw Coupon
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Eligible to win a brand new premium sports bike in our seasonal draw.
              </p>

              {hasUnlockedBike ? (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-300">
                    Qualified! 1 Super Bike Lucky Draw Pass will be generated with your order.
                  </span>
                </div>
              ) : (
                <p className="text-xs text-amber-400/90 mt-2 font-medium">
                  Add {formatCurrency(Math.max(0, 5000 - subtotal))} more to unlock this Super Bike Lucky Coupon!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tier 2: 5G Mobile Draw Card */}
        <div
          className={`p-5 rounded-3xl border relative overflow-hidden transition-all ${
            hasUnlockedMobile
              ? 'bg-gradient-to-br from-[#181E2E] via-[#1E2638] to-[#141822] border-blue-400/60 shadow-lg'
              : 'bg-[#15151C] border-zinc-800'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl ${
                hasUnlockedMobile
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Smartphone className="w-7 h-7" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">
                  Secondary Tier Reward
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400">
                  Min. {formatCurrency(2500)}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-1">
                5G Smartphone Lucky Draw Coupon
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Eligible to win the latest flagship 5G smartphone.
              </p>

              {hasUnlockedMobile ? (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-emerald-300">
                    Qualified! 1 5G Smartphone Lucky Coupon included with this order.
                  </span>
                </div>
              ) : (
                <p className="text-xs text-blue-300/90 mt-2 font-medium">
                  Add {formatCurrency(Math.max(0, 2500 - subtotal))} more to qualify for this Mobile Coupon!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4 mr-1" />}>
          Back to Delivery
        </Button>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          onClick={nextStep}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Review Order Details
        </Button>
      </div>
    </div>
  );
};
