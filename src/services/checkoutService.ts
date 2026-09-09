import { INITIAL_CAMPAIGNS, INITIAL_COUPONS, DELIVERY_OPTIONS } from '../data/homeData';
import { CartItem } from '../types/cart';
import { Coupon, CouponValidationResult } from '../types/coupon';
import { DeliveryOption, PriceBreakdown } from '../types/order';
import { PremiumCampaign } from '../types/banner';
import { StoreType } from '../types/product';
import { calculateCartTotals } from '../utils/priceCalculator';

const STORAGE_KEY_COUPONS = 'sz_coupons_db';
const STORAGE_KEY_CAMPAIGNS = 'sz_campaigns_db';

export const getStoredCoupons = (): Coupon[] => {
  const local = localStorage.getItem(STORAGE_KEY_COUPONS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(INITIAL_COUPONS));
  return INITIAL_COUPONS;
};

export const getStoredCampaigns = (): PremiumCampaign[] => {
  const local = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS));
  return INITIAL_CAMPAIGNS;
};

export const checkoutService = {
  async getDeliveryOptions(): Promise<DeliveryOption[]> {
    return DELIVERY_OPTIONS;
  },

  async validateCoupon(
    code: string,
    subtotal: number,
    storeType: StoreType
  ): Promise<CouponValidationResult> {
    const coupons = getStoredCoupons();
    const cleanCode = code.trim().toUpperCase();

    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Invalid coupon code. Please check and retry.',
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'This coupon code has expired or is deactivated.',
      };
    }

    // Check store restriction
    if (coupon.storeType !== 'both' && coupon.storeType !== storeType) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `This coupon is exclusively valid for ${coupon.storeType.toUpperCase()} store items.`,
      };
    }

    // Check min order value
    if (subtotal < coupon.minOrderValue) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required to apply this coupon.`,
      };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      const calc = (subtotal * coupon.discountValue) / 100;
      discountAmount = coupon.maxDiscount ? Math.min(calc, coupon.maxDiscount) : calc;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      isValid: true,
      coupon,
      discountAmount: Math.round(discountAmount),
      message: `Coupon '${coupon.code}' applied successfully! Saved ₹${Math.round(discountAmount).toLocaleString('en-IN')}.`,
    };
  },

  async getActivePremiumCampaign(subtotal: number): Promise<PremiumCampaign | null> {
    const campaigns = getStoredCampaigns();
    const active = campaigns.filter((c) => c.isActive && c.store === 'premium');
    if (active.length === 0) return null;

    // Find qualifying campaign with highest threshold that user qualifies for
    const qualifying = active
      .filter((c) => subtotal >= c.minOrderValue)
      .sort((a, b) => b.minOrderValue - a.minOrderValue);

    return qualifying.length > 0 ? qualifying[0] : active[0];
  },

  async calculateFinalBreakdown(
    items: CartItem[],
    deliveryOption: DeliveryOption,
    coupon: Coupon | null,
    campaign: PremiumCampaign | null,
    storeType: StoreType
  ): Promise<PriceBreakdown> {
    return calculateCartTotals(items, deliveryOption, coupon, campaign, storeType);
  },
};
