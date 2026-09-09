import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { orderService } from '../services/orderService';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatCurrency';
import { Button } from '../components/common/Button';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, Smartphone, Sparkles } from 'lucide-react';

interface OrdersPageProps {
  onNavigate: (route: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { isPremium } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    orderService
      .getOrders(user?.id)
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="capitalize">Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500">
            <Truck className="w-3.5 h-3.5" />
            <span className="capitalize">In Transit</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="capitalize">Processing</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-500/15 text-zinc-400">
            <Package className="w-3.5 h-3.5" />
            <span className="capitalize">Order Staged</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-6">
      <div className="flex items-baseline justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900'
            }`}
          >
            My Orders ({orders.length})
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Track dispatches, review receipts, and monitor VIP campaign passes
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 dark:bg-[#15151C] rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
          <Package className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold">No orders placed yet</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-6">
            When you finalize a purchase on Style Zone, your order timeline will appear here.
          </p>
          <Button onClick={() => onNavigate('/')}>Shop Now</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-6 rounded-2xl border transition-all ${
                isPremium
                  ? 'bg-[#15151C] border-[#2A2A35]'
                  : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              {/* Top metadata strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs">#{order.id}</span>
                    <span className="text-zinc-400 text-xs">•</span>
                    <span className="text-xs text-zinc-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Store: <strong className="uppercase">{order.storeType}</strong> • Mode:{' '}
                    {order.deliveryOption.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span
                    className={`text-base font-black ${
                      isPremium ? 'font-luxury text-[#F3E5AB]' : 'text-zinc-900'
                    }`}
                  >
                    {formatCurrency(order.priceBreakdown.finalPayableAmount)}
                  </span>
                </div>
              </div>

              {/* Campaign Privilege Callout if awarded */}
              {order.premiumCampaignClaimed && (
                <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#AA7C11]/10 border border-[#D4AF37]/40 flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-[#F3E5AB] font-luxury">
                      {order.premiumCampaignClaimed} (Pass Attached)
                    </span>
                    <p className="text-[11px] text-zinc-400">
                      Eligible for official Apple iPhone 16 Pro campaign benefit draw.
                    </p>
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-18 rounded-lg object-cover object-top shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-zinc-400">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-bold line-clamp-1">{item.productName}</h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {item.size ? `Size: ${item.size} • ` : ''}
                          {item.color ? `Color: ${item.color} • ` : ''}
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Destination info */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span>
                  Shipping To: {order.customerName}, {order.shippingAddress.street},{' '}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.postalCode}
                </span>
                <span className="text-zinc-500 font-mono">Status: {order.paymentStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
