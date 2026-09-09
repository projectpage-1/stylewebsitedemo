import React from 'react';
import { CheckoutStep } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  steps: { id: CheckoutStep; label: string }[];
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep, steps }) => {
  const { isPremium } = useStore();
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3">
      <div className="flex items-center justify-between min-w-[620px] max-w-4xl mx-auto px-4">
        {steps.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isPassed
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? isPremium
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 ring-4 ring-[#D4AF37]/20 font-luxury'
                        : 'bg-zinc-900 text-white ring-4 ring-zinc-200'
                      : isPremium
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isPassed ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 whitespace-nowrap tracking-wide ${
                    isCurrent
                      ? isPremium
                        ? 'text-[#F3E5AB] font-luxury font-bold'
                        : 'text-zinc-950 font-bold'
                      : isPassed
                      ? 'text-zinc-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting Line */}
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    idx < currentIndex
                      ? 'bg-emerald-500'
                      : isPremium
                      ? 'bg-zinc-800'
                      : 'bg-zinc-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
