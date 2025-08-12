/**
 * Demo component showing IndexedDB usage patterns
 * This demonstrates various security scenarios and best practices
 */

import React, { useState } from 'react'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  Alert,
  Divider,
  Chip,
  Grid
} from '@mui/material'
import { useSecureStorage } from '../hooks/useSecureStorage'
import SecureRecentValuesButton from '../components/RecentValuesButton/SecureRecentValuesButton'

export default function IndexedDBDemo() {
  const [demoData, setDemoData] = useState({
    username: '',
    email: '',
    preferences: ''
  })
  const [password, setPassword] = useState('')
  const [stats, setStats] = useState(null)

  // Initialize secure storage with optional password
  const {
    isReady,
    error,
    storeSecureData,
    getSecureData,
    setPreference,
    getPreference,
    clearAll,
    getStats
  } = useSecureStorage('DemoApp', password)

  // Demo functions
  const handleStoreSecureData = async () => {
    if (!demoData.username) return
    
    const piiData = {
      username: demoData.username,
      email: demoData.email,
      sensitiveInfo: 'This would be encrypted',
      timestamp: new Date().toISOString()
    }

    const success = await storeSecureData('userPII', piiData, 1000 * 60 * 60) // 1 hour TTL
    if (success) {
      alert('Secure data stored successfully!')
    }
  }

  const handleGetSecureData = async () => {
    const data = await getSecureData('userPII')
    console.log('Retrieved secure data:', data)
    alert(`Retrieved ${data.length} secure records. Check console for details.`)
  }

  const handleStorePreference = async () => {
    if (!demoData.preferences) return
    
    const success = await setPreference('userTheme', demoData.preferences)
    if (success) {
      alert('Preference stored!')
    }
  }

  const handleGetPreference = async () => {
    const pref = await getPreference('userTheme', 'default')
    alert(`User preference: ${pref}`)
  }

  const handleGetStats = async () => {
    const dbStats = await getStats()
    setStats(dbStats)
  }

  const recentFormSubmit = (formData) => {
    // This would be called when form is submitted
    console.log('Form submitted:', formData)
  }

  const recentFormSelect = (entry) => {
    // This would populate form fields
    console.log('Selected recent entry:', entry)
    setDemoData(prev => ({ ...prev, ...entry }))
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        IndexedDB Security Demo
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This demonstrates secure client-side storage using IndexedDB with optional encryption.
        Data is stored locally but can be encrypted if a password is provided.
      </Alert>

      <Grid container spacing={3}>
        {/* Connection Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connection Status
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip 
                  label={isReady ? 'Connected' : 'Connecting...'} 
                  color={isReady ? 'success' : 'default'} 
                  size="small"
                />
                {password && (
                  <Chip 
                    label="🔒 Encrypted" 
                    color="success" 
                    size="small"
                  />
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Encryption Password (optional)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Leave empty for unencrypted storage"
                size="small"
                sx={{ mb: 2 }}
              />

              <Button 
                fullWidth 
                variant="outlined" 
                onClick={handleGetStats}
                disabled={!isReady}
              >
                Get Storage Stats
              </Button>

              {stats && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block">
                    Recent Entries: {stats.recentEntries || 0}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Preferences: {stats.userPreferences || 0}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Secure Data: {stats.secureData || 0}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Demo Form */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demo Form with Recent Values
              </Typography>

              <TextField
                fullWidth
                label="Username"
                value={demoData.username}
                onChange={(e) => setDemoData(prev => ({ ...prev, username: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <TextField
                fullWidth
                label="Email"
                value={demoData.email}
                onChange={(e) => setDemoData(prev => ({ ...prev, email: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <TextField
                fullWidth
                label="Preferences"
                value={demoData.preferences}
                onChange={(e) => setDemoData(prev => ({ ...prev, preferences: e.target.value }))}
                sx={{ mb: 2 }}
                size="small"
              />

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <SecureRecentValuesButton
                  storageKey="demo.form"
                  onSelect={recentFormSelect}
                  title="Recent Form Entries"
                  useSecureStorage={true}
                  showStorageToggle={true}
                  buttonProps={{ size: 'small', fullWidth: true }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={() => recentFormSubmit(demoData)}
                disabled={!demoData.username}
              >
                Submit Form
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Operations */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Operations
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Test encrypted storage operations
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleStoreSecureData}
                disabled={!isReady || !demoData.username}
                sx={{ mb: 1 }}
              >
                Store Encrypted PII
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGetSecureData}
                disabled={!isReady}
                sx={{ mb: 1 }}
              >
                Retrieve Encrypted Data
              </Button>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                onClick={handleStorePreference}
                disabled={!isReady || !demoData.preferences}
                sx={{ mb: 1 }}
              >
                Store Preference
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGetPreference}
                disabled={!isReady}
                sx={{ mb: 1 }}
              >
                Get Preference
              </Button>

              <Divider sx={{ my: 2 }} />

              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={clearAll}
                disabled={!isReady}
              >
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Information Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            IndexedDB Security Features
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                ✅ Security Benefits:
              </Typography>
              <ul style={{ fontSize: '0.9rem', margin: 0 }}>
                <li>Same-origin policy protection</li>
                <li>Optional AES-GCM encryption</li>
                <li>Structured data support</li>
                <li>Automatic data expiration (TTL)</li>
                <li>Transaction-based operations</li>
                <li>Much larger storage capacity</li>
                <li>PII data sanitization</li>
              </ul>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                ⚠️ Considerations:
              </Typography>
              <ul style={{ fontSize: '0.9rem', margin: 0 }}>
                <li>Still vulnerable to XSS if not encrypted</li>
                <li>Encryption key management is critical</li>
                <li>More complex than localStorage</li>
                <li>Requires modern browser support</li>
                <li>Still client-side storage limitations</li>
                <li>Key derivation adds initial delay</li>
              </ul>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Production Recommendation:</strong> For truly sensitive PII data, use server-side sessions with 
            secure backend storage. IndexedDB with encryption is best for reducing localStorage vulnerabilities 
            while maintaining offline capability.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  )
}
