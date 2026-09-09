/**
 * ============================================================================
 * Style Zone Marketplace - Product Detail Experience (ProductDetailPage.tsx)
 * ============================================================================
 * Comprehensive garment showcase designed for desktop and mobile shoppers:
 * 1. Interactive Color Image Switching: Selecting color variant updates the main preview photo.
 * 2. Size selector with stock indicators and validation safeguards.
 * 3. Indian Postal PIN code checker with 2-3 business days delivery estimation.
 * 4. Storefront Store Switcher disabled (per user requirement: store switching only on main page).
 * 5. Mobile sticky action bar with "Add to Bag" and "Buy Now".
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useStore } from '../context/StoreContext';
import { productService } from '../services/productService';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { SizeSelector } from '../components/product/SizeSelector';
import { ColorSelector } from '../components/product/ColorSelector';
import { ProductActions } from '../components/product/ProductActions';
import { ProductCard } from '../components/product/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  ChevronRight,
  Truck,
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  Heart,
  ShoppingBag,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (route: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onSelectProduct,
}) => {
  const { isPremium, storeType } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Delivery check state
  const [pincode, setPincode] = useState('560001');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>('Delivery available in 2-3 business days | Free Store Pickup available');

  useEffect(() => {
    setIsLoading(true);
    setSizeError(null);
    setSelectedSize(undefined);

    productService
      .getProductById(productId)
      .then((p) => {
        setProduct(p);
        if (p) {
          if (p.colors && p.colors.length > 0) {
            setSelectedColor(p.colors[0].name);
          }
          if (p.sizes && p.sizes.length === 1) {
            setSelectedSize(p.sizes[0]);
          }
          productService
            .getProducts({ storeType })
            .then((list) => {
              // Get similar products
              const similar = list
                .filter((item) => item.id !== p.id && (item.categoryId === p.categoryId || item.gender === p.gender))
                .slice(0, 6);
              setRelatedProducts(similar);
            });
        }
      })
      .finally(() => setIsLoading(false));
  }, [productId, storeType]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus(`Available for ${pincode}: Guaranteed delivery in 2-3 business days or instant Store Pickup!`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit PIN code');
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSizeError(null);
  };

  const handleValidationFail = () => {
    setSizeError('Please choose an available size option before proceeding.');
  };

  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
              <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  // Active color image sync
  const activeImage = (() => {
    if (!selectedColor) return undefined;
    const col = product.colors?.find((c) => c.name === selectedColor);
    if (col?.imageUrl) return col.imageUrl;
    if (product.colorImages && product.colorImages[selectedColor]) {
      return product.colorImages[selectedColor];
    }
    const colIdx = product.colors?.findIndex((c) => c.name === selectedColor) ?? 0;
    if (colIdx >= 0 && product.images[colIdx]) {
      return product.images[colIdx];
    }
    return product.images[0];
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto no-scrollbar py-1">
        <button onClick={() => onNavigate('/')} className="hover:underline cursor-pointer shrink-0">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button
          onClick={() => onNavigate(`/category/${product.categoryId}`)}
          className="capitalize hover:underline cursor-pointer shrink-0"
        >
          {product.categoryId}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[240px]">
          {product.name}
        </span>
      </div>

      {/* Main Showcase Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Flipkart-Style Gallery Stage (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <ProductGallery
            images={product.images}
            productName={product.name}
            activeImageOverride={activeImage}
            colors={product.colors}
            colorImages={product.colorImages}
            onSelectColor={setSelectedColor}
          />

          {/* Action Button Row under Gallery for Desktop (Flipkart Style) */}
          <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (product.sizes.length > 0 && !selectedSize) {
                  handleValidationFail();
                  return;
                }
                addToCart(product, 1, selectedSize, selectedColor);
              }}
              className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isPremium
                  ? 'bg-[#1C1C24] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>ADD TO BAG</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (product.sizes.length > 0 && !selectedSize) {
                  handleValidationFail();
                  return;
                }
                addToCart(product, 1, selectedSize, selectedColor);
                onNavigate('/cart');
              }}
              className={`py-3.5 px-4 rounded-xl font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                isPremium
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-zinc-950 hover:brightness-110'
                  : 'bg-orange-600 text-white hover:bg-orange-700'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>BUY NOW</span>
            </button>
          </div>
        </div>

        {/* Right Column: Info, Specifications & Reviews (7 cols) */}
        <div className="lg:col-span-7 space-y-7">
          <ProductInfo product={product} selectedColor={selectedColor} />

          {/* Color Selector with Visual Cards */}
          {product.colors && product.colors.length > 0 && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#14141B] border border-zinc-200 dark:border-zinc-800">
              <ColorSelector
                colors={product.colors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#14141B] border border-zinc-200 dark:border-zinc-800">
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={handleSizeSelect}
                error={sizeError}
              />
            </div>
          )}

          {/* Delivery & Store Pickup Pincode Checker (Flipkart Inspired) */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#14141B] border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Delivery & Store Pickup Options</span>
              </span>
            </div>

            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                placeholder="Enter 6-digit Pincode"
                className="w-48 px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 cursor-pointer"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{pincodeStatus}</span>
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Pay at Store & Collect</h5>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Zero delivery charge. Hold order reserved for 7 days before auto-cancellation.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100">Courier Doorstep Dispatch</h5>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Pay with UPI or Cards. Manual flat delivery charge with live tracking updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Flipkart-Style Product Specifications Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Specifications & Highlights
              </h4>
            </div>
            <div className="p-4 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <span className="text-zinc-400 font-medium">Brand</span>
                <span className="col-span-2 font-semibold text-zinc-800 dark:text-zinc-200">{product.brand}</span>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <span className="text-zinc-400 font-medium">Category</span>
                <span className="col-span-2 font-semibold capitalize text-zinc-800 dark:text-zinc-200">{product.categoryId} ({product.gender})</span>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <span className="text-zinc-400 font-medium">Store Tier</span>
                <span className="col-span-2 font-semibold capitalize text-zinc-800 dark:text-zinc-200">
                  {product.storeType === 'premium' ? 'Style Zone Luxury Atelier' : 'Style Zone Everyday Collection'}
                </span>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <span className="text-zinc-400 font-medium">Available Sizes</span>
                <span className="col-span-2 font-semibold text-zinc-800 dark:text-zinc-200">{product.sizes.join(', ')}</span>
              </div>
              <div className="py-2.5 grid grid-cols-3 gap-2">
                <span className="text-zinc-400 font-medium">Stock Status</span>
                <span className="col-span-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  {product.stock > 0 ? `${product.stock} units available in warehouse` : 'Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Flipkart-Style Ratings & Customer Reviews Breakdown */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#14141B] border border-zinc-200 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Ratings & Verified Reviews</h4>
                <p className="text-xs text-zinc-500">Real customer feedback on fit, fabric and delivery</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm">
                <span>{product.rating}</span>
                <Star className="w-4 h-4 fill-white" />
              </div>
            </div>

            {/* Verified Review Cards */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3 pt-2">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                          {rev.rating} <Star className="w-3 h-3 fill-emerald-600" />
                        </span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{rev.date}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{rev.comment}</p>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Buyer
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">Be the first to review this product!</p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Recommendation Carousel / Grid (Flipkart Style URL link target) */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className={`text-xl font-black tracking-tight ${
                  isPremium ? 'font-luxury text-[#F3E5AB]' : 'text-zinc-900 dark:text-white'
                }`}
              >
                Similar Products & Recommendations
              </h3>
              <p className="text-xs text-zinc-500">
                Customers who viewed this item also explored these styles
              </p>
            </div>
            <button
              onClick={() => onNavigate(`/category/${product.categoryId}`)}
              className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onSelectProduct(p)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-[#0E0E14]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`p-3 rounded-xl border flex items-center justify-center cursor-pointer ${
            isLiked ? 'border-rose-500 text-rose-500 bg-rose-50' : 'border-zinc-200 dark:border-zinc-700'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (product.sizes.length > 0 && !selectedSize) {
              handleValidationFail();
              return;
            }
            addToCart(product, 1, selectedSize, selectedColor);
          }}
          className="flex-1 py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Bag</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (product.sizes.length > 0 && !selectedSize) {
              handleValidationFail();
              return;
            }
            addToCart(product, 1, selectedSize, selectedColor);
            onNavigate('/cart');
          }}
          className={`flex-1 py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
            isPremium
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-zinc-950'
              : 'bg-orange-600 text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
