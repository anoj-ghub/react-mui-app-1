/**
 * @fileoverview Status container component with flag icon, text fields, badges, and chips
 * @author System
 * @version 1.0.0
 */

import { 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Typography, 
  TextField, 
  Chip, 
  Badge,
  Divider
} from '@mui/material'
import FlagIcon from '@mui/icons-material/Flag'

/**
 * Status container component that displays various status indicators and information
 * 
 * Features:
 * - Flag icon indicator
 * - Text fields for status information
 * - Badge/pill components with 3-digit numbers
 * - Chips for additional status tags
 * - Divider for visual separation
 * - Responsive grid layout
 * - Dark mode theme support
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table name
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Status container component
 * 
 * @example
 * ```jsx
 * <StatusContainer
 *   selectedTable="Table 1"
 *   darkMode={false}
 * />
 * ```
 */
function StatusContainer({ selectedTable, darkMode }) {
  // Text field values - show data only when table is selected
  const textFields = selectedTable ? {
    status: 'Active',
    environment: 'Production',
    region: 'US-East-1',
    cluster: 'Main-Cluster'
  } : {
    status: '',
    environment: '',
    region: '',
    cluster: ''
  }
  // Badge values with 3-digit numbers - Always show for demo
  const badgeValues = [
    { label: 'Alerts', value: '142', color: 'error' },
    { label: 'Tasks', value: '089', color: 'warning' },
    { label: 'Users', value: '256', color: 'success' },
    { label: 'Queue', value: '073', color: 'info' },
    { label: 'Jobs', value: '198', color: 'primary' }
  ]

  // Chip values - Always show for demo
  const chipValues = [
    { label: 'Monitoring', color: 'primary', variant: 'filled' },
    { label: 'Backup', color: 'success', variant: 'outlined' },
    { label: 'Security', color: 'warning', variant: 'filled' },
    { label: 'Analytics', color: 'info', variant: 'outlined' },
    { label: 'Reports', color: 'secondary', variant: 'filled' },
    { label: 'Archive', color: 'default', variant: 'outlined' }
  ]

  return (
    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(48,63,159,0.1) 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Top Row: Flag Icon + Text Fields + Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {/* Flag Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
            <FlagIcon 
              sx={{ 
                color: selectedTable ? 'primary.main' : 'text.disabled',
                fontSize: 24,
                mr: 1
              }} 
            />
          </Box>

          {/* Text Fields */}
          <Grid container spacing={1} sx={{ flex: 1, maxWidth: '600px' }}>
            {Object.entries(textFields).map(([key, value]) => (
              <Grid item xs={3} key={key}>
                <TextField
                  size="small"
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                      height: 32,
                      '& input': {
                        color: value ? 'text.primary' : 'text.disabled',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        padding: '4px 8px'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }
                  }}
                  placeholder={value ? '' : 'No data'}
                />
              </Grid>
            ))}
          </Grid>          {/* Status Metrics Section */}
          <Box sx={{ 
            minWidth: 'fit-content',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 1,
            backgroundColor: 'rgba(255,255,255,0.7)'
          }}>
            {/* Header for Status Metrics */}
            <Box sx={{ 
              backgroundColor: 'primary.main', 
              color: 'white', 
              py: 0.5, 
              px: 1.5,
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
                Status Metrics
              </Typography>
            </Box>
            
            {/* Badges/Pills with 3-digit numbers */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap', 
              alignItems: 'center',
              p: 1.5
            }}>
              {badgeValues.map((badge, index) => (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 'bold', mb: 0.5 }}>
                    {badge.label}
                  </Typography>
                  <Chip
                    label={badge.value}
                    color={badge.color}
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                      minWidth: '45px',
                      height: '24px',
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 1.5 }} />        {/* System Tags Section */}
        <Box sx={{ 
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 1,
          backgroundColor: 'rgba(255,255,255,0.7)'
        }}>
          {/* Header for System Tags */}
          <Box sx={{ 
            backgroundColor: 'secondary.main', 
            color: 'white', 
            py: 0.5, 
            px: 1.5,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4
          }}>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
              System Tags
            </Typography>
          </Box>
          
          {/* Bottom Row: 6 Chips */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5, 
            flexWrap: 'wrap', 
            alignItems: 'center',
            p: 1.5
          }}>
            {chipValues.map((chip, index) => (
              <Chip
                key={index}
                label={chip.label}
                color={chip.color}
                variant={chip.variant}
                size="small"
                sx={{
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: '28px',
                  '& .MuiChip-label': {
                    px: 1.5
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatusContainer
