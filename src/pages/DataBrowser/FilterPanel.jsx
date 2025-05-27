/**
 * @fileoverview Filter panel component that contains database metrics and system information
 * @author System
 * @version 1.0.0
 */

import { Grid } from '@mui/material'
import DatabasePerformanceMetrics from '../../components/DatabaseMetrics'
import SystemInformation from '../../components/SystemInfo'

/**
 * Filter panel component that displays database performance metrics and system information
 * 
 * Features:
 * - Database performance metrics display
 * - System information display
 * - Responsive grid layout
 * - Theme-aware styling
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table name
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Filter panel component
 * 
 * @example
 * ```jsx
 * <FilterPanel selectedTable="Table 1" darkMode={false} />
 * ```
 */
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