import React, { useState } from 'react';
import { useCheckout } from '../../context/CheckoutContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { validateEmail, validatePhone } from '../../utils/validation';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';

export const StepCustomerInfo: React.FC = () => {
  const { customerInfo, setCustomerInfo, nextStep } = useCheckout();
  const { isPremium } = useStore();

  const [formData, setFormData] = useState({
    fullName: customerInfo.fullName,
    email: customerInfo.email,
    phone: customerInfo.phone,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!validateEmail(formData.email)) errs.email = 'Please enter a valid email address';
    if (!validatePhone(formData.phone)) errs.phone = 'Please enter a valid 10-digit phone number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCustomerInfo(formData);
      nextStep();
    }
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6 max-w-xl mx-auto">
      <div
        className={`p-6 rounded-2xl border ${
          isPremium ? 'bg-[#15151C] border-[#2A2A35]' : 'bg-white border-zinc-200 shadow-xs'
        }`}
      >
        <h3
          className={`text-base font-bold uppercase tracking-wider mb-4 pb-2 border-b ${
            isPremium ? 'border-zinc-800 text-white font-luxury' : 'border-zinc-100 text-zinc-900'
          }`}
        >
          Customer Contact Details
        </h3>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Alexander Wright"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-hidden border ${
                  isPremium
                    ? 'bg-[#1D1D26] text-white border-zinc-700 focus:border-[#D4AF37]'
                    : 'bg-zinc-50 text-zinc-900 border-zinc-200 focus:border-zinc-900'
                }`}
              />
              <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            </div>
            {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address for Tracking <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex@stylezone.com"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-hidden border ${
                  isPremium
                    ? 'bg-[#1D1D26] text-white border-zinc-700 focus:border-[#D4AF37]'
                    : 'bg-zinc-50 text-zinc-900 border-zinc-200 focus:border-zinc-900'
                }`}
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Mobile Contact Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98765 43210"
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl outline-hidden border ${
                  isPremium
                    ? 'bg-[#1D1D26] text-white border-zinc-700 focus:border-[#D4AF37]'
                    : 'bg-zinc-50 text-zinc-900 border-zinc-200 focus:border-zinc-900'
                }`}
              />
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            </div>
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant={isPremium ? 'luxury' : 'primary'}
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Proceed to Delivery Address
        </Button>
      </div>
    </form>
  );
};
