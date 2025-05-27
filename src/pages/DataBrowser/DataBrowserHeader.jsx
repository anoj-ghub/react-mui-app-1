/**
 * @fileoverview Header component for the Data Browser page with environment indicator
 * @author System
 * @version 1.0.0
 */

import { Box, Typography, Divider, Chip } from '@mui/material'

/**
 * Helper function to get environment chip color based on environment type
 * @param {string} env - Environment name (Development, Testing, Production)
 * @returns {string} MUI color variant for the chip
 */
const getEnvironmentColor = (env) => {
  switch (env) {
    case 'Development': return 'success'
    case 'Testing': return 'warning' 
    case 'Production': return 'error'
    default: return 'default'
  }
}

/**
 * Header component for the Data Browser page displaying title and environment indicator
 * 
 * Features:
 * - Gradient styled title
 * - Environment chip with color coding
 * - Responsive layout with proper spacing
 * - Subtitle with descriptive text
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.environment - Current environment (Development, Testing, Production)
 * @returns {JSX.Element} Data browser header component
 * 
 * @example
 * ```jsx
 * <DataBrowserHeader environment="Development" />
 * ```
 */
function DataBrowserHeader({ environment }) {return (
    <Box sx={{ mb: 1.5 }}> {/* Reduced margin bottom */}      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}> {/* Reduced margin */}
        <Box>
          <Typography 
            variant="h5" // Reduced from h4 to h5
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 0.2, // Reduced margin
              lineHeight: 1.2 // Tighter line height
            }}
          >
            Data Browser
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}> {/* Smaller font */}
            Explore and analyze your data with advanced filtering options
          </Typography>
        </Box>
        
        {/* Environment Display */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontSize: '0.85rem', 
              color: 'text.secondary',
              mr: 0.5,
              fontWeight: 600
            }}
          >
            Environment:
          </Typography>
          <Chip 
            label={environment} 
            color={getEnvironmentColor(environment)}
            size="small"
            sx={{ 
              fontWeight: 'bold', 
              height: 20, 
              fontSize: '0.7rem',
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ mt: 0.5 }} /> {/* Reduced margin */}
    </Box>
  )
}

export default DataBrowserHeader