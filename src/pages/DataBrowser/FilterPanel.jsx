import { Grid, Card, CardContent, Box, Typography } from '@mui/material'
import StorageIcon from '@mui/icons-material/Storage'
import SpeedIcon from '@mui/icons-material/Speed'
import TextField from '@mui/material/TextField'

function FilterPanel({ selectedTable, darkMode }) {

  // Additional read-only field values - show data only when table is selected
  const additionalFields = selectedTable ? {
    serverName: 'PROD-DB-01',
    connectionType: 'SSL/TLS',
    lastSync: '2025-05-24 14:30:25',
    recordCount: '100,000',
    dataSize: '245.6 MB',
    compression: 'Enabled',
    encryption: 'AES-256',
    backupStatus: 'Current',    version: 'v2.1.3',
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
    indexFragmentation: '',    lockWaitTime: '',
    connectionPoolSize: ''
  }

  return (
    <Grid container spacing={1.5} sx={{ mt: 1.5, mb: 1.5 }}>
      {/* Database Performance Panel */}
      <Grid item xs={12}>
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(255,193,7,0.1) 0%, rgba(255,152,0,0.1) 100%)'
              : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
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
                    }}                    InputLabelProps={{
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
      </Grid>

      {/* System Information Panel */}
      <Grid item xs={12}>
        <Card 
          elevation={2} 
          sx={{ 
            borderRadius: 2,
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(186,85,211,0.1) 0%, rgba(147,112,219,0.1) 100%)'
              : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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
                    }}                    InputLabelProps={{
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
      </Grid>
    </Grid>
  )
}

export default FilterPanel