import React from 'react';
import { useCheckout, CheckoutStep } from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { CheckoutStepper } from '../components/checkout/CheckoutStepper';
import { StepCustomerInfo } from '../components/checkout/StepCustomerInfo';
import { StepAddress } from '../components/checkout/StepAddress';
import { StepDelivery } from '../components/checkout/StepDelivery';
import { StepCoupon } from '../components/checkout/StepCoupon';
import { StepCampaign } from '../components/checkout/StepCampaign';
import { StepOrderReview } from '../components/checkout/StepOrderReview';
import { StepProceedToPay } from '../components/checkout/StepProceedToPay';
import { CartItemRow } from '../components/cart/CartItemRow';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyCart } from '../components/cart/EmptyCart';
import { ChevronRight } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { currentStep, nextStep, setStep, priceBreakdown, isCampaignEligible, activeCampaign } =
    useCheckout();
  const { items, updateQuantity, removeFromCart, itemCount } = useCart();
  const { storeType, isPremium } = useStore();

  if (items.length === 0 && currentStep !== 'proceed-to-pay') {
    return <EmptyCart onContinueShopping={() => onNavigate('/')} />;
  }

  // Stepper structure (Address is last before pay, coupons removed)
  const allSteps: { id: CheckoutStep; label: string }[] =
    storeType === 'premium'
      ? [
          { id: 'cart-review', label: '1. Cart' },
          { id: 'delivery', label: '2. Delivery' },
          { id: 'address', label: '3. Address' },
          { id: 'premium-campaign', label: '4. Lucky Draw' },
          { id: 'proceed-to-pay', label: '5. Proceed to Pay' },
        ]
      : [
          { id: 'cart-review', label: '1. Cart' },
          { id: 'delivery', label: '2. Delivery' },
          { id: 'address', label: '3. Address' },
          { id: 'proceed-to-pay', label: '4. Proceed to Pay' },
        ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Top Stepper Banner */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <CheckoutStepper currentStep={currentStep} steps={allSteps} />
      </div>

      {/* Render Current Step Component */}
      <div>
        {currentStep === 'cart-review' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Verify Bag Products ({itemCount})
              </h3>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  onRemove={() => removeFromCart(item.id)}
                  onMoveToWishlist={() => removeFromCart(item.id)}
                />
              ))}
            </div>

            <div>
              <CartSummary
                breakdown={priceBreakdown}
                onProceedToCheckout={nextStep}
                isEligibleForCampaign={isCampaignEligible}
                campaignName={activeCampaign?.name}
                itemCount={itemCount}
              />
            </div>
          </div>
        )}

        {currentStep === 'customer-info' && <StepCustomerInfo />}
        {currentStep === 'address' && <StepAddress />}
        {currentStep === 'delivery' && <StepDelivery />}
        {currentStep === 'coupon' && <StepCoupon />}
        {currentStep === 'premium-campaign' && <StepCampaign />}
        {currentStep === 'order-review' && <StepOrderReview />}
        {currentStep === 'proceed-to-pay' && <StepProceedToPay onNavigate={onNavigate} />}
      </div>
    </div>
  );
};
