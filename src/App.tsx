import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { LocationProvider } from './context/LocationContext';
import { LiveLocationPickerModal } from './components/location/LiveLocationPickerModal';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { productService } from './services/productService';
import { Product } from './types/product';
import { ProductGrid } from './components/product/ProductGrid';

const AppContent: React.FC = () => {
  const { isPremium, theme, storeType } = useStore();

  // State-driven routing with history push
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [searchMatches, setSearchMatches] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (to.startsWith('/search')) {
      const q = new URLSearchParams(to.split('?')[1] || '').get('q') || '';
      setSearchQuery(q);
      setIsSearching(true);
      productService.searchProducts(q, storeType).then((results) => {
        setSearchMatches(results.filter((p) => (p.storeType || 'normal') === storeType));
        setIsSearching(false);
      });
    }
    window.history.pushState(null, '', to);
    setCurrentPath(to);
  };

  // Route and query parameters extraction
  const cleanPath = currentPath.split('?')[0];
  const queryParams = new URLSearchParams(currentPath.split('?')[1] || '');
  const subcategoryParam = queryParams.get('subcategory') || undefined;

  // Re-run search if storeType shifts while viewing search results
  useEffect(() => {
    if (cleanPath.startsWith('/search') && searchQuery) {
      setIsSearching(true);
      productService.searchProducts(searchQuery, storeType).then((results) => {
        setSearchMatches(results.filter((p) => (p.storeType || 'normal') === storeType));
        setIsSearching(false);
      });
    }
  }, [storeType, cleanPath, searchQuery]);

  const handleSelectProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  let activeCategoryId: string | undefined;
  if (cleanPath.startsWith('/category/')) {
    activeCategoryId = cleanPath.replace('/category/', '');
  }

  // Active route renderer
  const renderPage = () => {
    if (cleanPath === '/' || cleanPath === '') {
      return <HomePage onNavigate={navigate} onSelectProduct={handleSelectProduct} />;
    }

    if (cleanPath.startsWith('/search')) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
          <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-black">Search Results for "{searchQuery}"</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Found {searchMatches.length} matching products in {storeType.toUpperCase()} store
            </p>
          </div>
          <ProductGrid
            products={searchMatches}
            onSelectProduct={handleSelectProduct}
            isLoading={isSearching}
          />
        </div>
      );
    }

    if (cleanPath.startsWith('/category/')) {
      const catId = cleanPath.replace('/category/', '');
      return (
        <CategoryPage
          categoryId={catId}
          initialSubcategoryId={subcategoryParam}
          onSelectProduct={handleSelectProduct}
        />
      );
    }

    if (cleanPath.startsWith('/product/')) {
      const prodId = cleanPath.replace('/product/', '');
      return (
        <ProductDetailPage
          productId={prodId}
          onNavigate={navigate}
          onSelectProduct={handleSelectProduct}
        />
      );
    }

    if (cleanPath === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (cleanPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (cleanPath === '/wishlist') {
      return <WishlistPage onNavigate={navigate} onSelectProduct={handleSelectProduct} />;
    }

    if (cleanPath === '/orders') {
      return <OrdersPage onNavigate={navigate} />;
    }

    if (cleanPath === '/account') {
      return <AccountPage onNavigate={navigate} />;
    }

    if (cleanPath === '/admin') {
      return <AdminPage />;
    }

    // Default fallback
    return <HomePage onNavigate={navigate} onSelectProduct={handleSelectProduct} />;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex flex-col ${theme.bg} ${theme.textPrimary}`}
    >
      {/* Universal Header with Brand & Store Switcher */}
      <Header onNavigate={navigate} activeRoute={cleanPath} />

      {/* Primary Category Navigation Bar */}
      <Navbar onNavigate={navigate} activeCategoryId={activeCategoryId} />

      {/* Main Routed Content Area */}
      <main className="flex-1">{renderPage()}</main>

      {/* Rich Footer */}
      <Footer onNavigate={navigate} />

      {/* Mobile Bottom Navigation Bar (Shown across storefront except on dedicated Product page where Sticky Buy Bar is active) */}
      {!cleanPath.startsWith('/product/') && (
        <MobileNav onNavigate={navigate} activeRoute={cleanPath} />
      )}

      {/* Global Live Location Picker Modal with Leaflet Map & GPS */}
      <LiveLocationPickerModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <LocationProvider>
          <CartProvider>
            <WishlistProvider>
              <CheckoutProvider>
                <AppContent />
              </CheckoutProvider>
            </WishlistProvider>
          </CartProvider>
        </LocationProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
