/**
 * ============================================================================
 * Style Zone Marketplace - Banners & Promotional Campaigns (banner.ts)
 * ============================================================================
 * Type models for:
 * 1. Storefront Promotional Banners & Carousels (Desktop & Mobile)
 * 2. Lucky Draw Campaigns (Bike, Car, Smartphone, Luxury Gifts)
 * 3. Awarded Lucky Draw Tickets / Coupons with draw schedules
 * 4. Festival Sales (Diwali, Dussehra, Navratri, Pongal, Eid, etc.)
 * ============================================================================
 */

import { StoreType } from './product';

/**
 * Banner interface for carousel and promotional strips
 */
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  ctaText: string;
  linkUrl: string;
  image: string;
  mobileImage?: string;
  storeType: StoreType | 'both';
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  order: number;
}

/**
 * LuckyDrawCouponAwarded: Represents a distinct coupon ticket code
 * awarded to the customer upon qualifying order placement (e.g. Bike Draw, Phone Draw, Car Draw).
 */
export interface LuckyDrawCouponAwarded {
  campaignId: string;
  campaignName?: string;
  campaignTitle?: string;
  prizeTitle?: string;
  prize?: string;
  couponId: string; // e.g. "SZ-BIKE-LUCKY-9842"
  drawDate?: string;
  giftImageUrl?: string;
  awardedAt?: string;
}

/**
 * PremiumCampaign & Lucky Draw Campaign:
 * Admin can manage campaigns (Bike Draw, Mobile Draw, Car Draw, etc.)
 * with scope configurable to 'premium', 'normal', or 'both'.
 */
export interface PremiumCampaign {
  id: string;
  name: string;
  code: string;
  store: 'premium' | 'normal' | 'both';
  storeScope?: 'premium' | 'normal' | 'both';
  applicableStore?: 'premium' | 'normal' | 'both';
  type?: 'bike' | 'mobile' | 'car' | 'electronics' | 'luxury_gift' | 'custom';
  description?: string;
  minOrderValue: number;
  startDate: string;
  endDate: string;
  eligibilityRules: string;
  benefit: string; // e.g. "Official Super Bike Lucky Draw Coupon Entry Ticket"
  reward?: string; // prize headline
  giftTitle?: string;
  giftImageUrl?: string;
  couponPrefix?: string; // e.g. "SZ-BIKE", "SZ-PHONE", "SZ-CAR"
  drawDate?: string; // e.g. "30th April 2026"
  usageLimit: number;
  isActive: boolean;
}

/**
 * FestivalSale:
 * Allows admin to manage special festival events like Diwali Sale, Dussehra Sale, etc.
 */
export interface FestivalSale {
  id: string;
  title: string; // e.g. "Diwali Grand Festive Dhamaka", "Dussehra Mega Utsav"
  festivalName: 'Diwali' | 'Dussehra' | 'Holi' | 'Eid' | 'Navratri' | 'New Year' | 'Independence Day' | 'Custom';
  storeScope: 'normal' | 'premium' | 'both';
  discountPercentage: number;
  badgeText: string; // e.g. "FLAT 40% OFF"
  bannerImage: string;
  tagline: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}
