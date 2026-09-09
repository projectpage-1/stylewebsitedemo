/**
 * ============================================================================
 * Style Zone Marketplace - Order Service (orderService.ts)
 * ============================================================================
 * Manages customer order records, fulfillment tracking, store pickups,
 * doorstep courier deliveries, and Lucky Draw Coupon issuance.
 *
 * Core Capabilities:
 * - Persistent order storage with localStorage database.
 * - Store Pickup with unique 7-day pickup redemption codes.
 * - Home delivery tracking with Indian addresses and PIN codes.
 * - Lucky Draw ticket allocation (Car, Bike, Smartphone) upon qualifying checkout.
 * - Admin order status transitions (Pending -> Processing -> Shipped -> Delivered).
 * ============================================================================
 */

import { Order } from '../types/order';

/** Local storage database key for persisted orders */
const STORAGE_KEY_ORDERS = 'sz_orders_db';

/** Seed initial customer orders for demonstration */
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1741230001',
    orderNumber: 'SZ-2026-7821',
    userId: 'guest',
    customerName: 'Rohit Sharma',
    customerEmail: 'rohit.s@example.com',
    customerPhone: '+91 98450 12345',
    storeType: 'normal',
    items: [
      {
        productId: 'prod-norm-1',
        productName: 'Everyday Solid Cotton T-Shirt',
        brand: 'ZONE BASICS',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        size: 'L',
        color: 'Navy Blue',
        quantity: 2,
        unitPrice: 399,
        totalPrice: 798,
        storeType: 'normal',
      },
    ],
    fulfillmentType: 'store_pickup',
    pickupDetails: {
      pickupCode: 'SZ-PICKUP-7821',
      storeName: 'Style Zone Commercial Flagship',
      storeAddress: '104 Brigade Road, Bangalore - 560001',
      pickupDeadline: '12 Mar 2026',
      instructions: 'Collect your order in 7 days, else order cancelled. Show this code at billing counter.',
    },
    shippingAddress: {
      id: 'addr-store-1',
      name: 'Rohit Sharma',
      fullName: 'Rohit Sharma',
      phone: '+91 98450 12345',
      street: 'Style Zone Store Counter Pickup',
      addressLine1: 'Style Zone Store Counter Pickup',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      type: 'home',
      isDefault: true,
    },
    deliveryOption: {
      id: 'collect-at-store',
      name: 'Collect at Store',
      estimatedDays: 'Ready in 2 Hours',
      price: 0,
      description: 'Complimentary store pickup from your nearest Style Zone Atelier / Flagship Store.',
    },
    priceBreakdown: {
      subtotal: 798,
      totalMrp: 1598,
      productDiscount: 800,
      couponDiscount: 0,
      deliveryCharge: 0,
      convenienceFee: 0,
      finalPayableAmount: 798,
    },
    paymentMethod: 'pay_at_store',
    status: 'processing',
    paymentStatus: 'pending',
    createdAt: '2026-03-05T10:15:00.000Z',
    updatedAt: '2026-03-05T10:15:00.000Z',
  },
  {
    id: 'ord_1741230002',
    orderNumber: 'SZ-2026-9042',
    userId: 'guest',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@example.com',
    customerPhone: '+91 97412 88990',
    storeType: 'premium',
    items: [
      {
        productId: 'prod-prem-1',
        productName: 'Atelier Cashmere Overcoat',
        brand: 'AURELIA COUTURE',
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
        size: 'M',
        color: 'Camel Tan',
        quantity: 1,
        unitPrice: 16999,
        totalPrice: 16999,
        storeType: 'premium',
      },
    ],
    fulfillmentType: 'doorstep_delivery',
    dispatchDetails: {
      courier: 'BlueDart Air Express',
      trackingNumber: 'SZ-EXP-9042BL',
      estimatedDelivery: '1 - 3 Business Days',
      dispatchStatus: 'Dispatched & In Transit',
    },
    shippingAddress: {
      id: 'addr-priya-1',
      name: 'Priya Nair',
      fullName: 'Priya Nair',
      phone: '+91 97412 88990',
      street: 'Villa 42, Palm Meadows, Whitefield',
      addressLine1: 'Villa 42, Palm Meadows, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
      type: 'home',
      isDefault: true,
    },
    deliveryOption: {
      id: 'receive-at-doorstep',
      name: 'Receive at Your Door Step',
      estimatedDays: '1 - 3 Business Days',
      price: 99,
      description: 'Hand-delivered with tamper-proof security seals.',
    },
    priceBreakdown: {
      subtotal: 16999,
      totalMrp: 24999,
      productDiscount: 8000,
      couponDiscount: 0,
      deliveryCharge: 99,
      convenienceFee: 0,
      finalPayableAmount: 17098,
    },
    paymentMethod: 'upi',
    status: 'shipped',
    paymentStatus: 'completed',
    createdAt: '2026-03-06T12:00:00.000Z',
    updatedAt: '2026-03-06T14:30:00.000Z',
  },
  {
    id: 'ord_1741230003',
    orderNumber: 'SZ-2026-4412',
    userId: 'guest',
    customerName: 'Ananya Deshmukh',
    customerEmail: 'ananya.d@example.com',
    customerPhone: '+91 99201 55667',
    storeType: 'normal',
    items: [
      {
        productId: 'prod-norm-2',
        productName: 'Slim Fit Oxford Button-Down',
        brand: 'ZONE DENIM',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop',
        size: 'M',
        color: 'White',
        quantity: 1,
        unitPrice: 899,
        totalPrice: 899,
        storeType: 'normal',
      },
    ],
    fulfillmentType: 'doorstep_delivery',
    dispatchDetails: {
      courier: 'Delhivery Express',
      trackingNumber: 'SZ-EXP-4412DL',
      estimatedDelivery: '2 - 3 Business Days',
      dispatchStatus: 'Delivered to Doorstep',
    },
    shippingAddress: {
      id: 'addr-ananya-1',
      name: 'Ananya Deshmukh',
      fullName: 'Ananya Deshmukh',
      phone: '+91 99201 55667',
      street: 'Flat 302, Green Glen Layout, Bellandur',
      addressLine1: 'Flat 302, Green Glen Layout, Bellandur',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560103',
      type: 'home',
      isDefault: true,
    },
    deliveryOption: {
      id: 'receive-at-doorstep',
      name: 'Receive at Your Door Step',
      estimatedDays: '1 - 3 Business Days',
      price: 99,
      description: 'Hand-delivered with tamper-proof security seals.',
    },
    priceBreakdown: {
      subtotal: 899,
      totalMrp: 1899,
      productDiscount: 1000,
      couponDiscount: 0,
      deliveryCharge: 99,
      convenienceFee: 0,
      finalPayableAmount: 998,
    },
    paymentMethod: 'card',
    status: 'delivered',
    paymentStatus: 'completed',
    createdAt: '2026-03-07T09:45:00.000Z',
    updatedAt: '2026-03-07T16:00:00.000Z',
  },
];

export const getStoredOrders = (): Order[] => {
  const local = localStorage.getItem(STORAGE_KEY_ORDERS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

export const saveStoredOrders = (orders: Order[]): void => {
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
};

export const orderService = {
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orders = getStoredOrders();
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      ...orderPayload,
      id: `ord_${timestamp}`,
      orderNumber: `SZ-${new Date().getFullYear()}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveStoredOrders(orders);
    return newOrder;
  },

  async getOrders(userId?: string): Promise<Order[]> {
    const all = getStoredOrders();
    if (userId) {
      return all.filter((o) => o.userId === userId);
    }
    return all;
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const all = getStoredOrders();
    return all.find((o) => o.id === orderId || o.orderNumber === orderId);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | undefined> {
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      saveStoredOrders(orders);
    }
    return order;
  },
};
