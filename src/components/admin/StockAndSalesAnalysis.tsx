import React, { useState, useMemo } from 'react';
import { Product } from '../../types/product';
import { Order } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../common/Button';
import {
  TrendingUp,
  Package,
  DollarSign,
  Building2,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Search,
  Plus,
  ArrowUpRight,
  Sparkles,
  Crown,
  Layers,
  ShoppingBag,
} from 'lucide-react';

interface StockAndSalesAnalysisProps {
  products: Product[];
  orders: Order[];
  onUpdateProductStock: (productId: string, newStock: number) => Promise<void>;
  isPremiumStore: boolean;
}

export const StockAndSalesAnalysis: React.FC<StockAndSalesAnalysisProps> = ({
  products,
  orders,
  onUpdateProductStock,
  isPremiumStore,
}) => {
  const [stockSearchQuery, setStockSearchQuery] = useState('');
  const [stockStoreFilter, setStockStoreFilter] = useState<'all' | 'normal' | 'premium'>('all');
  const [stockHealthFilter, setStockHealthFilter] = useState<'all' | 'low' | 'healthy'>('all');
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);

  // -------------------------------------------------------------
  // SALES METRICS COMPUTATION
  // -------------------------------------------------------------
  const salesMetrics = useMemo(() => {
    let totalSales = 0;
    let normalRevenue = 0;
    let premiumRevenue = 0;

    let storePickupOrders = 0;
    let storePickupRevenue = 0;
    let doorstepOrders = 0;
    let doorstepRevenue = 0;

    const productSalesMap: Record<string, { product: Product; unitsSold: number; revenue: number }> = {};

    orders.forEach((order) => {
      const amount = order.priceBreakdown.finalPayableAmount;
      totalSales += amount;

      if (order.storeType === 'premium') {
        premiumRevenue += amount;
      } else {
        normalRevenue += amount;
      }

      if (order.fulfillmentType === 'store_pickup' || order.paymentMethod === 'pay_at_store') {
        storePickupOrders++;
        storePickupRevenue += amount;
      } else {
        doorstepOrders++;
        doorstepRevenue += amount;
      }

      // Tally items
      order.items.forEach((item) => {
        if (!productSalesMap[item.productId]) {
          const matched = products.find((p) => p.id === item.productId) || {
            id: item.productId,
            name: item.productName,
            brand: item.brand,
            price: item.unitPrice,
            images: [item.image],
            stock: 0,
            storeType: item.storeType,
            categoryId: 'fashion',
            discount: 0,
            rating: 4.5,
            reviewCount: 1,
            sizes: [],
            colors: [],
          };
          productSalesMap[item.productId] = { product: matched as Product, unitsSold: 0, revenue: 0 };
        }
        productSalesMap[item.productId].unitsSold += item.quantity;
        productSalesMap[item.productId].revenue += item.totalPrice;
      });
    });

    const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
    const topSelling = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return {
      totalSales,
      normalRevenue,
      premiumRevenue,
      averageOrderValue,
      storePickupOrders,
      storePickupRevenue,
      doorstepOrders,
      doorstepRevenue,
      topSelling,
    };
  }, [orders, products]);

  // -------------------------------------------------------------
  // STOCK METRICS COMPUTATION
  // -------------------------------------------------------------
  const stockMetrics = useMemo(() => {
    let totalUnits = 0;
    let totalStockValuation = 0;
    let normalValuation = 0;
    let premiumValuation = 0;
    const lowStockItems: Product[] = [];

    products.forEach((p) => {
      totalUnits += p.stock;
      const val = p.price * p.stock;
      totalStockValuation += val;

      if (p.storeType === 'premium') {
        premiumValuation += val;
      } else {
        normalValuation += val;
      }

      if (p.stock <= 15) {
        lowStockItems.push(p);
      }
    });

    return {
      totalUnits,
      totalStockValuation,
      normalValuation,
      premiumValuation,
      lowStockItems,
      lowStockCount: lowStockItems.length,
    };
  }, [products]);

  // Filtered Products for Inventory Table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
        p.categoryId.toLowerCase().includes(stockSearchQuery.toLowerCase());

      const matchesStore = stockStoreFilter === 'all' || p.storeType === stockStoreFilter;

      const matchesHealth =
        stockHealthFilter === 'all' ||
        (stockHealthFilter === 'low' && p.stock <= 15) ||
        (stockHealthFilter === 'healthy' && p.stock > 15);

      return matchesSearch && matchesStore && matchesHealth;
    });
  }, [products, stockSearchQuery, stockStoreFilter, stockHealthFilter]);

  const handleQuickRestock = async (productId: string, currentStock: number, addUnits: number) => {
    setUpdatingStockId(productId);
    try {
      await onUpdateProductStock(productId, currentStock + addUnits);
    } finally {
      setUpdatingStockId(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* ============================================================== */}
      {/* SECTION 1: SALES ANALYSIS                                     */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 font-mono flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>REVENUE & COMMERCIAL DISPATCH METRICS</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
              Sales Performance Analysis
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Real-time analytics across all {orders.length} placed orders
          </span>
        </div>

        {/* 4 Commercial Headline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Total Sales Revenue</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatCurrency(salesMetrics.totalSales)}
            </span>
            <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 flex justify-between">
              <span>Avg. Order Value (AOV)</span>
              <strong className="text-zinc-900 dark:text-zinc-200">{formatCurrency(salesMetrics.averageOrderValue)}</strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Normal Store Revenue</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {formatCurrency(salesMetrics.normalRevenue)}
            </span>
            <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 flex justify-between">
              <span>Everyday Collection</span>
              <strong className="text-zinc-900 dark:text-zinc-200">
                {salesMetrics.totalSales > 0
                  ? Math.round((salesMetrics.normalRevenue / salesMetrics.totalSales) * 100)
                  : 0}
                % of total
              </strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Premium Luxe Revenue</span>
            <span className="text-2xl font-black text-[#D4AF37] font-luxury">
              {formatCurrency(salesMetrics.premiumRevenue)}
            </span>
            <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 flex justify-between">
              <span>Haute Couture Atelier</span>
              <strong className="text-zinc-900 dark:text-zinc-200">
                {salesMetrics.totalSales > 0
                  ? Math.round((salesMetrics.premiumRevenue / salesMetrics.totalSales) * 100)
                  : 0}
                % of total
              </strong>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Fulfillment Distribution</span>
            <div className="text-xs space-y-1.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Store Pickups:</span>
                </span>
                <strong className="text-zinc-900 dark:text-zinc-100">{salesMetrics.storePickupOrders} orders</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Courier Dispatches:</span>
                </span>
                <strong className="text-zinc-900 dark:text-zinc-100">{salesMetrics.doorstepOrders} orders</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Revenue Share Comparison Bar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-400">
              Revenue Volume Distribution
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Normal Store ({formatCurrency(salesMetrics.normalRevenue)})
              </span>
              <span className="flex items-center gap-1 text-[#D4AF37] font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] inline-block" />
                Premium Store ({formatCurrency(salesMetrics.premiumRevenue)})
              </span>
            </div>
          </div>

          <div className="w-full h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{
                width: `${
                  salesMetrics.totalSales > 0
                    ? (salesMetrics.normalRevenue / salesMetrics.totalSales) * 100
                    : 50
                }%`,
              }}
            />
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] h-full transition-all duration-500"
              style={{
                width: `${
                  salesMetrics.totalSales > 0
                    ? (salesMetrics.premiumRevenue / salesMetrics.totalSales) * 100
                    : 50
                }%`,
              }}
            />
          </div>
        </div>

        {/* Top Selling Products Leaderboard */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Top Selling Styles Leaderboard
              </h3>
              <p className="text-xs text-zinc-400">Best-performing apparel ranked by commercial order volume</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              Fast-Moving Inventory
            </span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {salesMetrics.topSelling.length > 0 ? (
              salesMetrics.topSelling.map((entry, idx) => (
                <div key={entry.product.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={entry.product.images[0]}
                      alt={entry.product.name}
                      className="w-10 h-12 object-cover object-top rounded-lg border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate max-w-[200px] sm:max-w-xs">
                        {entry.product.name}
                      </span>
                      <span className="text-zinc-400 text-[11px]">
                        {entry.product.brand} • <span className="capitalize">{entry.product.storeType}</span> Store
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 block">
                      {formatCurrency(entry.revenue)}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {entry.unitsSold} units purchased
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-zinc-400">No order units recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: STOCK & INVENTORY ANALYSIS                         */}
      {/* ============================================================== */}
      <div className="space-y-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 font-mono flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>WAREHOUSE ASSET CONTROL & REAL-TIME STOCK</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100">
              Stock & Inventory Analysis
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Managing {products.length} SKU garments across both catalogs
          </span>
        </div>

        {/* 4 Stock Valuation & Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Total Stock Units</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {stockMetrics.totalUnits.toLocaleString()}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">Physical garment units in warehouse</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Total Asset Valuation</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatCurrency(stockMetrics.totalStockValuation)}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">Current market inventory valuation</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Low Stock Alert Items</span>
            <span className={`text-2xl font-black ${stockMetrics.lowStockCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {stockMetrics.lowStockCount} SKUs
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">Products with ≤ 15 units remaining</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="text-xs font-bold uppercase text-zinc-400 block mb-1">Premium Stock Valuation</span>
            <span className="text-2xl font-black text-[#D4AF37] font-luxury">
              {formatCurrency(stockMetrics.premiumValuation)}
            </span>
            <p className="text-[11px] text-zinc-400 mt-1">
              Normal: {formatCurrency(stockMetrics.normalValuation)}
            </p>
          </div>
        </div>

        {/* Critical Low Stock Replenishment Strip */}
        {stockMetrics.lowStockItems.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                  Action Required: Low Stock Inventory Alert ({stockMetrics.lowStockItems.length} Products)
                </span>
              </div>
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold">
                Instant one-click warehouse restocking enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {stockMetrics.lowStockItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white dark:bg-[#161622] border border-amber-300/40 dark:border-amber-500/30 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-9 h-11 object-cover rounded-md shrink-0"
                    />
                    <div className="truncate">
                      <strong className="block truncate text-zinc-900 dark:text-zinc-100">{item.name}</strong>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                        Only {item.stock} left
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={updatingStockId === item.id}
                    onClick={() => handleQuickRestock(item.id, item.stock, 25)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-[11px] hover:bg-amber-600 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+25 Units</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Inventory Control Table */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Warehouse Stock Register
              </h3>
              <p className="text-xs text-zinc-400">Inspect SKU inventory and replenish warehouse batches</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search product or brand..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none w-48 sm:w-56"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
              </div>

              <select
                value={stockStoreFilter}
                onChange={(e) => setStockStoreFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
              >
                <option value="all">All Stores</option>
                <option value="normal">Normal Store</option>
                <option value="premium">Premium Store</option>
              </select>

              <select
                value={stockHealthFilter}
                onChange={(e) => setStockHealthFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none"
              >
                <option value="all">All Stock Statuses</option>
                <option value="low">Low Stock (≤ 15)</option>
                <option value="healthy">Healthy Stock (&gt; 15)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider border-y border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Store Tier</th>
                  <th className="py-3 px-3">Selling Price</th>
                  <th className="py-3 px-3">Current Stock</th>
                  <th className="py-3 px-3">Inventory Status</th>
                  <th className="py-3 px-3 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= 15;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-8 h-10 object-cover object-top rounded-md border border-zinc-200 dark:border-zinc-800 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-zinc-900 dark:text-zinc-100 block truncate max-w-[180px]">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 uppercase font-semibold">{p.brand}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 capitalize text-zinc-600 dark:text-zinc-400">
                        {p.categoryId}
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            p.storeType === 'premium'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                          }`}
                        >
                          {p.storeType}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-zinc-800 dark:text-zinc-200">
                        {formatCurrency(p.price)}
                      </td>

                      <td className="py-2.5 px-3">
                        <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-1">units</span>
                      </td>

                      <td className="py-2.5 px-3">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Healthy Supply
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={updatingStockId === p.id}
                            onClick={() => handleQuickRestock(p.id, p.stock, 10)}
                            className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            disabled={updatingStockId === p.id}
                            onClick={() => handleQuickRestock(p.id, p.stock, 25)}
                            className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                          >
                            +25
                          </button>
                          <button
                            type="button"
                            disabled={updatingStockId === p.id}
                            onClick={() => handleQuickRestock(p.id, p.stock, 50)}
                            className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-[10px] font-bold text-white transition-colors cursor-pointer shadow-xs"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
