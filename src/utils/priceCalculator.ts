import { CartItem } from '../types/cart';
import { Coupon } from '../types/coupon';
import { DeliveryOption, PriceBreakdown } from '../types/order';
import { PremiumCampaign } from '../types/banner';
import { StoreType } from '../types/product';

export const calculateCartTotals = (
  items: CartItem[],
  selectedDelivery?: DeliveryOption,
  coupon?: Coupon | null,
  activeCampaign?: PremiumCampaign | null,
  storeType: StoreType = 'normal'
): PriceBreakdown => {
  if (items.length === 0) {
    return {
      subtotal: 0,
      totalMrp: 0,
      productDiscount: 0,
      couponDiscount: 0,
      deliveryCharge: 0,
      convenienceFee: 0,
      finalPayableAmount: 0,
    };
  }

  // Calculate total MRP (sum of original prices or price)
  let totalMrp = 0;
  let subtotal = 0;

  items.forEach((item) => {
    const itemOriginal = (item.originalPrice || item.price) * item.quantity;
    const itemActual = item.price * item.quantity;
    totalMrp += itemOriginal;
    subtotal += itemActual;
  });

  const productDiscount = Math.max(0, totalMrp - subtotal);

  // Delivery charge
  let deliveryCharge = 0;
  if (selectedDelivery) {
    deliveryCharge = selectedDelivery.price;
  } else {
    // Free delivery above 999 for normal, above 1999 for premium
    const freeDeliveryThreshold = storeType === 'premium' ? 1999 : 999;
    deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : 99;
  }

  // Convenience / platform fee (free for premium, nominal ₹29 for normal)
  const convenienceFee = storeType === 'premium' ? 0 : 29;

  // Coupon discount calculation
  let couponDiscount = 0;
  if (coupon && coupon.isActive) {
    // Validate minimum order
    if (subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'percentage') {
        const calculated = (subtotal * coupon.discountValue) / 100;
        couponDiscount = coupon.maxDiscount
          ? Math.min(calculated, coupon.maxDiscount)
          : calculated;
      } else {
        couponDiscount = Math.min(coupon.discountValue, subtotal);
      }
    }
  }

  // Premium Campaign benefit check
  let campaignBenefitAwarded: string | undefined = undefined;
  if (
    storeType === 'premium' &&
    activeCampaign &&
    activeCampaign.isActive &&
    subtotal >= activeCampaign.minOrderValue
  ) {
    campaignBenefitAwarded = `${activeCampaign.name}: ${activeCampaign.benefit}`;
  }

  const finalPayableAmount = Math.max(
    0,
    Math.round(subtotal + deliveryCharge + convenienceFee - couponDiscount)
  );

  return {
    subtotal,
    totalMrp,
    productDiscount,
    couponDiscount,
    deliveryCharge,
    convenienceFee,
    campaignBenefitAwarded,
    finalPayableAmount,
  };
};
