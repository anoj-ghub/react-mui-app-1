import React, { useState, useEffect, useCallback } from 'react'
import { Container, createTheme, ThemeProvider, CssBaseline, Box } from '@mui/material'
import DataBrowserHeader from './DataBrowserHeader'
import ConfigurationPanel from './ConfigurationPanel'
import FilterPanel from './FilterPanel'
import DataGridSection from './DataGridSection'
import RecordDetailsModal from './RecordDetailsModal'
import DisplayFieldsContainer from '../../components/DisplayFieldsContainer'
import { generateMockData } from '../../utils/mockDataGenerator'
import { getColumns } from '../../utils/columnConfig'

function DataBrowser({ environment, darkMode, setEnvironment, setDarkMode }) {
  const [selectedTable, setSelectedTable] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
  const [quickSearchText, setQuickSearchText] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Account number validation state
  const [accountNumberError, setAccountNumberError] = useState('')
  const [isAccountNumberValid, setIsAccountNumberValid] = useState(true)
  
  // Modal states
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0)

  // Create theme based on mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      ...(darkMode ? {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      } : {}),
    },
  })

  useEffect(() => {
    // Only generate data if a table is selected
    if (selectedTable) {
      setLoading(true)
      // Simulate API loading delay
      const loadingTimeout = setTimeout(() => {
        const data = generateMockData(selectedTable)
        console.log('Generated data for table:', selectedTable, 'Data:', data)
        setTableData(data)
        setLoading(false)
      }, 800) // 800ms loading delay to demonstrate spinner
      
      return () => clearTimeout(loadingTimeout)
    } else {
      // Clear data when no table is selected
      setTableData([])
      setLoading(false)
    }
    setQuickSearchText('') // Reset search when table changes
  }, [selectedTable])

  // Account number validation function
  const validateAccountNumber = (value) => {
    // Remove any non-numeric characters
    const cleanValue = value.replace(/\D/g, '')
    
    if (cleanValue.length === 0) {
      setAccountNumberError('Account number is required')
      setIsAccountNumberValid(false)
      return false
    }
    
    if (cleanValue.length < 8) {
      setAccountNumberError('Account number must be at least 8 digits')
      setIsAccountNumberValid(false)
      return false
    }
    
    if (cleanValue.length > 12) {
      setAccountNumberError('Account number cannot exceed 12 digits')
      setIsAccountNumberValid(false)
      return false
    }
    
    // If validation passes
    setAccountNumberError('')
    setIsAccountNumberValid(true)
    return true
  }

  // Handle account number change with validation
  const handleAccountNumberChange = (value) => {
    const validatedValue = validateAccountNumber(value)
    setAccountNumber(validatedValue)
  }

  const handleViewDetails = useCallback((row) => {
    const rowIndex = tableData.findIndex(r => r.id === row.id)
    setCurrentRecordIndex(rowIndex)
    setSelectedRow(row)
    setDetailsOpen(true)
  }, [tableData])

  // Separate effect for setting up columns after tableData is ready
  useEffect(() => {
    if (selectedTable && tableData.length > 0) {
      const cols = getColumns(selectedTable, handleViewDetails, tableData)
      console.log('Generated columns for table:', selectedTable, 'Columns:', cols)
      setColumns(cols)
    } else if (!selectedTable) {
      setColumns([])
    }
  }, [selectedTable, tableData, handleViewDetails])

  // Add debugging for tableData changes
  useEffect(() => {
    console.log('TableData updated:', tableData?.length || 0, 'records')
    console.log('Columns updated:', columns?.length || 0, 'columns')
  }, [tableData, columns])

  // Debug selected table changes
  useEffect(() => {
    console.log('Selected table changed to:', selectedTable)
  }, [selectedTable])

  // Sync selectedRow with currentRecordIndex when pagination occurs
  useEffect(() => {
    if (detailsOpen && tableData.length > 0 && currentRecordIndex >= 0 && currentRecordIndex < tableData.length) {
      setSelectedRow(tableData[currentRecordIndex])
    }
  }, [currentRecordIndex, tableData, detailsOpen])

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedRow(null)
    setCurrentRecordIndex(0)
  }

  const handleClear = () => {
    // Reset all form fields
    setAccountNumber('')
    setSelectedDate('')
    setQuickSearchText('')
    
    // Reset account number validation
    setAccountNumberError('')
    setIsAccountNumberValid(true)
    
    // Reset table selection to empty (no table selected)
    setSelectedTable('')
    
    // Close modal if open
    setDetailsOpen(false)
    setSelectedRow(null)
    setCurrentRecordIndex(0)
    
    // Clear the grid - set empty data and columns
    setTableData([])
    setColumns([])
    setLoading(false) // Reset loading state
  }

  const handleSubmit = () => {
    console.log('Form submitted with:', {
      table: selectedTable,
      account: accountNumber,
      environment,
      date: selectedDate,
      search: quickSearchText
    })
  }

  // Test if data generation actually works
  useEffect(() => {
    console.log('Testing data generation for customer_accounts:')
    const testData = generateMockData('customer_accounts')
    console.log('Sample data:', testData?.slice(0, 2))
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 1, 
          height: '100vh', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <DataBrowserHeader environment={environment} darkMode={darkMode} />
        
        <ConfigurationPanel
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          accountNumber={accountNumber}
          setAccountNumber={handleAccountNumberChange}
          accountNumberError={accountNumberError}
          isAccountNumberValid={isAccountNumberValid}
          handleSubmit={handleSubmit}
          handleClear={handleClear}
          darkMode={darkMode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        <FilterPanel
          selectedTable={selectedTable}
          darkMode={darkMode}
        />

        {/* Display Fields Container - Show when no table is selected */}
        {/* {!selectedTable && (
          <Box sx={{ mb: 3 }}>
            <DisplayFieldsContainer 
              darkMode={darkMode}
              data={{
                fullName: 'Sarah Johnson',
                email: 'sarah.johnson@techcorp.com',
                phone: '+1 (555) 987-6543',
                location: 'San Francisco, CA, USA',
                department: 'Data Analytics',
                joinDate: '2023-03-20',
                accountNumber: 'ACC-2024-005678',
                cardType: 'Executive Platinum',
                securityLevel: 'Level 4 - Executive',
                language: 'English (US)'
              }}
            />
          </Box>
        )} */}

        <Box sx={{ flexGrow: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <DataGridSection
            selectedTable={selectedTable}
            tableData={tableData}
            columns={columns}
            quickSearchText={quickSearchText}
            setQuickSearchText={setQuickSearchText}
            environment={environment}
            darkMode={darkMode}
            loading={loading}
          />
        </Box>

        <RecordDetailsModal
          detailsOpen={detailsOpen}
          selectedRow={selectedRow}
          selectedTable={selectedTable}
          currentRecordIndex={currentRecordIndex}
          setCurrentRecordIndex={setCurrentRecordIndex}
          tableData={tableData}
          environment={environment}
          onClose={handleCloseDetails}
          darkMode={darkMode}
        />
      </Container>
    </ThemeProvider>
  )
}

export default DataBrowser