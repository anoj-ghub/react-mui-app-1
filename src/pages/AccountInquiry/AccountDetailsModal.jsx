/**
 * @fileoverview Account details modal with 8 interactive cards
 * @author System
 * @version 1.0.0
 */

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Grid,
  Fade,
  Slide
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AccountDataCard from './AccountDataCard'
import VerticalDataModal from './VerticalDataModal'
import ErrorRecordsModal from './ErrorRecordsModal'

/**
 * Account details modal with 8 data cards
 * 
 * Features:
 * - 8 different data cards with up to 20 fields each
 * - Navigation between records
 * - Vertical data view modal
 * - Error records modal
 * - Interactive components and styling
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {Object} props.selectedRow - Selected row data
 * @param {string} props.selectedTable - Selected table name
 * @param {number} props.currentRecordIndex - Current record index
 * @param {Function} props.setCurrentRecordIndex - Set record index
 * @param {Array} props.tableData - All table data
 * @param {string} props.environment - Current environment
 * @param {boolean} props.darkMode - Dark mode state
 * @returns {JSX.Element} Account details modal
 */
function AccountDetailsModal({
  open,
  onClose,
  selectedRow,
  selectedTable,
  currentRecordIndex,
  setCurrentRecordIndex,
  tableData,
  environment,
  darkMode
}) {
  const [verticalModal, setVerticalModal] = useState({ open: false, cardTitle: '', data: [] })
  const [errorModal, setErrorModal] = useState({ open: false, cardTitle: '', errors: [] })

  /**
   * Navigates to the previous record
   */
  const handlePreviousRecord = () => {
    if (currentRecordIndex > 0) {
      setCurrentRecordIndex(currentRecordIndex - 1)
    }
  }

  /**
   * Navigates to the next record
   */
  const handleNextRecord = () => {
    if (currentRecordIndex < tableData.length - 1) {
      setCurrentRecordIndex(currentRecordIndex + 1)
    }
  }

  /**
   * Opens vertical data modal
   * @param {string} cardTitle - Card title
   * @param {Array} data - Card data
   */
  const handleOpenVerticalModal = (cardTitle, data) => {
    setVerticalModal({ open: true, cardTitle, data })
  }

  /**
   * Closes vertical data modal
   */
  const handleCloseVerticalModal = () => {
    setVerticalModal({ open: false, cardTitle: '', data: [] })
  }

  /**
   * Opens error records modal
   * @param {string} cardTitle - Card title
   * @param {Array} errors - Error data
   */
  const handleOpenErrorModal = (cardTitle, errors) => {
    setErrorModal({ open: true, cardTitle, errors })
  }

  /**
   * Closes error records modal
   */
  const handleCloseErrorModal = () => {
    setErrorModal({ open: false, cardTitle: '', errors: [] })
  }

  // TEST MODE: Set to true to test "Data not available" functionality
  const TEST_EMPTY_DATA = true // Change this to true to test empty data

  // Dynamic empty data based on current record for testing
  const shouldShowEmptyData = (cardIndex) => {
    if (!TEST_EMPTY_DATA) return false
    
    // Different records show different missing data patterns
    const recordIndex = currentRecordIndex % 5 // Cycle through 5 patterns
    
    switch (recordIndex) {
      case 0: // First record: Customer Details and Products missing
        return cardIndex === 1 || cardIndex === 4 // Customer Details, Products & Services
      case 1: // Second record: Security and Risk missing  
        return cardIndex === 3 || cardIndex === 5 // Security & Compliance, Risk Assessment
      case 2: // Third record: Balance and Alerts missing
        return cardIndex === 2 || cardIndex === 6 // Balance & Transactions, Alerts & Notifications
      case 3: // Fourth record: Only Customer Details missing
        return cardIndex === 1 // Customer Details
      case 4: // Fifth record: Products and Relationship missing
        return cardIndex === 4 || cardIndex === 7 // Products & Services, Relationship & History
      default:
        return false
    }
  }

  // Generate data for 8 different cards
  const cardData = [
    {
      title: 'Account Information',
      icon: '🏦',
      color: '#2196F3',
      data: [
        { label: 'Account Number', value: selectedRow?.accountNumber || 'N/A', type: 'text' },
        { label: 'Account Type', value: selectedRow?.accountType || 'N/A', type: 'chip' },
        { label: 'Account Status', value: selectedRow?.status || 'N/A', type: 'status' },
        { label: 'Opening Date', value: '2020-01-15', type: 'date' },
        { label: 'Last Activity', value: selectedRow?.lastActivity || 'N/A', type: 'date' },
        { label: 'Branch Code', value: selectedRow?.branch || 'N/A', type: 'text' },
        { label: 'Currency', value: 'USD', type: 'text' },
        { label: 'Interest Rate', value: '2.5%', type: 'text' },
        { label: 'Minimum Balance', value: '$500', type: 'amount' },
        { label: 'Account Manager', value: 'John Smith', type: 'text' }
      ]
    },
    {
      title: 'Customer Details',
      icon: '👤',
      color: '#4CAF50',
      data: shouldShowEmptyData(1) ? [] : [
        { label: 'Customer Name', value: selectedRow?.customerName || 'N/A', type: 'text' },
        { label: 'Customer ID', value: selectedRow?.id || 'N/A', type: 'text' },
        { label: 'SSN', value: 'XXX-XX-1234', type: 'text' },
        { label: 'Date of Birth', value: '1985-03-20', type: 'date' },
        { label: 'Phone Number', value: '+1 (555) 123-4567', type: 'text' },
        { label: 'Email', value: 'customer@example.com', type: 'text' },
        { label: 'Address', value: '123 Main St, City, State 12345', type: 'text' },
        { label: 'Employment Status', value: 'Employed', type: 'chip' },
        { label: 'Annual Income', value: '$75,000', type: 'amount' },
        { label: 'Credit Score', value: '750', type: 'text' }
      ]
    },
    {
      title: 'Balance & Transactions',
      icon: '💰',
      color: '#FF9800',
      data: shouldShowEmptyData(2) ? [] : [
        { label: 'Current Balance', value: selectedRow?.balance || 0, type: 'amount' },
        { label: 'Available Balance', value: (selectedRow?.balance || 0) - 100, type: 'amount' },
        { label: 'Pending Transactions', value: '3', type: 'text' },
        { label: 'Last Deposit', value: '$2,500', type: 'amount' },
        { label: 'Last Withdrawal', value: '$150', type: 'amount' },
        { label: 'Monthly Average', value: '$45,000', type: 'amount' },
        { label: 'Transaction Count (30d)', value: '28', type: 'text' },
        { label: 'Largest Transaction', value: '$15,000', type: 'amount' },
        { label: 'Interest Earned (YTD)', value: '$245', type: 'amount' },
        { label: 'Fees Charged (YTD)', value: '$45', type: 'amount' }
      ]
    },
    {
      title: 'Security & Compliance',
      icon: '🔐',
      color: '#9C27B0',
      data: shouldShowEmptyData(3) ? [] : [
        { label: 'Security Level', value: 'High', type: 'chip' },
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'status' },
        { label: 'Last Login', value: '2024-08-01 09:30:00', type: 'datetime' },
        { label: 'Failed Login Attempts', value: '0', type: 'text' },
        { label: 'KYC Status', value: 'Verified', type: 'status' },
        { label: 'AML Risk Score', value: 'Low', type: 'chip' },
        { label: 'Sanctions Check', value: 'Clear', type: 'status' },
        { label: 'Document Verification', value: 'Complete', type: 'status' },
        { label: 'Last Security Review', value: '2024-07-15', type: 'date' },
        { label: 'Compliance Officer', value: 'Jane Doe', type: 'text' }
      ]
    },
    {
      title: 'Products & Services',
      icon: '📋',
      color: '#F44336',
      data: shouldShowEmptyData(4) ? [] : [
        { label: 'Primary Product', value: selectedRow?.accountType || 'N/A', type: 'chip' },
        { label: 'Additional Products', value: 'Credit Card, Loan', type: 'text' },
        { label: 'Online Banking', value: 'Active', type: 'status' },
        { label: 'Mobile App', value: 'Registered', type: 'status' },
        { label: 'Debit Card', value: 'Active', type: 'status' },
        { label: 'Overdraft Protection', value: 'Enabled', type: 'status' },
        { label: 'Direct Deposit', value: 'Setup', type: 'status' },
        { label: 'Auto Pay Services', value: '5 Active', type: 'text' },
        { label: 'Investment Account', value: 'Linked', type: 'status' },
        { label: 'Insurance Products', value: '2 Policies', type: 'text' }
      ]
    },
    {
      title: 'Risk Assessment',
      icon: '⚠️',
      color: '#607D8B',
      data: shouldShowEmptyData(5) ? [] : [
        { label: 'Risk Rating', value: selectedRow?.hasError ? 'High' : 'Low', type: 'chip' },
        { label: 'Credit Risk', value: 'Moderate', type: 'chip' },
        { label: 'Operational Risk', value: 'Low', type: 'chip' },
        { label: 'Fraud Risk', value: selectedRow?.hasError ? 'High' : 'Low', type: 'chip' },
        { label: 'Liquidity Risk', value: 'Low', type: 'chip' },
        { label: 'Market Risk', value: 'Medium', type: 'chip' },
        { label: 'Concentration Risk', value: 'Low', type: 'chip' },
        { label: 'Regulatory Risk', value: 'Low', type: 'chip' },
        { label: 'Last Risk Review', value: '2024-07-01', type: 'date' },
        { label: 'Next Review Date', value: '2024-10-01', type: 'date' }
      ]
    },
    {
      title: 'Alerts & Notifications',
      icon: '🔔',
      color: '#795548',
      data: shouldShowEmptyData(6) ? [] : [
        { label: 'Active Alerts', value: selectedRow?.hasError ? '3' : '0', type: 'text' },
        { label: 'Critical Alerts', value: selectedRow?.hasError ? '1' : '0', type: 'text' },
        { label: 'Low Balance Alert', value: 'Enabled', type: 'status' },
        { label: 'Large Transaction Alert', value: 'Enabled', type: 'status' },
        { label: 'Login Alert', value: 'Enabled', type: 'status' },
        { label: 'Payment Due Alert', value: 'Enabled', type: 'status' },
        { label: 'Security Alert', value: selectedRow?.hasError ? 'Active' : 'None', type: 'status' },
        { label: 'Marketing Preferences', value: 'Email Only', type: 'text' },
        { label: 'SMS Notifications', value: 'Enabled', type: 'status' },
        { label: 'Push Notifications', value: 'Enabled', type: 'status' }
      ]
    },
    {
      title: 'Relationship & History',
      icon: '📈',
      color: '#00BCD4',
      data: shouldShowEmptyData(7) ? [] : [
        { label: 'Customer Since', value: '2020-01-15', type: 'date' },
        { label: 'Relationship Length', value: '4 years 7 months', type: 'text' },
        { label: 'Total Lifetime Value', value: '$125,000', type: 'amount' },
        { label: 'Product Usage Score', value: '8.5/10', type: 'text' },
        { label: 'Satisfaction Rating', value: '4.8/5', type: 'text' },
        { label: 'Referrals Made', value: '3', type: 'text' },
        { label: 'Support Tickets', value: '12', type: 'text' },
        { label: 'Last Contact', value: '2024-07-25', type: 'date' },
        { label: 'Preferred Channel', value: 'Mobile App', type: 'text' },
        { label: 'Relationship Manager', value: 'Sarah Johnson', type: 'text' }
      ]
    }
  ]

  if (!selectedRow) return null

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: darkMode 
              ? 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 64
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountBalanceIcon />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Account Details - {selectedRow.accountNumber}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Record {currentRecordIndex + 1} of {tableData.length}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Navigation Controls */}
            <IconButton
              onClick={handlePreviousRecord}
              disabled={currentRecordIndex === 0}
              sx={{ color: 'white' }}
              size="small"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 60, textAlign: 'center' }}>
              {currentRecordIndex + 1} / {tableData.length}
            </Typography>
            <IconButton
              onClick={handleNextRecord}
              disabled={currentRecordIndex === tableData.length - 1}
              sx={{ color: 'white', mr: 2 }}
              size="small"
            >
              <NavigateNextIcon />
            </IconButton>

            <IconButton
              onClick={onClose}
              sx={{ color: 'white' }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Fade in timeout={300}>
            <Grid container spacing={3}>
              {cardData.map((card, index) => (
                <Grid item xs={12} md={6} lg={4} xl={3} key={card.title}>
                  <Slide
                    direction="up"
                    in
                    timeout={300 + index * 100}
                  >
                    <div>
                      <AccountDataCard
                        title={card.title}
                        icon={card.icon}
                        color={card.color}
                        data={card.data}
                        darkMode={darkMode}
                        onOpenVertical={handleOpenVerticalModal}
                        onOpenErrors={handleOpenErrorModal}
                        hasErrors={selectedRow.hasError && (index === 5 || index === 6)} // Risk and Alerts cards have errors
                      />
                    </div>
                  </Slide>
                </Grid>
              ))}
            </Grid>
          </Fade>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vertical Data Modal */}
      <VerticalDataModal
        open={verticalModal.open}
        onClose={handleCloseVerticalModal}
        title={verticalModal.cardTitle}
        data={verticalModal.data}
        darkMode={darkMode}
      />

      {/* Error Records Modal */}
      <ErrorRecordsModal
        open={errorModal.open}
        onClose={handleCloseErrorModal}
        title={errorModal.cardTitle}
        errors={errorModal.errors}
        darkMode={darkMode}
      />
    </>
  )
}

export default AccountDetailsModal
