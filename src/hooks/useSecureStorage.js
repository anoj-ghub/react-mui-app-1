/**
 * React hook for secure IndexedDB storage
 * Provides easy integration with React components
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import SecureIndexedDB from '../utils/secureIndexedDB'

export function useSecureStorage(dbName = 'ReactMUIApp', password = null) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)
  const dbRef = useRef(null)

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('Initializing SecureIndexedDB with dbName:', dbName)
        const db = new SecureIndexedDB(dbName)
        const success = await db.init(password)
        
        if (success) {
          console.log('SecureIndexedDB initialized successfully')
          dbRef.current = db
          setIsReady(true)
          setError(null)
        } else {
          console.error('Failed to initialize database')
          setError('Failed to initialize database')
        }
      } catch (err) {
        console.error('Database initialization error:', err)
        setError(err.message)
      }
    }

    initDB()
  }, [dbName, password])

  // Store recent entries (non-PII)
  const addRecentEntry = useCallback(async (storageKey, entry, maxEntries = 50) => {
    console.log('useSecureStorage.addRecentEntry called:', { storageKey, entry, maxEntries, isReady })
    if (!dbRef.current) {
      console.warn('Database not ready in addRecentEntry')
      return false
    }
    return await dbRef.current.addRecentEntry(storageKey, entry, maxEntries)
  }, [])

  // Get recent entries
  const getRecentEntries = useCallback(async (storageKey) => {
    console.log('useSecureStorage.getRecentEntries called:', { storageKey, isReady })
    if (!dbRef.current) {
      console.warn('Database not ready in getRecentEntries')
      return []
    }
    return await dbRef.current.getRecentEntries(storageKey)
  }, [])

  // Store encrypted data
  const storeSecureData = useCallback(async (category, data, ttlMs = null) => {
    if (!dbRef.current) return false
    return await dbRef.current.storeSecureData(category, data, ttlMs)
  }, [])

  // Get encrypted data
  const getSecureData = useCallback(async (category) => {
    if (!dbRef.current) return []
    return await dbRef.current.getSecureData(category)
  }, [])

  // Preferences
  const setPreference = useCallback(async (key, value) => {
    if (!dbRef.current) return false
    return await dbRef.current.setPreference(key, value)
  }, [])

  const getPreference = useCallback(async (key, defaultValue = null) => {
    if (!dbRef.current) return defaultValue
    return await dbRef.current.getPreference(key, defaultValue)
  }, [])

  // Clear all data
  const clearAll = useCallback(async () => {
    if (!dbRef.current) return false
    return await dbRef.current.clearAll()
  }, [])

  // Get storage statistics
  const getStats = useCallback(async () => {
    if (!dbRef.current) return {}
    return await dbRef.current.getStats()
  }, [])

  return {
    isReady,
    error,
    addRecentEntry,
    getRecentEntries,
    storeSecureData,
    getSecureData,
    setPreference,
    getPreference,
    clearAll,
    getStats
  }
}

// Hook specifically for recent values with IndexedDB
export function useSecureRecentValues(storageKey, maxEntries = 50) {
  const { isReady, addRecentEntry, getRecentEntries } = useSecureStorage()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  // Load entries on mount and when isReady changes
  useEffect(() => {
    const loadEntries = async () => {
      if (!isReady) {
        setLoading(false)
        return
      }
      
      setLoading(true)
      try {
        const data = await getRecentEntries(storageKey)
        console.log('Loaded IndexedDB entries:', data)
        setEntries(data)
      } catch (error) {
        console.error('Failed to load recent entries:', error)
        setEntries([])
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [isReady, storageKey, getRecentEntries])

  // Add new entry
  const addEntry = useCallback(async (entry) => {
    if (!isReady) {
      console.warn('IndexedDB not ready, cannot save entry')
      return false
    }

    try {
      console.log('Adding entry to IndexedDB:', entry)
      const success = await addRecentEntry(storageKey, entry, maxEntries)
      if (success) {
        // Reload entries to reflect changes
        const updatedEntries = await getRecentEntries(storageKey)
        console.log('Updated entries after save:', updatedEntries)
        setEntries(updatedEntries)
      }
      return success
    } catch (error) {
      console.error('Failed to add entry:', error)
      return false
    }
  }, [isReady, addRecentEntry, getRecentEntries, storageKey, maxEntries])

  return {
    entries,
    loading,
    addEntry,
    isReady
  }
}
