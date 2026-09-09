import React from 'react';
import { Product } from '../../types/product';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Star, ShieldCheck, Truck, RotateCcw, Crown, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  selectedColor?: string;
}

/**
 * ProductInfo Component:
 * Displays product branding, pricing, reviews, description, key specifications,
 * and dynamically adapts features and details whenever the user picks a different color.
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({ product, selectedColor }) => {
  const { isPremium } = useStore();

  const activeColor =
    product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];

  return (
    <div className="space-y-6">
      {/* Brand, Badges & Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-sm font-extrabold uppercase tracking-widest ${
              isPremium ? 'text-[#D4AF37] font-luxury' : 'text-zinc-500'
            }`}
          >
            {product.brand}
          </span>
          {product.storeType === 'premium' && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-luxury">
              <Crown className="w-3 h-3" />
              <span>PREMIUM ATELIER</span>
            </span>
          )}
        </div>

        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          {product.name}
        </h1>

        {/* Rating and Reviews Counter */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-md text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
          <span className="text-xs text-zinc-400">
            Based on {product.reviewCount || 42} verified customer ratings
          </span>
        </div>
      </div>

      {/* Pricing Module */}
      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#181820] border border-zinc-200 dark:border-[#2C2C38] flex items-baseline gap-3">
        <span
          className={`text-3xl font-black ${
            isPremium ? 'font-luxury text-[#F3E5AB]' : 'text-zinc-900'
          }`}
        >
          {formatCurrency(product.price)}
        </span>

        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-sm text-zinc-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span
              className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                isPremium
                  ? 'bg-[#D4AF37] text-zinc-950 font-luxury'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {product.discount}% OFF
            </span>
          </>
        )}
        <span className="text-[11px] text-zinc-400 ml-auto">Inclusive of all taxes</span>
      </div>

      {/* Selected Color Dynamic Details Section */}
      {activeColor && (
        <div
          className={`p-3.5 rounded-2xl border transition-all duration-300 ${
            isPremium
              ? 'bg-[#15151E] border-[#D4AF37]/30 text-zinc-200'
              : 'bg-blue-50/60 border-blue-200/80 text-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-black/20 shadow-xs inline-block"
                style={{ backgroundColor: activeColor.hex }}
              />
              <span className="text-xs font-bold uppercase tracking-wider">
                Selected Shade: <span className={isPremium ? 'text-[#D4AF37]' : 'text-blue-700 font-extrabold'}>{activeColor.name}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              In Stock & Ready
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {activeColor.toneDescription ||
              `Expertly finished in authentic ${activeColor.name}. Features color-fast organic dye formulation with refined hand-feel texture.`}
          </p>

          <div className="mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Color SKU: CLR-{activeColor.name.replace(/\s+/g, '-').toUpperCase()}-01</span>
            <span>Batch Dispatch: Next Business Day</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Product Narrative
        </h4>
        <p className={`text-sm leading-relaxed ${isPremium ? 'text-zinc-300' : 'text-zinc-600'}`}>
          {product.description}
        </p>
      </div>

      {/* Features & Details */}
      {product.details && product.details.length > 0 && (
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
            Key Specifications & Details
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {product.details.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delivery & Trust Highlights */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
          <Truck className="w-4 h-4 text-emerald-500" />
          <span>Flexible delivery: Collect at store or receive at your doorstep</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
          <RotateCcw className="w-4 h-4 text-blue-500" />
          <span>14-day contact-free doorstep return & exchange guarantee</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <span>100% genuine guaranteed with official authenticity serial</span>
        </div>
      </div>
    </div>
  );
};
