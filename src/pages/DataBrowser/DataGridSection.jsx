import React from 'react'
import ReusableDataTable from '../../components/ReusableDataTable'
import CustomToolbar from './CustomToolbar'

/**
 * Data grid section component using the reusable data table with custom toolbar
 * 
 * Features:
 * - Utilizes ReusableDataTable component for consistent UI
 * - Custom toolbar integration with export functionality
 * - Real-time search across all columns
 * - Loading state support
 * - Theme-aware styling (dark/light mode)
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.selectedTable - Currently selected table name
 * @param {Array} props.tableData - Array of data objects to display in the grid
 * @param {Array} props.columns - Column configuration for the DataGrid
 * @param {string} props.quickSearchText - Current search query text
 * @param {Function} props.setQuickSearchText - Function to update search text
 * @param {string} props.environment - Current environment name
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @param {boolean} [props.loading=false] - Loading state for the data
 * @returns {JSX.Element} Data grid section component
 * 
 * @example
 * ```jsx
 * <DataGridSection
 *   selectedTable="Table 1"
 *   tableData={[{id: 1, name: "Item"}]}
 *   columns={[{field: "name", headerName: "Name"}]}
 *   quickSearchText=""
 *   setQuickSearchText={setText}
 *   environment="Development"
 *   darkMode={false}
 *   loading={false}
 * />
 * ```
 */
function DataGridSection({ 
  selectedTable, 
  tableData, 
  columns, 
  quickSearchText, 
  setQuickSearchText, 
  environment,
  darkMode,
  loading = false
}) {

  /**
   * Create custom toolbar component with required props
   * @returns {JSX.Element} Custom toolbar component
   */  const renderToolbar = () => (
    <CustomToolbar 
      tableData={tableData}
      selectedTable={selectedTable}
      environment={environment}
    />
  )
  
  return (
    <ReusableDataTable
      title={selectedTable ? `${selectedTable} Data` : 'No Table Selected'}
      data={tableData}
      columns={columns}
      loading={loading}
      searchText={quickSearchText}
      onSearchChange={setQuickSearchText}      darkMode={darkMode}
      height="850px"
      initialPageSize={50}
      pageSizeOptions={[10, 25, 50, 100]}
      enableSearch={true}
      searchPlaceholder="Search across all columns"
      searchMaxLength={50}
      toolbarSlot={renderToolbar()}
      emptyMessage={selectedTable ? "No data found" : "Select a table to view data"}
      containerSx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      gridProps={{
        density: 'compact'
      }}
    />
  )
}

export default DataGridSection