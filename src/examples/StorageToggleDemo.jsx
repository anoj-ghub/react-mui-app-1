/**
 * Complete example showing different ways to toggle between localStorage and IndexedDB
 */

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Alert,
  Divider
} from '@mui/material'
import { SecureRecentValuesButton } from '../components'
import StorageToggle from '../components/StorageToggle/StorageToggle'
import { useSecureStorage } from '../hooks/useSecureStorage'
import { addRecentValue, getRecentValues } from '../utils/recentValuesStorage'

export default function StorageToggleDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: ''
  })
  const [storageMode, setStorageMode] = useState(false) // false = localStorage, true = IndexedDB
  const [entries, setEntries] = useState([])

  // IndexedDB hook
  const { 
    isReady, 
    addRecentEntry, 
    getRecentEntries 
  } = useSecureStorage('ToggleDemo')

  // Handle storage mode change
  const handleStorageModeChange = (useSecure) => {
    setStorageMode(useSecure)
    console.log(`Switched to ${useSecure ? 'IndexedDB' : 'localStorage'}`)
    loadEntries(useSecure)
  }

  // Load entries based on current storage mode
  const loadEntries = async (useSecure = storageMode) => {
    try {
      if (useSecure) {
        const secureEntries = await getRecentEntries('demo.form')
        setEntries(secureEntries)
      } else {
        const localEntries = getRecentValues('demo.form')
        setEntries(localEntries)
      }
    } catch (error) {
      console.error('Failed to load entries:', error)
    }
  }

  // Save entry to current storage
  const saveEntry = async () => {
    if (!formData.name) return

    const entry = {
      ...formData,
      timestamp: new Date().toISOString()
    }

    try {
      if (storageMode) {
        // Save to IndexedDB
        await addRecentEntry('demo.form', entry)
      } else {
        // Save to localStorage
        addRecentValue('demo.form', entry)
      }
      
      await loadEntries()
      alert(`Entry saved to ${storageMode ? 'IndexedDB' : 'localStorage'}!`)
    } catch (error) {
      console.error('Failed to save entry:', error)
    }
  }

  // Handle form submit
  const handleSubmit = () => {
    saveEntry()
  }

  // Handle recent entry selection
  const handleRecentSelect = (entry) => {
    setFormData({
      name: entry.name || '',
      email: entry.email || '',
      category: entry.category || ''
    })
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Storage Toggle Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This demo shows different ways to toggle between localStorage and IndexedDB storage.
        Try switching modes and saving entries to see the difference.
      </Alert>

      <Grid container spacing={3}>
        {/* Method 1: Global Storage Toggle */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Method 1: Global Storage Toggle
              </Typography>
              
              <StorageToggle
                onStorageChange={handleStorageModeChange}
                defaultSecure={storageMode}
                showLabels={true}
              />

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current Mode: <strong>{storageMode ? 'IndexedDB (Secure)' : 'localStorage (Standard)'}</strong>
              </Typography>

              {/* Demo Form */}
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!formData.name}
                sx={{ mb: 1 }}
              >
                Save to {storageMode ? 'IndexedDB' : 'localStorage'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => loadEntries()}
                size="small"
              >
                Refresh Entries ({entries.length})
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Method 2: Component-Level Toggle */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Method 2: Component-Level Toggle
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The SecureRecentValuesButton has its own built-in toggle.
              </Typography>

              <SecureRecentValuesButton
                storageKey="demo.form"
                onSelect={handleRecentSelect}
                title="Recent Form Entries"
                useSecureStorage={false}
                showStorageToggle={true}
                buttonProps={{ 
                  fullWidth: true, 
                  variant: 'outlined',
                  sx: { mb: 2 }
                }}
              />

              <Alert severity="success" sx={{ fontSize: '0.8rem' }}>
                This button includes its own toggle switch inside the dialog.
                Users can switch between storage modes without affecting other components.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Method 3: Programmatic Toggle */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Method 3: Programmatic Toggle (Code Examples)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    localStorage Approach:
                  </Typography>
                  <Box 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'grey.100', 
                      p: 1, 
                      borderRadius: 1,
                      overflow: 'auto'
                    }}
                  >
{`// Save to localStorage
import { addRecentValue } from './utils/recentValuesStorage'

addRecentValue('myKey', data)

// Load from localStorage
import { getRecentValues } from './utils/recentValuesStorage'

const entries = getRecentValues('myKey')`}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    IndexedDB Approach:
                  </Typography>
                  <Box 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'grey.100', 
                      p: 1, 
                      borderRadius: 1,
                      overflow: 'auto'
                    }}
                  >
{`// Save to IndexedDB
const { addRecentEntry } = useSecureStorage()

await addRecentEntry('myKey', data)

// Load from IndexedDB
const { getRecentEntries } = useSecureStorage()

const entries = await getRecentEntries('myKey')`}
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dynamic Toggle:
                  </Typography>
                  <Box 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: 'grey.100', 
                      p: 1, 
                      borderRadius: 1,
                      overflow: 'auto'
                    }}
                  >
{`// Conditional storage
if (useSecureStorage) {
  await addRecentEntry(key, data)
} else {
  addRecentValue(key, data)
}

// Load conditionally
const entries = useSecureStorage 
  ? await getRecentEntries(key)
  : getRecentValues(key)`}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Display */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Current Storage Status
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                <strong>Active Mode:</strong> {storageMode ? 'IndexedDB (Secure)' : 'localStorage (Standard)'}
              </Typography>
              <Typography variant="body2">
                <strong>IndexedDB Ready:</strong> {isReady ? '✅ Yes' : '❌ No'}
              </Typography>
              <Typography variant="body2">
                <strong>Loaded Entries:</strong> {entries.length}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">
                Recent entries preview:
              </Typography>
              <Box sx={{ maxHeight: 100, overflow: 'auto', mt: 1 }}>
                {entries.length === 0 ? (
                  <Typography variant="caption">No entries yet</Typography>
                ) : (
                  entries.slice(0, 3).map((entry, idx) => (
                    <Typography key={idx} variant="caption" display="block">
                      {entry.name} - {entry.category}
                    </Typography>
                  ))
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
