/**
 * ============================================================================
 * Style Zone Marketplace - Indian Currency & Price Utilities (formatCurrency.ts)
 * ============================================================================
 * Handles Indian Rupee (INR - ₹) formatting adhering to Indian numeral system
 * (Lakhs and Crores grouping, e.g. ₹1,49,999 or ₹2,499) and discount calculation.
 * ============================================================================
 */

/**
 * Formats a monetary number into Indian Rupee representation (e.g. ₹1,999)
 * @param amount Numeric price or amount
 * @param currency Currency code (default: 'INR')
 * @returns Formatted currency string with ₹ symbol and Indian grouping
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  if (currency === 'INR') {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateDiscountPercent = (mrp: number, salePrice: number): number => {
  if (!mrp || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
};
