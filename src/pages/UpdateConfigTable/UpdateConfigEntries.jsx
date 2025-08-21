/**
 * @fileoverview Update Config Entries component with 30-field form
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  Divider,
  Alert,
  Paper,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import ClearIcon from '@mui/icons-material/Clear'
import SettingsIcon from '@mui/icons-material/Settings'

/**
 * Initial configuration data with 30 fields of various types
 */
const defaultConfigData = {
  // System Settings
  appName: 'Data Management System',
  version: '2.1.4',
  environment: 'production',
  debugMode: false,
  logLevel: 'info',
  
  // Database Configuration
  dbHost: 'db-cluster-prod.example.com',
  dbPort: 5432,
  dbName: 'main_database',
  dbTimeout: 30,
  maxConnections: 100,
  connectionPoolSize: 20,
  
  // API Settings
  apiBaseUrl: 'https://api.example.com',
  apiVersion: 'v2',
  rateLimitPerMinute: 1000,
  apiTimeout: 5000,
  enableApiLogging: true,
  
  // Security Configuration
  tokenExpiration: 3600,
  maxLoginAttempts: 5,
  sessionTimeout: 1800,
  encryptionLevel: 'AES256',
  enableTwoFactor: true,
  
  // Business Logic
  defaultCurrency: 'USD',
  businessStartDate: '2024-01-01',
  businessHoursStart: '09:00',
  businessHoursEnd: '17:00',
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  
  // Performance Tuning
  cacheSize: 512,
  cacheTtl: 3600,
  batchSize: 1000,
  compressionLevel: 6
}

/**
 * Field configuration for form rendering
 */
const fieldConfig = [
  {
    section: 'System Configuration',
    fields: [
      { key: 'appName', label: 'Application Name', type: 'text', required: true },
      { key: 'version', label: 'Version', type: 'text', required: true },
      { key: 'environment', label: 'Environment', type: 'select', options: ['development', 'staging', 'production'], required: true },
      { key: 'debugMode', label: 'Debug Mode', type: 'switch' },
      { key: 'logLevel', label: 'Log Level', type: 'select', options: ['debug', 'info', 'warn', 'error'] }
    ]
  },
  {
    section: 'Database Settings',
    fields: [
      { key: 'dbHost', label: 'Database Host', type: 'text', required: true },
      { key: 'dbPort', label: 'Database Port', type: 'number', min: 1, max: 65535 },
      { key: 'dbName', label: 'Database Name', type: 'text', required: true },
      { key: 'dbTimeout', label: 'Connection Timeout (seconds)', type: 'slider', min: 5, max: 300 },
      { key: 'maxConnections', label: 'Max Connections', type: 'number', min: 1, max: 1000 },
      { key: 'connectionPoolSize', label: 'Connection Pool Size', type: 'number', min: 1, max: 100 }
    ]
  },
  {
    section: 'API Configuration',
    fields: [
      { key: 'apiBaseUrl', label: 'API Base URL', type: 'url', required: true },
      { key: 'apiVersion', label: 'API Version', type: 'select', options: ['v1', 'v2', 'v3'] },
      { key: 'rateLimitPerMinute', label: 'Rate Limit (per minute)', type: 'number', min: 1, max: 10000 },
      { key: 'apiTimeout', label: 'API Timeout (ms)', type: 'number', min: 1000, max: 60000 },
      { key: 'enableApiLogging', label: 'Enable API Logging', type: 'switch' }
    ]
  },
  {
    section: 'Security Settings',
    fields: [
      { key: 'tokenExpiration', label: 'Token Expiration (seconds)', type: 'number', min: 300, max: 86400 },
      { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', min: 1, max: 10 },
      { key: 'sessionTimeout', label: 'Session Timeout (seconds)', type: 'number', min: 300, max: 7200 },
      { key: 'encryptionLevel', label: 'Encryption Level', type: 'radio', options: ['AES128', 'AES256', 'RSA2048'] },
      { key: 'enableTwoFactor', label: 'Enable Two-Factor Authentication', type: 'switch' }
    ]
  },
  {
    section: 'Business Configuration',
    fields: [
      { key: 'defaultCurrency', label: 'Default Currency', type: 'select', options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'] },
      { key: 'businessStartDate', label: 'Business Start Date', type: 'date' },
      { key: 'businessHoursStart', label: 'Business Hours Start', type: 'time' },
      { key: 'businessHoursEnd', label: 'Business Hours End', type: 'time' },
      { key: 'workingDays', label: 'Working Days', type: 'checkbox-group', options: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] }
    ]
  },
  {
    section: 'Performance Tuning',
    fields: [
      { key: 'cacheSize', label: 'Cache Size (MB)', type: 'slider', min: 64, max: 2048 },
      { key: 'cacheTtl', label: 'Cache TTL (seconds)', type: 'number', min: 60, max: 86400 },
      { key: 'batchSize', label: 'Batch Size', type: 'number', min: 100, max: 10000 },
      { key: 'compressionLevel', label: 'Compression Level', type: 'slider', min: 0, max: 9 }
    ]
  }
]

/**
 * Update Config Entries component with 30 configurable fields
 * 
 * Features:
 * - 30 configuration fields with various input types
 * - Simple grid-based form layout
 * - Form validation and error handling
 * - Save and clear functionality
 * - Modern responsive design
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current theme mode
 * @returns {JSX.Element} Update Config Entries form
 */
function UpdateConfigEntries({ darkMode = false, environment = 'Development' }) {
  const [config, setConfig] = useState(defaultConfigData)
  const [initialConfig, setInitialConfig] = useState(defaultConfigData)
  const [errors, setErrors] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Log when component receives new environment prop
  useEffect(() => {
    console.log('UpdateConfigEntries received environment prop:', environment)
  }, [environment])

  /**
   * Handle field value changes
   */
  const handleFieldChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => ({
        ...prev,
        [key]: null
      }))
    }
  }

  /**
   * Validate form fields
   */
  const validateForm = () => {
    const newErrors = {}
    
    fieldConfig.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && !config[field.key]) {
          newErrors[field.key] = `${field.label} is required`
        }
        
        if (field.type === 'number' && config[field.key]) {
          const value = Number(config[field.key])
          if (field.min && value < field.min) {
            newErrors[field.key] = `${field.label} must be at least ${field.min}`
          }
          if (field.max && value > field.max) {
            newErrors[field.key] = `${field.label} must be at most ${field.max}`
          }
        }
        
        if (field.type === 'url' && config[field.key]) {
          try {
            new URL(config[field.key])
          } catch {
            newErrors[field.key] = `${field.label} must be a valid URL`
          }
        }
      })
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Submit configuration changes
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitMessage('Please fix the validation errors before submitting.')
      return
    }
    
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const changedFields = Object.keys(config).filter(key => 
        config[key] !== initialConfig[key]
      ).length
      
      setSubmitMessage(`Successfully updated ${changedFields} configuration settings.`)
      
      // Update the initial config to reflect the saved state
      // This removes the "modified" indicators and updates the baseline
      setInitialConfig({...config})
      
    } catch (error) {
      setSubmitMessage('Error updating configuration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Clear all changes
   */
  const handleClear = () => {
    setConfig(initialConfig)
    setErrors({})
    setSubmitMessage('')
  }

  /**
   * Check if a field has been modified
   */
  const isFieldModified = (fieldKey) => {
    return config[fieldKey] !== initialConfig[fieldKey]
  }

  /**
   * Render field based on type
   */
  const renderField = (field) => {
    const value = config[field.key]
    const error = errors[field.key]
    const isModified = isFieldModified(field.key)

    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderLeft: isModified ? '4px solid #ff9800' : 'none',
                backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
              }
            }}
          />
        )

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
            error={!!error}
            helperText={error}
            required={field.required}
            variant="outlined"
            size="small"
            inputProps={{ min: field.min, max: field.max }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderLeft: isModified ? '4px solid #ff9800' : 'none',
                backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
              }
            }}
          />
        )

      case 'time':
        return (
          <TextField
            fullWidth
            type="time"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            error={!!error}
            helperText={error}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderLeft: isModified ? '4px solid #ff9800' : 'none',
                backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
              }
            }}
          />
        )

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            error={!!error}
            helperText={error}
            variant="outlined"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderLeft: isModified ? '4px solid #ff9800' : 'none',
                backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
              }
            }}
          />
        )

      case 'select':
        return (
          <FormControl 
            fullWidth 
            size="small" 
            error={!!error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderLeft: isModified ? '4px solid #ff9800' : 'none',
                backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
              }
            }}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              {field.options.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
        )

      case 'switch':
        return (
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              borderLeft: isModified ? '4px solid #ff9800' : 'none',
              backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={value || false}
                  onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                />
              }
              label={field.label}
            />
          </Box>
        )

      case 'radio':
        return (
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              borderLeft: isModified ? '4px solid #ff9800' : 'none',
              backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
            }}
          >
            <FormControl component="fieldset" error={!!error}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup
                row
                value={value || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              >
                {field.options.map(option => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
              {error && <Typography variant="caption" color="error">{error}</Typography>}
            </FormControl>
          </Box>
        )

      case 'checkbox-group':
        return (
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              borderLeft: isModified ? '4px solid #ff9800' : 'none',
              backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
            }}
          >
            <FormLabel component="legend">{field.label}</FormLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {field.options.map(option => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const newValue = value || []
                        if (e.target.checked) {
                          handleFieldChange(field.key, [...newValue, option])
                        } else {
                          handleFieldChange(field.key, newValue.filter(v => v !== option))
                        }
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
          </Box>
        )

      case 'slider':
        return (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              borderLeft: isModified ? '4px solid #ff9800' : 'none',
              backgroundColor: isModified ? 'rgba(255, 152, 0, 0.04)' : 'transparent'
            }}
          >
            <Typography gutterBottom>{field.label}: {value}</Typography>
            <Slider
              value={value || field.min}
              onChange={(e, newValue) => handleFieldChange(field.key, newValue)}
              min={field.min}
              max={field.max}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        )

      default:
        return null
    }
  }

  const changedFieldsCount = Object.keys(config).filter(key => 
    config[key] !== initialConfig[key]
  ).length

  return (
    <Box 
      sx={{ 
        p: 4,
        minHeight: '100vh',
        background: darkMode 
          ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)'
      }}
    >
      {/* Header */}
      <Paper 
        elevation={4}
        sx={{ 
          p: 3, 
          mb: 3,
          background: darkMode 
            ? 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: 3,
          border: `1px solid ${darkMode ? '#404040' : '#e2e8f0'}`,
          boxShadow: darkMode 
            ? '0 8px 30px rgba(0,0,0,0.4)'
            : '0 8px 30px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: darkMode 
                ? 'linear-gradient(145deg, #3b82f6, #1e40af)'
                : 'linear-gradient(145deg, #3b82f6, #2563eb)',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
            }}
          >
            <EditIcon sx={{ color: '#ffffff', fontSize: 28 }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              background: darkMode 
                ? 'linear-gradient(45deg, #e3f2fd, #90caf9)'
                : 'linear-gradient(45deg, #1e293b, #475569)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}
          >
            Configuration Management
          </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
            mb: 2,
            fontSize: '1.1rem',
            lineHeight: 1.6
          }}
        >
          Modify system-wide configuration parameters. Changes will be applied after validation and submission.
        </Typography>
        
        {changedFieldsCount > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<SettingsIcon />}
              label={`${changedFieldsCount} fields modified`}
              sx={{
                background: 'linear-gradient(45deg, #ff9800, #f57c00)',
                color: '#ffffff',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                '& .MuiChip-icon': {
                  color: '#ffffff'
                }
              }}
            />
            <Chip
              label="Unsaved Changes"
              variant="outlined"
              sx={{
                borderColor: '#ef4444',
                color: '#ef4444',
                fontWeight: 500,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.7 }
                }
              }}
            />
          </Box>
        )}
      </Paper>

      {/* Action Buttons */}
      <Paper 
        elevation={2}
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          borderRadius: 3,
          border: `1px solid ${darkMode ? '#404040' : '#e2e8f0'}`,
          background: darkMode 
            ? 'linear-gradient(145deg, #2d2d2d 0%, #343434 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting || Object.keys(errors).length > 0}
            sx={{ 
              minWidth: 180,
              height: 50,
              fontWeight: 600,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #10b981, #059669)',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: darkMode ? '#404040' : '#e2e8f0',
                color: darkMode ? '#666' : '#999'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            💾 Save Configuration
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={isSubmitting}
            sx={{ 
              minWidth: 180,
              height: 50,
              fontWeight: 600,
              fontSize: '1.1rem',
              borderColor: '#ef4444',
              color: '#ef4444',
              borderWidth: 2,
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.2)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            🔄 Reset Changes
          </Button>
        </Box>
      </Paper>

      {/* Configuration Form */}
      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          borderRadius: 3,
          background: darkMode 
            ? 'linear-gradient(145deg, #2d2d2d 0%, #343434 100%)'
            : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: `1px solid ${darkMode ? '#404040' : '#e2e8f0'}`,
          boxShadow: darkMode 
            ? '0 10px 25px rgba(0,0,0,0.3), 0 6px 10px rgba(0,0,0,0.15)'
            : '0 10px 25px rgba(0,0,0,0.08), 0 6px 10px rgba(0,0,0,0.04)'
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            mb: 2,
            color: darkMode ? '#e3f2fd' : '#1e293b',
            borderBottom: `2px solid ${darkMode ? '#404040' : '#e2e8f0'}`,
            pb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
            }}
          />
          Configuration Fields
        </Typography>
        <Grid container spacing={2}>
          {fieldConfig.map((section) => 
            section.fields.map((field) => (
              <Grid item xs={12} md={6} lg={4} key={field.key}>
                <Box
                  sx={{
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      '& .field-container': {
                        boxShadow: darkMode 
                          ? '0 8px 25px rgba(0,0,0,0.3)'
                          : '0 8px 25px rgba(0,0,0,0.1)'
                      }
                    }
                  }}
                >
                  <Box
                    className="field-container"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: darkMode ? '#363636' : '#f8fafc',
                      border: `1px solid ${darkMode ? '#404040' : '#e2e8f0'}`,
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {renderField(field)}
                  </Box>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Paper>

      {/* Loading Progress */}
      {isSubmitting && (
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4,
            backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            borderRadius: 3,
            border: `1px solid ${darkMode ? '#404040' : '#e2e8f0'}`
          }}
        >
          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: darkMode ? '#404040' : '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                  borderRadius: 3
                }
              }}
            />
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              fontWeight: 500,
              color: darkMode ? '#90caf9' : '#1976d2'
            }}
          >
            🔄 Updating configuration settings...
          </Typography>
        </Paper>
      )}

      {/* Submit Message */}
      {submitMessage && (
        <Alert 
          severity={submitMessage.includes('Error') || submitMessage.includes('fix') ? 'error' : 'success'}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            boxShadow: darkMode 
              ? '0 4px 15px rgba(0,0,0,0.2)'
              : '0 4px 15px rgba(0,0,0,0.08)',
            '& .MuiAlert-icon': {
              fontSize: 24
            }
          }}
        >
          {submitMessage}
        </Alert>
      )}

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
            You are about to submit configuration changes to the <strong>Production</strong> environment. 
            This will affect live system settings and could impact application performance or user experience.
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

export default UpdateConfigEntries
