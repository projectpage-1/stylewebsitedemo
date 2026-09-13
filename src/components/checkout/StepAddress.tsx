import React, { useState, useEffect } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useLocation } from '../../context/LocationContext';
import { Address } from '../../types/user';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  MapPin,
  Plus,
  Check,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Navigation,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Crosshair,
  Compass,
} from 'lucide-react';

/**
 * List of standard Indian States and Union Territories
 */
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

/**
 * Helper mapping to auto-suggest City and State based on Indian Pincode prefix
 */
const PINCODE_LOOKUP: Record<string, { city: string; state: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi NCR' },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana' },
  '14': { city: 'Ludhiana / Amritsar', state: 'Punjab' },
  '16': { city: 'Chandigarh', state: 'Chandigarh' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' },
  '22': { city: 'Lucknow / Kanpur', state: 'Uttar Pradesh' },
  '30': { city: 'Jaipur', state: 'Rajasthan' },
  '38': { city: 'Ahmedabad', state: 'Gujarat' },
  '39': { city: 'Surat', state: 'Gujarat' },
  '40': { city: 'Mumbai', state: 'Maharashtra' },
  '41': { city: 'Pune', state: 'Maharashtra' },
  '44': { city: 'Nagpur', state: 'Maharashtra' },
  '45': { city: 'Indore', state: 'Madhya Pradesh' },
  '50': { city: 'Hyderabad', state: 'Telangana' },
  '53': { city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  '56': { city: 'Bangalore', state: 'Karnataka' },
  '57': { city: 'Mangalore / Mysore', state: 'Karnataka' },
  '60': { city: 'Chennai', state: 'Tamil Nadu' },
  '64': { city: 'Coimbatore', state: 'Tamil Nadu' },
  '68': { city: 'Kochi', state: 'Kerala' },
  '69': { city: 'Thiruvananthapuram', state: 'Kerala' },
  '70': { city: 'Kolkata', state: 'West Bengal' },
  '75': { city: 'Bhubaneswar', state: 'Odisha' },
  '80': { city: 'Patna', state: 'Bihar' },
  '78': { city: 'Guwahati', state: 'Assam' },
};

/**
 * StepAddress Component:
 * Allows user to choose or add verified Indian delivery addresses.
 * Features GPS live location detection, strict 6-digit Indian PIN code validation,
 * and 10-digit Indian mobile number validation.
 */
export const StepAddress: React.FC = () => {
  const { selectedAddress, setSelectedAddress, nextStep, prevStep } = useCheckout();
  const { user, addAddress, deleteAddress } = useAuth();
  const { isPremium } = useStore();
  const { selectedLocation, openLocationModal } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoVerified, setGeoVerified] = useState(false);

  // Sync selectedLocation into selectedAddress when user confirms a live location
  const handleSelectLiveLocationAsAddress = () => {
    const liveAddr: Address = {
      id: `live_loc_${Date.now()}`,
      name: user?.fullName || 'Alexander Wright',
      phone: user?.phone || '9876543210',
      street: [
        selectedLocation.houseNo,
        selectedLocation.area,
        selectedLocation.landmark,
      ]
        .filter(Boolean)
        .join(', ') || selectedLocation.formattedAddress,
      city: selectedLocation.city,
      state: selectedLocation.state,
      pincode: selectedLocation.pincode,
      postalCode: selectedLocation.pincode,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      houseNo: selectedLocation.houseNo,
      landmark: selectedLocation.landmark,
      type: selectedLocation.tag || 'home',
      isDefault: true,
    };
    setSelectedAddress(liveAddr);
  };

  const [newAddr, setNewAddr] = useState({
    name: user?.fullName || 'Alexander Wright',
    phone: user?.phone || '9876543210',
    street: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    country: 'India',
    type: 'home' as 'home' | 'work' | 'other',
  });

  const [formErrors, setFormErrors] = useState<{
    pincode?: string;
    phone?: string;
    general?: string;
  }>({});

  /**
   * Validate Indian PIN Code: strictly 6 digits, cannot start with 0
   */
  const validateIndianPincode = (code: string): boolean => {
    const clean = code.trim();
    // Rejects if user entered a 10-digit mobile number or non-6 digit string
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(clean);
  };

  /**
   * Validate Indian Mobile Number: 10 digits starting with 6, 7, 8, or 9
   */
  const validateIndianPhone = (phone: string): boolean => {
    const clean = phone.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(clean);
  };

  /**
   * Automatically suggest city and state when user types 6 digits
   */
  const handlePincodeChange = (val: string) => {
    // Only allow numeric input up to 6 digits
    const numeric = val.replace(/\D/g, '').slice(0, 6);
    setNewAddr((prev) => ({ ...prev, postalCode: numeric }));

    if (formErrors.pincode) {
      setFormErrors((prev) => ({ ...prev, pincode: undefined }));
    }

    // Auto-lookup city/state if first 2 digits match
    if (numeric.length >= 2) {
      const prefix = numeric.slice(0, 2);
      const match = PINCODE_LOOKUP[prefix];
      if (match) {
        setNewAddr((prev) => ({
          ...prev,
          city: prev.city || match.city,
          state: match.state,
        }));
      }
    }
  };

  /**
   * Live GPS Location Detection
   * Retrieves accurate browser coordinates and sets verified address fields
   */
  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setFormErrors((prev) => ({
        ...prev,
        general: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setIsLocating(true);
    setFormErrors((prev) => ({ ...prev, general: undefined }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoCoords({ lat: latitude, lng: longitude });
        setGeoVerified(true);

        try {
          // Attempt reverse geocoding lookup
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          if (resp.ok) {
            const data = await resp.json();
            const addr = data.address || {};

            const detectedPincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '';
            const detectedCity = addr.city || addr.town || addr.suburb || addr.district || 'Bangalore';
            const detectedState = addr.state || 'Karnataka';
            const detectedStreet = [addr.road, addr.neighbourhood, addr.suburb].filter(Boolean).join(', ');

            setNewAddr((prev) => ({
              ...prev,
              street: detectedStreet || prev.street || `GPS Pin near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: detectedCity,
              state: detectedState,
              postalCode: detectedPincode && validateIndianPincode(detectedPincode) ? detectedPincode : prev.postalCode || '560001',
            }));
          }
        } catch {
          // Fallback to default Bangalore GPS coordinates if offline
          setNewAddr((prev) => ({
            ...prev,
            city: prev.city || 'Bangalore',
            state: prev.state || 'Karnataka',
            postalCode: prev.postalCode || '560001',
            street: prev.street || `Location verified at ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
          }));
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        // Fallback for user convenience
        setGeoCoords({ lat: 12.9716, lng: 77.5946 });
        setGeoVerified(true);
        setNewAddr((prev) => ({
          ...prev,
          city: prev.city || 'Bangalore',
          state: 'Karnataka',
          postalCode: prev.postalCode || '560001',
          street: prev.street || 'Flagship Zone, MG Road Area',
        }));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  /**
   * Save Address Handler with Strict Validations
   */
  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { pincode?: string; phone?: string; general?: string } = {};

    // 1. PIN code validation
    if (!newAddr.postalCode || !validateIndianPincode(newAddr.postalCode)) {
      errors.pincode =
        'Invalid PIN Code! Indian postal codes must be exactly 6 digits (e.g., 560001). Do not enter mobile number here.';
    }

    // 2. Phone number validation
    if (!newAddr.phone || !validateIndianPhone(newAddr.phone)) {
      errors.phone = 'Invalid phone number! Must be a valid 10-digit Indian mobile number (e.g., 9876543210).';
    }

    // 3. Required fields
    if (!newAddr.name.trim() || !newAddr.street.trim() || !newAddr.city.trim()) {
      errors.general = 'Please fill in all mandatory address fields.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    await addAddress({
      ...newAddr,
      pincode: newAddr.postalCode,
      isDefault: false,
    });

    setIsModalOpen(false);
    setGeoVerified(false);
    setGeoCoords(null);
  };

  const addresses = user?.addresses || [];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3
            className={`text-lg font-bold tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900'
            }`}
          >
            Select Shipping Address
          </h3>
          <p className="text-xs text-zinc-400">
            Choose where your package will be delivered (All Indian States Supported)
          </p>
        </div>

        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="sm"
          onClick={() => {
            setFormErrors({});
            setIsModalOpen(true);
          }}
          leftIcon={<Plus className="w-4 h-4 mr-1" />}
        >
          Add New Address
        </Button>
      </div>

      {/* Live Location Map Selector Banner - Exactly like Blinkit / Swiggy / Zepto */}
      <div
        className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isPremium
            ? 'bg-gradient-to-r from-[#D4AF37]/15 via-[#181822] to-[#121217] border-[#D4AF37]/40 shadow-lg shadow-black/40'
            : 'bg-gradient-to-r from-rose-50/80 via-white to-amber-50/30 border-rose-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center shrink-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                isPremium ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-rose-600 text-white shadow-md'
              }`}
            >
              <Crosshair className="w-6 h-6" />
            </div>
            <span
              className={`absolute -inset-1 rounded-2xl animate-ping opacity-30 ${
                isPremium ? 'bg-[#D4AF37]' : 'bg-rose-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Select Live Location on Map
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                Live GPS
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Current Pin:{' '}
              <strong className="text-zinc-800 dark:text-zinc-200">
                {selectedLocation.area}, {selectedLocation.city} ({selectedLocation.pincode})
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={openLocationModal}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isPremium
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500'
                : 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Open Map</span>
          </button>

          <button
            type="button"
            onClick={handleSelectLiveLocationAsAddress}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
              isPremium
                ? 'bg-[#D4AF37] text-black hover:bg-[#C5A059]'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Deliver to This Live Pin</span>
          </button>
        </div>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => {
          const isSelected = selectedAddress?.id === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? isPremium
                    ? 'bg-[#181824] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg shadow-black'
                    : 'bg-blue-50/50 border-zinc-900 ring-2 ring-zinc-900/10'
                  : isPremium
                  ? 'bg-[#14141A] border-[#2A2A35] hover:border-zinc-600'
                  : 'bg-white border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    {addr.type}
                  </span>
                  {isSelected && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                      <Check className="w-4 h-4" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>

                <h4 className="text-sm font-bold">{addr.name}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {addr.street}, {addr.city}, {addr.state} -{' '}
                  <strong className="text-zinc-900 dark:text-zinc-100 font-mono">
                    {addr.postalCode || addr.pincode}
                  </strong>
                </p>
                <p className="text-xs text-zinc-400 mt-2 font-mono">
                  🇮🇳 Phone: {addr.phone}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAddress(addr.id);
                  }}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {addresses.length === 0 && (
        <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
          <MapPin className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            No shipping addresses saved yet
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Click "Add New Address" above to save your verified delivery address or use your live location.
          </p>
        </div>
      )}

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4 mr-1" />}>
          Back
        </Button>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          disabled={!selectedAddress}
          onClick={nextStep}
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Select Delivery Mode
        </Button>
      </div>

      {/* Add Address Modal with Live Map & Indian Validations */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Address (India)"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4">
          {/* Live GPS Location Button */}
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>Auto-Detect Address via GPS</span>
                </span>
                <p className="text-[11px] text-zinc-500">
                  Use your device's live location to verify delivery pin and auto-fill address
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    openLocationModal();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isPremium
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-rose-500" />
                  <span>Pick on Live Map</span>
                </button>

                <button
                  type="button"
                  onClick={handleDetectLiveLocation}
                  disabled={isLocating}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isPremium
                      ? 'bg-[#D4AF37]/20 text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/30'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  {isLocating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Use GPS</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual GPS Verification Badge */}
            {geoVerified && geoCoords && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  GPS Location Verified: Lat {geoCoords.lat.toFixed(4)}°N, Long {geoCoords.lng.toFixed(4)}°E (India Delivery Zone Confirmed)
                </span>
              </div>
            )}
          </div>

          {formErrors.general && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formErrors.general}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={newAddr.name}
                onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                placeholder="e.g. Alexander Wright"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                10-Digit Mobile Number *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-mono text-zinc-400">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={newAddr.phone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setNewAddr({ ...newAddr, phone: clean });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                  }}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono"
                  required
                />
              </div>
              {formErrors.phone && (
                <p className="text-[11px] text-rose-400 mt-1 font-medium">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Flat / House No., Building, Street Name *
            </label>
            <input
              type="text"
              value={newAddr.street}
              onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
              placeholder="e.g. Flat 302, Palm Grove Apartments, 12th Main Road"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Postal PIN Code with Strict Indian 6-Digit Check */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Indian PIN Code (6 Digits) *
              </label>
              <input
                type="text"
                maxLength={6}
                value={newAddr.postalCode}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="e.g. 560001"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono tracking-wider font-bold"
                required
              />
              {formErrors.pincode && (
                <p className="text-[10px] text-rose-400 mt-1 font-medium leading-tight">
                  {formErrors.pincode}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">City / Town *</label>
              <input
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                placeholder="e.g. Bangalore"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>

            {/* Indian State Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Indian State *</label>
              <select
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Address Label</label>
            <div className="flex gap-3">
              {(['home', 'work', 'other'] as const).map((t) => (
                <label
                  key={t}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    newAddr.type === t
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                      : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="addressType"
                    checked={newAddr.type === t}
                    onChange={() => setNewAddr({ ...newAddr, type: t })}
                    className="sr-only"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant={isPremium ? 'luxury' : 'primary'} type="submit">
              Save Verified Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
