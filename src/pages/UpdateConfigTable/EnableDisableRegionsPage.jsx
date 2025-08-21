/**
 * @fileoverview Enable/Disable Regions standalone page wrapper
 * @author System
 * @version 1.0.0
 */

import { Container, Box, Typography } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import EnableDisableRegionsComponent from './EnableDisableRegions'

/**
 * Standalone Enable/Disable Regions page
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current theme mode
 * @param {string} props.environment - Current environment
 * @returns {JSX.Element} Enable/Disable Regions standalone page
 */
function EnableDisableRegionsPage({ darkMode = false, environment = 'Development' }) {
  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PublicIcon 
            sx={{ 
              fontSize: 32,
              color: darkMode ? '#90caf9' : '#1976d2'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#fff' : '#1976d2'
            }}
          >
            Enable/Disable Regions
          </Typography>
        </Box>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Manage regional access and availability for different geographic areas
        </Typography>
      </Box>

      {/* Component Content */}
      <EnableDisableRegionsComponent darkMode={darkMode} environment={environment} />
    </Container>
  )
}

export default EnableDisableRegionsPage
