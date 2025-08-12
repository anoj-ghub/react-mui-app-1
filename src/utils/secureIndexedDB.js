/**
 * Secure IndexedDB wrapper with encryption support
 * Provides a secure alternative to localStorage for sensitive data
 */

class SecureIndexedDB {
  constructor(dbName = 'SecureAppDB', version = 1) {
    this.dbName = dbName
    this.version = version
    this.db = null
    this.encryptionKey = null
  }

  /**
   * Initialize the database and encryption
   */
  async init(password = null) {
    console.log('SecureIndexedDB.init called with password:', !!password)
    try {
      // Initialize encryption key if password provided
      if (password) {
        console.log('Deriving encryption key from password...')
        this.encryptionKey = await this.deriveKey(password)
      } else {
        console.log('No password provided, skipping encryption key setup')
      }

      // Open IndexedDB
      console.log('Opening IndexedDB database...')
      this.db = await this.openDatabase()
      console.log('IndexedDB database opened successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize SecureIndexedDB:', error)
      return false
    }
  }

  /**
   * Derive encryption key from password using PBKDF2
   */
  async deriveKey(password) {
    const encoder = new TextEncoder()
    const salt = new Uint8Array(16) // In production, use random salt per user
    crypto.getRandomValues(salt)

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Open IndexedDB connection
   */
  openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores for different data types
        if (!db.objectStoreNames.contains('recentEntries')) {
          const recentStore = db.createObjectStore('recentEntries', { keyPath: 'id', autoIncrement: true })
          recentStore.createIndex('storageKey', 'storageKey', { unique: false })
          recentStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains('secureData')) {
          const secureStore = db.createObjectStore('secureData', { keyPath: 'id', autoIncrement: true })
          secureStore.createIndex('category', 'category', { unique: false })
        }
      }
    })
  }

  /**
   * Encrypt data using AES-GCM
   */
  async encrypt(data) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized')
    }

    const encoder = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for GCM
    const encodedData = encoder.encode(JSON.stringify(data))

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.encryptionKey,
      encodedData
    )

    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength)
    result.set(iv, 0)
    result.set(new Uint8Array(encrypted), iv.length)

    return Array.from(result) // Convert to regular array for JSON serialization
  }

  /**
   * Decrypt data using AES-GCM
   */
  async decrypt(encryptedArray) {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized')
    }

    const encrypted = new Uint8Array(encryptedArray)
    const iv = encrypted.slice(0, 12)
    const ciphertext = encrypted.slice(12)

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      this.encryptionKey,
      ciphertext
    )

    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(decrypted))
  }

  /**
   * Store recent form entries (non-PII)
   */
  async addRecentEntry(storageKey, entry, maxEntries = 50) {
    console.log('SecureIndexedDB.addRecentEntry called with:', { storageKey, entry, maxEntries })
    
    try {
      // Prepare all async work BEFORE opening the transaction
      const sanitizedEntry = this.sanitizeEntry(entry)
      console.log('Sanitized entry:', sanitizedEntry)
      const hash = await this.generateHash(sanitizedEntry)

      // Open transaction only when ready to issue IDB requests
      const transaction = this.db.transaction(['recentEntries'], 'readwrite')
      const store = transaction.objectStore('recentEntries')

      const record = {
        storageKey,
        data: sanitizedEntry,
        timestamp: new Date().toISOString(),
        hash
      }
      
      console.log('Record to add:', record)

      // Add new record
      await this.promisifyRequest(store.add(record))
      console.log('Record added successfully')

  // Clean up old entries (separate transaction inside method)
  await this.cleanupOldEntries(storageKey, maxEntries)
      console.log('Cleanup completed')

      return true
    } catch (error) {
      console.error('Failed to add recent entry:', error)
      return false
    }
  }

  /**
   * Get recent entries by storage key
   */
  async getRecentEntries(storageKey) {
    console.log('SecureIndexedDB.getRecentEntries called with storageKey:', storageKey)
    
    try {
      const transaction = this.db.transaction(['recentEntries'], 'readonly')
      const store = transaction.objectStore('recentEntries')
      const index = store.index('storageKey')

      const request = index.getAll(storageKey)
      const results = await this.promisifyRequest(request)
      
      console.log('Raw results from IndexedDB:', results)

      // Sort by timestamp descending (most recent first)
      const sortedData = results
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(record => record.data)
        
      console.log('Sorted data to return:', sortedData)
      return sortedData
    } catch (error) {
      console.error('Failed to get recent entries:', error)
      return []
    }
  }

  /**
   * Store encrypted sensitive data
   */
  async storeSecureData(category, data, ttl = null) {
    if (!this.encryptionKey) {
      console.warn('No encryption key available, storing unencrypted')
    }

    try {
      // Prepare encryption BEFORE opening the transaction
      const payload = this.encryptionKey ? await this.encrypt(data) : data

      const transaction = this.db.transaction(['secureData'], 'readwrite')
      const store = transaction.objectStore('secureData')

      const record = {
        category,
        data: payload,
        encrypted: !!this.encryptionKey,
        timestamp: new Date().toISOString(),
        expiresAt: ttl ? new Date(Date.now() + ttl).toISOString() : null
      }

      await this.promisifyRequest(store.add(record))
      return true
    } catch (error) {
      console.error('Failed to store secure data:', error)
      return false
    }
  }

  /**
   * Retrieve encrypted sensitive data
   */
  async getSecureData(category) {
    try {
      const transaction = this.db.transaction(['secureData'], 'readonly')
      const store = transaction.objectStore('secureData')
      const index = store.index('category')

      const request = index.getAll(category)
      const results = await this.promisifyRequest(request)

      const validRecords = []
      const now = new Date()

      for (const record of results) {
        // Check expiration
        if (record.expiresAt && new Date(record.expiresAt) < now) {
          continue
        }

        // Decrypt if needed
        let data = record.data
        if (record.encrypted && this.encryptionKey) {
          try {
            data = await this.decrypt(record.data)
          } catch (error) {
            console.error('Failed to decrypt data:', error)
            continue
          }
        }

        validRecords.push({
          ...record,
          data
        })
      }

      return validRecords
    } catch (error) {
      console.error('Failed to get secure data:', error)
      return []
    }
  }

  /**
   * Store user preferences (non-sensitive)
   */
  async setPreference(key, value) {
    try {
      const transaction = this.db.transaction(['userPreferences'], 'readwrite')
      const store = transaction.objectStore('userPreferences')

      await this.promisifyRequest(store.put({ key, value, timestamp: new Date().toISOString() }))
      return true
    } catch (error) {
      console.error('Failed to set preference:', error)
      return false
    }
  }

  /**
   * Get user preference
   */
  async getPreference(key, defaultValue = null) {
    try {
      const transaction = this.db.transaction(['userPreferences'], 'readonly')
      const store = transaction.objectStore('userPreferences')

      const result = await this.promisifyRequest(store.get(key))
      return result ? result.value : defaultValue
    } catch (error) {
      console.error('Failed to get preference:', error)
      return defaultValue
    }
  }

  /**
   * Clear all data
   */
  async clearAll() {
    try {
      const storeNames = ['recentEntries', 'userPreferences', 'secureData']
      const transaction = this.db.transaction(storeNames, 'readwrite')

      for (const storeName of storeNames) {
        await this.promisifyRequest(transaction.objectStore(storeName).clear())
      }

      return true
    } catch (error) {
      console.error('Failed to clear data:', error)
      return false
    }
  }

  /**
   * Helper methods
   */

  sanitizeEntry(entry) {
    // Remove PII fields
    const piiFields = ['accountNumber', 'customerName', 'ssn', 'email', 'phone', 'address']
    const sanitized = { ...entry }
    
    piiFields.forEach(field => delete sanitized[field])
    
    return {
      ...sanitized,
      timestamp: new Date().toISOString(),
      // Keep only safe metadata
      tableType: entry.selectedTable ? 'table_selected' : 'no_table',
      hasDate: !!entry.selectedDate,
      fieldCount: Object.keys(entry).length
    }
  }

  async generateHash(data) {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(JSON.stringify(data))
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    return Array.from(new Uint8Array(hashBuffer))
  }

  async cleanupOldEntries(storageKey, maxEntries) {
    const tx = this.db.transaction(['recentEntries'], 'readwrite')
    const store = tx.objectStore('recentEntries')
    const index = store.index('storageKey')

    const allEntries = await this.promisifyRequest(index.getAll(storageKey))

    if (allEntries.length > maxEntries) {
      // Sort by timestamp and remove oldest
      const sorted = allEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      const toDelete = sorted.slice(0, allEntries.length - maxEntries)

      for (const entry of toDelete) {
        await this.promisifyRequest(store.delete(entry.id))
      }
    }
    // Let transaction finish naturally
  }

  promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get database usage statistics
   */
  async getStats() {
    try {
      const storeNames = ['recentEntries', 'userPreferences', 'secureData']
      const stats = {}

      for (const storeName of storeNames) {
        const transaction = this.db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const count = await this.promisifyRequest(store.count())
        stats[storeName] = count
      }

      return stats
    } catch (error) {
      console.error('Failed to get stats:', error)
      return {}
    }
  }
}

export default SecureIndexedDB
