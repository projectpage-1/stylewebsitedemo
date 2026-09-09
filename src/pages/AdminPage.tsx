/**
 * ============================================================================
 * Style Zone Marketplace - Administration Suite (AdminPage.tsx)
 * ============================================================================
 * Centralized dashboard for store owners & operators with dedicated controls:
 * 1. Product Catalog Management:
 *    - Add/Edit products with Brand, Category, MRP, Sale Price, Stock, Store Type.
 *    - Color Variants Manager with Dedicated Image URLs per color.
 * 2. Lucky Draw Campaigns:
 *    - Create, Edit, Toggle, and Delete Lucky Draws (Car, Bike, Mobile, Luxury).
 *    - Assign Store Scope (Normal Store, Premium Store, Both Stores).
 * 3. Festival Sales & Offers:
 *    - Create, Edit, and Activate festive sales (Diwali, Dussehra, Pongal, etc.).
 *    - Configurable discounts, badge text, and promotional banners.
 * 4. Coupons & Voucher Codes:
 *    - Percentage & flat discounts with min order values and store restrictions.
 * 5. Orders & Logistics Pipeline:
 *    - Track customer orders, pickup redemption codes, and update shipping stages.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { adminService, AdminStats } from '../services/adminService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, StoreType } from '../types/product';
import { Coupon } from '../types/coupon';
import { PremiumCampaign, FestivalSale } from '../types/banner';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatCurrency';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { INITIAL_CATEGORIES } from '../data/categoryData';
import {
  DollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  Crown,
  Smartphone,
  Tag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Ticket,
  Copy,
  Check,
  TrendingUp,
  LogOut,
  BarChart3,
  Car,
  Bike,
  Calendar,
  Gift,
  Flame,
  Palette,
  Eye,
  Store,
} from 'lucide-react';
import { AdminLoginCard } from '../components/admin/AdminLoginCard';
import { StockAndSalesAnalysis } from '../components/admin/StockAndSalesAnalysis';

type AdminTab = 'overview' | 'analytics' | 'products' | 'coupons' | 'campaigns' | 'orders';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { isPremium } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [campaign, setCampaign] = useState<PremiumCampaign | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<PremiumCampaign[]>([]);
  const [allFestivals, setAllFestivals] = useState<FestivalSale[]>([]);
  const [campaignSubTab, setCampaignSubTab] = useState<'luckydraw' | 'festivals'>('luckydraw');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<PremiumCampaign | null>(null);
  const [isFestivalModalOpen, setIsFestivalModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<FestivalSale | null>(null);

  // Color variants for current product
  const [colorVariants, setColorVariants] = useState<
    { name: string; hex: string; imageUrl: string }[]
  >([{ name: 'Standard', hex: '#1a1a1a', imageUrl: '' }]);

  // Form states
  const [campaignForm, setCampaignForm] = useState({
    name: 'Mahindra Thar 4x4 Mega Lucky Draw',
    code: 'THARDRAW',
    storeScope: 'both' as 'premium' | 'normal' | 'both',
    type: 'car' as 'car' | 'bike' | 'mobile' | 'luxury_gift' | 'electronics' | 'custom',
    minOrderValue: 2499,
    reward: 'Mahindra Thar 4x4 Grand Prize Pass',
    giftImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
    drawDate: '31st Dec 2026',
    couponPrefix: 'SZ-CAR',
    description: 'Place an order above qualifying amount to receive a guaranteed Lucky Draw Pass coupon code.',
    isActive: true,
  });

  const [festivalForm, setFestivalForm] = useState({
    festivalName: 'Diwali' as FestivalSale['festivalName'],
    title: 'Diwali Grand Festive Dhamaka',
    storeScope: 'both' as 'both' | 'normal' | 'premium',
    discountPercentage: 40,
    badgeText: 'DIWALI SPECIAL',
    bannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
    tagline: 'Mega Festive Offers across all luxury and everyday collections',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-11-15',
    isActive: true,
  });

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    description: '',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    categoryId: 'men',
    subcategoryId: 'shirts',
    storeType: 'normal' as StoreType,
    stock: 50,
    sizes: 'S, M, L, XL',
    colors: 'Black, White, Navy',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 20,
    minOrderValue: 999,
    storeType: 'both' as 'normal' | 'premium' | 'both',
    expiryDate: '2026-12-31',
    isActive: true,
  });

  // Unique Coupon Claim State
  const [claimForm, setClaimForm] = useState({
    couponCode: '',
    customerName: '',
    customerPhone: '',
  });
  const [copiedClaimId, setCopiedClaimId] = useState<string | null>(null);
  const [recentClaims, setRecentClaims] = useState<
    {
      claimId: string;
      couponCode: string;
      customerName: string;
      customerPhone: string;
      issuedAt: string;
      discountBenefit: string;
    }[]
  >(() => {
    try {
      const saved = localStorage.getItem('sz_claimed_coupons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleGenerateClaimId = () => {
    if (!claimForm.couponCode || !claimForm.customerName) return;
    const foundCoupon = coupons.find((c) => c.code === claimForm.couponCode);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timestampPart = Date.now().toString().slice(-4);
    const claimId = `CLAIM-SZ-${timestampPart}-${randomSuffix}`;

    const benefit = foundCoupon
      ? foundCoupon.type === 'percentage'
        ? `${foundCoupon.value}% Off`
        : `₹${foundCoupon.value} Flat Off`
      : 'Special VIP Discount';

    const newRecord = {
      claimId,
      couponCode: claimForm.couponCode,
      customerName: claimForm.customerName,
      customerPhone: claimForm.customerPhone || 'N/A',
      issuedAt: new Date().toLocaleString(),
      discountBenefit: benefit,
    };

    const updated = [newRecord, ...recentClaims];
    setRecentClaims(updated);
    localStorage.setItem('sz_claimed_coupons', JSON.stringify(updated));
    setClaimForm({ couponCode: '', customerName: '', customerPhone: '' });
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [s, p, c, camp, camps, fests, o] = await Promise.all([
        adminService.getDashboardStats(),
        productService.getProducts(),
        adminService.getCoupons(),
        adminService.getPremiumCampaign(),
        adminService.getCampaigns(),
        adminService.getFestivalSales(),
        orderService.getOrders(),
      ]);
      setStats(s);
      setProducts(p);
      setCoupons(c);
      setCampaign(camp);
      setAllCampaigns(camps);
      setAllFestivals(fests);
      setOrders(o);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Product actions
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean);
    
    // Process color variants with image URLs
    const validVariants = colorVariants.filter((v) => v.name.trim().length > 0);
    const colorsArray = validVariants.map((v) => ({
      name: v.name.trim(),
      hex: v.hex || '#1a1a1a',
      imageUrl: v.imageUrl?.trim() || undefined,
    }));

    const colorImagesMap: Record<string, string> = {};
    validVariants.forEach((v) => {
      if (v.imageUrl?.trim()) {
        colorImagesMap[v.name.trim()] = v.imageUrl.trim();
      }
    });

    const variantImages = validVariants
      .map((v) => v.imageUrl?.trim())
      .filter((url): url is string => Boolean(url && url.length > 0));

    const allImages = Array.from(
      new Set([productForm.imageUrl.trim(), ...variantImages])
    ).filter(Boolean);

    if (editingProduct) {
      await adminService.updateProduct(editingProduct.id, {
        ...editingProduct,
        name: productForm.name,
        brand: productForm.brand,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discount: Number(productForm.discount),
        categoryId: productForm.categoryId,
        subcategoryId: productForm.subcategoryId,
        storeType: productForm.storeType,
        stock: Number(productForm.stock),
        sizes: sizesArray,
        colors: colorsArray,
        colorImages: colorImagesMap,
        images: allImages.length > 0 ? allImages : [productForm.imageUrl],
      });
    } else {
      await adminService.createProduct({
        name: productForm.name,
        brand: productForm.brand,
        description: productForm.description,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice),
        discount: Number(productForm.discount),
        categoryId: productForm.categoryId,
        subcategoryId: productForm.subcategoryId,
        storeType: productForm.storeType,
        stock: Number(productForm.stock),
        sizes: sizesArray,
        colors: colorsArray,
        colorImages: colorImagesMap,
        images: allImages.length > 0 ? allImages : [productForm.imageUrl],
        rating: 4.8,
        reviewCount: 1,
        isFeatured: true,
        isTrending: true,
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this product from the catalog?')) {
      await adminService.deleteProduct(id);
      loadData();
    }
  };

  // Coupon actions
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.createCoupon({
      code: couponForm.code.toUpperCase().trim(),
      description: couponForm.description,
      type: couponForm.type,
      value: Number(couponForm.value),
      minOrderValue: Number(couponForm.minOrderValue),
      storeType: couponForm.storeType,
      expiryDate: couponForm.expiryDate,
      isActive: couponForm.isActive,
    });
    setIsCouponModalOpen(false);
    loadData();
  };

  const handleDeleteCoupon = async (code: string) => {
    await adminService.deleteCoupon(code);
    loadData();
  };

  // Campaign actions
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveCampaign({
      id: editingCampaign?.id,
      name: campaignForm.name,
      code: campaignForm.code,
      type: campaignForm.type,
      store: campaignForm.storeScope,
      storeScope: campaignForm.storeScope,
      applicableStore: campaignForm.storeScope,
      minOrderValue: Number(campaignForm.minOrderValue),
      reward: campaignForm.reward,
      benefit: campaignForm.reward,
      giftTitle: campaignForm.reward,
      giftImageUrl: campaignForm.giftImageUrl,
      drawDate: campaignForm.drawDate,
      couponPrefix: campaignForm.couponPrefix,
      description: campaignForm.description,
      isActive: campaignForm.isActive,
    });
    setIsCampaignModalOpen(false);
    setEditingCampaign(null);
    loadData();
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Lucky Draw campaign?')) {
      await adminService.deleteCampaign(id);
      loadData();
    }
  };

  const handleToggleCampaign = async (camp: PremiumCampaign) => {
    await adminService.saveCampaign({ ...camp, isActive: !camp.isActive });
    loadData();
  };

  const handleSaveFestivalSale = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminService.saveFestivalSale({
      id: editingFestival?.id,
      festivalName: festivalForm.festivalName,
      title: festivalForm.title,
      storeScope: festivalForm.storeScope,
      discountPercentage: Number(festivalForm.discountPercentage),
      badgeText: festivalForm.badgeText,
      bannerImage: festivalForm.bannerImage,
      tagline: festivalForm.tagline,
      startDate: festivalForm.startDate,
      endDate: festivalForm.endDate,
      isActive: festivalForm.isActive,
    });
    setIsFestivalModalOpen(false);
    setEditingFestival(null);
    loadData();
  };

  const handleDeleteFestivalSale = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Festival Sale offer?')) {
      await adminService.deleteFestivalSale(id);
      loadData();
    }
  };

  const handleToggleFestivalSale = async (sale: FestivalSale) => {
    await adminService.saveFestivalSale({ ...sale, isActive: !sale.isActive });
    loadData();
  };

  const handleUpdateCampaign = async (updates: Partial<PremiumCampaign>) => {
    if (!campaign) return;
    const updated = await adminService.updatePremiumCampaign(updates);
    setCampaign(updated);
    loadData();
  };

  // Order status update
  const handleOrderStatusChange = async (orderId: string, status: Order['status']) => {
    await orderService.updateOrderStatus(orderId, status);
    loadData();
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    await adminService.updateProduct(productId, { ...product, stock: Math.max(0, newStock) });
    loadData();
  };

  // Secure Role-Based Access: Prompt for Admin Credentials if not logged in as Admin
  if (!isAdmin) {
    return <AdminLoginCard />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 font-mono">
              SYSTEM CONSOLE
            </span>
            <span className="text-xs text-zinc-400">Authenticated: {user?.fullName}</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900'
            }`}
          >
            Style Zone Operations Suite
          </h1>
        </div>

        {/* Navigation Tabs & Logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 rounded-xl bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#2C2C38]">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'analytics', label: 'Stock & Sales Analysis', icon: TrendingUp },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'coupons', label: 'Coupons', icon: Tag },
              { id: 'campaigns', label: 'Lucky Draws & Festival Sales', icon: Gift },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? isPremium
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                        : 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer shrink-0"
            title="Sign Out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STOCK & SALES ANALYSIS */}
      {activeTab === 'analytics' && (
        <StockAndSalesAnalysis
          products={products}
          orders={orders}
          onUpdateProductStock={handleUpdateStock}
          isPremiumStore={isPremium}
        />
      )}

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35] shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Total Gross Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {formatCurrency(stats.totalSales)}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">Across all confirmed customer orders</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35] shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Total Placed Orders</span>
                <ShoppingBag className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {stats.totalOrders}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">Pending payment & dispatched</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35] shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Premium Luxe Revenue</span>
                <Crown className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span className="text-2xl font-black text-[#D4AF37] font-luxury">
                {formatCurrency(stats.premiumStoreRevenue)}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">Haute Couture Atelier segment</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35] shadow-xs">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2">
                <span>Active Products</span>
                <Package className="w-4 h-4 text-indigo-500" />
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {stats.totalProducts}
              </span>
              <p className="text-[11px] text-zinc-400 mt-1">
                {stats.lowStockProducts} items marked with low stock
              </p>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35]">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-3">
                Normal Store vs Premium Store Revenue
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">Normal Marketplace</span>
                    <span className="font-bold">{formatCurrency(stats.normalStoreRevenue)}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${Math.round((stats.normalStoreRevenue / (stats.totalSales || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#D4AF37] font-luxury">Premium Atelier</span>
                    <span className="font-bold text-[#D4AF37] font-luxury">{formatCurrency(stats.premiumStoreRevenue)}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] rounded-full"
                      style={{
                        width: `${Math.round((stats.premiumStoreRevenue / (stats.totalSales || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#15151C] border border-zinc-200 dark:border-[#2A2A35] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-[#D4AF37]">
                  <Smartphone className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase tracking-wider font-luxury">
                    Apple iPhone Campaign Status
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  The promotional iPhone 16 Pro campaign is currently{' '}
                  <strong className={campaign?.isActive ? 'text-emerald-500' : 'text-rose-500'}>
                    {campaign?.isActive ? 'ACTIVE' : 'DISABLED'}
                  </strong>{' '}
                  with a qualification threshold of{' '}
                  <strong>{formatCurrency(campaign?.minOrderValue || 14999)}</strong>.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('campaigns')}
                rightIcon={<ChevronRight className="w-4 h-4 ml-1" />}
              >
                Manage Campaign Rules
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Catalog Inventory ({products.length})</h3>
              <p className="text-xs text-zinc-400">Manage apparel entries, variants, prices and stock</p>
            </div>
            <Button
              size="sm"
              variant={isPremium ? 'luxury' : 'primary'}
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  brand: '',
                  description: '',
                  price: 1999,
                  originalPrice: 2999,
                  discount: 33,
                  categoryId: 'men',
                  subcategoryId: 'shirts',
                  storeType: 'normal',
                  stock: 50,
                  sizes: 'S, M, L, XL',
                  colors: 'Black',
                  imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
                });
                setColorVariants([
                  {
                    name: 'Black',
                    hex: '#111827',
                    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
                  },
                ]);
                setIsProductModalOpen(true);
              }}
              leftIcon={<Plus className="w-4 h-4 mr-1" />}
            >
              Add New Product
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15151C]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 uppercase font-bold text-zinc-500">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Store</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-10 h-12 rounded object-cover object-top"
                      />
                      <div>
                        <span className="font-bold block truncate max-w-[200px]">{p.name}</span>
                        <span className="text-[10px] text-zinc-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          p.storeType === 'premium'
                            ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-luxury'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {p.storeType}
                      </span>
                    </td>
                    <td className="p-3.5 uppercase font-semibold text-zinc-400">
                      {p.categoryId}
                    </td>
                    <td className="p-3.5 font-bold">{formatCurrency(p.price)}</td>
                    <td className="p-3.5 font-mono">{p.stock} units</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm({
                              name: p.name,
                              brand: p.brand,
                              description: p.description,
                              price: p.price,
                              originalPrice: p.originalPrice || p.price,
                              discount: p.discount,
                              categoryId: p.categoryId,
                              subcategoryId: p.subcategoryId,
                              storeType: p.storeType,
                              stock: p.stock,
                              sizes: p.sizes.join(', '),
                              colors: p.colors.map((c) => c.name).join(', '),
                              imageUrl: p.images[0] || '',
                            });
                            const existingVariants =
                              p.colors && p.colors.length > 0
                                ? p.colors.map((c, idx) => ({
                                    name: c.name,
                                    hex: c.hex || '#1a1a1a',
                                    imageUrl:
                                      c.imageUrl ||
                                      (p.colorImages && p.colorImages[c.name]) ||
                                      p.images[idx] ||
                                      '',
                                  }))
                                : [{ name: 'Standard', hex: '#1a1a1a', imageUrl: p.images[0] || '' }];
                            setColorVariants(existingVariants);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COUPON MANAGEMENT */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Vouchers & Coupons ({coupons.length})</h3>
              <p className="text-xs text-zinc-400">Manage promotional codes, expiry rules and store constraints</p>
            </div>
            <Button
              size="sm"
              variant={isPremium ? 'luxury' : 'primary'}
              onClick={() => setIsCouponModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4 mr-1" />}
            >
              Create New Coupon
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15151C] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-black text-blue-600 dark:text-[#D4AF37]">
                      {c.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-500/15 text-emerald-500' : 'bg-zinc-500/15 text-zinc-400'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">{c.description}</p>
                  <div className="space-y-1 text-xs text-zinc-500">
                    <p>
                      Benefit:{' '}
                      <strong>{c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value} Flat Off`}</strong>
                    </p>
                    <p>
                      Minimum Order: <strong>{formatCurrency(c.minOrderValue)}</strong>
                    </p>
                    <p>
                      Scope: <strong className="uppercase">{c.storeType}</strong>
                    </p>
                    <p>
                      Expires: <strong>{new Date(c.expiryDate).toLocaleDateString()}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION: Unique Coupon Claim ID Generator */}
          <div className="mt-8 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#161622] space-y-5">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500 dark:text-[#D4AF37]" />
              <div>
                <h4 className="text-base font-bold">Generate Unique Coupon Claim ID</h4>
                <p className="text-xs text-zinc-400">
                  Issue a tracked, authenticated claim identifier to a customer when they claim or request an authorized voucher.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Select Coupon Code
                </label>
                <select
                  value={claimForm.couponCode}
                  onChange={(e) => setClaimForm({ ...claimForm, couponCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1E1E2A] text-zinc-900 dark:text-white"
                >
                  <option value="">-- Choose Coupon --</option>
                  {coupons.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value} Off`})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={claimForm.customerName}
                  onChange={(e) => setClaimForm({ ...claimForm, customerName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1E1E2A] text-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Customer Phone (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 00000"
                  value={claimForm.customerPhone}
                  onChange={(e) => setClaimForm({ ...claimForm, customerPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#1E1E2A] text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="sm"
                variant={isPremium ? 'luxury' : 'primary'}
                disabled={!claimForm.couponCode || !claimForm.customerName}
                onClick={handleGenerateClaimId}
                leftIcon={<Sparkles className="w-4 h-4 mr-1" />}
              >
                Generate Certified Claim ID
              </Button>
            </div>

            {/* Recent Generated Claims Table */}
            {recentClaims.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Issued Customer Claims Log ({recentClaims.length})
                </h5>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {recentClaims.map((claim) => {
                    const isCopied = copiedClaimId === claim.claimId;
                    return (
                      <div
                        key={claim.claimId}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#1A1A24] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-600 dark:text-[#D4AF37]">
                              {claim.claimId}
                            </span>
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                              VERIFIED
                            </span>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300">
                            Issued to <strong>{claim.customerName}</strong> ({claim.customerPhone}) • Code: <strong className="font-mono">{claim.couponCode}</strong> ({claim.discountBenefit})
                          </p>
                          <p className="text-[10px] text-zinc-400">{claim.issuedAt}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(claim.claimId);
                            setCopiedClaimId(claim.claimId);
                            setTimeout(() => setCopiedClaimId(null), 2000);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-1 text-[11px] font-semibold cursor-pointer shrink-0 ml-3"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: LUCKY DRAWS & FESTIVAL SALES (SECTION 16 & FESTIVALS) */}
      {activeTab === 'campaigns' && (
        <div className="space-y-8">
          {/* Header & Sub-navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-luxury">
                  PROMOTIONAL & FESTIVAL ENGINE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                Lucky Draws & Festival Offers
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage Car, Bike, Mobile lucky draws, configure store eligibility (Normal, Premium, Both), and launch Festival Sales (Diwali, Dussehra, etc.).
              </p>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-zinc-800 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCampaignSubTab('luckydraw')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  campaignSubTab === 'luckydraw'
                    ? isPremium
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury shadow-xs'
                      : 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Lucky Draws ({allCampaigns.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCampaignSubTab('festivals')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  campaignSubTab === 'festivals'
                    ? isPremium
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury shadow-xs'
                      : 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Festival Sales ({allFestivals.length})</span>
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: LUCKY DRAWS (Car, Bike, Mobile, etc.) */}
          {campaignSubTab === 'luckydraw' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                    Active Lucky Draw Campaigns
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Customers placing qualifying orders automatically receive a registered Lucky Draw coupon ticket.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isPremium ? 'luxury' : 'primary'}
                  onClick={() => {
                    setEditingCampaign(null);
                    setCampaignForm({
                      name: 'Mahindra Thar 4x4 Mega Lucky Draw',
                      code: 'THAR4X4',
                      storeScope: 'both',
                      type: 'car',
                      minOrderValue: 2499,
                      reward: 'Mahindra Thar 4x4 or Luxury Car Entry Pass',
                      giftImageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
                      drawDate: '31st Dec 2026',
                      couponPrefix: 'SZ-CAR',
                      description: 'Place an order above qualifying amount to receive a guaranteed Lucky Draw Pass coupon code.',
                      isActive: true,
                    });
                    setIsCampaignModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4 mr-1" />}
                >
                  Create Lucky Draw Campaign
                </Button>
              </div>

              {/* Campaign Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCampaigns.map((c) => {
                  const scope = c.storeScope || c.store || 'premium';
                  const isCar = c.type === 'car';
                  const isBike = c.type === 'bike';
                  const isPhone = c.type === 'mobile';

                  return (
                    <div
                      key={c.id}
                      className={`relative rounded-2xl border p-4.5 flex flex-col justify-between transition-all ${
                        c.isActive
                          ? 'border-[#D4AF37]/50 bg-white dark:bg-[#161622] shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-70'
                      }`}
                    >
                      <div>
                        {/* Image Preview & Badge */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 bg-zinc-900">
                          {c.giftImageUrl ? (
                            <img
                              src={c.giftImageUrl}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-500">
                              <Gift className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                              {c.type?.toUpperCase() || 'PRIZE'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                scope === 'both'
                                  ? 'bg-emerald-600 text-white'
                                  : scope === 'normal'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury'
                              }`}
                            >
                              {scope === 'both' ? 'Both Stores' : scope === 'normal' ? 'Normal Store' : 'Premium Only'}
                            </span>
                          </div>

                          <div className="absolute top-2 right-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                c.isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-zinc-700 text-zinc-300'
                              }`}
                            >
                              {c.isActive ? 'Live' : 'Paused'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Details */}
                        <div className="flex items-center gap-1.5 mb-1 text-[#D4AF37]">
                          {isCar && <Car className="w-4 h-4" />}
                          {isBike && <Bike className="w-4 h-4" />}
                          {isPhone && <Smartphone className="w-4 h-4" />}
                          {!isCar && !isBike && !isPhone && <Gift className="w-4 h-4" />}
                          <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                            Prefix: {c.couponPrefix || 'SZ-LUCKY'}
                          </span>
                        </div>

                        <h5 className="text-base font-bold text-zinc-900 dark:text-white line-clamp-1">
                          {c.name}
                        </h5>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                          {c.benefit || c.description || c.giftTitle}
                        </p>

                        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Min Order Value:</span>
                            <span className="font-bold font-mono text-zinc-900 dark:text-white">
                              {formatCurrency(c.minOrderValue)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Draw Date:</span>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {c.drawDate || 'TBA'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaign(c)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            c.isActive
                              ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                          }`}
                        >
                          {c.isActive ? 'Pause' : 'Activate'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCampaign(c);
                              setCampaignForm({
                                name: c.name,
                                code: c.code || 'LUCKYDRAW',
                                storeScope: (c.storeScope || c.store || 'both') as 'premium' | 'normal' | 'both',
                                type: (c.type || 'custom') as any,
                                minOrderValue: c.minOrderValue,
                                reward: c.reward || c.benefit || c.giftTitle || '',
                                giftImageUrl: c.giftImageUrl || '',
                                drawDate: c.drawDate || '31st Dec 2026',
                                couponPrefix: c.couponPrefix || 'SZ-LUCKY',
                                description: c.description || '',
                                isActive: c.isActive,
                              });
                              setIsCampaignModalOpen(true);
                            }}
                            className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                            title="Edit Campaign"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="p-1.5 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Awarded Lucky Draw Orders */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-zinc-900 dark:text-white">
                  Orders Awarded Lucky Draw Coupons ({orders.filter((o) => (o.awardedCoupons && o.awardedCoupons.length > 0) || o.premiumCampaignClaimed).length})
                </h4>

                <div className="space-y-3">
                  {orders
                    .filter((o) => (o.awardedCoupons && o.awardedCoupons.length > 0) || o.premiumCampaignClaimed)
                    .map((o) => (
                      <div
                        key={o.id}
                        className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15151C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold">#{o.id}</span>
                            <span className="text-[10px] text-zinc-400">•</span>
                            <span className="text-xs font-bold text-zinc-900 dark:text-white">
                              {o.customerName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 font-mono">
                              {o.customerPhone}
                            </span>
                          </div>

                          {/* Awarded Coupons Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {o.awardedCoupons && o.awardedCoupons.length > 0 ? (
                              o.awardedCoupons.map((ac, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                >
                                  <Ticket className="w-3 h-3" />
                                  {ac.couponId} ({ac.prizeTitle || ac.prize || ac.campaignName || 'Draw Entry'})
                                </span>
                              ))
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-amber-500/10 text-amber-500">
                                Pass Registered
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#D4AF37] font-luxury block">
                            Qualified Order
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {formatCurrency(o.priceBreakdown.finalPayableAmount)}
                          </span>
                        </div>
                      </div>
                    ))}

                  {orders.filter((o) => (o.awardedCoupons && o.awardedCoupons.length > 0) || o.premiumCampaignClaimed).length === 0 && (
                    <p className="text-xs text-zinc-500 italic p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                      No orders have qualified for lucky draw coupons yet. Place a qualifying order above the campaign threshold to see it recorded here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: FESTIVAL SALES (Diwali, Dussehra, Pongal, etc.) */}
          {campaignSubTab === 'festivals' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                    Festival Sales & Seasonal Events
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Add or modify festive banners, discount highlights, and store availability for Diwali, Dussehra, and more.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isPremium ? 'luxury' : 'primary'}
                  onClick={() => {
                    setEditingFestival(null);
                    setFestivalForm({
                      festivalName: 'Diwali',
                      title: 'Diwali Grand Festive Dhamaka',
                      storeScope: 'both',
                      discountPercentage: 40,
                      badgeText: 'DIWALI SPECIAL',
                      bannerImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200&auto=format&fit=crop',
                      tagline: 'Mega Festive Offers across all luxury and everyday collections',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '2026-11-15',
                      isActive: true,
                    });
                    setIsFestivalModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4 mr-1" />}
                >
                  Add Festival Sale Offer
                </Button>
              </div>

              {/* Festival Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allFestivals.map((fest) => (
                  <div
                    key={fest.id}
                    className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${
                      fest.isActive
                        ? 'border-amber-500/40 bg-white dark:bg-[#161622] shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="relative h-44 w-full bg-zinc-900">
                        <img
                          src={fest.bannerImage}
                          alt={fest.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-zinc-950 font-mono">
                              {fest.badgeText}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs">
                              {fest.storeScope === 'both'
                                ? 'Both Stores'
                                : fest.storeScope === 'normal'
                                ? 'Normal Store'
                                : 'Premium Store'}
                            </span>
                          </div>
                          <h5 className="text-lg font-extrabold leading-snug">{fest.title}</h5>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-4 space-y-3">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {fest.tagline}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Festival:</span>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {fest.festivalName}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Discount:</span>
                            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                              Up to {fest.discountPercentage}% OFF
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Starts:</span>
                            <span className="text-zinc-700 dark:text-zinc-300 font-mono">
                              {fest.startDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Ends:</span>
                            <span className="text-zinc-700 dark:text-zinc-300 font-mono">
                              {fest.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleToggleFestivalSale(fest)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          fest.isActive
                            ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                      >
                        {fest.isActive ? 'Deactivate Sale' : 'Activate Live Sale'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFestival(fest);
                            setFestivalForm({
                              festivalName: fest.festivalName,
                              title: fest.title,
                              storeScope: fest.storeScope,
                              discountPercentage: fest.discountPercentage,
                              badgeText: fest.badgeText,
                              bannerImage: fest.bannerImage,
                              tagline: fest.tagline,
                              startDate: fest.startDate,
                              endDate: fest.endDate,
                              isActive: fest.isActive,
                            });
                            setIsFestivalModalOpen(true);
                          }}
                          className="p-1.5 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                          title="Edit Festival Sale"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFestivalSale(fest.id)}
                          className="p-1.5 rounded text-rose-500 hover:text-rose-700 cursor-pointer"
                          title="Delete Festival Sale"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold">Orders Pipeline ({orders.length})</h3>
            <p className="text-xs text-zinc-400">Manage dispatch lifecycle and verify payment milestones</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#15151C]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 uppercase font-bold text-zinc-500">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Store</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="p-3.5 font-mono font-bold">#{o.id}</td>
                    <td className="p-3.5">
                      <span className="font-bold block">{o.customerName}</span>
                      <span className="text-[11px] text-zinc-400">{o.shippingAddress.city}</span>
                    </td>
                    <td className="p-3.5 uppercase font-semibold text-zinc-400">{o.storeType}</td>
                    <td className="p-3.5">{o.items.length} items</td>
                    <td className="p-3.5 font-bold">
                      {formatCurrency(o.priceBreakdown.finalPayableAmount)}
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize font-semibold text-amber-500">{o.status}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleOrderStatusChange(o.id, e.target.value as Order['status'])
                        }
                        className="text-xs p-1 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? 'Edit Garment Product' : 'Add New Garment Product'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Product Title</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Brand Name</label>
              <input
                type="text"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Price (₹)</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">MRP Price (₹)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) =>
                  setProductForm({ ...productForm, originalPrice: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Stock</label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Store Segment</label>
              <select
                value={productForm.storeType}
                onChange={(e) =>
                  setProductForm({ ...productForm, storeType: e.target.value as StoreType })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              >
                <option value="normal">Normal Store</option>
                <option value="premium">Premium Store</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Category</label>
              <select
                value={productForm.categoryId}
                onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white uppercase"
              >
                {INITIAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Image URL</label>
              <input
                type="url"
                value={productForm.imageUrl}
                onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Available Sizes (comma separated)
            </label>
            <input
              type="text"
              value={productForm.sizes}
              onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
              placeholder="S, M, L, XL, XXL"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
            />
          </div>

          {/* Color Variants & Multi-Image Gallery Configuration */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
                  Color Variants & Dedicated Images
                </label>
                <p className="text-[11px] text-zinc-400">
                  Assign a unique image URL to each color so selecting the color changes the product photo.
                </p>
              </div>
              <Button
                size="xs"
                variant="outline"
                type="button"
                onClick={() =>
                  setColorVariants([
                    ...colorVariants,
                    { name: '', hex: '#2563EB', imageUrl: '' },
                  ])
                }
                leftIcon={<Plus className="w-3 h-3 mr-1" />}
              >
                Add Color
              </Button>
            </div>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {colorVariants.map((variant, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-950/60 flex items-center gap-2.5"
                >
                  {/* Swatch Picker */}
                  <input
                    type="color"
                    value={variant.hex}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[index].hex = e.target.value;
                      setColorVariants(updated);
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
                    title="Choose color shade"
                  />

                  {/* Color Name */}
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[index].name = e.target.value;
                      setColorVariants(updated);
                    }}
                    placeholder="Color (e.g. Navy Blue)"
                    className="w-32 px-2.5 py-1.5 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-white shrink-0"
                    required
                  />

                  {/* Dedicated Image URL */}
                  <input
                    type="url"
                    value={variant.imageUrl}
                    onChange={(e) => {
                      const updated = [...colorVariants];
                      updated[index].imageUrl = e.target.value;
                      setColorVariants(updated);
                    }}
                    placeholder="Color Image URL (https://...)"
                    className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-zinc-700 bg-zinc-900 text-white font-mono"
                  />

                  {/* Image Thumbnail Preview */}
                  <div className="w-8 h-8 rounded border border-zinc-700 overflow-hidden bg-zinc-900 shrink-0">
                    {variant.imageUrl ? (
                      <img
                        src={variant.imageUrl}
                        alt={variant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-mono">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Remove Variant */}
                  {colorVariants.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setColorVariants(colorVariants.filter((_, i) => i !== index))
                      }
                      className="p-1 rounded text-zinc-500 hover:text-rose-400 cursor-pointer shrink-0"
                      title="Remove variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsProductModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="luxury" type="submit">
              {editingProduct ? 'Update Product' : 'Save New Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        title="Create Promotional Coupon"
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Voucher Code</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
              placeholder="e.g. LUXURY25"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white uppercase font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
            <input
              type="text"
              value={couponForm.description}
              onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
              placeholder="e.g. 25% Off on Haute Couture"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Discount Type</label>
              <select
                value={couponForm.type}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, type: e.target.value as 'percentage' | 'fixed' })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Discount Value</label>
              <input
                type="number"
                value={couponForm.value}
                onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Min Order Value (₹)
              </label>
              <input
                type="number"
                value={couponForm.minOrderValue}
                onChange={(e) =>
                  setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Store Scope</label>
              <select
                value={couponForm.storeType}
                onChange={(e) =>
                  setCouponForm({
                    ...couponForm,
                    storeType: e.target.value as 'normal' | 'premium' | 'both',
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white uppercase"
              >
                <option value="both">Both Stores</option>
                <option value="normal">Normal Store Only</option>
                <option value="premium">Premium Store Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsCouponModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="luxury" type="submit">
              Publish Coupon
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create / Edit Lucky Draw Campaign Modal */}
      <Modal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        title={editingCampaign ? 'Edit Lucky Draw Campaign' : 'Create Lucky Draw Campaign'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveCampaign} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Campaign Title</label>
              <input
                type="text"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="e.g. Mahindra Thar 4x4 Mega Lucky Draw"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Prize Category</label>
              <select
                value={campaignForm.type}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, type: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              >
                <option value="car">Car (Thar, SUV, Sedan)</option>
                <option value="bike">Super Bike (Royal Enfield, Ninja)</option>
                <option value="mobile">Smartphone (iPhone 16 Pro, Galaxy)</option>
                <option value="luxury_gift">Luxury Gift Box</option>
                <option value="electronics">Electronics & Gadgets</option>
                <option value="custom">Custom Reward</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Store Scope Eligibility
              </label>
              <select
                value={campaignForm.storeScope}
                onChange={(e) =>
                  setCampaignForm({
                    ...campaignForm,
                    storeScope: e.target.value as 'premium' | 'normal' | 'both',
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-bold"
              >
                <option value="both">Both Stores (All Customers)</option>
                <option value="normal">Normal Store Only</option>
                <option value="premium">Premium Store Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Min Qualifying Order Amount (₹)
              </label>
              <input
                type="number"
                value={campaignForm.minOrderValue}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, minOrderValue: Number(e.target.value) })
                }
                placeholder="2499"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Ticket Coupon Prefix
              </label>
              <input
                type="text"
                value={campaignForm.couponPrefix}
                onChange={(e) =>
                  setCampaignForm({ ...campaignForm, couponPrefix: e.target.value.toUpperCase() })
                }
                placeholder="e.g. SZ-CAR, SZ-BIKE, SZ-PHONE"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Lucky Draw Announcement Date
              </label>
              <input
                type="text"
                value={campaignForm.drawDate}
                onChange={(e) => setCampaignForm({ ...campaignForm, drawDate: e.target.value })}
                placeholder="e.g. 31st Dec 2026"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Prize / Reward Headline
            </label>
            <input
              type="text"
              value={campaignForm.reward}
              onChange={(e) => setCampaignForm({ ...campaignForm, reward: e.target.value })}
              placeholder="e.g. Official Entry Ticket to win Mahindra Thar 4x4 Grand Prize"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Prize Showcase Image URL
            </label>
            <input
              type="url"
              value={campaignForm.giftImageUrl}
              onChange={(e) => setCampaignForm({ ...campaignForm, giftImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Terms & Narrative Description
            </label>
            <textarea
              value={campaignForm.description}
              onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="campaignActive"
              checked={campaignForm.isActive}
              onChange={(e) => setCampaignForm({ ...campaignForm, isActive: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900 text-amber-500 cursor-pointer"
            />
            <label htmlFor="campaignActive" className="text-xs text-zinc-300 cursor-pointer">
              Activate this Lucky Draw campaign immediately for live customer orders
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsCampaignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="luxury" type="submit">
              {editingCampaign ? 'Update Campaign' : 'Publish Lucky Draw'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create / Edit Festival Sale Modal */}
      <Modal
        isOpen={isFestivalModalOpen}
        onClose={() => setIsFestivalModalOpen(false)}
        title={editingFestival ? 'Edit Festival Sale Offer' : 'Launch Festival Sale Offer'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFestivalSale} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Festival Occasion</label>
              <select
                value={festivalForm.festivalName}
                onChange={(e) =>
                  setFestivalForm({ ...festivalForm, festivalName: e.target.value as any })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              >
                <option value="Diwali">Diwali (Festival of Lights)</option>
                <option value="Dussehra">Dussehra (Vijayadashami Utsav)</option>
                <option value="Holi">Holi (Colors Carnival)</option>
                <option value="Eid">Eid Mubarak Celebration</option>
                <option value="Navratri">Navratri Festive Days</option>
                <option value="New Year">New Year Mega Bash</option>
                <option value="Independence Day">Independence Day Freedom Sale</option>
                <option value="Custom">Custom Festive Celebration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Store Scope</label>
              <select
                value={festivalForm.storeScope}
                onChange={(e) =>
                  setFestivalForm({
                    ...festivalForm,
                    storeScope: e.target.value as 'both' | 'normal' | 'premium',
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-bold"
              >
                <option value="both">Both Stores</option>
                <option value="normal">Normal Store Only</option>
                <option value="premium">Premium Store Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Event Title</label>
            <input
              type="text"
              value={festivalForm.title}
              onChange={(e) => setFestivalForm({ ...festivalForm, title: e.target.value })}
              placeholder="e.g. Diwali Grand Festive Dhamaka"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">
                Discount Highlight (%)
              </label>
              <input
                type="number"
                value={festivalForm.discountPercentage}
                onChange={(e) =>
                  setFestivalForm({ ...festivalForm, discountPercentage: Number(e.target.value) })
                }
                placeholder="40"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Badge Callout Text</label>
              <input
                type="text"
                value={festivalForm.badgeText}
                onChange={(e) => setFestivalForm({ ...festivalForm, badgeText: e.target.value })}
                placeholder="e.g. DIWALI SPECIAL / FLAT 40% OFF"
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white uppercase font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Festive Banner Image URL
            </label>
            <input
              type="url"
              value={festivalForm.bannerImage}
              onChange={(e) => setFestivalForm({ ...festivalForm, bannerImage: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">Tagline Subtitle</label>
            <input
              type="text"
              value={festivalForm.tagline}
              onChange={(e) => setFestivalForm({ ...festivalForm, tagline: e.target.value })}
              placeholder="e.g. Mega Festive Offers across all luxury and everyday collections"
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Start Date</label>
              <input
                type="date"
                value={festivalForm.startDate}
                onChange={(e) => setFestivalForm({ ...festivalForm, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">End Date</label>
              <input
                type="date"
                value={festivalForm.endDate}
                onChange={(e) => setFestivalForm({ ...festivalForm, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-700 bg-zinc-900 text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="festivalActive"
              checked={festivalForm.isActive}
              onChange={(e) => setFestivalForm({ ...festivalForm, isActive: e.target.checked })}
              className="rounded border-zinc-700 bg-zinc-900 text-amber-500 cursor-pointer"
            />
            <label htmlFor="festivalActive" className="text-xs text-zinc-300 cursor-pointer">
              Display festival banner prominently on the storefront homepage
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsFestivalModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="luxury" type="submit">
              {editingFestival ? 'Update Festival Sale' : 'Publish Festival Sale'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
