import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface EmptyCartProps {
  onContinueShopping: () => void;
}

export const EmptyCart: React.FC<EmptyCartProps> = ({ onContinueShopping }) => {
  const { isPremium } = useStore();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
      <div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${
          isPremium
            ? 'bg-[#1D1D26] text-[#D4AF37] border border-[#D4AF37]/30'
            : 'bg-blue-50 text-blue-600'
        }`}
      >
        <ShoppingBag className="w-10 h-10" />
      </div>

      <h2
        className={`text-2xl font-extrabold tracking-tight mb-2 ${
          isPremium ? 'font-luxury text-white' : 'text-zinc-900'
        }`}
      >
        Your Shopping Bag is Empty
      </h2>

      <p className={`text-sm mb-8 leading-relaxed ${isPremium ? 'text-zinc-400' : 'text-zinc-600'}`}>
        There is nothing in your bag right now. Explore our curated collections and fill it with signature fashion statements.
      </p>

      <Button
        variant={isPremium ? 'luxury' : 'primary'}
        size="lg"
        onClick={onContinueShopping}
        rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
      >
        Start Exploring Collections
      </Button>
    </div>
  );
};
