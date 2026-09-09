import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { Trophy, Sparkles, Smartphone, Bike, ArrowRight } from 'lucide-react';

interface PromoBannerProps {
  onNavigate: (route: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onNavigate }) => {
  const { isPremium } = useStore();

  if (isPremium) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 bg-gradient-to-r from-[#141419] via-[#1C1C26] to-[#121218] p-8 sm:p-12 shadow-2xl">
          {/* Subtle gold decorative glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest font-luxury mb-4">
                <Trophy className="w-3.5 h-3.5" />
                <span>OFFICIAL LUCKY DRAW CAMPAIGN</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-luxury leading-tight mb-3">
                Win A Super Bike or 5G Smartphone
              </h2>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                Shop with Style Zone and enter our grand seasonal lucky draw! Place orders above{' '}
                <strong className="text-[#F3E5AB]">₹5,000 to win a Super Bike</strong>, or orders above{' '}
                <strong className="text-blue-300">₹2,500 for a Flagship 5G Smartphone</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button
                  variant="luxury"
                  size="md"
                  onClick={() => onNavigate('/category/men')}
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Shop Now & Win
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => onNavigate('/cart')}
                >
                  Check Cart Eligibility
                </Button>
              </div>
            </div>

            {/* Campaign Visual Prizes */}
            <div className="grid grid-cols-2 gap-4">
              {/* Prize 1: Super Bike */}
              <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-black/50 border border-[#D4AF37]/40 backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] mb-3">
                  <Bike className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white font-luxury">Super Bike Coupon</span>
                <span className="text-[11px] text-[#D4AF37] font-semibold mt-1">Orders &gt; ₹5,000</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">1 Lucky Draw Ticket</span>
              </div>

              {/* Prize 2: 5G Mobile */}
              <div className="flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-black/50 border border-blue-500/40 backdrop-blur-md">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-3">
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-white font-luxury">5G Mobile Coupon</span>
                <span className="text-[11px] text-blue-400 font-semibold mt-1">Orders &gt; ₹2,500</span>
                <span className="text-[10px] text-zinc-400 mt-0.5">1 Lucky Draw Ticket</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-zinc-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>GRAND LUCKY DRAW FESTIVAL</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-3">
              Shop Above ₹2,500 & Win Big!
            </h2>

            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed mb-6">
              Celebrate fashion with Style Zone! Get a <strong>5G Mobile Lucky Coupon</strong> on orders above ₹2,500, or a <strong>Super Bike Lucky Coupon</strong> on orders above ₹5,000.
            </p>

            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/category/men')}
              className="bg-white text-zinc-900 hover:bg-zinc-100"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Explore Collection & Qualify
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
              <Bike className="w-10 h-10 text-amber-300 mb-2" />
              <span className="text-xs font-bold text-white">Super Bike Pass</span>
              <span className="text-[11px] text-amber-300 font-semibold mt-0.5">Orders &gt; ₹5,000</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
              <Smartphone className="w-10 h-10 text-blue-300 mb-2" />
              <span className="text-xs font-bold text-white">5G Mobile Pass</span>
              <span className="text-[11px] text-blue-300 font-semibold mt-0.5">Orders &gt; ₹2,500</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
