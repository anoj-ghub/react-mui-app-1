/**
 * @fileoverview Enable/Disable Regions management component
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'

/**
 * Mock data for 15 countries with different statuses
 */
const mockRegions = [
  { code: 'US', name: 'United States', status: 'enabled', continent: 'North America' },
  { code: 'CA', name: 'Canada', status: 'enabled', continent: 'North America' },
  { code: 'MX', name: 'Mexico', status: 'disabled', continent: 'North America' },
  { code: 'GB', name: 'United Kingdom', status: 'enabled', continent: 'Europe' },
  { code: 'DE', name: 'Germany', status: 'enabled', continent: 'Europe' },
  { code: 'FR', name: 'France', status: 'enabled', continent: 'Europe' },
  { code: 'IT', name: 'Italy', status: 'disabled', continent: 'Europe' },
  { code: 'ES', name: 'Spain', status: 'enabled', continent: 'Europe' },
  { code: 'JP', name: 'Japan', status: 'enabled', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', status: 'disabled', continent: 'Asia' },
  { code: 'CN', name: 'China', status: 'disabled', continent: 'Asia' },
  { code: 'IN', name: 'India', status: 'enabled', continent: 'Asia' },
  { code: 'AU', name: 'Australia', status: 'enabled', continent: 'Oceania' },
  { code: 'BR', name: 'Brazil', status: 'disabled', continent: 'South America' },
  { code: 'ZA', name: 'South Africa', status: 'enabled', continent: 'Africa' }
]

/**
 * Enable/Disable Regions component for managing regional access
 * 
 * Features:
 * - 15 countries with enable/disable radio buttons
 * - Message fields for each region
 * - Bulk actions for all regions
 * - Visual status indicators
 * - Grouped by continent
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current theme mode
 * @param {string} props.environment - Current environment (Development/Pre-prod/Production)
 * @returns {JSX.Element} Enable/Disable Regions form
 */
function EnableDisableRegions({ darkMode = false, environment = 'Development' }) {
  const [regions, setRegions] = useState(mockRegions)
  const [committedRegions, setCommittedRegions] = useState(mockRegions) // Track the last committed state
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Log when component receives new environment prop
  useEffect(() => {
    console.log('EnableDisableRegions received environment prop:', environment)
  }, [environment])

  /**
   * Generate status message for a region based on its current state
   */
  const getRegionStatusMessage = (region) => {
    const committedRegion = committedRegions.find(r => r.code === region.code)
    
    if (region.status === committedRegion?.status) {
      return `${region.name} is currently ${region.status === 'enabled' ? 'active' : 'inactive'} - no changes pending`
    } else {
      const action = region.status === 'enabled' ? 'activation' : 'deactivation'
      return `${region.name} marked for ${action} - changes will be applied on submit`
    }
  }

  /**
   * Handle status change for a specific region
   */
  const handleStatusChange = (regionCode, newStatus) => {
    setRegions(prev => prev.map(region => 
      region.code === regionCode 
        ? { ...region, status: newStatus }
        : region
    ))
  }

  /**
   * Enable all regions
   */
  const handleEnableAll = () => {
    setRegions(prev => prev.map(region => ({ ...region, status: 'enabled' })))
  }

  /**
   * Disable all regions
   */
  const handleDisableAll = () => {
    setRegions(prev => prev.map(region => ({ ...region, status: 'disabled' })))
  }

  /**
   * Reset all regions to original state
   */
  const handleResetAll = () => {
    setRegions(mockRegions)
    setCommittedRegions(mockRegions)
  }

  /**
   * Submit changes
   */
  const handleSubmit = async () => {
    // Check if we're in Production environment and need confirmation
    if (environment === 'Production') {
      setShowConfirmDialog(true)
      return
    }
    
    await performSubmit()
  }

  /**
   * Perform the actual submit operation
   */
  const performSubmit = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      // Identify regions that have actually changed
      const changedRegions = regions.filter(region => {
        const committedRegion = committedRegions.find(cr => cr.code === region.code)
        return region.status !== committedRegion?.status
      })
      
      // If no changes, show appropriate message
      if (changedRegions.length === 0) {
        setSubmitMessage('No changes detected. All regions are already in their current state.')
        setIsSubmitting(false)
        return
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Count the changes by action type and get country names
      const enabledRegions = changedRegions.filter(r => r.status === 'enabled')
      const disabledRegions = changedRegions.filter(r => r.status === 'disabled')
      
      // Update the committed state to reflect the successful submission
      setCommittedRegions([...regions])
      
      // Create detailed success message with country names
      const changesSummary = []
      if (enabledRegions.length > 0) {
        const countryNames = enabledRegions.map(r => r.name).join(', ')
        changesSummary.push(`Enabled: ${countryNames}`)
      }
      if (disabledRegions.length > 0) {
        const countryNames = disabledRegions.map(r => r.name).join(', ')
        changesSummary.push(`Disabled: ${countryNames}`)
      }
      
      setSubmitMessage(`Successfully updated ${changedRegions.length} region${changedRegions.length > 1 ? 's' : ''}. ${changesSummary.join(' | ')}`)
    } catch (error) {
      setSubmitMessage('Error updating region settings. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group regions by continent
  const regionsByContinent = regions.reduce((acc, region) => {
    if (!acc[region.continent]) {
      acc[region.continent] = []
    }
    acc[region.continent].push(region)
    return acc
  }, {})

  const enabledCount = regions.filter(r => r.status === 'enabled').length
  const disabledCount = regions.filter(r => r.status === 'disabled').length
  
  // Calculate regions that have changed from their committed state
  const changedRegionsCount = regions.filter(region => {
    const committedRegion = committedRegions.find(cr => cr.code === region.code)
    return region.status !== committedRegion?.status
  }).length

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Statistics */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PublicIcon sx={{ color: darkMode ? '#90caf9' : '#1976d2' }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Regional Access Management
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 600 }}>
                {enabledCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enabled Regions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 600 }}>
                {disabledCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disabled Regions
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 600 }}>
                {changedRegionsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Changes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: darkMode ? '#90caf9' : '#1976d2', fontWeight: 600 }}>
                {regions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Regions
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Actions */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* Left side - Bulk action buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleEnableAll}
              disabled={isSubmitting}
            >
              Enable All Regions
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDisableAll}
              disabled={isSubmitting}
            >
              Disable All Regions
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetAll}
              disabled={isSubmitting}
            >
              Reset All Changes
            </Button>
          </Box>
          
          {/* Right side - Submit button */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting || changedRegionsCount === 0}
              sx={{ minWidth: 150 }}
            >
              Submit Changes
            </Button>
          </Box>
        </Box>
        
        {/* Loading Progress */}
        {isSubmitting && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Updating regional settings...
            </Typography>
          </Box>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <Alert 
            severity={submitMessage.includes('Error') ? 'error' : 'success'}
            sx={{ mt: 2 }}
          >
            {submitMessage}
          </Alert>
        )}
      </Box>

      {/* Regions by Continent */}
      {Object.entries(regionsByContinent).map(([continent, continentRegions]) => (
        <Card 
          key={continent}
          elevation={1}
          sx={{ 
            mb: 3,
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: 2
          }}
        >
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: darkMode ? '#90caf9' : '#1976d2',
                fontWeight: 500,
                borderBottom: `2px solid ${darkMode ? '#90caf9' : '#1976d2'}`,
                pb: 1,
                mb: 2
              }}
            >
              {continent}
            </Typography>
            
            <Grid container spacing={3}>
              {continentRegions.map((region) => (
                <Grid item xs={12} lg={6} key={region.code}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      border: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
                      borderRadius: 2,
                      backgroundColor: darkMode ? '#1e1e1e' : '#fafafa'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          backgroundColor: region.status === 'enabled' ? '#4caf50' : '#f44336',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {region.code}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {region.name}
                        </Typography>
                        <Chip
                          icon={region.status === 'enabled' ? <CheckCircleIcon /> : <CancelIcon />}
                          label={region.status === 'enabled' ? 'Enabled' : 'Disabled'}
                          color={region.status === 'enabled' ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            row
                            value={region.status}
                            onChange={(e) => handleStatusChange(region.code, e.target.value)}
                          >
                            <FormControlLabel 
                              value="enabled" 
                              control={<Radio color="success" size="small" />} 
                              label="Enable"
                              sx={{ 
                                '& .MuiFormControlLabel-label': { 
                                  fontSize: '0.875rem' 
                                }
                              }}
                            />
                            <FormControlLabel 
                              value="disabled" 
                              control={<Radio color="error" size="small" />} 
                              label="Disable" 
                              sx={{ 
                                '& .MuiFormControlLabel-label': { 
                                  fontSize: '0.875rem' 
                                }
                              }}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* Status Display Field */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: darkMode ? '#2a2a2a' : '#f5f5f5',
                        border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500,
                          color: darkMode ? '#fff' : '#333',
                          fontSize: '0.875rem'
                        }}
                      >
                        {getRegionStatusMessage(region)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* Production Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          ⚠️ Production Environment Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to submit changes to the <strong>Production</strong> environment. 
            This will affect live regional access settings and could impact active users.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 500 }}>
            Are you sure you want to proceed with these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowConfirmDialog(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={performSubmit}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EnableDisableRegions
