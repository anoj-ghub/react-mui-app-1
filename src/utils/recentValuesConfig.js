/**
 * Configuration utilities for SecureRecentValuesButton
 * Provides helper functions and presets for different screen types
 */

/**
 * Create a field configuration for the recent values component
 * @param {Object} options - Configuration options
 * @param {Array} options.fields - Array of field definitions
 * @param {Array} options.displayFields - Fields to show in the display text
 * @param {string} options.separator - Separator for display text (default: ' • ')
 * @param {string} options.emptySubtext - Custom empty state message
 * @returns {Object} Field configuration object
 */
export function createFieldConfig(options = {}) {
  const {
    fields = [],
    displayFields = [],
    separator = ' • ',
    emptySubtext = null
  } = options

  return {
    columns: fields.map(field => ({
      key: field.key,
      label: field.label || field.key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()),
      flex: field.flex || 1,
      minWidth: field.minWidth || 120,
      maxWidth: field.maxWidth,
      sortable: field.sortable !== false,
      renderCell: field.renderCell || ((params) => {
        const value = params.value
        if (field.type === 'date' && value) {
          return new Date(value).toLocaleDateString()
        }
        if (field.type === 'boolean') {
          return value ? 'Yes' : 'No'
        }
        if (field.type === 'currency' && typeof value === 'number') {
          return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
          }).format(value)
        }
        return value || field.fallback || '—'
      })
    })),
    displayFields: displayFields.length > 0 
      ? displayFields 
      : fields.slice(0, 3).map(f => ({ key: f.key, label: f.shortLabel })),
    separator,
    emptySubtext
  }
}

/**
 * Predefined configurations for common screen types
 */
export const presetConfigs = {
  // Data Browser configuration
  dataBrowser: createFieldConfig({
    fields: [
      { key: 'selectedTable', label: 'Table', shortLabel: 'Table', minWidth: 150 },
      { key: 'accountNumber', label: 'Account', shortLabel: 'Acct', minWidth: 120 },
      { key: 'environment', label: 'Environment', shortLabel: 'Env', minWidth: 120 },
      { key: 'selectedDate', label: 'Date', shortLabel: 'Date', type: 'date', minWidth: 120 },
      { key: 'timestamp', label: 'Created', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'selectedTable', fallback: '(no table)' },
      { key: 'accountNumber', fallback: '(no account)' },
      { key: 'environment', fallback: 'Production' },
      { key: 'selectedDate', fallback: 'All Dates' }
    ],
    emptySubtext: 'Submit a data browser query to save your first entry.'
  }),

  // Account Inquiry configuration
  accountInquiry: createFieldConfig({
    fields: [
      { key: 'accountNumber', label: 'Account Number', minWidth: 150 },
      { key: 'environment', label: 'Environment', minWidth: 120 },
      { key: 'date', label: 'Date Filter', minWidth: 140 },
      { key: 'selectedOption', label: 'Search Type', minWidth: 120 },
      { key: 'timestamp', label: 'Created', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'accountNumber', fallback: '(no account)' },
      { key: 'environment', fallback: 'Production' },
      { key: 'selectedOption', fallback: 'Option 1' },
      { key: 'date', fallback: 'All Dates' }
    ],
    emptySubtext: 'Submit an account inquiry to save your first entry.'
  }),

  // Login form configuration
  loginForm: createFieldConfig({
    fields: [
      { key: 'username', label: 'Username', minWidth: 120 },
      { key: 'environment', label: 'Environment', minWidth: 120 },
      { key: 'rememberMe', label: 'Remember', type: 'boolean', minWidth: 100 },
      { key: 'timestamp', label: 'Last Used', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'username', fallback: '(no username)' },
      { key: 'environment', fallback: 'Default' }
    ],
    emptySubtext: 'Log in to save your credentials for quick access.'
  }),

  // Search form configuration
  searchForm: createFieldConfig({
    fields: [
      { key: 'query', label: 'Search Query', minWidth: 200 },
      { key: 'category', label: 'Category', minWidth: 120 },
      { key: 'filters', label: 'Filters', minWidth: 150 },
      { key: 'timestamp', label: 'Searched', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'query', fallback: '(empty query)' },
      { key: 'category', fallback: 'All Categories' }
    ],
    emptySubtext: 'Perform a search to save your recent queries.'
  }),

  // Generic form configuration
  generic: createFieldConfig({
    fields: [
      { key: 'name', label: 'Name', minWidth: 150 },
      { key: 'value', label: 'Value', minWidth: 150 },
      { key: 'type', label: 'Type', minWidth: 100 },
      { key: 'timestamp', label: 'Created', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'name', fallback: '(unnamed)' },
      { key: 'value', fallback: '(no value)' }
    ],
    emptySubtext: 'Submit the form to save your entries.'
  })
}

/**
 * Create a custom filter function
 * @param {Object} options - Filter options
 * @param {Array} options.requiredFields - Fields that must have values
 * @param {Array} options.excludeValues - Values to exclude (for specific fields)
 * @param {Function} options.customLogic - Custom filter logic function
 * @returns {Function} Filter function
 */
export function createCustomFilter(options = {}) {
  const { requiredFields = [], excludeValues = {}, customLogic } = options

  return (entry) => {
    // Check required fields
    for (const field of requiredFields) {
      if (!entry[field] || entry[field] === '') {
        return false
      }
    }

    // Check excluded values
    for (const [field, excludedValues] of Object.entries(excludeValues)) {
      if (excludedValues.includes(entry[field])) {
        return false
      }
    }

    // Apply custom logic if provided
    if (customLogic && !customLogic(entry)) {
      return false
    }

    return true
  }
}

/**
 * Helper to create a storage key for a specific screen/form
 * @param {string} screenName - Name of the screen
 * @param {string} formName - Name of the form (optional)
 * @returns {string} Storage key
 */
export function createStorageKey(screenName, formName = null) {
  const base = `app.recent.${screenName.toLowerCase().replace(/\s+/g, '_')}`
  return formName ? `${base}.${formName.toLowerCase().replace(/\s+/g, '_')}` : base
}

export default {
  createFieldConfig,
  presetConfigs,
  createCustomFilter,
  createStorageKey
}
