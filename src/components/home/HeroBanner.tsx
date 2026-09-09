import React, { useState, useEffect } from 'react';
import { Banner } from '../../types/banner';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  banners: Banner[];
  onNavigate: (route: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners, onNavigate }) => {
  const { isPremium, storeType } = useStore();
  const filteredBanners = banners.filter(
    (b) => b.storeType === 'both' || b.storeType === storeType
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [storeType]);

  useEffect(() => {
    if (filteredBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [filteredBanners.length]);

  if (filteredBanners.length === 0) return null;

  const currentBanner = filteredBanners[currentIndex] || filteredBanners[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredBanners.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      <div
        className={`relative w-full h-[360px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
          isPremium ? 'border border-[#D4AF37]/30 shadow-[#D4AF37]/5' : 'border border-zinc-200'
        }`}
      >
        {/* Background Image with optimized object-fit */}
        <img
          src={currentBanner.image}
          alt={currentBanner.title}
          className="w-full h-full object-cover object-center transition-all duration-700 transform scale-100"
          loading="eager"
        />

        {/* Dynamic Dark Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            isPremium
              ? 'from-[#0A0A0D]/95 via-[#0A0A0D]/75 to-transparent'
              : 'from-black/85 via-black/50 to-transparent'
          }`}
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-2xl text-white">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 self-start mb-4">
              <span
                className={`text-[11px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full ${
                  isPremium
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-zinc-950 font-luxury shadow-md'
                    : 'bg-white text-zinc-900 shadow-sm'
                }`}
              >
                {currentBanner.badge}
              </span>
            </div>
          )}

          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-3 ${
              isPremium
                ? 'font-luxury text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-white'
                : 'text-white'
            }`}
          >
            {currentBanner.title}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-200 sm:text-zinc-300 font-normal mb-6 max-w-lg leading-relaxed">
            {currentBanner.subtitle}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant={isPremium ? 'luxury' : 'primary'}
              size="lg"
              onClick={() => onNavigate(currentBanner.linkUrl || '/category/men')}
              rightIcon={<Sparkles className="w-4 h-4 ml-1" />}
            >
              {currentBanner.ctaText || 'SHOP COLLECTION'}
            </Button>
          </div>
        </div>

        {/* Navigation arrows (desktop) */}
        {filteredBanners.length > 1 && (
          <div className="hidden sm:flex items-center gap-2 absolute bottom-6 right-8">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Slide pagination indicator dots */}
        {filteredBanners.length > 1 && (
          <div className="absolute bottom-6 left-6 sm:left-12 flex items-center gap-2">
            {filteredBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? isPremium
                      ? 'w-8 bg-[#D4AF37]'
                      : 'w-8 bg-white'
                    : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
