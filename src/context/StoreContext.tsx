import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { StoreType } from '../types/product';
import { StoreTransitionOverlay } from '../components/layout/StoreTransitionOverlay';

/**
 * Interface definition for StoreContext.
 * Contains active store type, switcher actions, and theme styling tokens.
 */
interface StoreContextType {
  storeType: StoreType;
  setStoreType: (type: StoreType) => void;
  toggleStore: () => void;
  isPremium: boolean;
  isTransitioning: boolean;
  theme: {
    bg: string;
    cardBg: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    accentBorder: string;
    badgeBg: string;
    badgeText: string;
    headerBg: string;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY_STORE_TYPE = 'sz_active_store_type';

/**
 * StoreProvider:
 * Controls the active store mode ('normal' fashion marketplace vs 'premium' haute couture atelier).
 * Manages the transition overlay animation when switching between stores.
 */
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeType, setStoreTypeState] = useState<StoreType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STORE_TYPE);
    return saved === 'premium' ? 'premium' : 'normal';
  });

  // State to track if buffering transition is active and which store is being entered
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<StoreType | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const isPremium = storeType === 'premium';

  /**
   * Effect to synchronize store type with localStorage and root HTML classes.
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STORE_TYPE, storeType);
    if (isPremium) {
      document.documentElement.classList.add('premium-mode');
    } else {
      document.documentElement.classList.remove('premium-mode');
    }
  }, [storeType, isPremium]);

  /**
   * Cleans up any pending transition timers on unmount.
   */
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  /**
   * Initiates store change with an elegant buffering screen showing the target store's logo.
   * @param targetType - 'normal' | 'premium'
   */
  const setStoreType = (targetType: StoreType) => {
    if (targetType === storeType) return;

    // Show buffering transition with target store logo
    setTransitionTarget(targetType);
    setIsTransitioning(true);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    // Allow the buffering animation with logo to display for 800ms
    transitionTimerRef.current = window.setTimeout(() => {
      setStoreTypeState(targetType);
      // Brief delay before removing overlay for smooth fade-out
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionTarget(null);
      }, 150);
    }, 850);
  };

  /**
   * Toggles between normal and premium store modes with the buffering transition.
   */
  const toggleStore = () => {
    setStoreType(storeType === 'normal' ? 'premium' : 'normal');
  };

  // Cohesive, mathematical theme tokens
  const theme = isPremium
    ? {
        bg: 'bg-[#0E0E11]',
        cardBg: 'bg-[#17171C]',
        textPrimary: 'text-[#F5F5F7]',
        textSecondary: 'text-[#A1A1AA]',
        accent: 'text-[#D4AF37]',
        accentBorder: 'border-[#D4AF37]/30',
        badgeBg: 'bg-gradient-to-r from-[#D4AF37]/20 to-[#AA7C11]/20 border border-[#D4AF37]/40',
        badgeText: 'text-[#F3E5AB]',
        headerBg: 'bg-[#0E0E11]/95 backdrop-blur-md border-b border-[#27272A]',
      }
    : {
        bg: 'bg-[#F8F9FA]',
        cardBg: 'bg-white',
        textPrimary: 'text-[#18181B]',
        textSecondary: 'text-[#71717A]',
        accent: 'text-[#2563EB]',
        accentBorder: 'border-[#E4E4E7]',
        badgeBg: 'bg-blue-50 border border-blue-200',
        badgeText: 'text-blue-700',
        headerBg: 'bg-white/95 backdrop-blur-md border-b border-gray-200',
      };

  return (
    <StoreContext.Provider
      value={{
        storeType,
        setStoreType,
        toggleStore,
        isPremium,
        isTransitioning,
        theme,
      }}
    >
      <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.textPrimary}`}>
        {/* Logo Buffering Transition Overlay */}
        <StoreTransitionOverlay isVisible={isTransitioning} targetStore={transitionTarget} />
        {children}
      </div>
    </StoreContext.Provider>
  );
};

/**
 * Custom hook to consume the StoreContext.
 */
export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

