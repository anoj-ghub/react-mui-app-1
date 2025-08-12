/**
 * Utility for managing recent environment selections
 * Extracts environment values from all recent values storage keys
 */

import { getRecentValues } from './recentValuesStorage'

/**
 * Get all unique environment values from recent values across all storage keys
 * @returns {Array<string>} Array of unique environment values
 */
export function getRecentEnvironments() {
  const environmentSet = new Set()
  const storageKeys = []
  
  // Get all localStorage keys that match our recent values pattern
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('app.recent.')) {
      storageKeys.push(key)
    }
  }
  
  // Extract environment values from each storage key
  storageKeys.forEach(storageKey => {
    const entries = getRecentValues(storageKey)
    entries.forEach(entry => {
      if (entry.environment && typeof entry.environment === 'string') {
        environmentSet.add(entry.environment)
      }
    })
  })
  
  // Convert to array and sort by preference (Production last for safety)
  const environments = Array.from(environmentSet)
  const sortOrder = { 'Development': 1, 'Pre-prod': 2, 'Production': 3 }
  
  return environments.sort((a, b) => {
    const orderA = sortOrder[a] || 999
    const orderB = sortOrder[b] || 999
    return orderA - orderB
  })
}

/**
 * Add an environment to the recent environments list
 * This is automatically called when forms are submitted with environment data
 * @param {string} environment - Environment name to track
 */
export function addRecentEnvironment(environment) {
  // We don't need to store environments separately since they're already 
  // captured in the form submissions that include environment fields
  console.log(`Environment "${environment}" will be tracked via form submissions`)
}

export default {
  getRecentEnvironments,
  addRecentEnvironment
}
