import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material'
import { SecureRecentValuesButton } from '../components'

export default function IndexedDBTest() {
  const [testValue, setTestValue] = useState('')
  const [saveFunction, setSaveFunction] = useState(null)
  const [browserSupport, setBrowserSupport] = useState(null)

  // Debug saveFunction changes
  useEffect(() => {
    console.log('SaveFunction changed:', saveFunction, 'type:', typeof saveFunction)
    if (saveFunction && typeof saveFunction !== 'function') {
      console.error('PROBLEM: saveFunction is not a function!', saveFunction)
    }
  }, [saveFunction])

  // Simple test function to verify our callback works
  const testCallback = useCallback((func) => {
    console.log('testCallback received:', func, 'type:', typeof func)
    if (typeof func === 'function') {
      console.log('Setting function correctly (using functional setter)')
      // Important: wrap to store the function value, not treat as updater
      setSaveFunction(() => func)
    } else {
      console.error('testCallback received non-function:', func)
    }
  }, [])

  // Removed direct setSaveFunction test that set a Promise by mistake

  // Check browser support on mount
  useEffect(() => {
    const checkSupport = () => {
      const support = {
        indexedDB: !!window.indexedDB,
        webCrypto: !!window.crypto && !!window.crypto.subtle,
        localStorage: !!window.localStorage
      }
      setBrowserSupport(support)
      console.log('Browser support check:', support)
    }
    checkSupport()
  }, [])

  const handleSave = async () => {
    console.log('handleSave called, saveFunction:', saveFunction, 'type:', typeof saveFunction)
    
    // Check if saveFunction is actually a function
    if (typeof saveFunction !== 'function') {
      console.error('saveFunction is not a function:', saveFunction)
      return
    }
    
    if (saveFunction && testValue.trim()) {
      console.log('Test: Calling save function with:', testValue)
      try {
        const result = await saveFunction({ testData: testValue, timestamp: new Date().toISOString() })
        console.log('Test: Save result:', result)
        setTestValue('')
      } catch (error) {
        console.error('Error calling save function:', error)
      }
    } else {
      console.warn('Cannot save - saveFunction:', saveFunction, 'testValue:', testValue)
    }
  }

  const handleSelect = (item) => {
    console.log('Test: Selected item:', item)
    setTestValue(item.testData || '')
  }

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        IndexedDB Storage Test
      </Typography>
      
      {/* Browser Support Status */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Browser Support:
        </Typography>
        {browserSupport && (
          <Box>
            <Alert severity={browserSupport.indexedDB ? 'success' : 'error'} sx={{ mb: 1 }}>
              IndexedDB: {browserSupport.indexedDB ? 'Supported' : 'Not Supported'}
            </Alert>
            <Alert severity={browserSupport.webCrypto ? 'success' : 'error'} sx={{ mb: 1 }}>
              Web Crypto API: {browserSupport.webCrypto ? 'Supported' : 'Not Supported'}
            </Alert>
            <Alert severity={browserSupport.localStorage ? 'success' : 'error'} sx={{ mb: 1 }}>
              localStorage: {browserSupport.localStorage ? 'Supported' : 'Not Supported'}
            </Alert>
          </Box>
        )}
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Test Value"
          value={testValue}
          onChange={(e) => setTestValue(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={!testValue.trim() || !saveFunction}
          sx={{ mt: 1 }}
        >
          Save Test Value
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Recent Values (with Storage Toggle):
        </Typography>
        <SecureRecentValuesButton
          storageKey="test-indexeddb"
          onSelect={handleSelect}
          useSecureStorage={false} // Start with localStorage
          showStorageToggle={true}
          onSaveEntry={testCallback} // Use testCallback to debug
          title="Test Recent Values"
        />
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Instructions:
          <br />
          1. Check browser support status above
          <br />
          2. Enter a test value and click "Save Test Value"
          <br />
          3. Toggle the storage mode in the Recent Values button
          <br />
          4. Save more values and check console for debugging
          <br />
          5. Open browser DevTools → Application → Storage to see IndexedDB
        </Typography>
      </Box>
    </Paper>
  )
}
