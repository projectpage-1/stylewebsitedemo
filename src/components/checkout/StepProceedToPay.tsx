import React, { useState } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../common/Button';
import {
  CheckCircle2,
  Package,
  ShieldCheck,
  Building2,
  Truck,
  QrCode,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Home,
  Ticket,
  Trophy,
  Gift,
} from 'lucide-react';

interface StepProceedToPayProps {
  onNavigate: (route: string) => void;
}

export const StepProceedToPay: React.FC<StepProceedToPayProps> = ({ onNavigate }) => {
  const {
    placedOrder,
    createOrderAndProceedToPay,
    isSubmittingOrder,
    priceBreakdown,
    selectedDelivery,
    resetCheckout,
  } = useCheckout();
  const { isPremium } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<'pay_at_store' | 'upi' | 'card'>(
    selectedDelivery?.id === 'collect-at-store' ? 'pay_at_store' : 'upi'
  );

  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLuckyTicket, setCopiedLuckyTicket] = useState<string | null>(null);

  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 8890',
    cardExpiry: '08/28',
    cardCvv: '•••',
    cardName: 'Alexander Wright',
  });

  const handleCopyPickupCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLuckyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    setCopiedLuckyTicket(ticket);
    setTimeout(() => setCopiedLuckyTicket(null), 2500);
  };

  const handleConfirmPayment = async () => {
    await createOrderAndProceedToPay(paymentMethod);
  };

  // -------------------------------------------------------------
  // VIEW A: ORDER CONFIRMED VIEW (When placedOrder is present)
  // -------------------------------------------------------------
  if (placedOrder) {
    const isStorePickup =
      placedOrder.fulfillmentType === 'store_pickup' || placedOrder.paymentMethod === 'pay_at_store';

    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center py-4">
        {/* Success Icon Badge */}
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
            isPremium
              ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-zinc-950 shadow-[#D4AF37]/20'
              : 'bg-emerald-600 text-white shadow-emerald-500/20'
          }`}
        >
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider mb-2">
            <span>
              {isStorePickup ? 'Order Confirmed • Store Pickup Reserved' : 'Order Confirmed • Dispatched via Courier'}
            </span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            {isStorePickup ? 'Ready for Store Collection!' : 'Dispatched to Your Doorstep!'}
          </h2>

          <p className="text-xs text-zinc-400 mt-1">
            Order Reference: <strong className="font-mono text-zinc-800 dark:text-zinc-200">{placedOrder.orderNumber}</strong>
          </p>
        </div>

        {/* ============================================================ */}
        {/* CASE 1: PAY AT STORE & COLLECT (7-DAY CANCEL CLAUSE & CODE)  */}
        {/* ============================================================ */}
        {isStorePickup ? (
          <div className="space-y-4 text-left">
            {/* 7-DAY CANCELLATION NOTICE BANNER (Strictly as user requested) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-black text-sm uppercase tracking-wide">
                  Collect your order in 7 days else order cancelled
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Your items are physically packed and reserved at our store counter. You must collect your order on or before{' '}
                  <strong className="text-amber-700 dark:text-amber-300 font-bold">
                    {placedOrder.pickupDetails?.pickupDeadline || '7 days from today'}
                  </strong>
                  . Uncollected reservations will be automatically returned to inventory.
                </p>
              </div>
            </div>

            {/* Pickup Code Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-[#2C2C38] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Your Store Pickup Passcode
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Show at Billing Counter
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-zinc-900 dark:text-[#D4AF37]">
                  {placedOrder.pickupDetails?.pickupCode || 'SZ-PICKUP-7821'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyPickupCode(placedOrder.pickupDetails?.pickupCode || 'SZ-PICKUP-7821')
                  }
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Store Location & Hours */}
              <div className="pt-2 text-xs space-y-2 text-zinc-600 dark:text-zinc-300">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 dark:text-zinc-100 block">
                      {placedOrder.pickupDetails?.storeName || 'Style Zone Flagship Atelier & Store'}
                    </strong>
                    <span>
                      {placedOrder.pickupDetails?.storeAddress ||
                        '104 Brigade Road, Commercial District, Bangalore - 560001'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-500">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Visiting Hours: 10:00 AM - 9:30 PM (Open all 7 Days)</span>
                </div>
              </div>
            </div>

            {/* Payable at counter */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#14141B] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Amount Payable at Store Counter:</span>
                <span className="text-xs text-zinc-500">Pay via Cash, UPI or Card upon trying garments</span>
              </div>
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {formatCurrency(placedOrder.priceBreakdown.finalPayableAmount)}
              </span>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* CASE 2: DOORSTEP COURIER DISPATCH FEATURE (UPI / CARD)       */
          /* ============================================================ */
          <div className="space-y-4 text-left">
            {/* Positive Customer Confirmation */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-sm">
                  Payment Confirmed! Handed to Express Logistics Courier
                </p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Your garments have passed multi-point quality check, packed with tamper-proof security seals, and dispatched directly for doorstep delivery.
                </p>
              </div>
            </div>

            {/* Impressive Live Dispatch Tracker */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#15151E] border border-zinc-200 dark:border-[#2C2C38] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                    Live Express Dispatch
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  In Transit
                </span>
              </div>

              {/* Courier & Tracking Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[11px]">Courier Partner</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    {placedOrder.dispatchDetails?.courier || 'BlueDart Air Express'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <span className="text-zinc-400 block text-[11px]">AWB Tracking Number</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    {placedOrder.dispatchDetails?.trackingNumber || 'SZ-EXP-9042BL'}
                  </span>
                </div>
              </div>

              {/* 4-Step Dispatch Timeline */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Order Verified & Insured</span>
                    <span className="text-[11px] text-zinc-400">Payment captured via {placedOrder.paymentMethod?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Packed with Tamper-Proof Seal</span>
                    <span className="text-[11px] text-zinc-400">Inspected at Style Zone Central Warehouse</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 animate-pulse">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Dispatched via Express Courier</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      Out for transit • Expected within 2-3 Business Days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs opacity-60">
                  <div className="w-6 h-6 rounded-full border border-zinc-400 text-zinc-400 flex items-center justify-center shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">Doorstep Delivery</span>
                    <span className="text-[11px] text-zinc-400">
                      To: {placedOrder.shippingAddress.addressLine1 || placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Fee Confirmation */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-center justify-between">
                <span>Manual Flat Delivery Charge: ₹99</span>
                <span className="font-bold">Zero surge / Hidden charges guaranteed</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PREMIUM STORE EXCLUSIVE: LUCKY DRAW ENTRY COUPON(S)           */}
        {/* ============================================================ */}
        {placedOrder.luckyDrawCouponsAwarded && placedOrder.luckyDrawCouponsAwarded.length > 0 && (
          <div className="space-y-4 text-left">
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1C1608] via-[#2A200B] to-[#14120C] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10 text-white relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between gap-2 border-b border-[#D4AF37]/30 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-zinc-950 flex items-center justify-center font-bold">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-[#F3E5AB] font-luxury">
                      Exclusive Premium Lucky Draw Ticket Awarded!
                    </h4>
                    <p className="text-[11px] text-zinc-300">
                      Eligible only for Style Zone Premium Store purchases
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#D4AF37] text-zinc-950">
                  Confirmed Entry
                </span>
              </div>

              <div className="space-y-3">
                {placedOrder.luckyDrawCouponsAwarded.map((ticket, idx) => (
                  <div
                    key={ticket.couponId || idx}
                    className="p-4 rounded-2xl bg-black/40 border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-xs font-extrabold uppercase tracking-wide text-zinc-200">
                          {ticket.campaignTitle}
                        </span>
                      </div>

                      <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>Grand Prize: {ticket.prize}</span>
                      </div>

                      <p className="text-[11px] text-zinc-400">
                        Official Draw Scheduled on: <strong className="text-white">{ticket.drawDate}</strong>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-zinc-400 uppercase font-mono block">Ticket ID</span>
                        <span className="font-mono text-base font-black text-[#F3E5AB] tracking-wider">
                          {ticket.couponId}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyLuckyTicket(ticket.couponId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedLuckyTicket === ticket.couponId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Ticket ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Auto-saved to your Style Zone Account under My Orders.</span>
                <span className="text-[#F3E5AB] font-bold">Good Luck! 🍀</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant={isPremium ? 'luxury' : 'primary'}
            onClick={() => {
              resetCheckout();
              onNavigate('/');
            }}
            className="cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="outline"
            onClick={() => window.print()}
            className="cursor-pointer"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW B: PAYMENT METHOD SELECTION & CONFIRMATION
  // -------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      <div>
        <h3
          className={`text-xl sm:text-2xl font-black tracking-tight ${
            isPremium ? 'font-luxury text-white' : 'text-zinc-900 dark:text-zinc-100'
          }`}
        >
          Select Payment & Order Settlement
        </h3>
        <p className="text-xs text-zinc-400">
          Choose to Pay at Store or pay with UPI / Cards to activate instant courier dispatch
        </p>
      </div>

      {/* 3 Interactive Payment Methods */}
      <div className="space-y-3">
        {/* OPTION 1: PAY AT STORE */}
        <div
          onClick={() => setPaymentMethod('pay_at_store')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
            paymentMethod === 'pay_at_store'
              ? isPremium
                ? 'bg-[#181824] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg'
                : 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
              : isPremium
              ? 'bg-[#14141B] border-[#2A2A35] hover:border-zinc-600'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl ${
                  paymentMethod === 'pay_at_store'
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Pay at Store & Collect
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    ₹0 Delivery Fee
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  No online payment needed now. Reserve your items and pay at our flagship store billing counter upon trying them.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                paymentMethod === 'pay_at_store'
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}
            >
              {paymentMethod === 'pay_at_store' && <Check className="w-3 h-3" />}
            </div>
          </div>

          {paymentMethod === 'pay_at_store' && (
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 text-xs space-y-2">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">
                  Collect your order in 7 days, else order cancelled automatically.
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                • Store Location: 104 Brigade Road, Bangalore (10 AM - 9:30 PM)
                <br />• Payment modes accepted at counter: Cash, UPI, Debit / Credit Cards
              </p>
            </div>
          )}
        </div>

        {/* OPTION 2: PAY WITH UPI */}
        <div
          onClick={() => setPaymentMethod('upi')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
            paymentMethod === 'upi'
              ? isPremium
                ? 'bg-[#181824] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg'
                : 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
              : isPremium
              ? 'bg-[#14141B] border-[#2A2A35] hover:border-zinc-600'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl ${
                  paymentMethod === 'upi'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Pay with UPI (GPay / PhonePe / Paytm / QR)
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    Dispatch Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Instant settlement. Triggers real-time express courier dispatch with live tracking updates.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                paymentMethod === 'upi'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}
            >
              {paymentMethod === 'upi' && <Check className="w-3 h-3" />}
            </div>
          </div>

          {paymentMethod === 'upi' && (
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 space-y-3">
              <div className="flex flex-col sm:flex-row gap-4 items-center p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <div className="p-2 rounded-lg bg-white border border-zinc-200 shrink-0 text-center">
                  <QrCode className="w-24 h-24 text-zinc-900 mx-auto" />
                  <span className="text-[10px] font-bold text-zinc-600 block mt-1">Scan & Pay via UPI</span>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                    Or Enter VPA / UPI ID
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi or name@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setUpiVerified(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
                    >
                      {upiVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                  {upiVerified && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for one-click settlement
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OPTION 3: PAY WITH CARDS */}
        <div
          onClick={() => setPaymentMethod('card')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer text-left ${
            paymentMethod === 'card'
              ? isPremium
                ? 'bg-[#181824] border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-lg'
                : 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
              : isPremium
              ? 'bg-[#14141B] border-[#2A2A35] hover:border-zinc-600'
              : 'bg-white border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-xl ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Credit / Debit Cards
                  </h4>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    256-Bit SSL
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  Visa, Mastercard, RuPay & American Express. Instant dispatch confirmation with tracking.
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                paymentMethod === 'card'
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-zinc-300 dark:border-zinc-600'
              }`}
            >
              {paymentMethod === 'card' && <Check className="w-3 h-3" />}
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="col-span-2">
                  <label className="text-[11px] text-zinc-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={cardData.cardExpiry}
                    onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">CVV / Security Code</label>
                  <input
                    type="password"
                    value={cardData.cardCvv}
                    onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Total & Confirm Action Button */}
      <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#15151D] border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Order Subtotal:</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {formatCurrency(priceBreakdown.subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            Delivery Charges (
            {paymentMethod === 'pay_at_store' ? 'Store Pickup' : 'Express Courier'}):
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {paymentMethod === 'pay_at_store' ? 'FREE' : '₹99 (Flat Manual Fee)'}
          </span>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block">Total Final Payable:</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              {formatCurrency(
                paymentMethod === 'pay_at_store'
                  ? priceBreakdown.subtotal
                  : priceBreakdown.subtotal + 99
              )}
            </span>
          </div>

          <Button
            size="lg"
            variant={
              isPremium
                ? 'luxury'
                : paymentMethod === 'pay_at_store'
                ? 'primary'
                : 'primary'
            }
            onClick={handleConfirmPayment}
            isLoading={isSubmittingOrder}
            className="cursor-pointer font-bold px-8 shadow-md"
          >
            {paymentMethod === 'pay_at_store' ? (
              <span className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>Confirm Order & Pay at Store</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span>Pay & Dispatch Courier</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
