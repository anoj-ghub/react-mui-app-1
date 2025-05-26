import React from 'react'
import { 
  Box, Typography, Chip, TextField, IconButton, InputAdornment, 
  Paper, Card
} from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import StorageIcon from '@mui/icons-material/Storage'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import CustomToolbar from './CustomToolbar'

function DataGridSection({ 
  selectedTable, 
  tableData, 
  columns, 
  quickSearchText, 
  setQuickSearchText, 
  environment,
  darkMode 
}) {

  // Filter rows based on search text
  const filteredRows = React.useMemo(() => {
    if (!quickSearchText.trim()) return tableData
    
    const searchTerms = quickSearchText.toLowerCase().split(' ').filter(term => term.length > 0)
    
    return tableData.filter(row => {
      return searchTerms.every(term =>
        Object.values(row).some(value => 
          value != null && value.toString().toLowerCase().includes(term)
        )
      )
    })
  }, [tableData, quickSearchText])

  return (    <Card 
      elevation={3} 
      sx={{ 
        borderRadius: 2,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(240,147,251,0.2) 0%, rgba(245,87,108,0.2) 100%)'
          : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        p: 0.25, // Reduced padding from 0.5 to 0.25 for thinner border
        height: '100%', // Added height: 100%
        display: 'flex', // Added flex display
        flexDirection: 'column' // Added flex direction
      }}
    ><Paper 
        elevation={0} 
        sx={{ 
          p: 1.5,
          borderRadius: 1.5,
          background: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          height: '100%' // Changed from calc(100vh - 400px) to 100%
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StorageIcon sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              {selectedTable || 'No Table Selected'} Data
            </Typography>            <Chip 
              label={`${filteredRows.length} records`} 
              color={filteredRows.length > 0 ? "primary" : "default"}
              size="small"
              sx={{ ml: 2, height: 18, fontSize: '0.7rem' }}
            />
          </Box>

          <TextField
            size="small"
            label="Quick Search"
            value={quickSearchText}
            onChange={(e) => setQuickSearchText(e.target.value)}
            variant="outlined"
            inputProps={{
              maxLength: 50,
              style: { fontSize: '0.8rem' }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '0.9rem', color: 'action.active' }} />
                </InputAdornment>
              ),
              endAdornment: quickSearchText && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setQuickSearchText('')}
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
            placeholder="Search across all columns (max 50 chars)..."
          />
        </Box>        <Box sx={{ 
          flexGrow: 1,
          border: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e0e0e0'}`,
          borderRadius: 1,
          overflow: 'hidden',
          height: '700px', // Set reasonable height for 25 rows
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
          }        }}>        <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              }
            }}            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            showCellVerticalBorder
            showColumnVerticalBorder
            paginationMode="client"
            disableColumnFilter
            disableColumnMenu
            slots={{ 
              toolbar: (props) => (                <CustomToolbar 
                  {...props}
                  tableData={filteredRows}
                  selectedTable={selectedTable}
                  environment={environment}
                />
              )
            }}
            sx={{ 
              height: '100%',
              width: '100%',
              border: 'none'
            }}
          />
        </Box>
      </Paper>
    </Card>
  )
}

export default DataGridSection