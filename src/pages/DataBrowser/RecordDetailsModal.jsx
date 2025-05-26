import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Button,
  Box,
  Typography,
  Chip,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Toolbar,
  Paper,
  Card,
  CardContent,
  Popover
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import RestoreIcon from '@mui/icons-material/Restore'
import SchemaIcon from '@mui/icons-material/Schema'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import InfoIcon from '@mui/icons-material/Info'

function RecordDetailsModal({
  detailsOpen,
  selectedRow,
  selectedTable,
  currentRecordIndex,
  setCurrentRecordIndex,
  tableData,
  environment,
  onClose,
  darkMode
}) {
  // Row visibility states for modal
  const [hiddenModalRows, setHiddenModalRows] = useState(new Set())
  const [contextMenu, setContextMenu] = useState(null)
  const [selectedModalRows, setSelectedModalRows] = useState([])
    // Toggle button states
  const [schemaActive, setSchemaActive] = useState(true) // true = active only, false = active + inactive side-by-side
  const [fullDataMode, setFullDataMode] = useState(true) // true = full, false = delta (only enabled when inactive schema shown)
  const [nodApplied, setNodApplied] = useState(false) // true = applied, false = not applied
  
  // Field info popover state
  const [fieldInfoAnchor, setFieldInfoAnchor] = useState(null)
  const [selectedFieldInfo, setSelectedFieldInfo] = useState(null)

  const handlePreviousRecord = () => {
    if (currentRecordIndex > 0) {
      const newIndex = currentRecordIndex - 1
      setCurrentRecordIndex(newIndex)
      setSelectedModalRows([]) // Reset modal row selection
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }

  const handleNextRecord = () => {
    if (currentRecordIndex < tableData.length - 1) {
      const newIndex = currentRecordIndex + 1
      setCurrentRecordIndex(newIndex)
      setSelectedModalRows([]) // Reset modal row selection
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }

  const handleRecordPageChange = (event, page) => {
    const newIndex = page - 1
    if (newIndex >= 0 && newIndex < tableData.length) {
      setCurrentRecordIndex(newIndex)
      setSelectedModalRows([]) // Reset modal row selection
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }

  const handleRowContextMenu = (event) => {
    event.preventDefault()
    if (selectedModalRows.length > 0) {
      setContextMenu({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      })
    }
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleToggleRowSelection = (index) => {
    setSelectedModalRows(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
      return newSelection
    })
  }

  const handleToggleRowVisibility = (index) => {
    setHiddenModalRows(prev => {
      const newHidden = new Set(prev)
      if (newHidden.has(index)) {
        newHidden.delete(index)
      } else {
        newHidden.add(index)
      }
      return newHidden
    })
  }

  const handleHideSelectedRows = () => {
    setHiddenModalRows(prev => {
      const newHidden = new Set(prev)
      selectedModalRows.forEach(index => {
        newHidden.add(index)
      })
      return newHidden
    })
    setSelectedModalRows([])
    handleCloseContextMenu()
  }

  const handleShowSelectedRows = () => {
    setHiddenModalRows(prev => {
      const newHidden = new Set(prev)
      selectedModalRows.forEach(index => {
        newHidden.delete(index)
      })
      return newHidden
    })
    setSelectedModalRows([])
    handleCloseContextMenu()
  }

  const handleShowAllRows = () => {
    setHiddenModalRows(new Set())
    setSelectedModalRows([])
    handleCloseContextMenu()
  }

  // JSON Export Functions
  const downloadJSON = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
  const handleExportCurrentRecord = () => {
    if (selectedRow) {
      const exportData = {
        table: selectedTable,
        environment: environment,
        exportDate: new Date().toISOString(),
        recordIndex: currentRecordIndex + 1,
        data: selectedRow
      }
      downloadJSON(exportData, `${selectedTable.replace(' ', '_')}_record_${selectedRow.id}.json`)
    }
  }

  // Field info handlers
  const handleShowFieldInfo = (event, fieldKey) => {
    event.stopPropagation() // Prevent row selection
    setFieldInfoAnchor(event.currentTarget)
    setSelectedFieldInfo(getFieldDetails(fieldKey))
  }

  const handleCloseFieldInfo = () => {
    setFieldInfoAnchor(null)
    setSelectedFieldInfo(null)
  }

  // Get field details for the popover
  const getFieldDetails = (fieldKey) => {
    const fieldMappings = {
      id: {
        displayName: 'ID',
        dataType: 'INTEGER',
        source: 'Primary Key',
        description: 'Unique identifier for the record',
        nullable: false,
        maxLength: null,
        defaultValue: 'AUTO_INCREMENT',
        constraints: ['PRIMARY KEY', 'NOT NULL'],
        indexed: true
      },
      name: {
        displayName: 'Name',
        dataType: 'VARCHAR',
        source: 'User Input',
        description: 'Full name of the entity',
        nullable: false,
        maxLength: 255,
        defaultValue: null,
        constraints: ['NOT NULL'],
        indexed: false
      },
      account: {
        displayName: 'Account',
        dataType: 'VARCHAR',
        source: 'Generated',
        description: 'Account number with format ACC###',
        nullable: false,
        maxLength: 10,
        defaultValue: null,
        constraints: ['UNIQUE', 'NOT NULL'],
        indexed: true
      },
      status: {
        displayName: 'Status',
        dataType: 'ENUM',
        source: 'Workflow',
        description: 'Current status of the record',
        nullable: false,
        maxLength: null,
        defaultValue: 'ACTIVE',
        constraints: ['CHECK (status IN (\'ACTIVE\', \'INACTIVE\', \'PENDING\'))'],
        indexed: true
      },
      amount: {
        displayName: 'Amount',
        dataType: 'DECIMAL(10,2)',
        source: 'Transaction System',
        description: 'Monetary amount in USD',
        nullable: true,
        maxLength: null,
        defaultValue: '0.00',
        constraints: ['CHECK (amount >= 0)'],
        indexed: false
      },
      date: {
        displayName: 'Date',
        dataType: 'DATE',
        source: 'System Generated',
        description: 'Record creation or transaction date',
        nullable: false,
        maxLength: null,
        defaultValue: 'CURRENT_DATE',
        constraints: ['NOT NULL'],
        indexed: true
      },
      category: {
        displayName: 'Category',
        dataType: 'VARCHAR',
        source: 'Classification System',
        description: 'Business category classification',
        nullable: true,
        maxLength: 100,
        defaultValue: null,
        constraints: [],
        indexed: false
      },
      department: {
        displayName: 'Department',
        dataType: 'VARCHAR',
        source: 'HR System',
        description: 'Organizational department',
        nullable: true,
        maxLength: 100,
        defaultValue: null,
        constraints: [],
        indexed: false
      }
    }
    
    return fieldMappings[fieldKey] || {
      displayName: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1),
      dataType: 'VARCHAR',
      source: 'Unknown',
      description: 'No detailed information available for this field',
      nullable: true,
      maxLength: 255,
      defaultValue: null,
      constraints: [],
      indexed: false
    }
  }

  const formatValue = (key, value, tableName) => {
    if (typeof value === 'number') {
      if (key === 'amount' || key === 'price' || key === 'total' || key === 'salary') {
        return `$${value.toLocaleString()}`
      }
      return value.toString()
    }
    return value?.toString() || ''
  }

  const getFieldDisplayName = (field) => {
    const displayNames = {
      id: 'ID',
      name: 'Name',
      account: 'Account',
      amount: 'Amount',
      date: 'Date',
      product: 'Product',
      category: 'Category',
      price: 'Price',
      stock: 'Stock',
      order: 'Order',
      customer: 'Customer',
      status: 'Status',
      total: 'Total',
      employee: 'Employee',
      department: 'Department',
      salary: 'Salary',
      hire_date: 'Hire Date'
    }
    return displayNames[field] || field
  }

  // Helper function to render cell values consistently
  const renderCellValue = (key, value) => {
    if (key === 'status') {
      return (
        <Chip 
          label={value} 
          size="small" 
          color={
            value === 'Shipped' ? 'info' :
            value === 'Delivered' ? 'success' :
            value === 'Pending' ? 'warning' :
            value === 'Processing' ? 'secondary' :
            value === 'Cancelled' ? 'error' :
            value === 'Returned' ? 'default' :
            value === 'Draft' ? 'default' :
            value === 'Archived' ? 'default' : 'default'
          }
          sx={{ 
            fontSize: '0.7rem', 
            height: 20,
            '& .MuiChip-label': {
              padding: '0 6px'
            }
          }}
        />
      )
    } else if (key === 'category' || key === 'department') {
      return (
        <Chip 
          label={value} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ 
            fontSize: '0.7rem', 
            height: 20,
            '& .MuiChip-label': {
              padding: '0 6px'
            }
          }}
        />
      )
    } else {
      return (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
          {formatValue(key, value, selectedTable)}
        </Typography>
      )
    }
  }

  // Get all row data for selection purposes
  const getAllRowData = () => {
    if (!selectedRow) return []
    return Object.entries(selectedRow)
      .filter(([key]) => key !== 'id')
      .map(([key, value], index) => ({ key, value, index }))
  }

  // Mock function to generate inactive schema data (simulated)
  const getInactiveSchemaData = () => {
    if (!selectedRow) return {}
    // Simulate inactive schema data with slight variations
    const inactiveData = { ...selectedRow }
    
    // Add some variations to simulate inactive schema differences
    Object.keys(inactiveData).forEach(key => {
      if (key !== 'id') {
        // Randomly modify some values to simulate schema differences
        if (Math.random() > 0.7) {
          if (typeof inactiveData[key] === 'string') {
            inactiveData[key] = inactiveData[key] + '_OLD'
          } else if (typeof inactiveData[key] === 'number') {
            inactiveData[key] = inactiveData[key] + 100
          }
        }
      }
    })
    
    return inactiveData
  }

  // Get combined data for side-by-side display
  const getCombinedRowData = () => {
    if (!selectedRow) return []
    
    const activeData = selectedRow
    const inactiveData = getInactiveSchemaData()
    
    const allRows = Object.keys(activeData)
      .filter(key => key !== 'id')
      .map((key, index) => ({
        key,
        activeValue: activeData[key],
        inactiveValue: inactiveData[key],
        index,
        isDifferent: activeData[key] !== inactiveData[key]
      }))

    // Filter based on fullDataMode when inactive schema is shown
    if (!schemaActive) {
      if (!fullDataMode) {
        // Delta mode: only show rows where data has changed
        return allRows.filter(row => row.isDifferent)
      }
    }
    
    return allRows
  }

  const handleClose = () => {
    setSelectedModalRows([])
    setHiddenModalRows(new Set())
    onClose()
  }

  return (
    <>
      <Dialog 
        open={detailsOpen} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableAutoFocus={false}
        disableEnforceFocus={false}
        disableRestoreFocus={false}
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
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
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 'fit-content' }}>
            <ViewListIcon sx={{ mr: 1 }} />
            {selectedTable} - Record {currentRecordIndex + 1} of {tableData.length}
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            {/* Export Button */}
            <Button 
              onClick={handleExportCurrentRecord}
              startIcon={<DownloadIcon sx={{ fontSize: '0.8rem' }} />}
              size="small"
              variant="contained"
              aria-label="Export current record as JSON"
              sx={{ 
                mr: 1,
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                },
                fontSize: '0.7rem',
                height: 28
              }}
            >
              Export JSON
            </Button>

            {/* Navigation Controls */}
            <IconButton 
              onClick={handlePreviousRecord}
              disabled={currentRecordIndex === 0}
              sx={{ color: 'white', mr: 1 }}
              size="small"
              aria-label="Previous record"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'white', mx: 1, minWidth: 60, textAlign: 'center' }}>
              {currentRecordIndex + 1} / {tableData.length}
            </Typography>
            <IconButton 
              onClick={handleNextRecord}
              disabled={currentRecordIndex === tableData.length - 1}
              sx={{ color: 'white', mr: 2 }}
              size="small"
              aria-label="Next record"
            >
              <NavigateNextIcon />
            </IconButton>

            <IconButton 
              onClick={handleClose}
              sx={{ color: 'white' }}
              size="small"
              aria-label="Close dialog"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        {/* Toolbar for switch controls */}
        <Toolbar 
          variant="dense" 
          sx={{ 
            backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e9ecef'}`,
            minHeight: 48,
            px: 2,
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={!schemaActive}
                    onChange={(e) => setSchemaActive(!e.target.checked)}
                    size="small"
                    color="success"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SchemaIcon sx={{ fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {schemaActive ? 'Active Schema Only' : 'Show Inactive Schema'}
                    </Typography>
                  </Box>
                }
                sx={{ mr: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={fullDataMode}
                    onChange={(e) => setFullDataMode(e.target.checked)}
                    size="small"
                    color="primary"
                    disabled={schemaActive}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <DataObjectIcon sx={{ fontSize: '1rem' }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.8rem',
                        color: schemaActive ? 'text.disabled' : 'inherit'
                      }}
                    >
                      {fullDataMode ? 'Full Data' : 'Delta Data'}
                    </Typography>
                  </Box>
                }
                sx={{ mr: 2 }}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={nodApplied}
                    onChange={(e) => setNodApplied(e.target.checked)}
                    size="small"
                    color="warning"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FilterAltIcon sx={{ fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      Apply NOD
                    </Typography>
                  </Box>
                }
              />
            </FormGroup>
          </Box>

          {/* Status indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={schemaActive ? 'Active Only' : 'Active + Inactive'} 
              size="small" 
              color={schemaActive ? 'primary' : 'success'}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
            {!schemaActive && (
              <>
                <Chip 
                  label={fullDataMode ? 'Full' : 'Delta'} 
                  size="small" 
                  color={fullDataMode ? 'primary' : 'secondary'}
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
                {!fullDataMode && (
                  <Chip 
                    label={`${getCombinedRowData().length} changed`} 
                    size="small" 
                    color="info"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                  />
                )}
              </>
            )}
            <Chip 
              label={nodApplied ? 'NOD Applied' : 'NOD Off'} 
              size="small" 
              color={nodApplied ? 'success' : 'warning'}
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        </Toolbar>
        
        <DialogContent sx={{ p: 0 }} onContextMenu={handleRowContextMenu}>
          {/* Record Data Table */}
          {selectedRow && (
            <TableContainer sx={{ 
              maxHeight: 400,
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: 0
              }
            }}>
              <Table 
                size="small" 
                sx={{
                  '& .MuiTableCell-root': {
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    height: '28px',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#d0d7de'}`,
                    borderLeft: 'none',
                    borderTop: 'none',
                    '&:first-of-type': {
                      borderLeft: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#d0d7de'}`
                    }
                  },
                  '& .MuiTableRow-root': {
                    '&:first-of-type .MuiTableCell-root': {
                      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#d0d7de'}`
                    },
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05) !important' : '#f6f8fa !important'
                    }
                  }
                }}
              >
                <TableBody>                  {/* Header row */}
                  <TableRow sx={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : '#f6f8fa' }}>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.03) !important' : '#f1f3f4 !important',
                        color: 'text.secondary',
                        fontSize: '0.75rem !important',
                        width: 100,
                        textAlign: 'center'
                      }}
                    >
                      Actions
                    </TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.03) !important' : '#f1f3f4 !important',
                        color: 'text.secondary',
                        fontSize: '0.75rem !important',
                        width: schemaActive ? '25%' : '20%'
                      }}
                    >
                      Field
                    </TableCell>                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.03) !important' : '#f1f3f4 !important',
                        color: 'text.secondary',
                        fontSize: '0.75rem !important',
                        width: schemaActive ? 'auto' : '40%'
                      }}
                    >
                      {schemaActive ? 'Value' : 'Active Schema'}
                    </TableCell>
                    {!schemaActive && (
                      <TableCell 
                        sx={{ 
                          fontWeight: 'bold',
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.03) !important' : '#f1f3f4 !important',
                          color: 'text.secondary',
                          fontSize: '0.75rem !important',
                          width: '40%'
                        }}
                      >
                        Inactive Schema
                      </TableCell>
                    )}
                  </TableRow>

                  {/* Data rows - render based on schema mode */}
                  {schemaActive ? (
                    getAllRowData().map(({ key, value, index }) => {
                      const isHidden = hiddenModalRows.has(index)
                      const isSelected = selectedModalRows.includes(index)

                      if (isHidden) return null

                      return (                        <TableRow 
                          key={key}
                          sx={{ 
                            backgroundColor: isSelected 
                              ? (darkMode ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)')
                              : 'transparent',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleToggleRowSelection(index)}
                        >
                          <TableCell sx={{ textAlign: 'center', width: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  const newHidden = new Set(hiddenModalRows)
                                  if (newHidden.has(index)) {
                                    newHidden.delete(index)
                                  } else {
                                    newHidden.add(index)
                                  }
                                  setHiddenModalRows(newHidden)
                                }}
                                sx={{ 
                                  padding: '2px',
                                  color: hiddenModalRows.has(index) ? 'text.disabled' : 'secondary.main',
                                  '&:hover': {
                                    backgroundColor: 'secondary.light',
                                    color: 'white'
                                  }
                                }}
                                title={hiddenModalRows.has(index) ? 'Show field' : 'Hide field'}
                              >
                                {hiddenModalRows.has(index) ? 
                                  <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : 
                                  <VisibilityIcon sx={{ fontSize: '1rem' }} />
                                }
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(event) => handleShowFieldInfo(event, key)}
                                sx={{ 
                                  padding: '2px',
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                  }
                                }}
                                title="Field information"
                              >
                                <InfoIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'medium', width: '25%' }}>
                            {getFieldDisplayName(key)}
                          </TableCell>                          <TableCell>
                            {renderCellValue(key, value)}
                          </TableCell>
                        </TableRow>
                      )
                    })                  ) : (
                    getCombinedRowData().map(({ key, activeValue, inactiveValue, index, isDifferent }) => {
                      const isHidden = hiddenModalRows.has(index)
                      const isSelected = selectedModalRows.includes(index)

                      if (isHidden) return null

                      return (
                        <TableRow 
                          key={key}
                          sx={{ 
                            backgroundColor: isSelected 
                              ? (darkMode ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)')
                              : isDifferent 
                                ? (darkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.05)')
                                : 'transparent',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleToggleRowSelection(index)}
                        >
                          <TableCell sx={{ textAlign: 'center', width: 100 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  const newHidden = new Set(hiddenModalRows)
                                  if (newHidden.has(index)) {
                                    newHidden.delete(index)
                                  } else {
                                    newHidden.add(index)
                                  }
                                  setHiddenModalRows(newHidden)
                                }}
                                sx={{ 
                                  padding: '2px',
                                  color: hiddenModalRows.has(index) ? 'text.disabled' : 'secondary.main',
                                  '&:hover': {
                                    backgroundColor: 'secondary.light',
                                    color: 'white'
                                  }
                                }}
                                title={hiddenModalRows.has(index) ? 'Show field' : 'Hide field'}
                              >
                                {hiddenModalRows.has(index) ? 
                                  <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : 
                                  <VisibilityIcon sx={{ fontSize: '1rem' }} />
                                }
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(event) => handleShowFieldInfo(event, key)}
                                sx={{ 
                                  padding: '2px',
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                  }
                                }}
                                title="Field information"
                              >
                                <InfoIcon sx={{ fontSize: '1rem' }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'medium', width: '20%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getFieldDisplayName(key)}
                              {isDifferent && (
                                <Chip 
                                  label="DIFF" 
                                  size="small" 
                                  color="warning"
                                  sx={{ 
                                    height: 16, 
                                    fontSize: '0.6rem',
                                    '& .MuiChip-label': { px: 0.5 }
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ width: '40%' }}>
                            {renderCellValue(key, activeValue)}
                          </TableCell>
                          <TableCell sx={{ width: '40%' }}>
                            {renderCellValue(key, inactiveValue)}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2, bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : '#f5f5f5', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              onClick={handleShowAllRows}
              startIcon={<RestoreIcon />}
              size="small"
              variant="outlined"
            >
              Show All Rows
            </Button>
            {selectedModalRows.length > 0 && (
              <Chip 
                label={`${selectedModalRows.length} rows selected`} 
                color="primary" 
                size="small"
                sx={{ ml: 2, height: 20 }}
              />
            )}
            {hiddenModalRows.size > 0 && (
              <Chip 
                label={`${hiddenModalRows.size} rows hidden`} 
                color="warning" 
                size="small"
                sx={{ ml: 1, height: 20 }}
              />
            )}
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Record pagination */}
            <Pagination 
              count={tableData.length} 
              page={currentRecordIndex + 1}
              onChange={handleRecordPageChange}
              size="small"
              siblingCount={1}
              boundaryCount={1}
            />
            
            <Button onClick={handleClose} color="primary" variant="contained">
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
          }
        }}
      >
        <MenuItem onClick={handleHideSelectedRows} disabled={selectedModalRows.length === 0}>
          <ListItemIcon>
            <VisibilityOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Hide Selected Rows ({selectedModalRows.length})</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShowSelectedRows} disabled={selectedModalRows.length === 0}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Show Selected Rows ({selectedModalRows.length})</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleShowAllRows}>
          <ListItemIcon>
            <RestoreIcon fontSize="small" />
          </ListItemIcon>          <ListItemText>Show All Rows</ListItemText>
        </MenuItem>
      </Menu>      {/* Field Info Popover - Enhanced Styling */}
      <Popover
        open={Boolean(fieldInfoAnchor)}
        anchorEl={fieldInfoAnchor}
        onClose={handleCloseFieldInfo}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            maxWidth: 400,
            backgroundColor: 'background.paper',
            boxShadow: darkMode 
              ? '0 8px 32px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
            borderRadius: 3,
            border: darkMode 
              ? '1px solid rgba(255,255,255,0.1)' 
              : '1px solid rgba(0,0,0,0.08)',
            backdrop: 'blur(10px)',
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(60,60,60,0.95) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            overflow: 'hidden',
            animation: 'slideIn 0.2s ease-out',
            '@keyframes slideIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(-10px) scale(0.95)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
          }
        }}
      >
        {selectedFieldInfo && (
          <Card sx={{ 
            minWidth: 320,
            background: 'transparent',
            boxShadow: 'none',
            '& .MuiCardContent-root:last-child': {
              paddingBottom: '16px'
            }
          }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
              {/* Header with gradient background */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px 12px 0 0'
              }} />
                {/* Close Button - positioned absolutely */}
              <IconButton
                onClick={handleCloseFieldInfo}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 28,
                  height: 28,
                  backgroundColor: darkMode 
                    ? 'rgba(255,255,255,0.1)' 
                    : 'rgba(0,0,0,0.05)',
                  color: 'text.secondary',
                  zIndex: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: darkMode 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'rgba(0,0,0,0.1)',
                    color: 'text.primary',
                    transform: 'scale(1.1)',
                    boxShadow: darkMode 
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.15)'
                  },
                  '&:active': {
                    transform: 'scale(0.95)'
                  }
                }}
                title="Close field information"
              >
                <CloseIcon sx={{ fontSize: '1rem' }} />
              </IconButton>

              {/* Field Name Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2.5,
                pt: 0.5,
                pr: 4 // Add right padding to avoid overlap with close button
              }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  mr: 1,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.5 },
                    '100%': { opacity: 1 },
                  }
                }} />
                <Typography variant="h6" component="div" sx={{ 
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '0.02em',
                  textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                }}>
                  {selectedFieldInfo.displayName}
                </Typography>
              </Box>
              
              {/* Description Section */}
              <Box sx={{ 
                mb: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: darkMode 
                  ? 'rgba(255,255,255,0.03)' 
                  : 'rgba(0,0,0,0.02)',
                border: darkMode 
                  ? '1px solid rgba(255,255,255,0.05)' 
                  : '1px solid rgba(0,0,0,0.05)',
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="caption" sx={{ 
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'text.secondary',
                  fontSize: '0.65rem'
                }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  mt: 0.5,
                  color: 'text.primary'
                }}>
                  {selectedFieldInfo.description}
                </Typography>
              </Box>

              {/* Technical Details Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 2, 
                mb: 2.5 
              }}>
                {/* Data Type */}
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: darkMode 
                    ? 'rgba(33, 150, 243, 0.1)' 
                    : 'rgba(33, 150, 243, 0.05)',
                  border: '1px solid rgba(33, 150, 243, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: darkMode 
                      ? '0 4px 12px rgba(33, 150, 243, 0.2)'
                      : '0 4px 12px rgba(33, 150, 243, 0.1)'
                  }
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Data Type
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    mt: 0.5,
                    fontFamily: 'monospace'
                  }}>
                    {selectedFieldInfo.dataType}
                  </Typography>
                </Box>
                
                {/* Source */}
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: darkMode 
                    ? 'rgba(76, 175, 80, 0.1)' 
                    : 'rgba(76, 175, 80, 0.05)',
                  border: '1px solid rgba(76, 175, 80, 0.2)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: darkMode 
                      ? '0 4px 12px rgba(76, 175, 80, 0.2)'
                      : '0 4px 12px rgba(76, 175, 80, 0.1)'
                  }
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 'bold',
                    color: 'success.main',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Source
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    mt: 0.5
                  }}>
                    {selectedFieldInfo.source}
                  </Typography>
                </Box>
              </Box>

              {/* Status Chips */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                mb: 2.5, 
                justifyContent: 'center' 
              }}>
                <Chip 
                  label={selectedFieldInfo.nullable ? 'Nullable' : 'Not Null'} 
                  size="small" 
                  color={selectedFieldInfo.nullable ? 'warning' : 'success'}
                  variant={selectedFieldInfo.nullable ? 'outlined' : 'filled'}
                  sx={{ 
                    height: 28, 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    px: 1.5,
                    '& .MuiChip-label': {
                      px: 0.5
                    },
                    boxShadow: selectedFieldInfo.nullable 
                      ? 'none' 
                      : darkMode 
                        ? '0 2px 8px rgba(76, 175, 80, 0.3)'
                        : '0 2px 8px rgba(76, 175, 80, 0.2)'
                  }}
                />
                <Chip 
                  label={selectedFieldInfo.indexed ? 'Indexed' : 'No Index'} 
                  size="small" 
                  color={selectedFieldInfo.indexed ? 'info' : 'default'}
                  variant={selectedFieldInfo.indexed ? 'filled' : 'outlined'}
                  sx={{ 
                    height: 28, 
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    px: 1.5,
                    '& .MuiChip-label': {
                      px: 0.5
                    },
                    boxShadow: selectedFieldInfo.indexed 
                      ? darkMode 
                        ? '0 2px 8px rgba(33, 150, 243, 0.3)'
                        : '0 2px 8px rgba(33, 150, 243, 0.2)'
                      : 'none'
                  }}
                />
              </Box>

              {/* Additional Properties */}
              {(selectedFieldInfo.maxLength || selectedFieldInfo.defaultValue) && (
                <Box sx={{ 
                  mb: 2.5,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode 
                    ? 'rgba(255,255,255,0.02)' 
                    : 'rgba(0,0,0,0.02)',
                  border: darkMode 
                    ? '1px solid rgba(255,255,255,0.05)' 
                    : '1px solid rgba(0,0,0,0.05)'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    mb: 1,
                    display: 'block'
                  }}>
                    Properties
                  </Typography>
                  
                  {selectedFieldInfo.maxLength && (
                    <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                        minWidth: 80
                      }}>
                        Max Length:
                      </Typography>
                      <Chip 
                        label={selectedFieldInfo.maxLength}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  )}

                  {selectedFieldInfo.defaultValue && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                        minWidth: 80
                      }}>
                        Default:
                      </Typography>
                      <Chip 
                        label={selectedFieldInfo.defaultValue}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ 
                          height: 20, 
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {/* Constraints Section */}
              {selectedFieldInfo.constraints && selectedFieldInfo.constraints.length > 0 && (
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: darkMode 
                    ? 'rgba(156, 39, 176, 0.1)' 
                    : 'rgba(156, 39, 176, 0.05)',
                  border: '1px solid rgba(156, 39, 176, 0.2)'
                }}>
                  <Typography variant="caption" sx={{ 
                    fontWeight: 'bold',
                    color: 'secondary.main',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1,
                    display: 'block'
                  }}>
                    Database Constraints
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {selectedFieldInfo.constraints.map((constraint, index) => (
                      <Chip 
                        key={index}
                        label={constraint} 
                        size="small" 
                        variant="filled"
                        color="secondary"
                        sx={{ 
                          height: 22, 
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          borderRadius: 1.5,
                          fontFamily: 'monospace',
                          textTransform: 'uppercase',
                          boxShadow: darkMode 
                            ? '0 2px 6px rgba(156, 39, 176, 0.3)'
                            : '0 2px 6px rgba(156, 39, 176, 0.2)'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Popover>
    </>
  )
}

export default RecordDetailsModal