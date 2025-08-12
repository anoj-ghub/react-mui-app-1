/**
 * @fileoverview Account search panel component with filters and recent values
 * @author System
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Divider
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import RefreshIcon from '@mui/icons-material/Refresh'
import { SecureRecentValuesButton } from '../../components'
import { presetConfigs, createStorageKey } from '../../utils/recentValuesConfig'

/**
 * Account search panel component for filtering account data
 * 
 * Features:
 * - Account number search
 * - Environment selection
 * - Date filtering
 * - Recent values storage and selection
 * - Clear and refresh functionality
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.accountNumber - Current account number
 * @param {Function} props.setAccountNumber - Function to update account number
 * @param {string} props.environment - Current environment
 * @param {Function} props.setEnvironment - Function to update environment
 * @param {string} props.date - Current date filter
 * @param {Function} props.setDate - Function to update date filter
 * @param {Function} props.onSearch - Function to trigger search
 * @param {Function} props.onClear - Function to clear filters
 * @param {Function} props.onRefresh - Function to refresh data
 * @param {boolean} props.darkMode - Dark mode state
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} Account search panel
 */
function AccountSearchPanel({
  accountNumber,
  setAccountNumber,
  environment,
  setEnvironment,
  date,
  setDate,
  onSearch,
  onClear,
  onRefresh,
  darkMode,
  loading
}) {
  // State for save function and storage toggle
  const [saveEntryFunction, setSaveEntryFunction] = useState(null)
  const [useSecureStorage, setUseSecureStorage] = useState(false)

  // Predefined date options
  const dateOptions = [
    { value: '', label: 'All Dates' },
    { value: '2025-08-11', label: 'Today (2025-08-11)' },
    { value: '2025-08-10', label: 'Yesterday (2025-08-10)' },
    { value: '2025-08-09', label: '2025-08-09' },
    { value: '2025-08-08', label: '2025-08-08' },
    { value: '2025-08-07', label: '2025-08-07' },
    { value: '2025-08-04', label: 'Last Week (2025-08-04)' },
    { value: '2025-07-28', label: '2 Weeks Ago (2025-07-28)' },
    { value: '2025-08-01', label: 'Month Start (2025-08-01)' },
    { value: '2025-07-11', label: 'Last Month (2025-07-11)' },
    { value: '2025-07-01', label: 'Quarter Start (2025-07-01)' },
    { value: '2025-01-01', label: 'Year Start (2025-01-01)' },
    { value: '2024-12-31', label: 'Last Year End (2024-12-31)' },
    { value: '2024-08-11', label: 'Same Date Last Year (2024-08-11)' }
  ]

  // Environment options
  const environmentOptions = [
    { value: 'Development', label: 'Development' },
    { value: 'Pre-prod', label: 'Pre-prod' },
    { value: 'Production', label: 'Production' }
  ]

  // Handle form submission with recent values save
  const handleSearchWithSave = async () => {
    const searchData = {
      accountNumber,
      environment,
      date,
      timestamp: new Date().toISOString()
    }

    // Save to recent values if save function is available
    if (saveEntryFunction) {
      try {
        await saveEntryFunction(searchData)
        console.log('Account search saved to recent values')
      } catch (error) {
        console.error('Failed to save search to recent values:', error)
      }
    }

    // Trigger the search
    onSearch?.()
  }

  // Handle selection from recent values
  const handleRecentSelect = (entry) => {
    if (!entry) return
    
    // Autofill form with recent values
    if (entry.accountNumber !== undefined) setAccountNumber(entry.accountNumber)
    if (entry.environment !== undefined) setEnvironment(entry.environment)
    if (entry.date !== undefined) setDate(entry.date)
  }

  // Handle storage mode change
  const handleStorageModeChange = (useSecure) => {
    setUseSecureStorage(useSecure)
    console.log(`Account search storage mode: ${useSecure ? 'IndexedDB' : 'localStorage'}`)
  }

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        background: darkMode
          ? 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(60,60,60,0.9) 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SearchIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Account Search & Filters
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="center">
          {/* Account Number Input */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter account number"
              disabled={loading}
            />
          </Grid>

          {/* Environment Selection */}
          <Grid item xs={12} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Environment</InputLabel>
              <Select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                label="Environment"
                disabled={loading}
              >
                {environmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Selection */}
          <Grid item xs={12} md={2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Filter</InputLabel>
              <Select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                label="Date Filter"
                disabled={loading}
              >
                {dateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleSearchWithSave}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{ minWidth: 80 }}
              >
                Search
              </Button>
              <IconButton
                size="small"
                onClick={onClear}
                disabled={loading}
                title="Clear filters"
              >
                <ClearIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={onRefresh}
                disabled={loading}
                title="Refresh data"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Recent Values Button */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SecureRecentValuesButton
                storageKey={createStorageKey('accountInquiry', 'search')}
                onSelect={handleRecentSelect}
                title="Recent Account Searches"
                fieldConfig={presetConfigs.accountInquiry}
                useSecureStorage={useSecureStorage}
                showStorageToggle={true}
                onStorageModeChange={handleStorageModeChange}
                onSaveEntry={(fn) => {
                  if (typeof fn === 'function') {
                    setSaveEntryFunction(() => fn)
                  } else {
                    console.warn('onSaveEntry received non-function:', fn)
                    setSaveEntryFunction(null)
                  }
                }}
                compact={true}
                buttonProps={{
                  size: 'small',
                  variant: 'outlined',
                  sx: {
                    minWidth: 90,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AccountSearchPanel
