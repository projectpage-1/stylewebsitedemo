import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';
import { Button } from '../common/Button';

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onResetFilters?: () => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onSelectProduct,
  onResetFilters,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse aspect-3/4"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-4">
          <PackageOpen className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-1">
          No matching products found
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm mb-6">
          Try loosening your filter criteria or explore products from our alternative store experience.
        </p>
        {onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            Clear All Active Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => onSelectProduct(product)}
        />
      ))}
    </div>
  );
};
