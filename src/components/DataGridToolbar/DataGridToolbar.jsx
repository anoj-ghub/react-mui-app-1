/**
 * @fileoverview Custom DataGrid toolbar with search and action buttons
 * @author System
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import FilterListIcon from '@mui/icons-material/FilterList'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ClearIcon from '@mui/icons-material/Clear'

/**
 * Custom DataGrid toolbar with search and action buttons
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Table title
 * @param {number} props.recordCount - Number of records
 * @param {Function} props.onSearch - Search handler
 * @param {Function} props.onColumnsClick - Columns button handler
 * @param {Function} props.onDensityClick - Density button handler
 * @param {Function} props.onExportClick - Export button handler
 * @param {boolean} props.darkMode - Dark mode state
 * @returns {JSX.Element} DataGrid toolbar
 */
function DataGridToolbar({ 
  title = "Table Data", 
  recordCount = 0, 
  onSearch, 
  onColumnsClick,
  onDensityClick,
  onExportClick,
  darkMode = false 
}) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchChange = (event) => {
    const value = event.target.value
    setSearchValue(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    if (onSearch) {
      onSearch('')
    }
  }

  const handleColumnsClick = () => {
    if (onColumnsClick) {
      onColumnsClick()
    } else {
      // Default action - show columns dialog
      console.log('Columns button clicked - no handler provided')
    }
  }

  const handleDensityClick = () => {
    if (onDensityClick) {
      onDensityClick()
    } else {
      // Default action - toggle density
      console.log('Density button clicked - no handler provided')
    }
  }

  const handleExportClick = () => {
    if (onExportClick) {
      onExportClick()
    } else {
      // Default action - export data
      console.log('Export button clicked - no handler provided')
    }
  }

  return (
    <Box sx={{ 
      p: 2, 
      borderBottom: 1, 
      borderColor: 'divider',
      backgroundColor: darkMode ? '#2d2d2d' : '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      flexWrap: 'wrap'
    }}>
      {/* Left side - Title and record count */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            color: darkMode ? '#ffffff' : '#000000'
          }}
        >
          {title}
        </Typography>
        <Chip
          label={`${recordCount} records`}
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.1)',
            color: darkMode ? '#64b5f6' : '#1976d2',
            borderColor: darkMode ? '#64b5f6' : '#1976d2'
          }}
        />
      </Box>

      {/* Center - Search */}
      <Box sx={{ flex: 1, maxWidth: 400 }}>
        <TextField
          size="small"
          placeholder="Search across all columns (max 50 chars)"
          value={searchValue}
          onChange={handleSearchChange}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              '& fieldset': {
                borderColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
              },
              '&:hover fieldset': {
                borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputBase-input': {
              color: darkMode ? '#ffffff' : '#000000'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }} />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  sx={{ color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Columns">
          <IconButton 
            size="small"
            onClick={handleColumnsClick}
            sx={{ 
              color: darkMode ? '#ffffff' : '#000000',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
              }
            }}
          >
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Density">
          <IconButton 
            size="small"
            onClick={handleDensityClick}
            sx={{ 
              color: darkMode ? '#ffffff' : '#000000',
              backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'
              }
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          size="small"
          startIcon={<FileDownloadIcon />}
          onClick={handleExportClick}
          sx={{
            background: 'linear-gradient(45deg, #FF6B35 30%, #FF8E53 90%)',
            color: 'white',
            textTransform: 'none',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5722 30%, #FF7043 90%)',
              boxShadow: '0 4px 8px 3px rgba(255, 87, 34, 0.3)'
            }
          }}
        >
          Export JSON ({recordCount})
        </Button>
      </Box>
    </Box>
  )
}

export default DataGridToolbar
