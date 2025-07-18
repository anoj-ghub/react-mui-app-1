/**
 * @fileoverview System information component displaying database and server details
 * @author System
 * @version 1.0.0
 */

import { Grid, Card, CardContent, Box, Typography, TextField } from '@mui/material'
import StorageIcon from '@mui/icons-material/Storage'

/**
 * System information component that displays database and server configuration details
 * 
 * Features:
 * - System configuration display
 * - Server and database information
 * - Conditional data display based on table selection
 * - Grid layout with responsive design
 * - Read-only text fields for system values
 * - Dark mode theme support
 * - Security and backup status indicators
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table name
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} System information component
 * 
 * @example
 * ```jsx
 * <SystemInformation
 *   selectedTable="Table 1"
 *   darkMode={false}
 * />
 * ```
 */
function SystemInformation({ selectedTable, darkMode }) {
  // Additional read-only field values - show data only when table is selected
  const additionalFields = selectedTable ? {
    serverName: 'PROD-DB-01',
    connectionType: 'SSL/TLS',
    lastSync: '2025-05-24 14:30:25',
    recordCount: '100,000',
    dataSize: '245.6 MB',
    compression: 'Enabled',
    encryption: 'AES-256',
    backupStatus: 'Current',
    version: 'v2.1.3',
    uptime: '99.98%',
    maxConnections: '500',
    activeUsers: '127'
  } : {
    serverName: '',
    connectionType: '',
    lastSync: '',
    recordCount: '',
    dataSize: '',
    compression: '',
    encryption: '',
    backupStatus: '',
    version: '',
    uptime: '',
    maxConnections: '',
    activeUsers: ''
  }

  return (    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(63,81,181,0.15) 0%, rgba(25,118,210,0.15) 100%)'
          : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <StorageIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
            System Information
          </Typography>
        </Box>
        {/* 4 fields per row, 3 rows total */}
        <Grid container spacing={0.8}>
          {Object.entries(additionalFields).map(([key, value], index) => (
            <Grid 
              item 
              xs={3} 
              key={key}
              sx={{
                // Add margin top for second and third rows (after first 4 and 8 fields)
                ...(index >= 4 && index < 8 && { mt: 1.5 }),
                ...(index >= 8 && { mt: 1.5 })
              }}
            >
              <TextField
                size="small"
                label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={value}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true, // RESTORED: Labels appear on border
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                    height: 28, // Reduced from 32
                    '& input': {
                      color: value ? (
                        ['recordCount', 'uptime', 'activeUsers'].includes(key) ? 'success.main' : 
                        ['compression', 'encryption'].includes(key) ? 'info.main' : 
                        ['backupStatus'].includes(key) ? 'warning.main' :
                        'text.primary'
                      ) : 'text.disabled', // Disabled color when empty
                      fontSize: '0.7rem',
                      fontWeight: ['recordCount', 'uptime', 'activeUsers'].includes(key) ? 600 : 400,
                      padding: '2px 6px' // Reduced padding
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.7rem',
                    fontWeight: 'bold' // Made labels bold
                  }
                }}
                placeholder={value ? '' : 'No data'}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SystemInformation
