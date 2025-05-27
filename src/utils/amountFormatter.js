/**
 * @fileoverview Amount Formatter Utility for NOD (Number of Decimals) functionality
 * @author System
 * @version 1.0.0
 * 
 * This utility provides functions to format amount fields based on the number of decimals (NOD).
 * NOD can have values 0 through 4, and the amount field will initially have 4 decimals.
 * 
 * Key Features:
 * - Configurable decimal precision (0-4)
 * - Currency symbol support
 * - Locale-aware formatting
 * - Field type-specific formatting
 * - Validation and error handling
 */

/**
 * Formats an amount value based on the specified number of decimals
 * @param {number|string} amount - The amount value to format
 * @param {number} nod - Number of decimals (0-4)
 * @param {object} options - Formatting options
 * @param {boolean} options.showCurrency - Whether to show currency symbol (default: true)
 * @param {string} options.currencySymbol - Currency symbol to use (default: '$')
 * @param {boolean} options.useLocaleString - Whether to use locale formatting for thousands separator (default: true)
 * @returns {string} - Formatted amount string
 */
export const formatAmount = (amount, nod = 4, options = {}) => {
  const {
    showCurrency = true,
    currencySymbol = '$',
    useLocaleString = true
  } = options;

  // Validate NOD range
  if (nod < 0 || nod > 4) {
    console.warn(`Invalid NOD value: ${nod}. Using default value of 4.`);
    nod = 4;
  }

  // Handle null, undefined, or empty values
  if (amount === null || amount === undefined || amount === '') {
    return showCurrency ? `${currencySymbol}0.${'0'.repeat(nod)}` : `0.${'0'.repeat(nod)}`;
  }

  // Convert to number if it's a string
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid numbers
  if (isNaN(numericAmount)) {
    console.warn(`Invalid amount value: ${amount}. Returning zero.`);
    return showCurrency ? `${currencySymbol}0.${'0'.repeat(nod)}` : `0.${'0'.repeat(nod)}`;
  }

  // Format the number with specified decimal places
  const formattedNumber = numericAmount.toFixed(nod);

  // Apply locale formatting for thousands separator if requested
  let finalAmount;
  if (useLocaleString && nod > 0) {
    // Split into integer and decimal parts
    const [integerPart, decimalPart] = formattedNumber.split('.');
    const formattedInteger = parseInt(integerPart).toLocaleString();
    finalAmount = `${formattedInteger}.${decimalPart}`;
  } else if (useLocaleString && nod === 0) {
    finalAmount = parseInt(formattedNumber).toLocaleString();
  } else {
    finalAmount = formattedNumber;
  }

  // Add currency symbol if requested
  return showCurrency ? `${currencySymbol}${finalAmount}` : finalAmount;
};

/**
 * Formats multiple amount fields in an object based on NOD
 * @param {object} data - Object containing amount fields
 * @param {array} amountFields - Array of field names that are amount fields
 * @param {number} nod - Number of decimals (0-4)
 * @param {object} options - Formatting options (same as formatAmount)
 * @returns {object} - New object with formatted amount fields
 */
export const formatAmountFields = (data, amountFields = [], nod = 4, options = {}) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const formattedData = { ...data };

  amountFields.forEach(field => {
    if (field in formattedData) {
      formattedData[field] = formatAmount(formattedData[field], nod, options);
    }
  });

  return formattedData;
};

/**
 * Default amount field names commonly used in the application
 */
export const DEFAULT_AMOUNT_FIELDS = [
  'amount',
  'price', 
  'total',
  'salary',
  'cost',
  'value',
  'balance',
  'payment',
  'fee',
  'charge'
];

/**
 * Applies NOD formatting to amount fields with different NOD values for different field types
 * @param {number|string} amount - The amount value to format
 * @param {string} fieldType - Type of amount field ('currency', 'percentage', 'rate', etc.)
 * @param {number} nod - Number of decimals (0-4)
 * @param {object} options - Formatting options
 * @returns {string} - Formatted amount string
 */
export const formatAmountByType = (amount, fieldType = 'currency', nod = 4, options = {}) => {
  const defaultOptions = {
    showCurrency: true,
    currencySymbol: '$',
    useLocaleString: true,
    ...options
  };

  switch (fieldType.toLowerCase()) {
    case 'percentage':
      return formatAmount(amount, nod, {
        ...defaultOptions,
        showCurrency: false
      }) + '%';
    
    case 'rate':
      return formatAmount(amount, nod, {
        ...defaultOptions,
        showCurrency: false
      });
    
    case 'currency':
    default:
      return formatAmount(amount, nod, defaultOptions);
  }
};

/**
 * Parses a formatted amount string back to a number
 * @param {string} formattedAmount - Formatted amount string
 * @returns {number} - Numeric value
 */
export const parseFormattedAmount = (formattedAmount) => {
  if (typeof formattedAmount !== 'string') {
    return parseFloat(formattedAmount) || 0;
  }

  // Remove currency symbols and commas
  const cleanedAmount = formattedAmount
    .replace(/[$£€¥₹₨]/g, '') // Remove common currency symbols
    .replace(/,/g, '') // Remove thousand separators
    .replace(/%/g, '') // Remove percentage symbol
    .trim();

  return parseFloat(cleanedAmount) || 0;
};

/**
 * Validates if a NOD value is valid
 * @param {number} nod - Number of decimals to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidNOD = (nod) => {
  return typeof nod === 'number' && nod >= 0 && nod <= 4 && Number.isInteger(nod);
};

/**
 * Gets the appropriate NOD value based on field name and context
 * @param {string} fieldName - Name of the field
 * @param {string} context - Context like 'display', 'calculation', 'storage'
 * @returns {number} - Recommended NOD value
 */
export const getRecommendedNOD = (fieldName, context = 'display') => {
  const fieldLower = fieldName.toLowerCase();
  
  // Context-based recommendations
  if (context === 'calculation') {
    return 4; // Maximum precision for calculations
  }
  
  if (context === 'storage') {
    return 4; // Store with maximum precision
  }
  
  // Field-based recommendations for display
  if (fieldLower.includes('percentage') || fieldLower.includes('rate')) {
    return 2;
  }
  
  if (fieldLower.includes('price') || fieldLower.includes('cost')) {
    return 2;
  }
  
  if (fieldLower.includes('salary') || fieldLower.includes('total')) {
    return 0; // Whole numbers for large amounts
  }
  
  // Default display precision
  return 2;
};
