import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { useLocation, DeliveryLocation } from '../../context/LocationContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Crosshair,
  Search,
  X,
  Check,
  Navigation,
  Loader2,
  Home,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Compass,
  Building2,
  AlertCircle,
} from 'lucide-react';

/**
 * Popular Indian Metro Locations for instant 1-tap quick pick
 */
const POPULAR_LOCATIONS: {
  name: string;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  tag: string;
}[] = [
  {
    name: 'Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    lat: 12.9784,
    lng: 77.6408,
    tag: 'Bangalore East',
  },
  {
    name: 'Koramangala 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560034',
    lat: 12.9352,
    lng: 77.6245,
    tag: 'Bangalore South',
  },
  {
    name: 'Bandra West, Linking Rd',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    lat: 19.0596,
    lng: 72.8295,
    tag: 'Mumbai Suburban',
  },
  {
    name: 'Connaught Place',
    city: 'New Delhi',
    state: 'Delhi NCR',
    pincode: '110001',
    lat: 28.6315,
    lng: 77.2167,
    tag: 'Central Delhi',
  },
  {
    name: 'Hitec City, Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    lat: 17.4504,
    lng: 78.3808,
    tag: 'Hyderabad Tech Hub',
  },
  {
    name: 'Anna Nagar West',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600040',
    lat: 13.085,
    lng: 80.2101,
    tag: 'Chennai Central',
  },
  {
    name: 'Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    lat: 18.5362,
    lng: 73.894,
    tag: 'Pune East',
  },
];

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    state?: string;
    postcode?: string;
  };
}

export const LiveLocationPickerModal: React.FC = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    selectedLocation,
    setSelectedLocation,
    detectLiveLocation,
    isLocating,
    reverseGeocode,
    savedLocations,
    saveLocationToList,
  } = useLocation();

  const { isPremium } = useStore();
  const { user, addAddress } = useAuth();

  // Active Map and View State
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const isDraggingMapRef = useRef(false);

  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>({
    lat: selectedLocation.lat,
    lng: selectedLocation.lng,
  });

  const [isMapMoving, setIsMapMoving] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Address Fields
  const [houseNo, setHouseNo] = useState(selectedLocation.houseNo || '');
  const [landmark, setLandmark] = useState(selectedLocation.landmark || '');
  const [addressTag, setAddressTag] = useState<'home' | 'work' | 'other'>(
    selectedLocation.tag || 'home'
  );

  const [currentAddressDetails, setCurrentAddressDetails] = useState<Partial<DeliveryLocation>>({
    area: selectedLocation.area,
    city: selectedLocation.city,
    state: selectedLocation.state,
    pincode: selectedLocation.pincode,
    formattedAddress: selectedLocation.formattedAddress,
  });

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchDebounceRef = useRef<number | null>(null);

  // Sync coords when modal opens
  useEffect(() => {
    if (isLocationModalOpen) {
      setActiveCoords({
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
      setCurrentAddressDetails({
        area: selectedLocation.area,
        city: selectedLocation.city,
        state: selectedLocation.state,
        pincode: selectedLocation.pincode,
        formattedAddress: selectedLocation.formattedAddress,
      });
      setHouseNo(selectedLocation.houseNo || '');
      setLandmark(selectedLocation.landmark || '');
      setAddressTag(selectedLocation.tag || 'home');
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [isLocationModalOpen, selectedLocation]);

  /**
   * Reverse geocodes the given coordinates and updates state
   */
  const handleCoordsChange = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      try {
        const details = await reverseGeocode(lat, lng);
        setCurrentAddressDetails((prev) => ({
          ...prev,
          ...details,
        }));
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [reverseGeocode]
  );

  /**
   * Initializes or updates Leaflet Map
   */
  useEffect(() => {
    if (!isLocationModalOpen || !mapContainerRef.current) return;

    let map = mapInstanceRef.current;

    if (!map) {
      // Initialize Leaflet map
      map = L.map(mapContainerRef.current, {
        center: [activeCoords.lat, activeCoords.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // OpenStreetMap high-definition tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Map move events (like Swiggy / Uber center pin)
      map.on('movestart', () => {
        isDraggingMapRef.current = true;
        setIsMapMoving(true);
      });

      map.on('moveend', () => {
        if (!mapInstanceRef.current) return;
        isDraggingMapRef.current = false;
        setIsMapMoving(false);
        const center = mapInstanceRef.current.getCenter();
        setActiveCoords({ lat: center.lat, lng: center.lng });
        handleCoordsChange(center.lat, center.lng);
      });

      mapInstanceRef.current = map;
    } else {
      map.setView([activeCoords.lat, activeCoords.lng], map.getZoom() || 16);
    }

    // Invalidate size to ensure clean render after modal animation
    const timer = window.setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLocationModalOpen, activeCoords.lat, activeCoords.lng, handleCoordsChange]);

  // Clean up map when modal closes
  useEffect(() => {
    if (!isLocationModalOpen && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
  }, [isLocationModalOpen]);

  /**
   * Search Nominatim for places across India
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&limit=6&addressdetails=1`
        );
        if (resp.ok) {
          const data: SearchResult[] = await resp.json();
          setSearchResults(data);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.warn('Search query error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);
  };

  /**
   * Selects a searched place and pans the map
   */
  const handleSelectSearchResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setActiveCoords({ lat, lng });
    setShowSearchResults(false);
    setSearchQuery('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 17, { duration: 1.2 });
    }

    const addr = result.address || {};
    const area =
      addr.suburb || addr.road || result.display_name.split(',')[0] || 'Selected Area';
    const city = addr.city || addr.town || 'Bangalore';
    const state = addr.state || 'Karnataka';
    const pincode = addr.postcode ? addr.postcode.replace(/\D/g, '').slice(0, 6) : '560001';

    setCurrentAddressDetails({
      area,
      city,
      state,
      pincode,
      formattedAddress: result.display_name,
      lat,
      lng,
    });
  };

  /**
   * 1-Tap Trigger for Live GPS Location
   */
  const handleTriggerLiveLocation = async () => {
    const liveLoc = await detectLiveLocation();
    if (liveLoc) {
      setActiveCoords({ lat: liveLoc.lat, lng: liveLoc.lng });
      setCurrentAddressDetails({
        area: liveLoc.area,
        city: liveLoc.city,
        state: liveLoc.state,
        pincode: liveLoc.pincode,
        formattedAddress: liveLoc.formattedAddress,
        lat: liveLoc.lat,
        lng: liveLoc.lng,
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([liveLoc.lat, liveLoc.lng], 17, { duration: 1.2 });
      }
    }
  };

  /**
   * Selects a predefined popular location
   */
  const handleSelectPopularLocation = (pop: typeof POPULAR_LOCATIONS[0]) => {
    setActiveCoords({ lat: pop.lat, lng: pop.lng });
    setCurrentAddressDetails({
      area: pop.name,
      city: pop.city,
      state: pop.state,
      pincode: pop.pincode,
      formattedAddress: `${pop.name}, ${pop.city}, ${pop.state} - ${pop.pincode}`,
      lat: pop.lat,
      lng: pop.lng,
    });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([pop.lat, pop.lng], 16, { duration: 1 });
    }
  };

  /**
   * Confirm and save the finalized delivery location
   */
  const handleConfirmLocation = async () => {
    const finalLocation: DeliveryLocation = {
      area: currentAddressDetails.area || 'Doorstep Location',
      city: currentAddressDetails.city || 'Bangalore',
      state: currentAddressDetails.state || 'Karnataka',
      pincode: currentAddressDetails.pincode || '560001',
      formattedAddress:
        currentAddressDetails.formattedAddress ||
        `${currentAddressDetails.area}, ${currentAddressDetails.city} - ${currentAddressDetails.pincode}`,
      lat: activeCoords.lat,
      lng: activeCoords.lng,
      houseNo: houseNo.trim() || undefined,
      landmark: landmark.trim() || undefined,
      tag: addressTag,
      isLiveDetected: true,
    };

    // Save in global LocationContext
    setSelectedLocation(finalLocation);
    saveLocationToList(finalLocation);

    // If customer is logged in, optionally save as an address
    if (user) {
      try {
        await addAddress({
          name: user.fullName || 'Customer',
          phone: user.phone || '9876543210',
          street: [houseNo.trim(), currentAddressDetails.area, landmark.trim()]
            .filter(Boolean)
            .join(', '),
          city: finalLocation.city,
          state: finalLocation.state,
          pincode: finalLocation.pincode,
          postalCode: finalLocation.pincode,
          lat: finalLocation.lat,
          lng: finalLocation.lng,
          houseNo: finalLocation.houseNo,
          landmark: finalLocation.landmark,
          type: finalLocation.tag || 'home',
          isDefault: true,
        });
      } catch (err) {
        console.warn('Address sync error:', err);
      }
    }

    closeLocationModal();
  };

  if (!isLocationModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[95vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all ${
          isPremium
            ? 'bg-[#121217] text-white border border-[#2F2F3D]'
            : 'bg-white text-zinc-900 border border-zinc-200'
        }`}
      >
        {/* Header Bar */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b ${
            isPremium ? 'border-zinc-800 bg-[#16161D]' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isPremium ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-rose-100 text-rose-600'
              }`}
            >
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Select Delivery Location</h2>
              <p className="text-[11px] text-zinc-400">
                Choose live location on map for accurate doorstep delivery
              </p>
            </div>
          </div>

          <button
            onClick={closeLocationModal}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 p-4 sm:p-5">
          {/* Search Box with Autocomplete */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search area, apartment, street name, or PIN code..."
                className={`w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all outline-none ${
                  isPremium
                    ? 'bg-zinc-900/90 border-zinc-700 text-white placeholder-zinc-500 focus:border-[#D4AF37]'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowSearchResults(false);
                  }}
                  className="absolute right-3 p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {isSearching && (
                <Loader2 className="absolute right-3.5 w-4 h-4 text-zinc-400 animate-spin" />
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className={`absolute left-0 right-0 top-12 z-30 rounded-2xl shadow-xl border overflow-hidden max-h-56 overflow-y-auto ${
                  isPremium
                    ? 'bg-[#181822] border-zinc-700 divide-zinc-800'
                    : 'bg-white border-zinc-200 divide-zinc-100'
                } divide-y`}
              >
                {searchResults.map((res) => (
                  <button
                    key={res.place_id}
                    type="button"
                    onClick={() => handleSelectSearchResult(res)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                      isPremium ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-50 text-zinc-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{res.display_name.split(',')[0]}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{res.display_name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary "Use Current Location" (GPS) Card - Exactly Like Swiggy/Blinkit/Zepto */}
          <button
            type="button"
            onClick={handleTriggerLiveLocation}
            disabled={isLocating}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
              isPremium
                ? 'bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/10 to-transparent border-[#D4AF37]/40 hover:border-[#D4AF37]'
                : 'bg-rose-50/70 border-rose-200 hover:border-rose-400 hover:bg-rose-100/60'
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Radar Pulsing Locator Icon */}
              <div className="relative flex items-center justify-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    isPremium ? 'bg-[#D4AF37] text-black' : 'bg-rose-600 text-white'
                  }`}
                >
                  {isLocating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Crosshair className="w-5 h-5" />
                  )}
                </div>
                {!isLocating && (
                  <span
                    className={`absolute -inset-1 rounded-2xl animate-ping opacity-35 ${
                      isPremium ? 'bg-[#D4AF37]' : 'bg-rose-500'
                    }`}
                  />
                )}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Use Current Location
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    GPS
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {isLocating
                    ? 'Detecting high-precision GPS coordinates...'
                    : 'Fetch current coordinates & auto-detect verified address'}
                </p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
          </button>

          {/* Interactive Live Leaflet Map View */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-300 dark:border-zinc-700 shadow-inner h-64 sm:h-72 w-full">
            {/* Map Container */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Realistic Centered Delivery Pin with "Deliver Here" Pill */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
              <div
                className={`flex flex-col items-center transition-transform duration-200 ${
                  isMapMoving ? '-translate-y-4 scale-105' : 'translate-y-0 scale-100'
                }`}
              >
                {/* Floating "Deliver Here" pill */}
                <div className="px-2.5 py-1 rounded-full shadow-lg text-[11px] font-bold text-white bg-zinc-900 border border-amber-400 flex items-center gap-1 mb-1 animate-in fade-in">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Order will be delivered here</span>
                </div>

                {/* Big Pin Head with Ripple */}
                <div className="relative flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white">
                    <MapPin className="w-5 h-5 fill-white" />
                  </div>
                  {/* Pin Point Pointer */}
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-rose-600 -mt-0.5" />
                </div>

                {/* Dynamic Pin Shadow on ground */}
                <div
                  className={`w-3.5 h-1.5 bg-black/40 rounded-full blur-[1px] transition-all duration-200 ${
                    isMapMoving ? 'scale-75 opacity-30 translate-y-3' : 'scale-100 opacity-60'
                  }`}
                />
              </div>
            </div>

            {/* Instruction Badge at bottom of map */}
            <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
              <span className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-black/75 text-white backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1">
                <Navigation className="w-3 h-3 text-blue-400" />
                <span>Drag map to place pin accurately at doorstep</span>
              </span>
            </div>

            {/* Floating Re-center GPS button on bottom-right of map */}
            <button
              type="button"
              onClick={handleTriggerLiveLocation}
              disabled={isLocating}
              title="Locate me"
              className="absolute bottom-2.5 right-2.5 z-20 p-2.5 rounded-xl bg-white text-zinc-800 dark:bg-zinc-900 dark:text-white shadow-lg border border-zinc-200 dark:border-zinc-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-blue-500' : ''}`} />
            </button>
          </div>

          {/* Detected Address Details Card */}
          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isPremium ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Verified Delivery Zone
                    </span>
                    {isReverseGeocoding && (
                      <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold mt-0.5">
                    {currentAddressDetails.area || 'Selected Locality'}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                    {currentAddressDetails.formattedAddress}
                  </p>
                </div>
              </div>

              {/* Indian Postal Code Badge */}
              <div className="shrink-0 px-2.5 py-1 rounded-xl bg-zinc-200 dark:bg-zinc-800 font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                PIN {currentAddressDetails.pincode || '560001'}
              </div>
            </div>

            {/* Quick Doorstep Specifications Form */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  House / Flat / Block / Floor No. *
                </label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="e.g. Flat 402, Building 3B"
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border outline-none ${
                    isPremium
                      ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#D4AF37]'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Station / Main Gate"
                  className={`w-full px-3 py-1.5 text-xs rounded-xl border outline-none ${
                    isPremium
                      ? 'bg-zinc-950 border-zinc-700 text-white focus:border-[#D4AF37]'
                      : 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500'
                  }`}
                />
              </div>
            </div>

            {/* Save Address Tag */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-zinc-400 font-medium">Save As:</span>
              {(['home', 'work', 'other'] as const).map((tag) => {
                const isActive = addressTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setAddressTag(tag)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? isPremium
                          ? 'bg-[#D4AF37] text-black shadow-xs font-bold'
                          : 'bg-zinc-900 text-white shadow-xs font-bold'
                        : isPremium
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        : 'bg-zinc-200/70 text-zinc-700 hover:bg-zinc-300'
                    }`}
                  >
                    {tag === 'home' && <Home className="w-3 h-3" />}
                    {tag === 'work' && <Briefcase className="w-3 h-3" />}
                    {tag === 'other' && <Building2 className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Cities Quick Picker */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Popular Delivery Hubs
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {POPULAR_LOCATIONS.map((pop) => (
                <button
                  key={pop.name}
                  type="button"
                  onClick={() => handleSelectPopularLocation(pop)}
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all cursor-pointer ${
                    activeCoords.lat === pop.lat && activeCoords.lng === pop.lng
                      ? isPremium
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F3E5AB] font-bold'
                        : 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                      : isPremium
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <span>{pop.name}</span>
                  <span className="text-[10px] text-zinc-400 ml-1.5">({pop.city})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Confirmation Action Bar */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            isPremium ? 'border-zinc-800 bg-[#16161D]' : 'border-zinc-100 bg-zinc-50'
          }`}
        >
          <div className="hidden sm:block">
            <span className="text-xs font-bold block">
              {currentAddressDetails.area || 'Doorstep Location'}
            </span>
            <span className="text-[11px] text-zinc-400">
              {currentAddressDetails.city}, {currentAddressDetails.state} -{' '}
              {currentAddressDetails.pincode}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={closeLocationModal}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmLocation}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                isPremium
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black hover:opacity-95'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Confirm Location & Deliver Here</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
