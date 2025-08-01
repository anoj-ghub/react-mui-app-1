/**
 * @fileoverview Account Inquiry header component with controls and status
 * @author System
 * @version 1.0.0
 */

import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Fade
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'

/**
 * Account Inquiry header component
 * 
 * Features:
 * - Environment indicator
 * - Loading state
 * - Visual indicators
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.environment - Current environment
 * @param {boolean} props.darkMode - Dark mode state
 * @param {boolean} props.loading - Loading state
 * @returns {JSX.Element} Account Inquiry header
 */
function AccountInquiryHeader({ environment, darkMode, loading }) {
  /**
   * Gets environment color based on environment type
   * @param {string} env - Environment name
   * @returns {string} Color name
   */
  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'Production': return 'error'
      case 'Development': return 'info'
      case 'Pre-prod': return 'warning'
      default: return 'default'
    }
  }

  return (
    <Fade in timeout={300}>
      <Box>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            p: 1.5,
            borderRadius: 3,
            background: darkMode 
              ? 'linear-gradient(145deg, #1a237e 0%, #3949ab 100%)'
              : 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)',
            border: `1px solid ${darkMode ? 'rgba(57, 73, 171, 0.3)' : 'rgba(33, 150, 243, 0.2)'}`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <AccountBalanceIcon sx={{ 
              fontSize: 24, 
              color: darkMode ? '#90caf9' : '#1976d2',
              mr: 1.5
            }} />
            <Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: darkMode ? '#90caf9' : '#1976d2',
                  lineHeight: 1.2
                }}
              >
                Account Inquiry
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: darkMode ? 'rgba(144, 202, 249, 0.8)' : 'rgba(25, 118, 210, 0.8)',
                  fontWeight: 400,
                  fontSize: '0.8rem'
                }}
              >
                Customer Account Management
              </Typography>
            </Box>
          </Box>

          {/* Environment Indicator - moved to the right */}
          <Chip
            label={environment}
            color={getEnvironmentColor(environment)}
            variant="filled"
            sx={{
              fontWeight: 700,
              fontSize: '0.8rem',
              height: 32,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>

        {/* Loading Progress */}
        {loading && (
          <LinearProgress 
            sx={{ 
              mb: 2,
              borderRadius: 1,
              height: 3,
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 1,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
              }
            }} 
          />
        )}
      </Box>
    </Fade>
  )
}

export default AccountInquiryHeader
