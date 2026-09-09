/**
 * ============================================================================
 * Style Zone Marketplace - Order Domain Types (order.ts)
 * ============================================================================
 * Defines models for:
 * 1. Order status lifecycle (pending, confirmed, processing, shipped, delivered, cancelled)
 * 2. Delivery options (Store Pickup vs Express Doorstep Courier)
 * 3. Line items with selected size and color attributes
 * 4. Transparent Indian Price Breakdown (MRP, Discounts, GST, Delivery Fee)
 * 5. Store Pickup credentials (7-day collection deadline & redemption code)
 * 6. Lucky Draw Tickets awarded during checkout
 * ============================================================================
 */

import { Address } from './user';
import { StoreType } from './product';
import { Coupon } from './coupon';
import { LuckyDrawCouponAwarded } from './banner';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DeliveryOption {
  id: string;
  name: string;
  estimatedDays: string;
  price: number;
  description: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  storeType: StoreType;
}

export interface PriceBreakdown {
  subtotal: number;
  totalMrp: number;
  productDiscount: number;
  couponDiscount: number;
  deliveryCharge: number;
  convenienceFee: number;
  campaignBenefitAwarded?: string;
  finalPayableAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  storeType: StoreType;
  items: OrderItem[];
  shippingAddress: Address;
  deliveryOption: DeliveryOption;
  appliedCoupon?: Coupon;
  premiumCampaignClaimed?: string;
  luckyDrawCouponsAwarded?: LuckyDrawCouponAwarded[];
  priceBreakdown: PriceBreakdown;
  status: OrderStatus;
  paymentStatus: 'pending' | 'ready_for_payment' | 'completed' | 'failed';
  paymentMethod?: 'pay_at_store' | 'upi' | 'card' | string;
  fulfillmentType?: 'store_pickup' | 'doorstep_delivery';
  pickupDetails?: {
    storeName: string;
    storeAddress: string;
    pickupDeadline: string; // 7 days from order date
    pickupCode: string;
    instructions: string;
  };
  dispatchDetails?: {
    courier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    dispatchStatus: string;
  };
  createdAt: string;
  updatedAt: string;
}
