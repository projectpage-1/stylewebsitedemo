import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon } from '../../types/coupon';
import { Tag, Check, X } from 'lucide-react';

interface CouponBoxProps {
  appliedCoupon: Coupon | null;
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  error?: string | null;
  successMessage?: string | null;
}

export const CouponBox: React.FC<CouponBoxProps> = ({
  appliedCoupon,
  onApply,
  onRemove,
  error,
  successMessage,
}) => {
  const { isPremium } = useStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsLoading(true);
    await onApply(code.trim().toUpperCase());
    setIsLoading(false);
    setCode('');
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isPremium
          ? 'bg-[#15151C] border-[#2A2A35]'
          : 'bg-white border-zinc-200 shadow-2xs'
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className={`w-4 h-4 ${isPremium ? 'text-[#D4AF37]' : 'text-blue-600'}`} />
        <h4 className={`text-xs font-bold uppercase tracking-wider ${isPremium ? 'text-zinc-200' : 'text-zinc-900'}`}>
          Apply Promotional Coupon
        </h4>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <div>
              <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
                {appliedCoupon.code} Applied
              </span>
              <p className="text-[11px] text-zinc-500">
                {appliedCoupon.type === 'percentage'
                  ? `${appliedCoupon.value}% discount applied`
                  : `₹${appliedCoupon.value} discount applied`}
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1 rounded text-zinc-400 hover:text-rose-500 cursor-pointer"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={isPremium ? 'Enter LUXURYVIP or code' : 'Enter STYLE20 or code'}
            className={`flex-1 px-3.5 py-2 text-xs uppercase font-semibold rounded-xl outline-hidden border ${
              isPremium
                ? 'bg-[#1B1B24] text-white border-zinc-700 placeholder-zinc-500 focus:border-[#D4AF37]'
                : 'bg-zinc-50 text-zinc-900 border-zinc-200 placeholder-zinc-400 focus:border-zinc-400'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer ${
              isPremium
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                : 'bg-zinc-900 text-white hover:bg-black'
            }`}
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}

      {/* Inline Feedback alerts */}
      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-500">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mt-2 text-xs font-semibold text-emerald-500">
          {successMessage}
        </p>
      )}

      {/* Suggested Quick Codes */}
      <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
        <span>Try:</span>
        <button
          type="button"
          onClick={() => onApply(isPremium ? 'LUXURYVIP' : 'STYLE20')}
          className="font-mono font-bold text-blue-600 dark:text-[#D4AF37] hover:underline cursor-pointer"
        >
          {isPremium ? 'LUXURYVIP' : 'STYLE20'}
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => onApply('WELCOME500')}
          className="font-mono font-bold text-blue-600 dark:text-[#D4AF37] hover:underline cursor-pointer"
        >
          WELCOME500
        </button>
      </div>
    </div>
  );
};
