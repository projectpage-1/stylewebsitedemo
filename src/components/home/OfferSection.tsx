import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Sparkles, Percent, Gift } from 'lucide-react';

interface OfferSectionProps {
  onNavigate: (route: string) => void;
}

export const OfferSection: React.FC<OfferSectionProps> = ({ onNavigate }) => {
  const { isPremium } = useStore();

  const normalOffers = [
    {
      title: 'FLAT 50% OFF',
      subtitle: 'On 25,000+ Everyday Staples',
      code: 'STYLE20',
      icon: Percent,
      actionText: 'Browse 50% Off',
      link: '/category/men',
    },
    {
      title: 'FIRST ORDER PERK',
      subtitle: 'Flat ₹500 off on ₹1,999+',
      code: 'WELCOME500',
      icon: Gift,
      actionText: 'Claim Offer',
      link: '/category/women',
    },
    {
      title: 'FOOTWEAR FIESTA',
      subtitle: 'Puma, Catwalk & Sneakers from ₹999',
      code: 'AUTO-APPLIED',
      icon: Tag,
      actionText: 'Shop Shoes',
      link: '/category/footwear',
    },
  ];

  const premiumOffers = [
    {
      title: 'TITANIUM IPHONE BENEFIT',
      subtitle: 'Unlock draw entry on orders ₹14,999+',
      code: 'IPHONE16PRO',
      icon: Sparkles,
      actionText: 'View Campaign Rules',
      link: '/category/accessories',
    },
    {
      title: 'VIP PRIVATE PASS',
      subtitle: 'Get 15% off up to ₹5,000 on Luxury Suite',
      code: 'LUXURYVIP',
      icon: Tag,
      actionText: 'Explore Haute Couture',
      link: '/category/men',
    },
    {
      title: 'COMPLIMENTARY CONCIERGE',
      subtitle: 'White-glove delivery & bespoke dustbags',
      code: 'INCLUDED',
      icon: Gift,
      actionText: 'Experience Luxury',
      link: '/category/women',
    },
  ];

  const offers = isPremium ? premiumOffers : normalOffers;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {offers.map((offer, idx) => {
          const Icon = offer.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(offer.link)}
              className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between ${
                isPremium
                  ? 'bg-[#15151A] border border-[#2E2E38] hover:border-[#D4AF37]/50 shadow-lg'
                  : 'bg-white border border-zinc-200 hover:border-zinc-400 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    isPremium
                      ? 'bg-[#D4AF37]/15 text-[#D4AF37]'
                      : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${
                    isPremium
                      ? 'bg-zinc-800 text-[#F3E5AB] border border-[#D4AF37]/30 font-luxury'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {offer.code}
                </span>
              </div>

              <div>
                <h3
                  className={`text-lg font-black tracking-tight mb-1 ${
                    isPremium ? 'font-luxury text-white' : 'text-zinc-900'
                  }`}
                >
                  {offer.title}
                </h3>
                <p className={`text-xs ${isPremium ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {offer.subtitle}
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  isPremium
                    ? 'border-zinc-800 text-[#D4AF37] group-hover:text-amber-300'
                    : 'border-zinc-100 text-blue-600 group-hover:text-blue-800'
                }`}
              >
                <span>{offer.actionText}</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
