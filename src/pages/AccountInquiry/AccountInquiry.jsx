/**
 * @fileoverview Account Inquiry page component for customer account data management
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar,
  Fade
} from '@mui/material'
import AccountInquiryHeader from './AccountInquiryHeader'
import AccountDataGrid from './AccountDataGrid'
import AccountDetailsModal from './AccountDetailsModal'
import AccountSearchPanel from './AccountSearchPanel'
import useTableData from '../../hooks/useTableData'

/**
 * Account Inquiry page component
 * 
 * Features:
 * - Fixed table selection (Customer Accounts)
 * - Data grid with error row highlighting
 * - Account details modal with 8 cards
 * - Interactive components and styling
 * - Error handling and notifications
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Dark mode state
 * @returns {JSX.Element} Account Inquiry page
 */
function AccountInquiry({ darkMode }) {
  // Fixed table name for Customer Accounts
  const selectedTable = 'Customer Accounts'
  
  // State management
  const [selectedRow, setSelectedRow] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  const [selectedOption, setSelectedOption] = useState('option-1') // Radio button state

  // Custom hook for table data
  const { 
    data: tableData, 
    loading, 
    error, 
    clearInputs,
    accountNumber,
    setAccountNumber,
    environment,
    setEnvironment,
    date,
    setDate
  } = useTableData()

  /**
   * Handles row click to open details modal
   * @param {Object} row - Selected row data
   * @param {number} index - Row index
   */
  const handleRowClick = (row, index) => {
    setSelectedRow(row)
    setCurrentRecordIndex(index)
    setDetailsOpen(true)
  }

  /**
   * Closes the details modal
   */
  const handleCloseDetails = () => {
    setDetailsOpen(false)
    setSelectedRow(null)
  }

  /**
   * Shows notification snackbar
   * @param {string} message - Message to display
   * @param {string} severity - Severity level
   */
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }

  /**
   * Closes notification snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  /**
   * Handles search action
   */
  const handleSearch = () => {
    // The useTableData hook automatically refetches when parameters change
    // This function can be used for additional search logic if needed
    showNotification('Searching accounts...', 'info')
  }

  /**
   * Handles refresh action
   */
  const handleRefresh = () => {
    clearInputs()
    showNotification('Data refreshed successfully', 'success')
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Typography 
              variant="button" 
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleRefresh}
            >
              Retry
            </Typography>
          }
        >
          Failed to load account data: {error.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Fade in timeout={300}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Page Header */}
        <AccountInquiryHeader
          environment={environment}
          darkMode={darkMode}
          loading={loading}
        />

        {/* Search Panel */}
        <AccountSearchPanel
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          environment={environment}
          setEnvironment={setEnvironment}
          date={date}
          setDate={setDate}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onSearch={handleSearch}
          onClear={clearInputs}
          onRefresh={handleRefresh}
          darkMode={darkMode}
          loading={loading}
        />

        {/* Main Content */}
        <Paper 
          elevation={2} 
          sx={{ 
            mt: 3,
            borderRadius: 3,
            overflow: 'hidden',
            background: darkMode 
              ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Data Grid */}
            <AccountDataGrid
              data={tableData}
              loading={loading}
              onRowClick={handleRowClick}
              darkMode={darkMode}
              environment={environment}
            />
          </Box>
        </Paper>

        {/* Account Details Modal */}
        <AccountDetailsModal
          open={detailsOpen}
          onClose={handleCloseDetails}
          selectedRow={selectedRow}
          selectedTable={selectedTable}
          currentRecordIndex={currentRecordIndex}
          setCurrentRecordIndex={setCurrentRecordIndex}
          tableData={tableData || []}
          environment={environment}
          darkMode={darkMode}
        />

        {/* Notification Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  )
}

export default AccountInquiry
