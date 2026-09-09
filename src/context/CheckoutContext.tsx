import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useStore } from './StoreContext';
import { checkoutService } from '../services/checkoutService';
import { orderService } from '../services/orderService';
import { adminService } from '../services/adminService';
import { Address } from '../types/user';
import { Coupon } from '../types/coupon';
import { DeliveryOption, Order, PriceBreakdown } from '../types/order';
import { PremiumCampaign, LuckyDrawCouponAwarded } from '../types/banner';

export type CheckoutStep =
  | 'cart-review'
  | 'customer-info'
  | 'address'
  | 'delivery'
  | 'coupon'
  | 'premium-campaign'
  | 'order-review'
  | 'proceed-to-pay';

interface CheckoutContextType {
  currentStep: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  deliveryOptions: DeliveryOption[];
  selectedDelivery: DeliveryOption | null;
  setSelectedDelivery: (option: DeliveryOption) => void;
  appliedCoupon: Coupon | null;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  activeCampaign: PremiumCampaign | null;
  isCampaignEligible: boolean;
  priceBreakdown: PriceBreakdown;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  customerInfo: { fullName: string; email: string; phone: string };
  setCustomerInfo: (info: { fullName: string; email: string; phone: string }) => void;
  isSubmittingOrder: boolean;
  placedOrder: Order | null;
  createOrderAndProceedToPay: (paymentMethod?: 'pay_at_store' | 'upi' | 'card') => Promise<Order | null>;
  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Fulfillment is chosen first, Address is last before payment (or skipped for in-store pickup)
const STEPS_FLOW: CheckoutStep[] = [
  'cart-review',
  'delivery',
  'address',
  'premium-campaign',
  'proceed-to-pay',
];

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, subtotal } = useCart();
  const { storeType } = useStore();
  const { user, selectedAddress: authSelectedAddress } = useAuth();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart-review');
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [activeCampaign, setActiveCampaign] = useState<PremiumCampaign | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(authSelectedAddress);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: user?.fullName || 'Alexander Wright',
    email: user?.email || 'alex@stylezone.com',
    phone: user?.phone || '+91 98765 43210',
  });
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    subtotal: 0,
    totalMrp: 0,
    productDiscount: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    convenienceFee: 0,
    finalPayableAmount: 0,
  });
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Sync user info
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
      });
      if (!selectedAddress && user.addresses.length > 0) {
        setSelectedAddress(user.addresses.find((a) => a.isDefault) || user.addresses[0]);
      }
    }
  }, [user]);

  // Load delivery options & active campaign
  useEffect(() => {
    checkoutService.getDeliveryOptions().then((opts) => {
      setDeliveryOptions(opts);
      if (opts.length > 0 && !selectedDelivery) {
        setSelectedDelivery(opts[0]);
      }
    });
  }, []);

  // Update campaign & recalculate breakdown whenever dependencies shift
  useEffect(() => {
    checkoutService.getActivePremiumCampaign(subtotal).then((camp) => {
      setActiveCampaign(camp);
    });
  }, [subtotal, storeType]);

  useEffect(() => {
    if (selectedDelivery) {
      checkoutService
        .calculateFinalBreakdown(items, selectedDelivery, appliedCoupon, activeCampaign, storeType)
        .then(setPriceBreakdown);
    }
  }, [items, selectedDelivery, appliedCoupon, activeCampaign, storeType]);

  const isCampaignEligible =
    storeType === 'premium' && !!activeCampaign && subtotal >= activeCampaign.minOrderValue;

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    setCouponSuccess(null);
    const result = await checkoutService.validateCoupon(code, subtotal, storeType);
    if (result.isValid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponSuccess(result.message);
      return true;
    } else {
      setAppliedCoupon(null);
      setCouponError(result.message);
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  };

  const setStep = (step: CheckoutStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const currentIndex = STEPS_FLOW.indexOf(currentStep);
    if (currentIndex < STEPS_FLOW.length - 1) {
      // If store is normal and next step is 'premium-campaign', skip directly to 'proceed-to-pay'
      if (storeType === 'normal' && STEPS_FLOW[currentIndex + 1] === 'premium-campaign') {
        setCurrentStep('proceed-to-pay');
      } else {
        setCurrentStep(STEPS_FLOW[currentIndex + 1]);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = STEPS_FLOW.indexOf(currentStep);
    if (currentIndex > 0) {
      if (storeType === 'normal' && STEPS_FLOW[currentIndex - 1] === 'premium-campaign') {
        setCurrentStep('address');
      } else {
        setCurrentStep(STEPS_FLOW[currentIndex - 1]);
      }
    }
  };

  const createOrderAndProceedToPay = async (
    paymentMethod: 'pay_at_store' | 'upi' | 'card' = 'pay_at_store'
  ): Promise<Order | null> => {
    const effectiveDelivery =
      selectedDelivery ||
      deliveryOptions[0] || {
        id: 'collect-at-store',
        name: 'Collect at Store',
        estimatedDays: 'Ready in 2 Hours',
        price: 0,
        description: 'Complimentary store pickup from your nearest Style Zone Atelier / Flagship Store.',
      };

    const effectiveAddress: Address = selectedAddress || {
      id: 'addr-store-pickup',
      fullName: customerInfo.fullName || 'Valued Customer',
      phone: customerInfo.phone || '+91 98765 43210',
      addressLine1:
        paymentMethod === 'pay_at_store'
          ? 'Style Zone Store Counter Pickup Desk'
          : 'Customer Delivery Address',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true,
    };

    setIsSubmittingOrder(true);
    try {
      const isStorePickup = paymentMethod === 'pay_at_store' || effectiveDelivery.id === 'collect-at-store';

      const pickupDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const pickupCode = `SZ-PICKUP-${Math.floor(1000 + Math.random() * 9000)}`;

      // Lucky Draw Coupon generation:
      // Supports premium store and admin-enabled normal store campaigns
      const luckyDrawCoupons: LuckyDrawCouponAwarded[] = [];
      try {
        const allCampaigns = await adminService.getCampaigns();
        const activeEligible = allCampaigns.filter((c) => {
          if (!c.isActive) return false;
          const scope = c.applicableStore || 'premium';
          if (storeType === 'premium') {
            return scope === 'premium' || scope === 'both';
          } else {
            return scope === 'normal' || scope === 'both';
          }
        });

        if (activeEligible.length > 0) {
          activeEligible.forEach((camp) => {
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            const prefix = camp.type ? camp.type.toUpperCase() : 'LUCKY';
            luckyDrawCoupons.push({
              couponId: `SZ-${prefix}-${randomNum}`,
              campaignId: camp.id,
              campaignTitle: camp.name,
              prize: camp.reward || camp.name,
              drawDate: camp.drawDate || 'End of Festive Season',
              awardedAt: new Date().toISOString(),
            });
          });
        } else if (storeType === 'premium') {
          // Default premium lucky draw coupon if no custom campaigns created
          const randomNum = Math.floor(100000 + Math.random() * 900000);
          luckyDrawCoupons.push({
            couponId: `SZ-SUPERCAR-${randomNum}`,
            campaignId: 'camp-default-thar',
            campaignTitle: 'Premium Atelier Supercar & Bike Lucky Draw',
            prize: 'Mahindra Thar 4x4 or BMW G310R Grand Prize Entry',
            drawDate: '31st Dec 2026',
            awardedAt: new Date().toISOString(),
          });
        }
      } catch {
        if (storeType === 'premium') {
          const randomNum = Math.floor(100000 + Math.random() * 900000);
          luckyDrawCoupons.push({
            couponId: `SZ-LUCKY-${randomNum}`,
            campaignId: 'camp-default',
            campaignTitle: 'Premium Store Mega Lucky Draw',
            prize: 'Mega Luxury Lucky Draw Grand Prize Entry',
            drawDate: 'End of Month',
            awardedAt: new Date().toISOString(),
          });
        }
      }

      const order = await orderService.createOrder({
        userId: user?.id || 'guest',
        customerName: customerInfo.fullName || 'Valued Customer',
        customerEmail: customerInfo.email || 'customer@stylezone.com',
        customerPhone: customerInfo.phone || '+91 98765 43210',
        storeType,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          brand: i.product.brand,
          image: i.product.images[0],
          size: i.selectedSize,
          color: i.selectedColor,
          quantity: i.quantity,
          unitPrice: i.price,
          totalPrice: i.price * i.quantity,
          storeType: i.storeType,
        })),
        shippingAddress: effectiveAddress,
        deliveryOption: effectiveDelivery,
        appliedCoupon: appliedCoupon || undefined,
        premiumCampaignClaimed: isCampaignEligible ? activeCampaign?.name : undefined,
        luckyDrawCouponsAwarded: luckyDrawCoupons.length > 0 ? luckyDrawCoupons : undefined,
        priceBreakdown,
        status: isStorePickup ? 'confirmed' : 'shipped',
        paymentStatus: isStorePickup ? 'pending' : 'completed',
        paymentMethod,
        fulfillmentType: isStorePickup ? 'store_pickup' : 'doorstep_delivery',
        pickupDetails: isStorePickup
          ? {
              storeName: 'Style Zone Flagship Atelier & Experience Centre',
              storeAddress: '104 Brigade Road, Commercial Hub, Bangalore - 560001',
              pickupDeadline,
              pickupCode,
              instructions: 'Collect your order in 7 days, else order cancelled. Show this pickup code at the billing counter.',
            }
          : undefined,
        dispatchDetails: !isStorePickup
          ? {
              courier: 'BlueDart Air Express',
              trackingNumber: `SZ-EXP-${Math.floor(100000 + Math.random() * 900000)}BL`,
              estimatedDelivery: '2 - 3 Business Days',
              dispatchStatus: 'Dispatched & In Transit',
            }
          : undefined,
      });

      setPlacedOrder(order);
      setCurrentStep('proceed-to-pay');
      return order;
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const resetCheckout = () => {
    setCurrentStep('cart-review');
    setAppliedCoupon(null);
    setPlacedOrder(null);
  };

  return (
    <CheckoutContext.Provider
      value={{
        currentStep,
        setStep,
        nextStep,
        prevStep,
        deliveryOptions,
        selectedDelivery,
        setSelectedDelivery,
        appliedCoupon,
        couponError,
        couponSuccess,
        applyCoupon,
        removeCoupon,
        activeCampaign,
        isCampaignEligible,
        priceBreakdown,
        selectedAddress,
        setSelectedAddress,
        customerInfo,
        setCustomerInfo,
        isSubmittingOrder,
        placedOrder,
        createOrderAndProceedToPay,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
