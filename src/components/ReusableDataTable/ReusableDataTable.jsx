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
import ErrorBoundary from '../ErrorBoundary'

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
    
    const searchLower = searchText.toLowerCase().trim()
    
    return data.filter(row => {
      return Object.values(row).some(value => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchLower)
      })
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
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
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
          background: darkMode ? '#1e1e1e' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
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
                  backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#000000',
                  fontSize: '0.8rem',
                  height: 36,
                  '& fieldset': {
                    borderColor: darkMode ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: darkMode ? '#90caf9' : '#1976d2'
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.8rem',
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                  '&.Mui-focused': {
                    color: darkMode ? '#90caf9' : '#1976d2'
                  }
                },
                '& input': {
                  color: darkMode ? '#ffffff' : '#000000'
                }
              }}
              placeholder={`${searchPlaceholder} (max ${searchMaxLength} chars)...`}
            />
          )}
        </Box>

        {/* Data Grid Container */}
        <Box sx={{ 
          flexGrow: 1,
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0'}`,
          borderRadius: 1,
          overflow: 'hidden',
          height: height,
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          [`& .${gridClasses.root}`]: {
            border: 'none',
            fontSize: '0.75rem',
            backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            '& .MuiDataGrid-main': {
              backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
            },
            '& .MuiDataGrid-overlayWrapper': {
              backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
            },
            '& .MuiDataGrid-virtualScrollerRenderZone': {
              backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
            },
            '& .MuiDataGrid-columnHeader:focus': {
              outline: 'none !important',
              backgroundColor: darkMode ? '#2d2d2d !important' : '#f5f5f5'
            },
            '& .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none !important',
              backgroundColor: darkMode ? '#2d2d2d !important' : '#f5f5f5'
            },
            '& .MuiDataGrid-cell:focus': {
              outline: 'none !important'
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            }
          },
          [`& .${gridClasses.columnHeaders}`]: {
            backgroundColor: darkMode ? '#2d2d2d !important' : '#f5f5f5',
            fontSize: '0.75rem',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0'}`,
            minHeight: '40px',
            color: darkMode ? '#ffffff' : '#000000',
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: darkMode ? '#2d2d2d !important' : '#f5f5f5',
              color: darkMode ? '#ffffff !important' : '#000000',
              border: 'none !important',
              outline: 'none !important',
              '&:focus': {
                outline: 'none !important',
                border: 'none !important'
              },
              '&:focus-within': {
                outline: 'none !important',
                border: 'none !important'
              }
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: darkMode ? '#ffffff !important' : '#000000',
              fontWeight: 600
            },
            '& .MuiDataGrid-iconButtonContainer': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiDataGrid-sortIcon': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiDataGrid-columnSeparator': {
              color: darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
            }
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            fontWeight: 600,
            fontSize: '0.75rem',
            color: darkMode ? '#ffffff !important' : '#000000 !important'
          },
          [`& .${gridClasses.row}`]: {
            backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff !important',
            color: darkMode ? '#ffffff' : '#000000',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : '#f0f0f0'}`,
            transition: 'all 0.2s ease-in-out',
            '&.odd-row': {
              backgroundColor: darkMode ? '#242424 !important' : '#f9f9f9 !important',
              boxShadow: darkMode 
                ? '0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
            },
            '&.even-row': {
              backgroundColor: darkMode ? '#1a1a1a !important' : '#ffffff !important',
              boxShadow: darkMode 
                ? '0 2px 6px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.03)'
                : '0 2px 6px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(0,0,0,0.03)',
            },
            '&:hover': {
              backgroundColor: darkMode ? '#2d2d2d' : '#f8f9fa',
              boxShadow: darkMode 
                ? '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                : '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
              transform: 'translateY(-1px)',
            },
            '&.Mui-selected': {
              backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.1)',
              boxShadow: darkMode 
                ? '0 3px 8px rgba(33, 150, 243, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 3px 8px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.4)' : 'rgba(33, 150, 243, 0.15)',
                boxShadow: darkMode 
                  ? '0 5px 15px rgba(33, 150, 243, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                  : '0 5px 15px rgba(33, 150, 243, 0.3), inset 0 1px 0 rgba(255,255,255,0.9)',
              }
            }
          },
          [`& .${gridClasses.cell}`]: {
            borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : '#f0f0f0'}`,
            padding: '4px 8px',
            fontSize: '0.75rem',
            color: darkMode ? '#ffffff' : '#000000'
          },
          [`& .${gridClasses.footerContainer}`]: {
            borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e0e0e0'}`,
            backgroundColor: darkMode ? '#2d2d2d' : '#fafafa',
            color: darkMode ? '#ffffff' : '#000000',
            '& .MuiTablePagination-root': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiTablePagination-selectLabel': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiTablePagination-displayedRows': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiSelect-select': {
              color: darkMode ? '#ffffff' : '#000000'
            },
            '& .MuiIconButton-root': {
              color: darkMode ? '#ffffff' : '#000000'
            }
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
                gap: 2,
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                color: darkMode ? '#ffffff' : '#000000'
              }}
            >
              <StorageIcon sx={{ 
                fontSize: 48, 
                color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' 
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' 
                }}
              >
                {emptyMessage}
              </Typography>
            </Box>          ) : (            <ErrorBoundary>
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
                getRowId={(row) => row.id}
                getRowClassName={(params) => 
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even-row' : 'odd-row'
                }
                slots={toolbarSlot ? { 
                  toolbar: () => toolbarSlot
                } : {}}
                slotProps={{
                  toolbar: toolbarSlot ? {} : undefined
                }}
                sx={{ 
                  height: '100%',
                  width: '100%',
                  border: 'none',
                  backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff',
                  '& .MuiDataGrid-columnHeader': {
                    outline: 'none !important',
                    '&:focus': {
                      outline: 'none !important'
                    }
                  },
                  '& .MuiDataGrid-cell': {
                    outline: 'none !important',
                    '&:focus': {
                      outline: 'none !important'
                    }
                  },
                  '& .MuiDataGrid-row': {
                    '&:focus': {
                      outline: 'none !important'
                    }
                  },
                  '& .MuiDataGrid-viewport': {
                    backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
                  },
                  '& .MuiDataGrid-window': {
                    backgroundColor: darkMode ? '#1e1e1e !important' : '#ffffff'
                  }
                }}
                {...gridProps}
              />
            </ErrorBoundary>
          )}
        </Box>
      </Paper>
    </Card>
  )
}

export default ReusableDataTable
