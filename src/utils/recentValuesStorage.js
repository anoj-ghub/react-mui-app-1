/**
 * Utility for storing and retrieving recent form values in localStorage.
 * Keeps up to `maxEntries` (default 50) most recent, de-duplicated items per key.
 */

const DEFAULT_MAX = 50

function stableStringify(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']'
  const keys = Object.keys(obj).sort()
  return '{' + keys.map(k => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}'
}

export function getRecentValues(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function addRecentValue(storageKey, entry, maxEntries = DEFAULT_MAX) {
  try {
    const list = getRecentValues(storageKey)
    const newSig = stableStringify(entry)
    const deduped = list.filter(item => stableStringify(item) !== newSig)
    deduped.unshift(entry)
    const trimmed = deduped.slice(0, Math.max(1, maxEntries))
    localStorage.setItem(storageKey, JSON.stringify(trimmed))
    return trimmed
  } catch {
    // noop
    return []
  }
}

export function clearRecentValues(storageKey) {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // noop
  }
}

export function removeRecentValueAt(storageKey, index) {
  try {
    const list = getRecentValues(storageKey)
    if (index < 0 || index >= list.length) return list
    const next = list.slice(0, index).concat(list.slice(index + 1))
    localStorage.setItem(storageKey, JSON.stringify(next))
    return next
  } catch {
    return []
  }
}

export default {
  getRecentValues,
  addRecentValue,
  clearRecentValues,
  removeRecentValueAt,
}
