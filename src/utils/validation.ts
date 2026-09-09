export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateEmail = isValidEmail;

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-()+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 13;
};

export const validatePhone = isValidPhone;

export const isValidPincode = (pincode: string): boolean => {
  const cleaned = pincode.replace(/\s+/g, '');
  return /^[1-9][0-9]{5}$/.test(cleaned);
};

export interface AddressValidationErrors {
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const validateAddressForm = (values: {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}): { isValid: boolean; errors: AddressValidationErrors } => {
  const errors: AddressValidationErrors = {};

  if (!values.name.trim()) errors.name = 'Full name is required';
  if (!values.phone.trim()) errors.phone = 'Mobile number is required';
  else if (!isValidPhone(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number';

  if (!values.street.trim()) errors.street = 'Street address / Flat number is required';
  if (!values.city.trim()) errors.city = 'City is required';
  if (!values.state.trim()) errors.state = 'State is required';
  if (!values.pincode.trim()) errors.pincode = 'Postal code is required';
  else if (!isValidPincode(values.pincode)) errors.pincode = 'Enter a valid 6-digit postal code';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
