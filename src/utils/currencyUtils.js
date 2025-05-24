// src/utils/currencyUtils.js

export const getSystemSettings = () => {
  try {
    const stored = localStorage.getItem('systemSettings');
    return stored ? JSON.parse(stored) : { currency: '£', country: 'UK' };
  } catch {
    return { currency: '£', country: 'UK' };
  }
};

export const getCurrencyCode = () => {
  const settings = getSystemSettings();
  const currencyMap = {
    '£': 'GBP',
    '€': 'EUR', 
    '$': 'USD'
  };
  return currencyMap[settings.currency] || 'GBP';
};

export const getCurrencySymbol = () => {
  const settings = getSystemSettings();
  return settings.currency || '£';
};

export const getPriceForCurrency = (product, currency = null) => {
  const currencyCode = currency || getCurrencyCode();
  
  switch (currencyCode) {
    case 'EUR':
      return product.mrspEUR || product.msrpEUR || 0;
    case 'GBP':
      return product.mrspGBP || product.msrpGBP || 0;
    case 'USD':
      return product.mrspUSD || product.msrpUSD || product.mrspGBP || 0;
    default:
      return product.mrspGBP || product.msrpGBP || 0;
  }
};