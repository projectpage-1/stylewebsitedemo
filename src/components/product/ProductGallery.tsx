import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductColor } from '../../types/product';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  activeImageOverride?: string;
  colors?: ProductColor[];
  colorImages?: Record<string, string>;
  onSelectColor?: (colorName: string) => void;
}

/**
 * ProductGallery Component:
 * Displays responsive photo gallery with interactive thumbnail list
 * and dynamic image updates when variant color selections change.
 */
export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  activeImageOverride,
  colors,
  colorImages,
  onSelectColor,
}) => {
  const { isPremium } = useStore();
  const [currentImage, setCurrentImage] = useState<string>(activeImageOverride || images[0]);

  // When activeImageOverride changes (user clicked another color), update the current image immediately!
  useEffect(() => {
    if (activeImageOverride) {
      setCurrentImage(activeImageOverride);
    }
  }, [activeImageOverride]);

  // Reset or fallback when images list changes
  useEffect(() => {
    if (!activeImageOverride && images.length > 0) {
      setCurrentImage(images[0]);
    }
  }, [images, activeImageOverride]);

  const allImages = React.useMemo(() => {
    const list = [...images];
    if (activeImageOverride && !list.includes(activeImageOverride)) {
      list.unshift(activeImageOverride);
    }
    return list;
  }, [images, activeImageOverride]);

  const displayedImage = currentImage || images[0];

  const handleThumbnailClick = (img: string) => {
    setCurrentImage(img);
    if (onSelectColor && colors) {
      const match = colors.find(
        (c) => c.imageUrl === img || (colorImages && colorImages[c.name] === img)
      );
      if (match) {
        onSelectColor(match.name);
      }
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Strip */}
      {allImages.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-20 shrink-0 py-1">
          {allImages.map((img, idx) => {
            const isSelected = img === displayedImage;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleThumbnailClick(img)}
                className={`relative rounded-xl overflow-hidden aspect-3/4 w-16 md:w-full border-2 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? isPremium
                      ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/30'
                      : 'border-zinc-950 scale-105 shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Stage with high quality crop */}
      <div
        className={`flex-1 relative rounded-3xl overflow-hidden bg-zinc-900 aspect-3/4 max-h-[640px] shadow-xl border transition-all duration-300 ${
          isPremium ? 'border-[#2A2A35]' : 'border-zinc-200'
        }`}
      >
        <img
          key={displayedImage}
          src={displayedImage}
          alt={productName}
          className="w-full h-full object-cover object-top transition-all duration-300"
        />

        {/* Badge showing image index */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold">
            {allImages.indexOf(displayedImage) + 1} / {allImages.length}
          </div>
        )}
      </div>
    </div>
  );
};

