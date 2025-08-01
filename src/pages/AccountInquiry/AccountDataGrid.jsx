/**
 * @fileoverview Account data grid component with account number search
 * @author System  // Filter data based on account number search and general search
  const filteredData = useMemo(() => {
    let result = accountData

    // Apply account number filter first
    if (searchAccountNumber && searchAccountNumber.trim() !== '') {
      result = result.filter(row =>
        row.accountNumber.includes(searchAccountNumber.trim())
      )
    }

    // Apply general search filter
    if (generalSearchText && generalSearchText.trim() !== '') {
      const searchLower = generalSearchText.toLowerCase().trim()
      result = result.filter(row => {
        return Object.values(row).some(value => {
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchLower)
        })
      })
    }

    return result
  }, [accountData, searchAccountNumber, generalSearchText])ion 1.0.0
 */

import { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Button,
  InputAdornment,
  Skeleton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ReusableDataTable from '../../components/ReusableDataTable'
import DataGridToolbar from '../../components/DataGridToolbar'

/**
 * Account data grid component with account number search
 * 
 * Features:
 * - Error row highlighting in red
 * - Account number search (max 15 digits)
 * - Submit and clear buttons
 * - Status indicators
 * - Click to view details
 * - Responsive design
 * - Data Browser style appearance
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Loading state
 * @param {Function} props.onRowClick - Row click handler
 * @param {boolean} props.darkMode - Dark mode state
 * @param {string} props.environment - Current environment
 * @returns {JSX.Element} Account data grid
 */
function AccountDataGrid({ data, loading, onRowClick, darkMode, environment }) {
  const [accountNumber, setAccountNumber] = useState('')
  const [searchAccountNumber, setSearchAccountNumber] = useState('')
  const [generalSearchText, setGeneralSearchText] = useState('')
  const [gridDensity, setGridDensity] = useState('compact') // compact, standard, comfortable
  const [visibleColumns, setVisibleColumns] = useState({
    actions: true,
    accountNumber: true,
    customerName: true,
    accountType: true,
    balance: true,
    status: true,
    lastActivity: true,
    branch: true
  })

  // Handle account number input (numeric only, max 15 digits)
  const handleAccountNumberChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digits
    if (value.length <= 15) {
      setAccountNumber(value)
    }
  }, [])

  // Handle submit button
  const handleSubmit = useCallback(() => {
    setSearchAccountNumber(accountNumber)
  }, [accountNumber])

  // Handle clear button
  const handleClear = useCallback(() => {
    setAccountNumber('')
    setSearchAccountNumber('')
  }, [])

  // Generate mock account data with some error records
  const accountData = useMemo(() => {
    if (!data || data.length === 0) {
      // Generate stable mock data for demonstration (using index-based values instead of Math.random)
      return Array.from({ length: 50 }, (_, index) => ({
        id: `ACC${String(index + 1).padStart(6, '0')}`,
        accountNumber: `${String(index + 1).padStart(12, '0')}`,
        customerName: `Customer ${index + 1}`,
        accountType: ['Checking', 'Savings', 'Business', 'Investment'][index % 4],
        balance: (index * 1987 + 1000) % 100000 + 1000, // Stable pseudo-random using index
        status: index % 7 === 0 ? 'Error' : ['Active', 'Inactive', 'Pending'][index % 3],
        lastActivity: new Date(Date.now() - (index * 86400000)).toISOString().split('T')[0], // Stable dates
        branch: `Branch ${(index % 10) + 1}`,
        hasError: index % 7 === 0, // Every 7th record has an error
        errorMessage: index % 7 === 0 ? 'Account validation failed' : null
      }))
    }
    return data.map((item, index) => ({
      ...item,
      hasError: index % 7 === 0,
      errorMessage: index % 7 === 0 ? 'Account validation failed' : null
    }))
  }, [data])

  // Filter data based on account number search
  const filteredData = useMemo(() => {
    if (!searchAccountNumber || searchAccountNumber.trim() === '') {
      return accountData
    }
    
    return accountData.filter(row =>
      row.accountNumber?.toString().includes(searchAccountNumber)
    )
  }, [accountData, searchAccountNumber])

  // Define columns for ReusableDataTable
  const allColumns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              const index = filteredData.findIndex(row => row.id === params.row.id)
              onRowClick(params.row, index)
            }}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            <VisibilityIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )
    },
    {
      field: 'accountNumber',
      headerName: 'Account Number',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {params.value}
          </Typography>
          {params.row.hasError && (
            <Tooltip title={params.row.errorMessage}>
              <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
            </Tooltip>
          )}
        </Box>
      )
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'accountType',
      headerName: 'Account Type',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Checking' ? 'primary' :
            params.value === 'Savings' ? 'success' :
            params.value === 'Business' ? 'warning' : 'info'
          }
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
      )
    },
    {
      field: 'balance',
      headerName: 'Balance',
      width: 120,
      type: 'number',
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: 'monospace', 
            fontWeight: 600,
            color: params.value > 50000 ? 'success.main' : 'text.primary'
          }}
        >
          ${params.value?.toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value === 'Active' ? 'success' :
            params.value === 'Error' ? 'error' :
            params.value === 'Pending' ? 'warning' : 'default'
          }
          icon={params.value === 'Active' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : undefined}
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
      )
    },
    {
      field: 'lastActivity',
      headerName: 'Last Activity',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      )
    },
    {
      field: 'branch',
      headerName: 'Branch',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {params.value}
        </Typography>
      )
    }
  ]

  // Filter columns based on visibility settings
  const columns = useMemo(() => {
    return allColumns.filter(column => {
      const fieldKey = column.field
      return visibleColumns[fieldKey] !== false
    })
  }, [allColumns, visibleColumns])

  // Handle toolbar button clicks - placed after data definitions to avoid reference errors
  const handleColumnsClick = useCallback(() => {
    console.log('Columns management clicked')
    
    // Toggle between showing all columns and hiding some
    const allVisible = Object.values(visibleColumns).every(visible => visible)
    
    if (allVisible) {
      // Hide some columns to demonstrate functionality
      setVisibleColumns(prev => ({
        ...prev,
        lastActivity: false,
        branch: false
      }))
    } else {
      // Show all columns
      setVisibleColumns({
        actions: true,
        accountNumber: true,
        customerName: true,
        accountType: true,
        balance: true,
        status: true,
        lastActivity: true,
        branch: true
      })
    }
  }, [visibleColumns])

  const handleDensityClick = useCallback(() => {
    console.log('Density toggle clicked')
    
    // Cycle through density options
    const densityOptions = ['compact', 'standard', 'comfortable']
    const currentIndex = densityOptions.indexOf(gridDensity)
    const nextIndex = (currentIndex + 1) % densityOptions.length
    const nextDensity = densityOptions[nextIndex]
    
    setGridDensity(nextDensity)
    
    // Show notification of change
    const densityLabels = {
      compact: 'Compact (25 rows)',
      standard: 'Standard (15 rows)', 
      comfortable: 'Comfortable (10 rows)'
    }
    
    // Create a temporary notification element
    const notification = document.createElement('div')
    notification.textContent = `Grid density changed to: ${densityLabels[nextDensity]}`
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${darkMode ? '#333' : '#fff'};
      color: ${darkMode ? '#fff' : '#333'};
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: system-ui;
      border: 1px solid ${darkMode ? '#555' : '#ddd'};
    `
    
    document.body.appendChild(notification)
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 2000)
  }, [gridDensity, darkMode])

  const handleExportClick = useCallback(() => {
    console.log('Export clicked', { recordCount: filteredData.length })
    const exportData = {
      metadata: {
        title: 'Account Inquiry Data Export',
        exportDate: new Date().toISOString(),
        environment: environment,
        totalRecords: filteredData.length,
        filters: {
          accountNumber: searchAccountNumber || 'None',
          generalSearch: generalSearchText || 'None'
        }
      },
      data: filteredData.map(row => ({
        accountNumber: row.accountNumber,
        customerName: row.customerName,
        accountType: row.accountType,
        balance: row.balance,
        status: row.status,
        lastActivity: row.lastActivity,
        branch: row.branch,
        hasError: row.hasError,
        errorMessage: row.errorMessage
      }))
    }
    
    // Create and download JSON file
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `account-inquiry-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    alert(`Successfully exported ${filteredData.length} records!\n\nFile: account-inquiry-export-${new Date().toISOString().split('T')[0]}.json\n\nThe file has been downloaded to your Downloads folder.`)
  }, [filteredData, environment, searchAccountNumber, generalSearchText])

  // Custom search controls component - memoized to prevent re-creation on each render
  const searchControls = useMemo(() => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      mb: 3,
      p: 3,
      borderRadius: 3,
      background: darkMode 
        ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%)'
        : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffcc80 100%)',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}`,
      boxShadow: darkMode 
        ? '0 4px 20px rgba(0,0,0,0.4), 0 1px 3px rgba(255,255,255,0.1) inset'
        : '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(255,255,255,0.8) inset',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(247,147,30,0.05) 50%, rgba(255,140,66,0.15) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.9) 100%)',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 1
      },
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: darkMode 
          ? '0 6px 25px rgba(0,0,0,0.5), 0 2px 5px rgba(255,255,255,0.1) inset'
          : '0 6px 25px rgba(0,0,0,0.12), 0 2px 5px rgba(255,255,255,0.9) inset',
      },
      '& > *': {
        position: 'relative',
        zIndex: 2
      }
    }}>
      <TextField
        label="Account Number"
        value={accountNumber}
        onChange={handleAccountNumberChange}
        placeholder="Enter account number (max 15 digits)"
        variant="outlined"
        size="small"
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          maxLength: 15
        }}
        sx={{
          minWidth: 300,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
          }
        }}
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!accountNumber}
        startIcon={<SearchIcon />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 100
        }}
      >
        Submit
      </Button>
      <Button
        variant="outlined"
        onClick={handleClear}
        startIcon={<ClearIcon />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 100
        }}
      >
        Clear
      </Button>
    </Box>
  ), [accountNumber, darkMode, handleAccountNumberChange, handleSubmit, handleClear])

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        {searchControls}
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            height={52} 
            sx={{ mb: 1, borderRadius: 1 }} 
          />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {searchControls}
      <ReusableDataTable
        title="Customer Accounts"
        data={filteredData}
        columns={columns}
        loading={loading}
        darkMode={darkMode}
        height="600px"
        initialPageSize={gridDensity === 'compact' ? 25 : gridDensity === 'standard' ? 15 : 10}
        pageSizeOptions={gridDensity === 'compact' ? [10, 25, 50, 100] : gridDensity === 'standard' ? [5, 15, 30, 50] : [5, 10, 20, 30]}
        enableSearch={false} // Disable built-in search since we have custom search
        emptyMessage="No account data found"
        onRowClick={(params) => {
          const index = filteredData.findIndex(row => row.id === params.id)
          onRowClick(params, index)
        }}
        containerSx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
        toolbarSlot={
          <DataGridToolbar
            title="Table 3 Data"
            recordCount={filteredData.length}
            onSearch={setGeneralSearchText}
            onColumnsClick={handleColumnsClick}
            onDensityClick={handleDensityClick}
            onExportClick={handleExportClick}
            darkMode={darkMode}
          />
        }
        gridProps={{
          density: gridDensity,
          getRowClassName: (params) => {
            const isEven = params.indexRelativeToCurrentPage % 2 === 0
            const isError = params.row.hasError
            let classes = isEven ? 'even-row' : 'odd-row'
            if (isError) classes += ' error-row'
            return classes
          },
          sx: {
            '& .error-row': {
              backgroundColor: darkMode ? 'rgba(244, 67, 54, 0.15) !important' : 'rgba(244, 67, 54, 0.08) !important',
              '&:hover': {
                backgroundColor: darkMode ? 'rgba(244, 67, 54, 0.2) !important' : 'rgba(244, 67, 54, 0.12) !important',
              }
            }
          }
        }}
      />
    </Box>
  )
}

export default AccountDataGrid
