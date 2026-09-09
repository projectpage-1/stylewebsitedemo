import React, { createContext, useContext, useEffect, useState } from 'react';
import { Address, User, UserRole } from '../types/user';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, email: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      if (currentUser?.addresses?.length) {
        const def = currentUser.addresses.find((a) => a.isDefault) || currentUser.addresses[0];
        setSelectedAddress(def);
      }
    });
  }, []);

  const login = async (email: string, role: UserRole = 'customer') => {
    const loggedUser = await authService.login(email, role);
    setUser(loggedUser);
    if (loggedUser.addresses.length > 0) {
      setSelectedAddress(loggedUser.addresses[0]);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const res = await authService.adminLogin(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const register = async (fullName: string, email: string, phone: string) => {
    const newUser = await authService.register(fullName, email, phone);
    setUser(newUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setSelectedAddress(null);
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    const updated = await authService.addAddress(address);
    setUser({ ...updated });
    const newlyAdded = updated.addresses[updated.addresses.length - 1];
    if (newlyAdded) setSelectedAddress(newlyAdded);
  };

  const updateAddress = async (addressId: string, address: Partial<Address>) => {
    const updated = await authService.updateAddress(addressId, address);
    setUser({ ...updated });
    if (selectedAddress?.id === addressId) {
      const refreshed = updated.addresses.find((a) => a.id === addressId);
      if (refreshed) setSelectedAddress(refreshed);
    }
  };

  const deleteAddress = async (addressId: string) => {
    const updated = await authService.deleteAddress(addressId);
    setUser({ ...updated });
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(updated.addresses[0] || null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        adminLogin,
        register,
        logout,
        addAddress,
        updateAddress,
        deleteAddress,
        selectedAddress,
        setSelectedAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
