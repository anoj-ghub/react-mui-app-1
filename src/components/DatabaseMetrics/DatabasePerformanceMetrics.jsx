/**
 * @fileoverview Database performance metrics component displaying system statistics
 * @author System
 * @version 1.0.0
 */

import { Grid, Card, CardContent, Box, Typography, TextField } from '@mui/material'
import SpeedIcon from '@mui/icons-material/Speed'

/**
 * Database performance metrics component that displays various database statistics
 * 
 * Features:
 * - Real-time performance metrics display
 * - Conditional data display based on table selection
 * - Grid layout with responsive design
 * - Read-only text fields for metric values
 * - Dark mode theme support
 * - Performance indicators (CPU, Memory, Disk I/O, etc.)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table name
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Database performance metrics component
 * 
 * @example
 * ```jsx
 * <DatabasePerformanceMetrics
 *   selectedTable="Table 1"
 *   darkMode={false}
 * />
 * ```
 */
function DatabasePerformanceMetrics({ selectedTable, darkMode }) {
  // Database Performance metrics - show data only when table is selected
  const performanceFields = selectedTable ? {
    cpuUsage: '23.4%',
    memoryUsage: '67.8%',
    diskIO: '145 MB/s',
    networkLatency: '12ms',
    queryExecutionTime: '0.89s',
    transactionsPerSecond: '2,847',
    cacheHitRatio: '94.2%',
    indexFragmentation: '3.1%',
    lockWaitTime: '0.02s',
    connectionPoolSize: '350/500'
  } : {
    cpuUsage: '',
    memoryUsage: '',
    diskIO: '',
    networkLatency: '',
    queryExecutionTime: '',
    transactionsPerSecond: '',
    cacheHitRatio: '',
    indexFragmentation: '',
    lockWaitTime: '',
    connectionPoolSize: ''
  }

  return (    <Card 
      elevation={2} 
      sx={{ 
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(156,39,176,0.15) 0%, rgba(123,31,162,0.15) 100%)'
          : 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SpeedIcon sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
            Database Performance Metrics
          </Typography>
        </Box>
        {/* 5 fields per row, 2 rows total for 10 fields */}
        <Grid container spacing={0.8}>
          {Object.entries(performanceFields).map(([key, value], index) => (
            <Grid 
              item 
              xs={2.4} 
              key={key}
              sx={{
                // Add margin top for second row (after first 5 fields)
                ...(index >= 5 && { mt: 1.5 })
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
                  shrink: true,
                }}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                    backgroundColor: 'background.paper',
                    height: 28, // Reduced from 32
                    '& input': {
                      color: value ? (
                        ['cpuUsage', 'memoryUsage', 'indexFragmentation'].includes(key) ? 'warning.main' : 
                        ['cacheHitRatio', 'transactionsPerSecond'].includes(key) ? 'success.main' : 
                        ['networkLatency', 'queryExecutionTime', 'lockWaitTime'].includes(key) ? 'info.main' :
                        'text.primary'
                      ) : 'text.disabled',
                      fontSize: '0.7rem',
                      fontWeight: ['cacheHitRatio', 'transactionsPerSecond'].includes(key) ? 600 : 400,
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

export default DatabasePerformanceMetrics
