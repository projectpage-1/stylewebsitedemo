import { Product, StoreType } from './product';

export interface CartItem {
  id: string; // Unique combination: `${productId}-${size || 'nosize'}-${color || 'nocolor'}`
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number;
  originalPrice?: number;
  storeType: StoreType;
}

export interface CartSummary {
  subtotal: number;
  productDiscountTotal: number;
  couponDiscountTotal: number;
  deliveryCharge: number;
  platformFee: number;
  totalPayable: number;
  itemCount: number;
}
