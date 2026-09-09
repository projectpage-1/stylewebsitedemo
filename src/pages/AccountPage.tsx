import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Button } from '../components/common/Button';
import { AddressFormModal } from '../components/common/AddressFormModal';
import { User, Mail, Phone, MapPin, Plus, Trash2, ShieldCheck, Crown, LogOut } from 'lucide-react';

interface AccountPageProps {
  onNavigate: (route: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, login, logout, addAddress, deleteAddress, isAdmin } = useAuth();
  const { storeType, toggleStore, isPremium } = useStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleSaveAddress = async (addressData: any) => {
    await addAddress({
      ...addressData,
      country: 'India',
      isDefault: (user?.addresses?.length || 0) === 0,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          My Account & Preferences
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal credentials, delivery addresses, and role settings
        </p>
      </div>

      {/* User Profile Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'
              }
              alt={user?.fullName || 'User'}
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">{user?.fullName || 'Guest Customer'}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {user?.role || 'Guest'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{user?.email || 'Not logged in'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => login('admin@stylezone.com', 'admin')}
              >
                Switch to Admin Role
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => login('customer@stylezone.com', 'customer')}
              >
                Switch to Customer Role
              </Button>
            )}
            <button
              onClick={() => logout()}
              className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-500">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>{user?.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Style Zone Verified Profile</span>
          </div>
        </div>
      </div>

      {/* Store Experience Preference Card */}
      <div
        className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className={`w-4 h-4 ${isPremium ? 'text-[#D4AF37]' : 'text-blue-600'}`} />
            <h4 className="text-sm font-bold uppercase tracking-wider">
              Store Experience: {storeType.toUpperCase()}
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            {isPremium
              ? 'Currently shopping in the Haute Couture Atelier with luxury aesthetics and gold motifs.'
              : 'Currently shopping in the Everyday Modern Marketplace with crisp white aesthetics.'}
          </p>
        </div>
        <Button variant={isPremium ? 'secondary' : 'luxury'} size="sm" onClick={toggleStore}>
          Switch to {isPremium ? 'Normal Store' : 'Premium Luxe Store'}
        </Button>
      </div>

      {/* Saved Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Saved Shipping Addresses</h3>
            <p className="text-xs text-zinc-400">Manage destination pins for rapid checkout</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddressModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5 mr-1" />}
          >
            Add New Address
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.addresses?.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between ${
                isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {addr.type}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-bold text-emerald-500">Default</span>
                  )}
                </div>
                <h4 className="text-xs font-bold">{addr.name}</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1">Phone: {addr.phone}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Address Modal with strict Indian validation, GPS live location, and Map */}
      <AddressFormModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaveAddress={handleSaveAddress}
      />
    </div>
  );
};
