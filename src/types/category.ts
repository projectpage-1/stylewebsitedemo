import { StoreType } from './product';

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface Category {
  id: string; // e.g. "men", "women", "kids", "footwear", "accessories"
  name: string;
  title: string; // e.g. "Men's Fashion"
  description: string;
  image: string; // Category image card
  iconName: string; // Lucide icon identifier
  storeType?: StoreType | 'both';
  subcategories: Subcategory[];
  order: number;
  isActive: boolean;
}
