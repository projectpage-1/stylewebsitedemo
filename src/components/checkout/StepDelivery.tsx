import React, { useState } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  Store,
  Home,
  Check,
  ArrowRight,
  ArrowLeft,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  DollarSign,
  MapPin,
} from 'lucide-react';

/**
 * StepDelivery Component:
 * Exclusively presents the 2 tailored fulfillment options:
 * 1. Collect at Store (Free pickup from flagship atelier)
 * 2. Contact With Us to Receive at Your Door Step (Identical product prices + manual delivery charge controller & concierge contact).
 */
export const StepDelivery: React.FC = () => {
  const { deliveryOptions, selectedDelivery, setSelectedDelivery, nextStep, prevStep } =
    useCheckout();
  const { isPremium } = useStore();

  // Manual delivery fee customizer state
  const [customChargeInput, setCustomChargeInput] = useState<string>('');
  const [isEditingCustomFee, setIsEditingCustomFee] = useState<boolean>(false);

  /**
   * Updates the manual delivery fee on the selected delivery option.
   * @param feeAmount - Numeric delivery charge
   */
  const handleUpdateDeliveryFee = (feeAmount: number) => {
    if (!selectedDelivery || selectedDelivery.id !== 'receive-at-doorstep') return;
    setSelectedDelivery({
      ...selectedDelivery,
      price: Math.max(0, feeAmount),
    });
  };

  /**
   * Applies custom manual fee entered in input
   */
  const handleApplyCustomFee = () => {
    const val = parseFloat(customChargeInput);
    if (!isNaN(val) && val >= 0) {
      handleUpdateDeliveryFee(val);
      setIsEditingCustomFee(false);
    }
  };

  const isDoorstep = selectedDelivery?.id === 'receive-at-doorstep';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h3
          className={`text-lg font-bold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Fulfillment & Delivery Options
        </h3>
        <p className="text-xs text-zinc-400">
          Choose to collect directly from store or arrange doorstep courier with manual delivery charges
        </p>
      </div>

      {/* Main 2 Delivery Options Cards */}
      <div className="space-y-3">
        {deliveryOptions.map((opt) => {
          const isSelected = selectedDelivery?.id === opt.id;
          const isStorePickup = opt.id === 'collect-at-store';
          const Icon = isStorePickup ? Store : Home;

          return (
            <div
              key={opt.id}
              onClick={() => setSelectedDelivery(opt)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? isPremium
                    ? 'bg-[#181824] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg shadow-black'
                    : 'bg-blue-50/60 border-zinc-900 ring-2 ring-zinc-900/10'
                  : isPremium
                  ? 'bg-[#14141A] border-[#2A2A35] hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl shrink-0 ${
                    isSelected
                      ? isPremium
                        ? 'bg-[#D4AF37] text-zinc-950 font-luxury'
                        : 'bg-zinc-900 text-white'
                      : isPremium
                      ? 'bg-zinc-800 text-[#D4AF37]'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{opt.name}</h4>
                    {isStorePickup && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        FREE PICKUP
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Estimated Availability: <strong>{opt.estimatedDays}</strong>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{opt.description}</p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className="text-sm font-black block">
                  {opt.price === 0 ? (
                    <span className="text-emerald-500 uppercase text-xs font-bold">FREE</span>
                  ) : (
                    formatCurrency(opt.price)
                  )}
                </span>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Sub-Panel 1: When Doorstep Delivery is Selected */}
      {isDoorstep && (
        <div
          className={`p-5 rounded-2xl border space-y-4 transition-all duration-300 ${
            isPremium
              ? 'bg-[#15151F] border-[#D4AF37]/30 text-white'
              : 'bg-zinc-50 border-zinc-300 text-zinc-900'
          }`}
        >
          {/* Price Guarantee Notice */}
          <div className="flex items-start gap-2.5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                100% Identical Product Price Guarantee
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                All clothing items stay strictly at their original atelier prices with zero markup. Only the exact delivery charges apply.
              </p>
            </div>
          </div>

          {/* Manual Delivery Charges Manager */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>Manual Delivery Charge: <strong>{formatCurrency(selectedDelivery?.price || 0)}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditingCustomFee(!isEditingCustomFee)}
                className="text-[11px] font-semibold text-blue-600 dark:text-[#D4AF37] hover:underline cursor-pointer"
              >
                {isEditingCustomFee ? 'Cancel' : 'Enter Custom Fee'}
              </button>
            </div>

            {/* Quick Preset Delivery Charge Selectors */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Local City', fee: 60 },
                { label: 'Standard Metro', fee: 99 },
                { label: 'Pan-India Air', fee: 149 },
              ].map((preset) => {
                const isCurrent = selectedDelivery?.price === preset.fee;
                return (
                  <button
                    key={preset.fee}
                    type="button"
                    onClick={() => handleUpdateDeliveryFee(preset.fee)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      isCurrent
                        ? isPremium
                          ? 'bg-[#D4AF37] text-zinc-950 border-[#D4AF37] shadow-sm'
                          : 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : isPremium
                        ? 'bg-[#1C1C26] border-zinc-700 text-zinc-300 hover:border-zinc-500'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-semibold opacity-75">{preset.label}</span>
                    <span className="block">{formatCurrency(preset.fee)}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Drawer */}
            {isEditingCustomFee && (
              <div className="mt-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-xs font-bold text-zinc-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter manual delivery charge"
                    value={customChargeInput}
                    onChange={(e) => setCustomChargeInput(e.target.value)}
                    className={`w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border outline-hidden ${
                      isPremium
                        ? 'bg-[#1F1F2C] border-zinc-600 text-white'
                        : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCustomFee}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                >
                  Apply Fee
                </button>
              </div>
            )}
          </div>

          {/* Contact With Us for Concierge Doorstep Dispatch */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isPremium ? 'bg-[#1A1A24] border-zinc-800' : 'bg-white border-zinc-200'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Contact Dispatch Concierge</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Contact with us on WhatsApp or call to coordinate your custom delivery slot & fee.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/919876543210?text=Hi%20StyleZone%2C%20I%20am%20placing%20an%20order%20and%20requesting%20doorstep%20delivery%20coordination."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Us</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Sub-Panel 2: When Store Pickup is Selected */}
      {!isDoorstep && (
        <div
          className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
            isPremium
              ? 'bg-[#15151F] border-[#D4AF37]/30 text-white'
              : 'bg-zinc-50 border-zinc-300 text-zinc-900'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Store className="w-4 h-4" />
            <span>Store Collection Details</span>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span><strong>Style Zone Flagship Atelier</strong>, 142 MG Road Central, Bangalore</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Timings: Mon - Sun (10:00 AM - 9:30 PM)</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-200 dark:border-zinc-800">
            Your items will be steam-pressed and boxed in luxury garment cases. Bring your Order Confirmation SMS / Email to collect.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4 mr-1" />}>
          Back
        </Button>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          disabled={!selectedDelivery}
          onClick={nextStep}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Proceed to Order Review
        </Button>
      </div>
    </div>
  );
};

