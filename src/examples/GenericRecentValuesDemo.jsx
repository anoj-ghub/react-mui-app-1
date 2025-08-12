import React, { useState } from 'react'
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@mui/material'
import { SecureRecentValuesButton } from '../components'
import { presetConfigs, createFieldConfig, createCustomFilter, createStorageKey } from '../utils/recentValuesConfig'

/**
 * Example showing how to use the generic SecureRecentValuesButton
 * on different types of forms and screens
 */
export default function GenericRecentValuesDemo() {
  // Example 1: Simple contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium'
  })
  const [contactSaveFunction, setContactSaveFunction] = useState(null)

  // Example 2: Advanced search form
  const [searchForm, setSearchForm] = useState({
    query: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    includeArchived: false
  })
  const [searchSaveFunction, setSearchSaveFunction] = useState(null)

  // Example 3: Login form
  const [loginForm, setLoginForm] = useState({
    username: '',
    environment: 'development',
    rememberMe: false
  })
  const [loginSaveFunction, setLoginSaveFunction] = useState(null)

  // Contact form configuration
  const contactConfig = createFieldConfig({
    fields: [
      { key: 'name', label: 'Contact Name', minWidth: 150 },
      { key: 'email', label: 'Email Address', minWidth: 200 },
      { key: 'subject', label: 'Subject', minWidth: 180 },
      { key: 'priority', label: 'Priority', minWidth: 100 },
      { key: 'timestamp', label: 'Created', type: 'date', minWidth: 140 }
    ],
    displayFields: [
      { key: 'name', fallback: '(no name)' },
      { key: 'email', fallback: '(no email)' },
      { key: 'subject', fallback: '(no subject)' }
    ],
    emptySubtext: 'Submit a contact form to save your entries.'
  })

  // Advanced search configuration
  const searchConfig = createFieldConfig({
    fields: [
      { key: 'query', label: 'Search Query', minWidth: 200 },
      { key: 'category', label: 'Category', minWidth: 120 },
      { key: 'dateFrom', label: 'From Date', type: 'date', minWidth: 120 },
      { key: 'dateTo', label: 'To Date', type: 'date', minWidth: 120 },
      { key: 'includeArchived', label: 'Include Archived', type: 'boolean', minWidth: 120 }
    ],
    displayFields: [
      { key: 'query', fallback: '(empty query)' },
      { key: 'category', fallback: 'All Categories' },
      { key: 'dateFrom', label: 'From' },
      { key: 'dateTo', label: 'To' }
    ],
    separator: ' | ',
    emptySubtext: 'Perform searches to build your recent queries list.'
  })

  // Custom filter for contact form (only save if name and email are provided)
  const contactFilter = createCustomFilter({
    requiredFields: ['name', 'email'],
    excludeValues: {
      priority: [''] // Don't save entries with empty priority
    }
  })

  // Custom filter for search (only save non-empty queries)
  const searchFilter = createCustomFilter({
    requiredFields: ['query'],
    customLogic: (entry) => entry.query.length >= 3 // At least 3 characters
  })

  // Handle form submissions
  const handleContactSubmit = async () => {
    if (contactSaveFunction) {
      const success = await contactSaveFunction({
        ...contactForm,
        timestamp: new Date().toISOString()
      })
      if (success) {
        console.log('Contact form saved to recent values')
        // Reset form or perform other actions
      }
    }
  }

  const handleSearchSubmit = async () => {
    if (searchSaveFunction) {
      const success = await searchSaveFunction({
        ...searchForm,
        timestamp: new Date().toISOString()
      })
      if (success) {
        console.log('Search saved to recent values')
        // Perform search or other actions
      }
    }
  }

  const handleLoginSubmit = async () => {
    if (loginSaveFunction) {
      const success = await loginSaveFunction({
        ...loginForm,
        timestamp: new Date().toISOString()
      })
      if (success) {
        console.log('Login saved to recent values')
        // Perform login or other actions
      }
    }
  }

  // Handle selection from recent values
  const handleContactSelect = (entry) => {
    setContactForm({
      name: entry.name || '',
      email: entry.email || '',
      subject: entry.subject || '',
      priority: entry.priority || 'medium'
    })
  }

  const handleSearchSelect = (entry) => {
    setSearchForm({
      query: entry.query || '',
      category: entry.category || '',
      dateFrom: entry.dateFrom || '',
      dateTo: entry.dateTo || '',
      includeArchived: entry.includeArchived || false
    })
  }

  const handleLoginSelect = (entry) => {
    setLoginForm({
      username: entry.username || '',
      environment: entry.environment || 'development',
      rememberMe: entry.rememberMe || false
    })
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Generic Recent Values Demo
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Examples showing how to use SecureRecentValuesButton with different form types and configurations.
      </Typography>

      {/* Example 1: Contact Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Contact Form Example</Typography>
          <SecureRecentValuesButton
            storageKey={createStorageKey('demo', 'contact')}
            onSelect={handleContactSelect}
            title="Recent Contact Forms"
            fieldConfig={contactConfig}
            customFilter={contactFilter}
            allowDuplicates={false}
            onSaveEntry={setContactSaveFunction}
            compact={true}
            buttonProps={{ variant: 'outlined', size: 'small' }}
          />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField
            label="Contact Name"
            value={contactForm.name}
            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
          />
          <TextField
            label="Email Address"
            type="email"
            value={contactForm.email}
            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          />
          <TextField
            label="Subject"
            value={contactForm.subject}
            onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
          />
          <FormControl>
            <InputLabel>Priority</InputLabel>
            <Select
              value={contactForm.priority}
              onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button variant="contained" onClick={handleContactSubmit}>
          Submit Contact Form
        </Button>
      </Paper>

      {/* Example 2: Advanced Search */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Advanced Search Example</Typography>
          <SecureRecentValuesButton
            storageKey={createStorageKey('demo', 'search')}
            onSelect={handleSearchSelect}
            title="Recent Searches"
            fieldConfig={searchConfig}
            customFilter={searchFilter}
            maxEntries={25}
            onSaveEntry={setSearchSaveFunction}
            buttonProps={{ variant: 'outlined', size: 'small' }}
          />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 2, mb: 2 }}>
          <TextField
            label="Search Query"
            value={searchForm.query}
            onChange={(e) => setSearchForm({ ...searchForm, query: e.target.value })}
          />
          <FormControl>
            <InputLabel>Category</InputLabel>
            <Select
              value={searchForm.category}
              onChange={(e) => setSearchForm({ ...searchForm, category: e.target.value })}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="documents">Documents</MenuItem>
              <MenuItem value="images">Images</MenuItem>
              <MenuItem value="videos">Videos</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="From Date"
            type="date"
            value={searchForm.dateFrom}
            onChange={(e) => setSearchForm({ ...searchForm, dateFrom: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To Date"
            type="date"
            value={searchForm.dateTo}
            onChange={(e) => setSearchForm({ ...searchForm, dateTo: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        
        <Button variant="contained" onClick={handleSearchSubmit}>
          Perform Search
        </Button>
      </Paper>

      {/* Example 3: Login Form (using preset) */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Login Form Example (Using Preset)</Typography>
          <SecureRecentValuesButton
            storageKey={createStorageKey('demo', 'login')}
            onSelect={handleLoginSelect}
            title="Recent Logins"
            fieldConfig={presetConfigs.loginForm}
            useSecureStorage={true}
            showStorageToggle={true}
            onSaveEntry={setLoginSaveFunction}
            buttonProps={{ variant: 'outlined', size: 'small' }}
          />
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <TextField
            label="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
          />
          <FormControl>
            <InputLabel>Environment</InputLabel>
            <Select
              value={loginForm.environment}
              onChange={(e) => setLoginForm({ ...loginForm, environment: e.target.value })}
            >
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="staging">Staging</MenuItem>
              <MenuItem value="production">Production</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Button variant="contained" onClick={handleLoginSubmit}>
          Login
        </Button>
      </Paper>
    </Box>
  )
}
