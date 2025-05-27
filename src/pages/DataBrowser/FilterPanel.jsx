import { Grid } from '@mui/material'
import DatabasePerformanceMetrics from '../../components/DatabaseMetrics'
import SystemInformation from '../../components/SystemInfo'

function FilterPanel({ selectedTable, darkMode }) {
  return (
    <Grid container spacing={1.5} sx={{ mt: 1.5, mb: 1.5 }}>
      {/* Database Performance Panel */}
      <Grid item xs={12}>
        <DatabasePerformanceMetrics selectedTable={selectedTable} darkMode={darkMode} />
      </Grid>

      {/* System Information Panel */}
      <Grid item xs={12}>
        <SystemInformation selectedTable={selectedTable} darkMode={darkMode} />
      </Grid>
    </Grid>
  )
}

export default FilterPanel