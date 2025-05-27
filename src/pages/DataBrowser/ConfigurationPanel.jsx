/**
 * @fileoverview Configuration panel component for data source selection and filtering
 * @author System
 * @version 1.0.0
 */

import { 
  Box, Typography, FormControl, InputLabel, Select, MenuItem, 
  TextField, Button, Grid, Card, CardContent, Chip
} from '@mui/material'
import TableViewIcon from '@mui/icons-material/TableView'
import StorageIcon from '@mui/icons-material/Storage'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

/** @constant {string[]} Available table options for selection */
const tableOptions = ['Table 1', 'Table 2', 'Table 3', 'Table 4']

/**
 * Helper function to get environment chip color based on environment type
 * @param {string} env - Environment name (Development, Pre-prod, Production)
 * @returns {string} MUI color variant for the chip
 */
const getEnvironmentColor = (env) => {
  switch (env) {
    case 'Development': return 'success'
    case 'Pre-prod': return 'warning'
    case 'Production': return 'error'
    default: return 'default'
  }
}

/**
 * Configuration panel component for data source selection and filtering options
 * 
 * Features:
 * - Table selection dropdown
 * - Account number input with validation
 * - Date selection dropdown with predefined options
 * - Submit and clear action buttons
 * - Real-time validation feedback
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table
 * @param {Function} props.setSelectedTable - Function to update selected table
 * @param {string} props.accountNumber - Current account number value
 * @param {Function} props.setAccountNumber - Function to update account number
 * @param {string} props.accountNumberError - Account number validation error message
 * @param {boolean} props.isAccountNumberValid - Account number validation status
 * @param {Function} props.handleSubmit - Function to handle form submission
 * @param {Function} props.handleClear - Function to clear all form fields
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @param {string} props.selectedDate - Currently selected date
 * @param {Function} props.setSelectedDate - Function to update selected date
 * @returns {JSX.Element} Configuration panel component
 * 
 * @example
 * ```jsx
 * <ConfigurationPanel
 *   selectedTable="Table 1"
 *   setSelectedTable={setTable}
 *   accountNumber="1234567890"
 *   setAccountNumber={setAccount}
 *   handleSubmit={onSubmit}
 *   handleClear={onClear}
 *   darkMode={false}
 * />
 * ```
 */
function ConfigurationPanel({ 
  selectedTable, 
  setSelectedTable, 
  accountNumber, 
  setAccountNumber, 
  accountNumberError,
  isAccountNumberValid,
  handleSubmit,
  handleClear,
  darkMode,
  selectedDate,
  setSelectedDate
}) {

  /** @constant {Object[]} Predefined date options with values and labels */
  const dateOptions = [
    { value: '', label: 'All Dates' },
    { value: '2025-05-24', label: 'Today (2025-05-24)' },
    { value: '2025-05-23', label: 'Yesterday (2025-05-23)' },
    { value: '2025-05-22', label: '2025-05-22' },
    { value: '2025-05-21', label: '2025-05-21' },
    { value: '2025-05-20', label: '2025-05-20' },
    { value: '2025-05-17', label: 'Last Week (2025-05-17)' },
    { value: '2025-05-10', label: '2 Weeks Ago (2025-05-10)' },
    { value: '2025-05-01', label: 'Month Start (2025-05-01)' },
    { value: '2025-04-24', label: 'Last Month (2025-04-24)' },
    { value: '2025-04-01', label: 'Quarter Start (2025-04-01)' },
    { value: '2025-01-01', label: 'Year Start (2025-01-01)' },
    { value: '2024-12-31', label: 'Last Year End (2024-12-31)' },
    { value: '2024-05-24', label: 'Same Date Last Year (2024-05-24)' }
  ]
  return (
    <Card 
      elevation={2} 
      sx={{ 
        mb: 1,
        minHeight: 100, // Ensure minimum height for all fields
        borderRadius: 1.5,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(60,60,60,0.9) 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}    >
      <CardContent sx={{ p: 1.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <TableViewIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>
            Data Source Configuration
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <FormControl 
              fullWidth 
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  height: 32
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.75rem'
                }
              }}
            >
              <InputLabel>Select Table</InputLabel>
              <Select
                value={selectedTable}
                label="Select Table"
                onChange={(e) => setSelectedTable(e.target.value)}
                sx={{ fontSize: '0.8rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                  -- Select a table --
                </MenuItem>
                {tableOptions.map((table) => (
                  <MenuItem key={table} value={table} sx={{ fontSize: '0.8rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StorageIcon sx={{ mr: 0.5, fontSize: '0.7rem' }} />
                      {table}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={9}>            <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                <TextField
                size="small"
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                variant="outlined"
                error={!isAccountNumberValid && accountNumber !== ''}
                helperText={accountNumberError}
                inputProps={{ 
                  maxLength: 15,
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
                }}
                sx={{ 
                  width: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: 'background.paper',
                    height: 32,
                    fontSize: '0.8rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      transform: 'translateY(-0.5px)'
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 3px 10px rgba(33,150,243,0.15)',
                      transform: 'translateY(-0.5px)'
                    },
                    // Valid state - green border
                    ...(isAccountNumberValid && accountNumber !== '' && {
                      '& fieldset': {
                        borderColor: '#4caf50',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#45a049'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#4caf50'
                      }
                    }),
                    // Invalid state - red border
                    ...(!isAccountNumberValid && accountNumber !== '' && {
                      '& fieldset': {
                        borderColor: '#f44336',
                        borderWidth: '2px'
                      },
                      '&:hover fieldset': {
                        borderColor: '#d32f2f'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f44336'
                      }
                    })
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem',
                    // Change label color for valid/invalid states
                    ...(isAccountNumberValid && accountNumber !== '' && {
                      color: '#4caf50',
                      '&.Mui-focused': {
                        color: '#4caf50'
                      }
                    }),
                    ...(!isAccountNumberValid && accountNumber !== '' && {
                      color: '#f44336',
                      '&.Mui-focused': {
                        color: '#f44336'
                      }
                    })
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: '0.65rem',
                    marginTop: '2px',
                    marginLeft: 0
                  }
                }}
                placeholder="000000000000000"
              />
              <Button 
                variant="contained" 
                size="small"
                onClick={handleSubmit}
                startIcon={<SearchIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 90,
                  height: 32,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 3px 10px rgba(102,126,234,0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.3px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 4px 15px rgba(102,126,234,0.5)',
                    transform: 'translateY(-0.5px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Submit
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={handleClear}
                startIcon={<ClearIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{ 
                  borderRadius: 2,
                  minWidth: 80,
                  height: 32,
                  borderWidth: '1.5px',
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.3px',
                  '&:hover': {
                    borderWidth: '1.5px',
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255,107,107,0.06)',
                    color: '#ff6b6b',
                    boxShadow: '0 3px 10px rgba(255,107,107,0.2)',
                    transform: 'translateY(-0.5px)',
                  },
                  '&:active': {
                    transform: 'translateY(0px)',
                    boxShadow: '0 2px 8px rgba(255,107,107,0.15)',
                  },                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Clear
              </Button>
              </Box>
              
              {/* Date Filter - Moved to the right */}
              <FormControl 
                size="small"
                sx={{ 
                  width: 140,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                    backgroundColor: 'background.paper',
                    height: 32
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.75rem'
                  }
                }}
              >
                <InputLabel>Select Date</InputLabel>
                <Select
                  value={selectedDate}
                  label="Select Date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  sx={{ fontSize: '0.8rem' }}
                >
                  {dateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value} sx={{ fontSize: '0.8rem' }}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ConfigurationPanel