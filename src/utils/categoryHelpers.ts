import { Category } from '../types/category';

export const normalizeCategoryId = (rawId: string): string => {
  return rawId ? rawId.toLowerCase().trim() : '';
};

export const findCategoryById = (
  categories: Category[],
  categoryId: string
): Category | undefined => {
  const normalized = normalizeCategoryId(categoryId);
  return categories.find((c) => normalizeCategoryId(c.id) === normalized);
};

export interface BreadcrumbItem {
  label: string;
  link?: string;
  active?: boolean;
}

export const buildCategoryBreadcrumbs = (
  categories: Category[],
  categoryId?: string,
  subcategoryId?: string,
  productName?: string
): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', link: '/' }];

  if (!categoryId) return crumbs;

  const category = findCategoryById(categories, categoryId);
  if (category) {
    crumbs.push({
      label: category.name,
      link: `/category/${category.id}`,
      active: !subcategoryId && !productName,
    });

    if (subcategoryId) {
      const sub = category.subcategories.find(
        (s) => s.id === subcategoryId || s.slug === subcategoryId
      );
      if (sub) {
        crumbs.push({
          label: sub.name,
          link: `/category/${category.id}?subcategory=${sub.id}`,
          active: !productName,
        });
      }
    }
  }

  if (productName) {
    crumbs.push({
      label: productName,
      active: true,
    });
  }

  return crumbs;
};
