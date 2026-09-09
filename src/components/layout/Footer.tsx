import React from 'react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_CATEGORIES } from '../../data/categoryData';
import { ShieldCheck, RotateCcw, Truck, Lock, Crown, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { isPremium, toggleStore } = useStore();

  return (
    <footer
      className={`w-full transition-colors duration-300 border-t ${
        isPremium
          ? 'bg-[#0A0A0D] border-zinc-800 text-zinc-400'
          : 'bg-zinc-100 border-zinc-200 text-zinc-600'
      }`}
    >
      {/* Trust & Value Proposition Strip */}
      <div className={`border-b ${isPremium ? 'border-zinc-800/80' : 'border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPremium ? 'bg-zinc-800/80 text-[#D4AF37]' : 'bg-white text-zinc-900 shadow-xs'
                }`}
              >
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  100% Authentic
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">Directly sourced brand verified garments</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPremium ? 'bg-zinc-800/80 text-[#D4AF37]' : 'bg-white text-zinc-900 shadow-xs'
                }`}
              >
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  Hassle-Free Returns
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">14-day instant door pickup guarantee</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPremium ? 'bg-zinc-800/80 text-[#D4AF37]' : 'bg-white text-zinc-900 shadow-xs'
                }`}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  Priority Transit
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">Insured pan-India express delivery</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  isPremium ? 'bg-zinc-800/80 text-[#D4AF37]' : 'bg-white text-zinc-900 shadow-xs'
                }`}
              >
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
                  Secure Checkout
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">256-bit encrypted orders architecture</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-2xl font-black tracking-tight ${
                  isPremium
                    ? 'font-luxury text-[#E5C158]'
                    : 'text-zinc-900'
                }`}
              >
                STYLE ZONE
              </span>
              {isPremium && (
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed mb-4">
              India's premier fashion marketplace engineered for everyday modern trendsetters and luxury atelier connoisseurs alike.
            </p>
            <button
              onClick={toggleStore}
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                isPremium
                  ? 'bg-zinc-800 text-[#D4AF37] hover:bg-zinc-700'
                  : 'bg-zinc-900 text-white hover:bg-black'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Switch to {isPremium ? 'Normal Store' : 'Premium Luxe Store'}</span>
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
              Shop By Category
            </h4>
            <ul className="space-y-2 text-xs">
              {INITIAL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="hover:underline cursor-pointer transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/orders')} className="hover:underline cursor-pointer">
                  Track Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cart')} className="hover:underline cursor-pointer">
                  Shipping Rates & Times
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:underline cursor-pointer">
                  Saved Addresses
                </button>
              </li>
              <li>
                <span className="text-zinc-500">support@stylezone.com</span>
              </li>
            </ul>
          </div>

          {/* Admin & Platform */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
              Operations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="font-semibold text-amber-500 hover:underline cursor-pointer"
                >
                  Admin Operations Suite
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/campaigns')}
                  className="hover:underline cursor-pointer"
                >
                  Premium Campaigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/inventory')}
                  className="hover:underline cursor-pointer"
                >
                  Inventory Real-Time
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin/coupons')}
                  className="hover:underline cursor-pointer"
                >
                  Coupon Architecture
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 ${isPremium ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p>© {new Date().getFullYear()} STYLE ZONE Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with precision for fashion enthusiasts</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
