import { Address, User } from '../types/user';

const STORAGE_KEY_USER = 'sz_active_user';

const DEMO_CUSTOMER: User = {
  id: 'usr-customer-01',
  fullName: 'Alexander Wright',
  email: 'alex@stylezone.com',
  phone: '+91 98765 43210',
  role: 'customer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  addresses: [
    {
      id: 'addr-01',
      name: 'Alexander Wright',
      phone: '+91 98765 43210',
      street: 'Flat 402, Highline Luxury Towers, Bandra Kurla Complex',
      locality: 'Bandra East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      type: 'home',
      isDefault: true,
    },
    {
      id: 'addr-02',
      name: 'Alexander Wright (Office)',
      phone: '+91 98765 43210',
      street: '7th Floor, Innovation Hub, Senapati Bapat Marg',
      locality: 'Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      type: 'work',
      isDefault: false,
    },
  ],
  createdAt: '2025-01-15T10:00:00.000Z',
};

const DEMO_ADMIN: User = {
  id: 'usr-admin-01',
  fullName: 'Style Zone Operations Admin',
  email: 'admin@stylezone.com',
  phone: '+91 98989 89898',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  addresses: [],
  createdAt: '2024-12-01T08:00:00.000Z',
};

export const getStoredUser = (): User | null => {
  const local = localStorage.getItem(STORAGE_KEY_USER);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }
  return null; // Guest browsing by default! Login only when required
};

export const saveStoredUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    return getStoredUser();
  },

  async login(email: string, role: 'customer' | 'admin' = 'customer'): Promise<User> {
    const user = role === 'admin' ? { ...DEMO_ADMIN, email } : { ...DEMO_CUSTOMER, email };
    saveStoredUser(user);
    return user;
  },

  async adminLogin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    if (email.trim().toLowerCase() === 'admin@stylezone.com' && (password === 'admin123' || password === '123456')) {
      const adminUser: User = { ...DEMO_ADMIN, email };
      saveStoredUser(adminUser);
      return { success: true, user: adminUser };
    }
    if (password === 'admin123' || password === '123456') {
      const adminUser: User = {
        ...DEMO_ADMIN,
        email: email || 'admin@stylezone.com',
        fullName: 'Style Zone Operations Admin',
      };
      saveStoredUser(adminUser);
      return { success: true, user: adminUser };
    }
    return { success: false, error: 'Invalid admin credentials. Use admin@stylezone.com / admin123' };
  },

  async register(fullName: string, email: string, phone: string): Promise<User> {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName,
      email,
      phone,
      role: 'customer',
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    saveStoredUser(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    saveStoredUser(null);
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<User> {
    let user = getStoredUser();
    if (!user) {
      user = { ...DEMO_CUSTOMER, addresses: [] };
    }
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}`,
    };

    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach((a) => (a.isDefault = false));
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    saveStoredUser(user);
    return user;
  },

  async updateAddress(addressId: string, updated: Partial<Address>): Promise<User> {
    const user = getStoredUser();
    if (!user) return DEMO_CUSTOMER;
    const index = user.addresses.findIndex((a) => a.id === addressId);
    if (index > -1) {
      if (updated.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      }
      user.addresses[index] = { ...user.addresses[index], ...updated };
      saveStoredUser(user);
    }
    return user;
  },

  async deleteAddress(addressId: string): Promise<User> {
    const user = getStoredUser();
    if (!user) return DEMO_CUSTOMER;
    user.addresses = user.addresses.filter((a) => a.id !== addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    saveStoredUser(user);
    return user;
  },
};
