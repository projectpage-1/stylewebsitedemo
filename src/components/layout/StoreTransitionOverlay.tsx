import React, { useEffect, useState } from 'react';
import { StoreType } from '../../types/product';
import { Crown, Sparkles, Gem, ShieldCheck } from 'lucide-react';

interface StoreTransitionOverlayProps {
  isVisible: boolean;
  targetStore: StoreType | null;
}

/**
 * StoreTransitionOverlay:
 * Renders an impressive, cinematic buffering animation when switching between
 * Normal and Premium stores with animated progress, glowing auras, and distinctive store identity.
 */
export const StoreTransitionOverlay: React.FC<StoreTransitionOverlayProps> = ({
  isVisible,
  targetStore,
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    if (!isVisible) {
      setProgress(15);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 20) + 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible || !targetStore) return null;

  const isEnteringPremium = targetStore === 'premium';

  return (
    <div
      id="store-transition-buffer"
      role="alert"
      aria-busy="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 select-none ${
        isEnteringPremium
          ? 'bg-gradient-to-b from-[#0B0B10] via-[#050508] to-[#000002] text-white'
          : 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EFF6FF] text-zinc-900'
      }`}
    >
      {/* Dynamic Ambient Radiant Glows */}
      <div
        className={`absolute w-96 h-96 rounded-full filter blur-[110px] opacity-30 pointer-events-none transition-all duration-700 animate-pulse ${
          isEnteringPremium
            ? 'bg-gradient-to-tr from-[#D4AF37] to-[#AA7C11]'
            : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg space-y-6">
        {/* Animated Multi-Ring Store Emblem */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outermost Orbiting Particle Ring */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-dashed animate-spin opacity-50 ${
              isEnteringPremium ? 'border-[#D4AF37]' : 'border-blue-500'
            }`}
            style={{ animationDuration: '6s' }}
          />

          {/* Primary High-Speed Glowing Ring */}
          <div
            className={`absolute inset-2 rounded-full border-3 border-transparent animate-spin ${
              isEnteringPremium
                ? 'border-t-[#D4AF37] border-r-[#F3E5AB] border-b-transparent border-l-[#AA7C11]'
                : 'border-t-blue-600 border-r-indigo-400 border-b-transparent border-l-sky-400'
            }`}
            style={{ animationDuration: '1.2s' }}
          />

          {/* Inner Counter-Spin Accent */}
          <div
            className={`absolute inset-5 rounded-full border border-dotted animate-spin opacity-40 ${
              isEnteringPremium ? 'border-[#F3E5AB]' : 'border-blue-400'
            }`}
            style={{ animationDirection: 'reverse', animationDuration: '2.5s' }}
          />

          {/* Center Brand Medallion */}
          <div
            className={`w-22 h-22 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 transform scale-100 ${
              isEnteringPremium
                ? 'bg-gradient-to-br from-[#1C1C26] via-[#12121A] to-[#0A0A0E] border-2 border-[#D4AF37]/60 shadow-[0_0_35px_rgba(212,175,55,0.35)] text-[#D4AF37]'
                : 'bg-white border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.25)] text-blue-600'
            }`}
          >
            {isEnteringPremium ? (
              <div className="flex flex-col items-center">
                <Crown className="w-9 h-9 animate-bounce" />
                <span className="text-[9px] font-luxury font-black tracking-widest text-[#F3E5AB] -mt-1">
                  LUXE
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black tracking-tighter text-zinc-900">
                  SZ
                </span>
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-blue-600 -mt-1">
                  ORIGINAL
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Store Title & Micro-Copy */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            {isEnteringPremium ? (
              <Gem className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-blue-600" />
            )}
            <span
              className={`text-xs uppercase font-extrabold tracking-[0.3em] ${
                isEnteringPremium ? 'text-[#D4AF37] font-luxury' : 'text-blue-600'
              }`}
            >
              {isEnteringPremium ? 'Entering Haute Couture Suite' : 'Entering Fashion Marketplace'}
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isEnteringPremium
                ? 'font-luxury text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3D1] to-[#C5A059]'
                : 'text-zinc-900 tracking-tight'
            }`}
          >
            {isEnteringPremium ? 'STYLE ZONE LUXE' : 'STYLE ZONE FASHION'}
          </h2>

          <p
            className={`text-xs max-w-sm mx-auto font-medium leading-relaxed ${
              isEnteringPremium ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            {isEnteringPremium
              ? 'Calibrating boutique designer catalog, bespoke finishes, and grand superbike lucky draw privileges...'
              : 'Syncing verified apparel collections, low-range daily fashion, and fast fulfillment counters...'}
          </p>
        </div>

        {/* Dynamic Smooth Progress Gauge */}
        <div className="w-64 space-y-1.5">
          <div className="w-full h-1.5 rounded-full bg-zinc-200/50 dark:bg-zinc-800/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isEnteringPremium
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11]'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>Synchronizing Store</span>
            <span className="font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
