import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Crown, Sparkles } from 'lucide-react';

export const StoreSwitcher: React.FC = () => {
  const { storeType, setStoreType, isPremium } = useStore();

  return (
    <div className="inline-flex items-center p-1 rounded-full bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 shadow-inner">
      <button
        onClick={() => setStoreType('normal')}
        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
          !isPremium
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-400 hover:text-white'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>NORMAL</span>
      </button>

      <button
        onClick={() => setStoreType('premium')}
        className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
          isPremium
            ? 'bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#AA7C11] text-zinc-950 shadow-md shadow-[#D4AF37]/20 font-luxury'
            : 'text-zinc-500 hover:text-zinc-900'
        }`}
      >
        <Crown className="w-3.5 h-3.5" />
        <span>PREMIUM</span>
      </button>
    </div>
  );
};
