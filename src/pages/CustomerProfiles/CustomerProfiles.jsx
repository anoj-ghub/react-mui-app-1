/**
 * @fileoverview Customer Profiles management component
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Chip,
  Avatar,
  Paper,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'
import ClearIcon from '@mui/icons-material/Clear'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BusinessIcon from '@mui/icons-material/Business'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

/**
 * Mock data for 20 customer profiles
 */
const mockCustomers = [
  {
    id: 'CUST001',
    name: 'Alice Johnson',
    email: 'alice.johnson@techcorp.com',
    phone: '+1-555-0101',
    company: 'TechCorp Solutions',
    location: 'New York, NY',
    status: 'active',
    tier: 'Premium',
    joinDate: '2022-03-15',
    lastActivity: '2024-01-20',
    totalOrders: 45,
    totalSpent: 125000
  },
  {
    id: 'CUST002',
    name: 'Bob Smith',
    email: 'bob.smith@innovate.com',
    phone: '+1-555-0102',
    company: 'Innovate Inc',
    location: 'San Francisco, CA',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2021-11-20',
    lastActivity: '2023-12-01',
    totalOrders: 23,
    totalSpent: 45000
  },
  {
    id: 'CUST003',
    name: 'Carol Davis',
    email: 'carol.davis@globaltech.com',
    phone: '+1-555-0103',
    company: 'Global Tech',
    location: 'Austin, TX',
    status: 'active',
    tier: 'Enterprise',
    joinDate: '2020-08-10',
    lastActivity: '2024-01-22',
    totalOrders: 89,
    totalSpent: 350000
  },
  {
    id: 'CUST004',
    name: 'David Wilson',
    email: 'david.wilson@startup.io',
    phone: '+1-555-0104',
    company: 'Startup.io',
    location: 'Seattle, WA',
    status: 'active',
    tier: 'Standard',
    joinDate: '2023-01-05',
    lastActivity: '2024-01-21',
    totalOrders: 12,
    totalSpent: 18000
  },
  {
    id: 'CUST005',
    name: 'Eva Martinez',
    email: 'eva.martinez@megacorp.com',
    phone: '+1-555-0105',
    company: 'MegaCorp Industries',
    location: 'Chicago, IL',
    status: 'active',
    tier: 'Premium',
    joinDate: '2021-07-22',
    lastActivity: '2024-01-19',
    totalOrders: 67,
    totalSpent: 198000
  },
  {
    id: 'CUST006',
    name: 'Frank Brown',
    email: 'frank.brown@smallbiz.com',
    phone: '+1-555-0106',
    company: 'Small Business Co',
    location: 'Denver, CO',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2022-09-14',
    lastActivity: '2023-11-15',
    totalOrders: 8,
    totalSpent: 12000
  },
  {
    id: 'CUST007',
    name: 'Grace Lee',
    email: 'grace.lee@futuretech.com',
    phone: '+1-555-0107',
    company: 'Future Tech Solutions',
    location: 'Boston, MA',
    status: 'active',
    tier: 'Enterprise',
    joinDate: '2020-12-03',
    lastActivity: '2024-01-23',
    totalOrders: 134,
    totalSpent: 567000
  },
  {
    id: 'CUST008',
    name: 'Henry Garcia',
    email: 'henry.garcia@digital.com',
    phone: '+1-555-0108',
    company: 'Digital Dynamics',
    location: 'Miami, FL',
    status: 'active',
    tier: 'Premium',
    joinDate: '2022-05-18',
    lastActivity: '2024-01-18',
    totalOrders: 56,
    totalSpent: 145000
  },
  {
    id: 'CUST009',
    name: 'Iris Chen',
    email: 'iris.chen@cloudtech.com',
    phone: '+1-555-0109',
    company: 'CloudTech Systems',
    location: 'Portland, OR',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2023-03-07',
    lastActivity: '2023-10-20',
    totalOrders: 15,
    totalSpent: 28000
  },
  {
    id: 'CUST010',
    name: 'Jack Thompson',
    email: 'jack.thompson@enterprise.com',
    phone: '+1-555-0110',
    company: 'Enterprise Solutions',
    location: 'Atlanta, GA',
    status: 'active',
    tier: 'Enterprise',
    joinDate: '2019-11-25',
    lastActivity: '2024-01-22',
    totalOrders: 198,
    totalSpent: 890000
  },
  {
    id: 'CUST011',
    name: 'Karen White',
    email: 'karen.white@consulting.com',
    phone: '+1-555-0111',
    company: 'White Consulting',
    location: 'Phoenix, AZ',
    status: 'active',
    tier: 'Premium',
    joinDate: '2021-02-14',
    lastActivity: '2024-01-20',
    totalOrders: 73,
    totalSpent: 234000
  },
  {
    id: 'CUST012',
    name: 'Leo Rodriguez',
    email: 'leo.rodriguez@datacore.com',
    phone: '+1-555-0112',
    company: 'DataCore Analytics',
    location: 'Dallas, TX',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2022-12-01',
    lastActivity: '2023-09-10',
    totalOrders: 19,
    totalSpent: 35000
  },
  {
    id: 'CUST013',
    name: 'Maria Lopez',
    email: 'maria.lopez@aitech.com',
    phone: '+1-555-0113',
    company: 'AI Technologies',
    location: 'San Diego, CA',
    status: 'active',
    tier: 'Enterprise',
    joinDate: '2020-06-08',
    lastActivity: '2024-01-21',
    totalOrders: 156,
    totalSpent: 678000
  },
  {
    id: 'CUST014',
    name: 'Nathan Taylor',
    email: 'nathan.taylor@startup.com',
    phone: '+1-555-0114',
    company: 'Taylor Startup',
    location: 'Nashville, TN',
    status: 'active',
    tier: 'Standard',
    joinDate: '2023-08-12',
    lastActivity: '2024-01-19',
    totalOrders: 6,
    totalSpent: 9500
  },
  {
    id: 'CUST015',
    name: 'Olivia Anderson',
    email: 'olivia.anderson@retail.com',
    phone: '+1-555-0115',
    company: 'Anderson Retail',
    location: 'Las Vegas, NV',
    status: 'active',
    tier: 'Premium',
    joinDate: '2021-10-30',
    lastActivity: '2024-01-23',
    totalOrders: 92,
    totalSpent: 287000
  },
  {
    id: 'CUST016',
    name: 'Paul Wilson',
    email: 'paul.wilson@logistics.com',
    phone: '+1-555-0116',
    company: 'Wilson Logistics',
    location: 'Detroit, MI',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2022-07-19',
    lastActivity: '2023-08-25',
    totalOrders: 31,
    totalSpent: 52000
  },
  {
    id: 'CUST017',
    name: 'Quinn Davis',
    email: 'quinn.davis@manufacturing.com',
    phone: '+1-555-0117',
    company: 'Davis Manufacturing',
    location: 'Milwaukee, WI',
    status: 'active',
    tier: 'Enterprise',
    joinDate: '2019-04-15',
    lastActivity: '2024-01-20',
    totalOrders: 245,
    totalSpent: 1250000
  },
  {
    id: 'CUST018',
    name: 'Rachel Green',
    email: 'rachel.green@healthcare.com',
    phone: '+1-555-0118',
    company: 'Green Healthcare',
    location: 'Kansas City, MO',
    status: 'active',
    tier: 'Premium',
    joinDate: '2020-09-22',
    lastActivity: '2024-01-18',
    totalOrders: 78,
    totalSpent: 189000
  },
  {
    id: 'CUST019',
    name: 'Steve Miller',
    email: 'steve.miller@finance.com',
    phone: '+1-555-0119',
    company: 'Miller Financial',
    location: 'Charlotte, NC',
    status: 'inactive',
    tier: 'Standard',
    joinDate: '2023-04-10',
    lastActivity: '2023-12-05',
    totalOrders: 14,
    totalSpent: 22000
  },
  {
    id: 'CUST020',
    name: 'Tina Brown',
    email: 'tina.brown@education.com',
    phone: '+1-555-0120',
    company: 'Brown Education',
    location: 'Salt Lake City, UT',
    status: 'active',
    tier: 'Standard',
    joinDate: '2021-12-08',
    lastActivity: '2024-01-21',
    totalOrders: 38,
    totalSpent: 67000
  }
]

/**
 * Customer Profiles management component
 * 
 * Features:
 * - 20 customer profiles with enable/disable functionality
 * - Rich customer information display
 * - Status management with radio buttons
 * - Validation and submission
 * - Message fields for status changes
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current theme mode
 * @returns {JSX.Element} Customer Profiles management page
 */
function CustomerProfiles({ darkMode = false, environment = 'Development' }) {
  const [customers, setCustomers] = useState(mockCustomers)
  const [messages, setMessages] = useState({})
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerNumbers, setCustomerNumbers] = useState({})
  const [validatedCustomers, setValidatedCustomers] = useState({})
  const [isValidating, setIsValidating] = useState(false)
  const [hasValidated, setHasValidated] = useState(false)
  const [fetchedCustomerDetails, setFetchedCustomerDetails] = useState({})
  const [validationErrors, setValidationErrors] = useState({})
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Log when component receives new environment prop
  useEffect(() => {
    console.log('CustomerProfiles received environment prop:', environment)
  }, [environment])

  // List of valid customer numbers (simulate a database of existing customers)
  const validCustomerNumbers = [
    'CUST001', 'CUST002', 'CUST003', 'CUST004', 'CUST005',
    'CUST006', 'CUST007', 'CUST008', 'CUST009', 'CUST010',
    'C001', 'C002', 'C003', 'C004', 'C005',
    '12345', '12346', '12347', '12348', '12349',
    'ABC123', 'ABC124', 'ABC125', 'XYZ001', 'XYZ002'
  ]

  /**
   * Handle customer number input change
   */
  const handleCustomerNumberChange = (cardIndex, customerNumber) => {
    setCustomerNumbers(prev => ({
      ...prev,
      [cardIndex]: customerNumber
    }))
    // Clear validation error for this card when customer number changes
    setValidationErrors(prev => ({
      ...prev,
      [cardIndex]: null
    }))
    // Reset validation state when customer number changes
    if (hasValidated) {
      setHasValidated(false)
      setValidatedCustomers({})
      setFetchedCustomerDetails({})
    }
  }

  /**
   * Validate all entered customer numbers
   */
  const handleValidateAllCustomers = async () => {
    const customerNumbersToValidate = Object.entries(customerNumbers)
      .filter(([cardIndex, customerNumber]) => customerNumber?.trim())
    
    if (customerNumbersToValidate.length === 0) {
      setSubmitMessage('Please enter at least one customer number to validate')
      return
    }

    setIsValidating(true)
    setSubmitMessage('')
    const newValidatedCustomers = {}
    const newFetchedCustomerDetails = {}
    const newValidationErrors = {}

    try {
      // Simulate API call to fetch all customer details
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      for (const [cardIndex, customerNumber] of customerNumbersToValidate) {
        const trimmedCustomerNumber = customerNumber.trim()
        
        // Check if customer number exists in valid list
        if (!validCustomerNumbers.includes(trimmedCustomerNumber)) {
          newValidationErrors[cardIndex] = `Customer number "${trimmedCustomerNumber}" not found in system`
          continue
        }

        // Mock customer data based on customer number
        const mockCustomerDetail = {
          id: trimmedCustomerNumber,
          name: `Customer ${trimmedCustomerNumber}`,
          email: `customer${trimmedCustomerNumber.toLowerCase()}@example.com`,
          phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          company: `Company ${trimmedCustomerNumber} Ltd`,
          location: ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA'][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.5 ? 'active' : 'inactive',
          tier: ['Standard', 'Premium', 'Enterprise'][Math.floor(Math.random() * 3)],
          joinDate: '2023-01-01',
          lastActivity: '2024-01-20',
          totalOrders: Math.floor(Math.random() * 100),
          totalSpent: Math.floor(Math.random() * 500000)
        }

        newFetchedCustomerDetails[cardIndex] = mockCustomerDetail
        newValidatedCustomers[cardIndex] = true
      }

      setFetchedCustomerDetails(newFetchedCustomerDetails)
      setValidatedCustomers(newValidatedCustomers)
      setValidationErrors(newValidationErrors)
      setHasValidated(true)
      
      const successfulValidations = Object.keys(newValidatedCustomers).length
      const errorCount = Object.keys(newValidationErrors).length
      
      if (successfulValidations > 0 && errorCount === 0) {
        setSubmitMessage(`Successfully validated ${successfulValidations} customer(s)`)
      } else if (successfulValidations > 0 && errorCount > 0) {
        setSubmitMessage(`Validated ${successfulValidations} customer(s), ${errorCount} error(s) found`)
      } else if (errorCount > 0) {
        setSubmitMessage(`Validation failed: ${errorCount} customer(s) not found`)
      }
    } catch (error) {
      setSubmitMessage('Error validating customers. Please try again.')
    } finally {
      setIsValidating(false)
    }
  }

  /**
   * Handle status change for a validated customer
   */
  const handleValidatedCustomerStatusChange = (cardIndex, newStatus) => {
    setFetchedCustomerDetails(prev => ({
      ...prev,
      [cardIndex]: {
        ...prev[cardIndex],
        status: newStatus
      }
    }))
  }

  /**
   * Handle status change for a specific customer
   */
  const handleStatusChange = (customerId, newStatus) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, status: newStatus }
        : customer
    ))
  }

  /**
   * Handle message change for a specific customer
   */
  const handleMessageChange = (customerId, message) => {
    setMessages(prev => ({
      ...prev,
      [customerId]: message
    }))
  }

  /**
   * Validate all changes
   */
  const validateChanges = () => {
    const changedCustomers = customers.filter((customer, index) => 
      customer.status !== mockCustomers[index].status
    )
    
    const missingMessages = changedCustomers.filter(customer => 
      !messages[customer.id]?.trim()
    )
    
    if (missingMessages.length > 0) {
      setSubmitMessage(`Please provide status messages for: ${missingMessages.map(c => c.name).join(', ')}`)
      return false
    }
    
    return true
  }

  /**
   * Submit changes
   */
  const handleSubmit = async () => {
    if (!validateChanges()) {
      return
    }
    
    // Check if we're in Production environment and need confirmation
    if (environment === 'Production') {
      setShowConfirmDialog(true)
      return
    }
    
    await performSubmit()
  }

  /**
   * Perform the actual submit operation
   */
  const performSubmit = async () => {
    setShowConfirmDialog(false)
    setIsSubmitting(true)
    setSubmitMessage('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Count only the customers that were actually updated/added
      // These are customers with customer numbers entered AND fetched details
      const actuallyUpdatedCustomers = Object.entries(fetchedCustomerDetails)
        .filter(([cardIndex, customerDetail]) => {
          // Must have customer detail AND have a customer number entered
          return customerDetail && customerNumbers[cardIndex]?.trim() && validatedCustomers[cardIndex]
        })
        .map(([cardIndex, customerDetail]) => customerDetail)
      
      const activeUpdatedCount = actuallyUpdatedCustomers.filter(customer => customer.status === 'active').length
      const inactiveUpdatedCount = actuallyUpdatedCustomers.filter(customer => customer.status === 'inactive').length
      const totalUpdatedCount = actuallyUpdatedCustomers.length
      
      let message = `Successfully updated ${totalUpdatedCount} customer profile${totalUpdatedCount !== 1 ? 's' : ''}`
      
      if (totalUpdatedCount > 0) {
        const statusBreakdown = []
        if (activeUpdatedCount > 0) statusBreakdown.push(`${activeUpdatedCount} active`)
        if (inactiveUpdatedCount > 0) statusBreakdown.push(`${inactiveUpdatedCount} inactive`)
        
        if (statusBreakdown.length > 0) {
          message += `: ${statusBreakdown.join(', ')}`
        }
      }
      
      setSubmitMessage(message)
    } catch (error) {
      setSubmitMessage('Error updating customer profiles. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Clear all changes
   */
  const handleClear = () => {
    setCustomers(mockCustomers)
    setMessages({})
    setSubmitMessage('')
    setCustomerNumbers({})
    setValidatedCustomers({})
    setHasValidated(false)
    setFetchedCustomerDetails({})
    setValidationErrors({})
  }

  const activeCount = customers.filter(c => c.status === 'active').length
  const inactiveCount = customers.filter(c => c.status === 'inactive').length
  const changedCount = customers.filter((customer, index) => 
    customer.status !== mockCustomers[index].status
  ).length

  // Count validated customers as changes that can be submitted
  const validatedCustomersCount = Object.keys(validatedCustomers).length
  const totalChanges = changedCount + validatedCustomersCount

  /**
   * Get tier color
   */
  const getTierColor = (tier) => {
    switch (tier) {
      case 'Enterprise': return '#9c27b0'
      case 'Premium': return '#ff9800'
      case 'Standard': return '#2196f3'
      default: return '#757575'
    }
  }

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PeopleIcon 
            sx={{ 
              fontSize: 32,
              color: darkMode ? '#90caf9' : '#1976d2'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#fff' : '#1976d2'
            }}
          >
            Customer Profiles
          </Typography>
        </Box>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Manage customer account activation and profile settings
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={isValidating ? <CircularProgress size={16} /> : <SearchIcon />}
            onClick={handleValidateAllCustomers}
            disabled={isValidating || Object.keys(customerNumbers).filter(key => customerNumbers[key]?.trim()).length === 0}
            sx={{ 
              minWidth: 150,
              borderColor: '#3b82f6',
              color: '#3b82f6',
              '&:hover': {
                borderColor: '#2563eb',
                backgroundColor: 'rgba(59, 130, 246, 0.04)',
              }
            }}
          >
            {isValidating ? 'Validating...' : 'Validate Customers'}
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<VerifiedUserIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting || !hasValidated || totalChanges === 0}
            sx={{ 
              minWidth: 150,
              background: hasValidated && totalChanges > 0 ? 'linear-gradient(45deg, #10b981, #059669)' : 'linear-gradient(45deg, #9ca3af, #6b7280)',
              '&:hover': {
                background: hasValidated && totalChanges > 0 ? 'linear-gradient(45deg, #059669, #047857)' : 'linear-gradient(45deg, #9ca3af, #6b7280)',
              }
            }}
          >
            Submit Changes
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ClearIcon />}
            onClick={handleClear}
            disabled={isSubmitting}
            sx={{ 
              minWidth: 150,
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.04)',
              }
            }}
          >
            Clear Changes
          </Button>
        </Box>
      </Paper>

      {/* Submit Message */}
      {submitMessage && (
        <Alert 
          severity={submitMessage.includes('Error') || submitMessage.includes('provide') ? 'error' : 'success'}
          sx={{ mb: 3 }}
        >
          {submitMessage}
        </Alert>
      )}

      {/* Summary Statistics */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3, 
          mb: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
          borderRadius: 2
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 600 }}>
                {activeCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Customers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 600 }}>
                {inactiveCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inactive Customers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: darkMode ? '#90caf9' : '#1976d2', fontWeight: 600 }}>
                {customers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Customers
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 600 }}>
                {totalChanges}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Changes
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Customer Cards */}
      <Grid container spacing={3}>
        {/* New Customer Input Cards */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((cardIndex) => {
          const customerDetail = fetchedCustomerDetails[cardIndex]
          const isValidated = validatedCustomers[cardIndex]
          const hasCustomerNumber = customerNumbers[cardIndex]?.trim()
          const hasValidationError = validationErrors[cardIndex]
          
          return (
            <Grid item xs={12} lg={6} xl={4} key={`new-${cardIndex}`}>
              <Card 
                elevation={2}
                sx={{ 
                  backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
                  borderRadius: 2,
                  border: hasValidationError
                    ? `2px solid ${darkMode ? '#f44336' : '#d32f2f'}`
                    : isValidated 
                      ? `2px solid ${darkMode ? '#4caf50' : '#2e7d32'}` 
                      : hasCustomerNumber 
                        ? `2px solid ${darkMode ? '#3b82f6' : '#2563eb'}`
                        : `1px dashed ${darkMode ? '#666' : '#ccc'}`,
                  position: 'relative',
                  minHeight: 400
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  {/* Customer Number Input */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonAddIcon />
                      {isValidated ? 'Customer Details' : 'Add New Customer'}
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Customer Number"
                      value={customerNumbers[cardIndex] || ''}
                      onChange={(e) => handleCustomerNumberChange(cardIndex, e.target.value)}
                      variant="outlined"
                      size="small"
                      disabled={isValidated}
                      placeholder="Enter customer number..."
                      error={!!validationErrors[cardIndex]}
                      helperText={
                        validationErrors[cardIndex] || 
                        (hasCustomerNumber && !isValidated ? "Click 'Validate Customers' button to fetch details" : "")
                      }
                    />
                  </Box>

                  {/* Customer Details (shown after validation) */}
                  {isValidated && customerDetail && (
                    <>
                      {/* Customer Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Badge
                          badgeContent={customerDetail.status === 'active' ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
                          color={customerDetail.status === 'active' ? 'success' : 'error'}
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        >
                          <Avatar 
                            sx={{ 
                              width: 48, 
                              height: 48,
                              backgroundColor: getTierColor(customerDetail.tier),
                              fontSize: '1.2rem',
                              fontWeight: 600
                            }}
                          >
                            {customerDetail.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </Badge>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {customerDetail.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {customerDetail.id}
                          </Typography>
                          <Box sx={{ mt: 0.5 }}>
                            <Chip
                              label={customerDetail.tier}
                              size="small"
                              sx={{ 
                                backgroundColor: getTierColor(customerDetail.tier),
                                color: 'white',
                                fontWeight: 500
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* Customer Details */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {customerDetail.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {customerDetail.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {customerDetail.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {customerDetail.phone}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Customer Metrics */}
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          mb: 2,
                          backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
                          borderRadius: 1
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ color: darkMode ? '#90caf9' : '#1976d2', fontWeight: 600 }}>
                                {customerDetail.totalOrders}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Orders
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                {formatCurrency(customerDetail.totalSpent)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Total Spent
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Divider sx={{ mb: 2 }} />

                      {/* Status Control */}
                      <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <FormLabel component="legend" sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            Account Status
                          </FormLabel>
                          <Chip
                            label={customerDetail.status}
                            size="small"
                            color={customerDetail.status === 'active' ? 'success' : 'error'}
                            sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              textTransform: 'capitalize'
                            }}
                          />
                        </Box>
                        <RadioGroup
                          row
                          value={customerDetail.status}
                          onChange={(e) => handleValidatedCustomerStatusChange(cardIndex, e.target.value)}
                        >
                          <FormControlLabel 
                            value="active" 
                            control={<Radio color="success" />} 
                            label="Active" 
                          />
                          <FormControlLabel 
                            value="inactive" 
                            control={<Radio color="error" />} 
                            label="Inactive" 
                          />
                        </RadioGroup>
                      </FormControl>

                      {/* Status Message */}
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Status Change Message"
                        placeholder={`Enter message for ${customerDetail.name}...`}
                        value={messages[`new-${cardIndex}`] || ''}
                        onChange={(e) => handleMessageChange(`new-${cardIndex}`, e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}

                  {/* Empty State */}
                  {!isValidated && !hasCustomerNumber && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 200,
                      color: 'text.secondary'
                    }}>
                      <PersonAddIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" align="center">
                        Enter a customer number and click "Validate Customers" to add a new customer profile
                      </Typography>
                    </Box>
                  )}

                  {/* Pending Validation State */}
                  {!isValidated && hasCustomerNumber && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: 200,
                      color: 'text.secondary'
                    }}>
                      <SearchIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body2" align="center">
                        Customer number entered. Click "Validate Customers" button to fetch details.
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Loading Progress */}
      {isSubmitting && (
        <Box sx={{ mt: 3, mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Updating customer profiles...
          </Typography>
        </Box>
      )}

      {/* Production Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
          ⚠️ Production Environment Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to submit customer profile changes to the <strong>Production</strong> environment. 
            This will affect live customer data and could impact customer access and service.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, fontWeight: 500 }}>
            Are you sure you want to proceed with these changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setShowConfirmDialog(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={performSubmit}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Yes, Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default CustomerProfiles
