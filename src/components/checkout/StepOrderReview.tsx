import React from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../common/Button';
import { MapPin, Truck, Tag, Smartphone, ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export const StepOrderReview: React.FC = () => {
  const {
    selectedAddress,
    selectedDelivery,
    appliedCoupon,
    isCampaignEligible,
    activeCampaign,
    priceBreakdown,
    customerInfo,
    isSubmittingOrder,
    createOrderAndProceedToPay,
    prevStep,
  } = useCheckout();
  const { items } = useCart();
  const { isPremium } = useStore();

  const handleConfirmOrder = async () => {
    await createOrderAndProceedToPay();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h3
          className={`text-xl font-extrabold tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900'
          }`}
        >
          Final Order Review
        </h3>
        <p className="text-xs text-zinc-400">
          Review your items, address, and delivery details before advancing to payment
        </p>
      </div>

      {/* Items Summary */}
      <div
        className={`p-5 rounded-2xl border ${
          isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Purchased Items ({items.length})
        </h4>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-16 rounded-lg object-cover object-top shrink-0"
                />
                <div>
                  <h5 className="text-xs font-bold line-clamp-1">{item.product.name}</h5>
                  <p className="text-[11px] text-zinc-400">
                    {item.selectedSize ? `Size: ${item.selectedSize}` : ''}{' '}
                    {item.selectedColor ? `• Color: ${item.selectedColor}` : ''} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Delivery info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Address Card */}
        <div
          className={`p-4 rounded-xl border ${
            isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-400 mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Shipping To</span>
          </div>
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{customerInfo.fullName}</p>
          <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
            {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} -{' '}
            {selectedAddress?.postalCode || selectedAddress?.pincode}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Phone: {customerInfo.phone}</p>
        </div>

        {/* Delivery Mode Card */}
        <div
          className={`p-4 rounded-xl border ${
            isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-zinc-400 mb-2">
            <Truck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Delivery Method</span>
          </div>
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{selectedDelivery?.name}</p>
          <p className="text-xs text-zinc-400 mt-0.5">{selectedDelivery?.estimatedDays} Transit</p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Cost:{' '}
            {selectedDelivery?.price === 0
              ? 'FREE'
              : formatCurrency(selectedDelivery?.price || 0)}
          </p>
        </div>
      </div>

      {/* Campaign Benefit info if active */}
      {isCampaignEligible && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#AA7C11]/10 border border-[#D4AF37]/40 flex items-center gap-3">
          <Smartphone className="w-6 h-6 text-[#D4AF37] shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#F3E5AB] font-luxury block">
              Privilege Attached: {activeCampaign?.name}
            </span>
            <span className="text-zinc-300">
              Titanium Lucky Pass attached with Order tracking reference.
            </span>
          </div>
        </div>
      )}

      {/* Applied coupon banner */}
      {appliedCoupon && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Voucher {appliedCoupon.code} Applied
            </span>
          </div>
          <span className="font-bold text-emerald-500">
            -{formatCurrency(priceBreakdown.couponDiscount)}
          </span>
        </div>
      )}

      {/* Price Summary Breakdown */}
      <div
        className={`p-5 rounded-2xl border space-y-2 text-xs ${
          isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200'
        }`}
      >
        <div className="flex justify-between">
          <span className="text-zinc-400">Bag Subtotal</span>
          <span className="font-semibold">{formatCurrency(priceBreakdown.subtotal)}</span>
        </div>
        {priceBreakdown.couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-500">
            <span>Coupon Discount</span>
            <span>-{formatCurrency(priceBreakdown.couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-zinc-400">Delivery Fee</span>
          <span>
            {priceBreakdown.deliveryCharge === 0
              ? 'FREE'
              : formatCurrency(priceBreakdown.deliveryCharge)}
          </span>
        </div>
        {priceBreakdown.convenienceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-zinc-400">Handling Fee</span>
            <span>{formatCurrency(priceBreakdown.convenienceFee)}</span>
          </div>
        )}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-baseline">
          <span className="text-sm font-bold uppercase">Total Payable</span>
          <span
            className={`text-2xl font-black ${
              isPremium ? 'text-[#F3E5AB] font-luxury' : 'text-zinc-900'
            }`}
          >
            {formatCurrency(priceBreakdown.finalPayableAmount)}
          </span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={prevStep} leftIcon={<ArrowLeft className="w-4 h-4 mr-1" />}>
          Back
        </Button>
        <Button
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          isLoading={isSubmittingOrder}
          onClick={handleConfirmOrder}
          rightIcon={<Lock className="w-4 h-4 ml-1" />}
        >
          Confirm & Proceed to Pay
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Order will be securely registered with Style Zone Core Server</span>
      </div>
    </div>
  );
};
