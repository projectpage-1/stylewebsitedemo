import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Interface representing a delivery location for the user across the app.
 */
export interface DeliveryLocation {
  area: string;
  city: string;
  state: string;
  pincode: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  houseNo?: string;
  landmark?: string;
  tag?: 'home' | 'work' | 'other';
  isLiveDetected?: boolean;
}

interface LocationContextType {
  selectedLocation: DeliveryLocation;
  setSelectedLocation: (loc: DeliveryLocation) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  isLocating: boolean;
  detectLiveLocation: () => Promise<DeliveryLocation | null>;
  reverseGeocode: (lat: number, lng: number) => Promise<Partial<DeliveryLocation>>;
  savedLocations: DeliveryLocation[];
  saveLocationToList: (loc: DeliveryLocation) => void;
}

const STORAGE_KEY_LOCATION = 'sz_delivery_location';
const STORAGE_KEY_SAVED_LOCATIONS = 'sz_saved_delivery_locations';

/**
 * Standard default location for Indian shoppers
 */
const DEFAULT_LOCATION: DeliveryLocation = {
  area: 'Indiranagar',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560038',
  formattedAddress: '100 Feet Rd, Indiranagar, Bangalore, Karnataka 560038',
  lat: 12.9784,
  lng: 77.6408,
  tag: 'home',
  isLiveDetected: false,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

/**
 * Helper to extract 6-digit Indian PIN code from address text or postcode string
 */
export const extractIndianPincode = (str: string): string => {
  const match = str.match(/\b[1-9][0-9]{5}\b/);
  return match ? match[0] : '';
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocationState] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOCATION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_LOCATION;
  });

  const [savedLocations, setSavedLocations] = useState<DeliveryLocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SAVED_LOCATIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [
      DEFAULT_LOCATION,
      {
        area: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
        formattedAddress: 'Hill Road, Bandra West, Mumbai, Maharashtra 400050',
        lat: 19.0596,
        lng: 72.8295,
        tag: 'work',
        isLiveDetected: false,
      },
      {
        area: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi NCR',
        pincode: '110001',
        formattedAddress: 'Inner Circle, Connaught Place, New Delhi 110001',
        lat: 28.6315,
        lng: 77.2167,
        tag: 'other',
        isLiveDetected: false,
      },
    ];
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  const setSelectedLocation = (loc: DeliveryLocation) => {
    setSelectedLocationState(loc);
    try {
      localStorage.setItem(STORAGE_KEY_LOCATION, JSON.stringify(loc));
    } catch {
      // ignore
    }
  };

  const saveLocationToList = (loc: DeliveryLocation) => {
    setSavedLocations((prev) => {
      const filtered = prev.filter(
        (p) => !(p.lat === loc.lat && p.lng === loc.lng) && p.area !== loc.area
      );
      const updated = [loc, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_LOCATIONS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  /**
   * Reverse geocodes latitude/longitude into human-readable area, city, state, and Indian pincode
   */
  const reverseGeocode = async (lat: number, lng: number): Promise<Partial<DeliveryLocation>> => {
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (resp.ok) {
        const data = await resp.json();
        const address = data.address || {};

        const area =
          address.neighbourhood ||
          address.suburb ||
          address.commercial ||
          address.residential ||
          address.road ||
          address.village ||
          address.city_district ||
          'Local Area';

        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.district ||
          address.county ||
          'Bangalore';

        const state = address.state || 'Karnataka';

        const rawCode = address.postcode || '';
        const pincode = extractIndianPincode(rawCode) || '560001';

        const roadPart = [address.road, address.neighbourhood].filter(Boolean).join(', ');
        const formattedAddress = data.display_name || `${roadPart}, ${area}, ${city}, ${state} ${pincode}`;

        return {
          area,
          city,
          state,
          pincode,
          formattedAddress,
          lat,
          lng,
        };
      }
    } catch (err) {
      console.warn('Geocoding service unavailable, using coordinate fallbacks:', err);
    }

    // Fallback if network or geocoding fails
    return {
      area: `Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}, India`,
      lat,
      lng,
    };
  };

  /**
   * Captures the user's live device location using browser GPS
   */
  const detectLiveLocation = async (): Promise<DeliveryLocation | null> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return null;
    }

    setIsLocating(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geocoded = await reverseGeocode(latitude, longitude);

          const liveLoc: DeliveryLocation = {
            area: geocoded.area || 'Current Location',
            city: geocoded.city || 'Bangalore',
            state: geocoded.state || 'Karnataka',
            pincode: geocoded.pincode || '560001',
            formattedAddress:
              geocoded.formattedAddress ||
              `Doorstep GPS Pin (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`,
            lat: latitude,
            lng: longitude,
            isLiveDetected: true,
          };

          setSelectedLocation(liveLoc);
          saveLocationToList(liveLoc);
          setIsLocating(false);
          resolve(liveLoc);
        },
        (error) => {
          console.warn('Location access denied or timed out:', error.message);
          setIsLocating(false);
          // High-accuracy fallback to flagship hub
          const fallbackLoc: DeliveryLocation = {
            area: 'Indiranagar / MG Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            formattedAddress: 'MG Road Metro Boulevard, Indiranagar, Bangalore 560038',
            lat: 12.9716,
            lng: 77.5946,
            isLiveDetected: true,
          };
          setSelectedLocation(fallbackLoc);
          resolve(fallbackLoc);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
        isLocating,
        detectLiveLocation,
        reverseGeocode,
        savedLocations,
        saveLocationToList,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
