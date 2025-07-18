/**
 * Utility functions for detecting and handling pipe-delimited data
 */

/**
 * Detects if a string contains pipe-delimited data
 * @param {string} value - Value to check
 * @param {number} minItems - Minimum number of items to consider as pipe-delimited (default: 2)
 * @returns {boolean} True if the value appears to be pipe-delimited data
 */
export const isPipeDelimitedData = (value, minItems = 2) => {
  if (!value || typeof value !== 'string') {
    return false;
  }

  // Check if the value contains pipe characters
  if (!value.includes('|')) {
    return false;
  }

  // Split by pipes and filter out empty items
  const items = value.split('|').map(item => item.trim()).filter(item => item.length > 0);

  // Must have at least the minimum number of items
  if (items.length < minItems) {
    return false;
  }

  // Additional validation: check if items look like meaningful data
  // (not just random characters with pipes)
  const meaningfulItems = items.filter(item => {
    // Item should be at least 1 character and not just special characters
    return item.length > 0 && /\w/.test(item);
  });

  return meaningfulItems.length >= minItems;
};

/**
 * Gets a preview of pipe-delimited data for display
 * @param {string} value - Pipe-delimited string
 * @param {number} maxItems - Maximum number of items to show in preview (default: 3)
 * @returns {string} Preview string
 */
export const getPipeDelimitedPreview = (value, maxItems = 3) => {
  if (!isPipeDelimitedData(value)) {
    return value;
  }

  const items = value.split('|').map(item => item.trim()).filter(item => item.length > 0);
  
  if (items.length <= maxItems) {
    return items.join(' | ');
  }

  const preview = items.slice(0, maxItems).join(' | ');
  const remaining = items.length - maxItems;
  
  return `${preview} | ... (+${remaining} more)`;
};

/**
 * Counts the number of items in pipe-delimited data
 * @param {string} value - Pipe-delimited string
 * @returns {number} Number of items
 */
export const countPipeDelimitedItems = (value) => {
  if (!isPipeDelimitedData(value)) {
    return 0;
  }

  return value.split('|').map(item => item.trim()).filter(item => item.length > 0).length;
};

/**
 * Validates if pipe-delimited data is well-formed
 * @param {string} value - Pipe-delimited string
 * @returns {Object} Validation result with isValid flag and issues array
 */
export const validatePipeDelimitedData = (value) => {
  const result = {
    isValid: true,
    issues: []
  };

  if (!value || typeof value !== 'string') {
    result.isValid = false;
    result.issues.push('Invalid input: not a string');
    return result;
  }

  if (!value.includes('|')) {
    result.isValid = false;
    result.issues.push('No pipe delimiters found');
    return result;
  }

  const items = value.split('|');
  const emptyItems = items.filter(item => item.trim().length === 0);
  
  if (emptyItems.length > 0) {
    result.issues.push(`Found ${emptyItems.length} empty items`);
  }

  const duplicateItems = items.filter((item, index) => 
    items.indexOf(item.trim()) !== index && item.trim().length > 0
  );
  
  if (duplicateItems.length > 0) {
    result.issues.push(`Found ${duplicateItems.length} duplicate items`);
  }

  // Check for items that are too long (might indicate malformed data)
  const longItems = items.filter(item => item.trim().length > 200);
  if (longItems.length > 0) {
    result.issues.push(`Found ${longItems.length} unusually long items`);
  }

  return result;
};
