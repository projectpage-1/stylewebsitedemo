import { StoreType } from './product';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g., 15 for 15% or 500 for flat 500
  maxDiscount?: number;
  minOrderValue: number;
  storeType: StoreType | 'both';
  validFrom: string;
  validUntil: string;
  expiryDate?: string;
  isActive: boolean;
  usageLimitPerUser?: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
}
