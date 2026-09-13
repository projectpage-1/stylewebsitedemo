/**
 * ============================================================================
 * Style Zone Marketplace - User & Address Domain Models (user.ts)
 * ============================================================================
 * Defines models for:
 * 1. User authentication state and roles ('customer' vs 'admin')
 * 2. Strict Indian Postal Address validation fields:
 *    - Recipient name and 10-digit mobile number (+91)
 *    - Street / Building / House number
 *    - Locality / Area / Landmark
 *    - City & Indian State / Union Territory
 *    - Exact 6-digit Indian Postal PIN code
 *    - Address categorization ('home' | 'work' | 'other')
 * ============================================================================
 */

export type UserRole = 'customer' | 'admin';

export interface Address {
  id: string;
  name: string;
  fullName?: string;
  phone: string;
  alternatePhone?: string;
  street: string;
  addressLine1?: string;
  locality?: string;
  houseNo?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}
