/**
 * @fileoverview Reusable data table component with loading state, search functionality, and customizable styling
 * @author System
 * @version 1.0.0
 */

import React from 'react'
import { 
  Box, 
  Typography, 
  Chip, 
  TextField, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Card,
  CircularProgress,
  Backdrop
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import StorageIcon from '@mui/icons-material/Storage'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

/**
 * Reusable data table component with loading state and search functionality
 * 
 * Features:
 * - MUI X DataGrid with custom styling
 * - Loading spinner with backdrop
 * - Real-time search across all columns
 * - Record count display
 * - Customizable toolbar slot
 * - Theme-aware styling (dark/light mode)
 * - Responsive layout with proper overflow handling
 * - Configurable pagination options
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Table title to display in header
 * @param {Array} props.data - Array of data objects to display in the grid
 * @param {Array} props.columns - Column configuration for the DataGrid
 * @param {boolean} [props.loading=false] - Loading state flag
 * @param {string} [props.searchText=''] - Current search query text
 * @param {Function} [props.onSearchChange] - Function to handle search text changes
 * @param {boolean} [props.darkMode=false] - Dark mode theme flag
 * @param {string} [props.height='700px'] - Table container height
 * @param {Array} [props.pageSizeOptions=[10, 25, 50, 100]] - Available page size options
 * @param {number} [props.initialPageSize=25] - Initial page size
 * @param {boolean} [props.enableSearch=true] - Enable/disable search functionality
 * @param {string} [props.searchPlaceholder='Search across all columns...'] - Search input placeholder
 * @param {number} [props.searchMaxLength=50] - Maximum length for search input
 * @param {React.ReactNode} [props.toolbarSlot] - Custom toolbar component to render
 * @param {Object} [props.gridProps] - Additional props to pass to DataGrid
 * @param {string} [props.emptyMessage='No data available'] - Message to show when no data
 * @param {Object} [props.containerSx] - Additional sx props for container
 * @returns {JSX.Element} Reusable data table component
 * 
 * @example
 * ```jsx
 * <ReusableDataTable
 *   title="Users"
 *   data={userData}
 *   columns={userColumns}
 *   loading={isLoading}
 *   searchText={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   darkMode={isDark}
 *   height="600px"
 *   initialPageSize={50}
 * />
 * ```
 */
const ReusableDataTable = ({
  title = 'Data Table',
  data = [],
  columns = [],
  loading = false,
  searchText = '',
  onSearchChange,
  darkMode = false,
  height = '700px',
  pageSizeOptions = [10, 25, 50, 100],
  initialPageSize = 25,
  enableSearch = true,
  searchPlaceholder = 'Search across all columns...',
  searchMaxLength = 50,
  toolbarSlot,
  gridProps = {},
  emptyMessage = 'No data available',
  containerSx = {}
}) => {

  /**
   * Memoized filtered rows based on search text
   * Performs case-insensitive search across all column values
   * @type {Array} Filtered array of table data
   */
  const filteredRows = React.useMemo(() => {
    if (!enableSearch || !searchText.trim()) return data
    
    const searchTerms = searchText.toLowerCase().split(' ').filter(term => term.length > 0)
    
    return data.filter(row => {
      return searchTerms.every(term =>
        Object.values(row).some(value => 
          value != null && value.toString().toLowerCase().includes(term)
        )
      )
    })
  }, [data, searchText, enableSearch])

  /**
   * Handle search text change
   * @param {string} newValue - New search text value
   */
  const handleSearchChange = (newValue) => {
    if (onSearchChange) {
      onSearchChange(newValue)
    }
  }

  /**
   * Clear search text
   */
  const handleClearSearch = () => {
    handleSearchChange('')
  }

  return (
    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(240,147,251,0.2) 0%, rgba(245,87,108,0.2) 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        p: 0.25,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        ...containerSx
      }}
    >
      {/* Loading Backdrop */}
      <Backdrop
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          zIndex: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ 
            color: darkMode ? '#fff' : 'primary.main'
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: darkMode ? '#fff' : 'text.primary',
            fontWeight: 500
          }}
        >
          Loading data...
        </Typography>
      </Backdrop>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 1.5,
          borderRadius: 1.5,
          background: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Header with title, record count, and search */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 1, 
          flexShrink: 0 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StorageIcon sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {title}
            </Typography>
            <Chip 
              label={`${filteredRows.length} record${filteredRows.length !== 1 ? 's' : ''}`} 
              color={filteredRows.length > 0 ? "primary" : "default"}
              size="small"
              sx={{ ml: 2, height: 18, fontSize: '0.7rem' }}
            />
          </Box>

          {/* Search Field */}
          {enableSearch && (
            <TextField
              size="small"
              label="Quick Search"
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              variant="outlined"
              inputProps={{
                maxLength: searchMaxLength,
                style: { fontSize: '0.8rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: '0.9rem', color: 'action.active' }} />
                  </InputAdornment>
                ),
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                width: 380,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: 'background.paper',
                  fontSize: '0.8rem',
                  height: 36
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem'
                }
              }}
              placeholder={`${searchPlaceholder} (max ${searchMaxLength} chars)...`}
            />
          )}
        </Box>

        {/* Data Grid Container */}
        <Box sx={{ 
          flexGrow: 1,
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
          borderRadius: 1,
          overflow: 'hidden',
          height: height,
          [`& .${gridClasses.root}`]: {
            border: 'none',
            fontSize: '0.75rem'
          },
          [`& .${gridClasses.columnHeaders}`]: {
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
            fontSize: '0.75rem',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
            minHeight: '40px'
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            fontWeight: 600,
            fontSize: '0.75rem'
          },
          [`& .${gridClasses.row}`]: {
            '&:hover': {
              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa'
            }
          },
          [`& .${gridClasses.cell}`]: {
            borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`,
            padding: '4px 8px',
            fontSize: '0.75rem'
          },
          [`& .${gridClasses.footerContainer}`]: {
            borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
            backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : '#fafafa'
          }
        }}>
          {/* Show empty state or DataGrid */}
          {!loading && filteredRows.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <StorageIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: initialPageSize },
                }
              }}
              pageSizeOptions={pageSizeOptions}
              disableRowSelectionOnClick
              showCellVerticalBorder
              showColumnVerticalBorder
              paginationMode="client"
              disableColumnFilter
              disableColumnMenu
              slots={toolbarSlot ? { 
                toolbar: () => toolbarSlot
              } : {}}
              sx={{ 
                height: '100%',
                width: '100%',
                border: 'none'
              }}
              {...gridProps}
            />
          )}
        </Box>
      </Paper>
    </Card>
  )
}

export default ReusableDataTable
