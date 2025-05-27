/**
 * @fileoverview Application constants and configuration options
 * @author System
 * @version 1.0.0
 */

/**
 * Available table options for selection
 * @constant {Array<Object>} TABLE_OPTIONS
 * @property {string} value - The internal value for the table
 * @property {string} label - The display label for the table
 */
export const TABLE_OPTIONS = [
  { value: 'users', label: 'Users' },
  { value: 'products', label: 'Products' },
  { value: 'orders', label: 'Orders' },
];

/**
 * Available environment options for deployment contexts
 * @constant {Array<Object>} ENVIRONMENT_OPTIONS
 * @property {string} value - The internal value for the environment
 * @property {string} label - The display label for the environment
 */
export const ENVIRONMENT_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'development', label: 'Development' },
  { value: 'pre-prod', label: 'Pre-prod' },
];

/**
 * Available date range options for filtering
 * @constant {Array<Object>} DATE_OPTIONS
 * @property {string} value - The internal value for the date range
 * @property {string} label - The display label for the date range
 */
export const DATE_OPTIONS = [
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'last_30_days', label: 'Last 30 Days' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
];