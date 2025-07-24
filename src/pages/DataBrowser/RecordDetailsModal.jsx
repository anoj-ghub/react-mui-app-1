/**
 * @fileoverview Detailed record modal component with NOD formatting and advanced features
 * @author System
 * @version 1.0.0
 */

/**
 * @fileoverview Detailed record modal component with NOD formatting and advanced features
 * @author System
 * @version 1.0.0
 */

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
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
  Popover,
  LinearProgress,
  Badge,
  Tooltip,
  Avatar
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SchemaIcon from '@mui/icons-material/Schema'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import InfoIcon from '@mui/icons-material/Info'
import LaunchIcon from '@mui/icons-material/Launch'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import StorageIcon from '@mui/icons-material/Storage'
import ApiIcon from '@mui/icons-material/Api'
import FolderIcon from '@mui/icons-material/Folder'
import CloudSyncIcon from '@mui/icons-material/CloudSync'
import TableChartIcon from '@mui/icons-material/TableChart'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import TransformIcon from '@mui/icons-material/Transform'
import SecurityIcon from '@mui/icons-material/Security'
import SpeedIcon from '@mui/icons-material/Speed'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { formatAmount, formatAmountByType, DEFAULT_AMOUNT_FIELDS, isValidNOD } from '../../utils/amountFormatter'
import { PipeDelimitedDataModal, PipeDelimitedVerticalModal } from '../../components'
import { isPipeDelimitedData, getPipeDelimitedPreview, countPipeDelimitedItems } from '../../utils/pipeDelimitedDetector'
import FieldInfoPopover from '../../components/FieldInfoPopover'

/**
 * Record details modal component with advanced features and NOD (Number of Decimals) formatting
 * 
 * Features:
 * - Detailed record view in modal format
 * - NOD (Number of Decimals) formatting for amount fields
 * - Interactive NOD controls (0-4 decimal places)
 * - Field visibility toggle
 * - Record navigation (previous/next)
 * - Data export functionality
 * - Schema and data mode switching
 * - Field information popover
 * - Context menu for field operations
 * - Responsive design with dark mode support
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.detailsOpen - Modal open/closed state
 * @param {Object} props.selectedRow - Currently selected row data
 * @param {string} props.selectedTable - Currently selected table name
 * @param {number} props.currentRecordIndex - Index of current record in dataset
 * @param {Function} props.setCurrentRecordIndex - Function to update current record index
 * @param {Array} props.tableData - Array of all table data for navigation
 * @param {string} props.environment - Current environment name
 * @param {Function} props.onClose - Function to close the modal
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Record details modal component
 */

/**
 * Record details modal component with advanced features and NOD (Number of Decimals) formatting
 * 
 * Features:
 * - Detailed record view in modal format
 * - NOD (Number of Decimals) formatting for amount fields
 * - Interactive NOD controls (0-4 decimal places)
 * - Field visibility toggle
 * - Record navigation (previous/next)
 * - Data export functionality
 * - Schema and data mode switching
 * - Field information popover
 * - Context menu for field operations
 * - Responsive design with dark mode support
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.detailsOpen - Modal open/closed state
 * @param {Object} props.selectedRow - Currently selected row data
 * @param {string} props.selectedTable - Currently selected table name
 * @param {number} props.currentRecordIndex - Index of current record in dataset
 * @param {Function} props.setCurrentRecordIndex - Function to update current record index
 * @param {Array} props.tableData - Array of all table data for navigation
 * @param {string} props.environment - Current environment name
 * @param {Function} props.onClose - Function to close the modal
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Record details modal component
 * 
 * @example
 * ```jsx
 * <RecordDetailsModal
 *   detailsOpen={true}
 *   selectedRow={{id: 1, amount: 1234.5678}}
 *   selectedTable="Table 1"
 *   currentRecordIndex={0}
 *   setCurrentRecordIndex={setIndex}
 *   tableData={[...]}
 *   environment="Development"
 *   onClose={handleClose}
 *   darkMode={false}
 * />
 * ```
 */
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
  /** @type {[Set, Function]} Hidden modal rows state for field visibility */
  const [hiddenModalRows, setHiddenModalRows] = useState(new Set())
  
  
  
  /** @type {[boolean, Function]} Schema toggle state (active only vs active + inactive) */
  const [schemaActive, setSchemaActive] = useState(true)
  
  /** @type {[boolean, Function]} Data mode state (full vs delta) */
  const [fullDataMode, setFullDataMode] = useState(true)
  
  /** @type {[boolean, Function]} NOD application state (applied vs not applied) */
  const [nodApplied, setNodApplied] = useState(false)
  
  /** @type {[number, Function]} NOD value state (0-4 decimal places, default 2) */
  const [nodValue, setNodValue] = useState(2)
  
  /** @type {[Object|null, Function]} Field info popover anchor element */
  const [fieldInfoAnchor, setFieldInfoAnchor] = useState(null)
  
  /** @type {[Object|null, Function]} Selected field information for popover */
  const [selectedFieldInfo, setSelectedFieldInfo] = useState(null)

  /** @type {[Object, Function]} Pipe-delimited modal state */
  const [pipeDelimitedModal, setPipeDelimitedModal] = useState({
    open: false,
    data: '',
    fieldName: ''
  })

  /** @type {[Object, Function]} Pipe-delimited vertical modal state */
  const [pipeDelimitedVerticalModal, setPipeDelimitedVerticalModal] = useState({
    open: false,
    data: '',
    fieldName: ''
  })
  /**
   * Navigates to the previous record in the dataset
   */
  const handlePreviousRecord = () => {
    if (currentRecordIndex > 0) {
      const newIndex = currentRecordIndex - 1
      setCurrentRecordIndex(newIndex)
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }

  /**
   * Navigates to the next record in the dataset
   */
  const handleNextRecord = () => {
    if (currentRecordIndex < tableData.length - 1) {
      const newIndex = currentRecordIndex + 1
      setCurrentRecordIndex(newIndex)
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }
  /**
   * Handles record pagination when the page is changed
   * @param {Object} event - The event object
   * @param {number} page - The new page number
   */
  const handleRecordPageChange = (event, page) => {
    const newIndex = page - 1
    if (newIndex >= 0 && newIndex < tableData.length) {
      setCurrentRecordIndex(newIndex)
      setHiddenModalRows(new Set()) // Reset hidden rows
    }
  }


  /**
   * Toggles the visibility of a modal row
   * @param {number} index - The index of the row to toggle visibility
   */
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
  /**
   * Shows all modal rows
   */
  const handleShowAllRows = () => {
    setHiddenModalRows(new Set())
  }

  // JSON Export Functions
  /**
   * Downloads data as a JSON file
   * @param {Object} data - The data to download
   * @param {string} filename - The filename for the downloaded JSON file
   */
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

  /**
   * Exports the current record as a JSON file
   */
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
  /**
   * Shows field information in a popover
   * @param {Object} event - The event object
   * @param {string} fieldKey - The key of the field to show information for
   */
  const handleShowFieldInfo = (event, fieldKey) => {
    event.stopPropagation() // Prevent row selection
    setFieldInfoAnchor(event.currentTarget)
    setSelectedFieldInfo(getFieldDetails(fieldKey))
  }

  /**
   * Closes the field information popover
   */
  const handleCloseFieldInfo = () => {
    setFieldInfoAnchor(null)
    setSelectedFieldInfo(null)
  }

  /**
   * Opens the pipe-delimited data modal
   * @param {string} value - The pipe-delimited data value
   * @param {string} fieldName - The name of the field
   */
  const handleOpenPipeDelimitedModal = (value, fieldName) => {
    setPipeDelimitedModal({
      open: true,
      data: value,
      fieldName: fieldName
    })
  }

  /**
   * Closes the pipe-delimited data modal
   */
  const handleClosePipeDelimitedModal = () => {
    setPipeDelimitedModal({
      open: false,
      data: '',
      fieldName: ''
    })
  }

  /**
   * Opens the pipe-delimited vertical data modal
   * @param {string} value - The pipe-delimited data value
   * @param {string} fieldName - The name of the field
   */
  const handleOpenPipeDelimitedVerticalModal = (value, fieldName) => {
    setPipeDelimitedVerticalModal({
      open: true,
      data: value,
      fieldName: fieldName
    })
  }

  /**
   * Closes the pipe-delimited vertical data modal
   */
  const handleClosePipeDelimitedVerticalModal = () => {
    setPipeDelimitedVerticalModal({
      open: false,
      data: '',
      fieldName: ''
    })
  }

  // Get field details for the popover
  /**
   * Gets the details for a field based on the field key
   * @param {string} fieldKey - The key of the field to get details for
   * @returns {Object} The field details
   */
  const getFieldDetails = (fieldKey) => {
    const fieldMappings = {
      id: {
        displayName: 'Customer ID',
        description: 'Customer Account number',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'customer.txt',
              recType: '10',
              fieldname: 'Customer-number',
              datatype: 'char',
              length: 12,
              startPos: 25,
              endPos: 37
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'customerUpdate',
                datatype: 'string',
                length: 12,
                startPos: 36,
                endPos: 48
              },
              {
                eventName: 'orderUpdate',
                datatype: 'string',
                length: 12,
                startPos: 122,
                endPos: 134
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'customer_details',
            colName: 'custNum',
            colNum: 1,
            datatype: 'string',
            length: 12,
            scale: 0,
            nulls: false,
            default: false,
            defaultValue: '',
            isPrimaryKey: true,
            ixName: 'custidx01',
            ixColSeq: 4
          }
        },
        apiInfo: [
          {
            spName: 'getCustomerInfo',
            resultsetNum: 1,
            rsName: 'customer-details',
            tagName: 'customerNumber',
            position: 5,
            formatting: {
              applied: true,
              formatNumeric: true,
              other: false
            },
            transformationLogic: {
              type: 'conditional checking',
              expression: 'if cust-num > 9000 then null'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'customer-control.txt',
          datafile: 'customer-data.txt',
          fieldname: 'customer-num',
          datatype: 'string',
          length: 12,
          position: 5
        }
      },
      name: {
        displayName: 'Customer Name',
        description: 'Full legal name of the customer entity',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'customer.txt',
              recType: '10',
              fieldname: 'CustomerName',
              datatype: 'varchar',
              length: 255,
              startPos: 38,
              endPos: 293
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'customerNameUpdate',
                datatype: 'string',
                length: 255,
                startPos: 49,
                endPos: 304
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'customer_details',
            colName: 'customerName',
            colNum: 2,
            datatype: 'varchar',
            length: 255,
            scale: 0,
            nulls: false,
            default: false,
            defaultValue: '',
            isPrimaryKey: false,
            ixName: null,
            ixColSeq: null
          }
        },
        apiInfo: [
          {
            spName: 'getCustomerInfo',
            resultsetNum: 1,
            rsName: 'customer-details',
            tagName: 'customerName',
            position: 2,
            formatting: {
              applied: true,
              formatNumeric: false,
              other: true
            },
            transformationLogic: {
              type: 'string manipulation',
              expression: 'trim and upper case conversion'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'customer-control.txt',
          datafile: 'customer-data.txt',
          fieldname: 'customer-name',
          datatype: 'string',
          length: 255,
          position: 2
        }
      },
      account: {
        displayName: 'Account Number',
        description: 'System-generated account identifier with ACC prefix',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'account.txt',
              recType: '20',
              fieldname: 'AccountNum',
              datatype: 'char',
              length: 10,
              startPos: 1,
              endPos: 11
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'accountCreated',
                datatype: 'string',
                length: 10,
                startPos: 1,
                endPos: 11
              },
              {
                eventName: 'accountUpdated',
                datatype: 'string',
                length: 10,
                startPos: 12,
                endPos: 22
              },
              {
                eventName: 'accountClosed',
                datatype: 'string',
                length: 10,
                startPos: 23,
                endPos: 33
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'account_master',
            colName: 'accountNumber',
            colNum: 1,
            datatype: 'varchar',
            length: 10,
            scale: 0,
            nulls: false,
            default: false,
            defaultValue: '',
            isPrimaryKey: false,
            ixName: 'accidx01',
            ixColSeq: 1
          }
        },
        apiInfo: [
          {
            spName: 'getAccountDetails',
            resultsetNum: 1,
            rsName: 'account-info',
            tagName: 'accountNumber',
            position: 1,
            formatting: {
              applied: false,
              formatNumeric: false,
              other: false
            },
            transformationLogic: {
              type: 'format validation',
              expression: 'validate ACC### pattern'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'account-control.txt',
          datafile: 'account-data.txt',
          fieldname: 'account-number',
          datatype: 'string',
          length: 10,
          position: 1
        }
      },
      amount: {
        displayName: 'Transaction Amount',
        description: 'Monetary amount in USD with precision handling',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'transaction.txt',
              recType: '30',
              fieldname: 'Amount',
              datatype: 'decimal',
              length: 15,
              startPos: 50,
              endPos: 65
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'transactionProcessed',
                datatype: 'decimal',
                length: 15,
                startPos: 20,
                endPos: 35
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'transaction_details',
            colName: 'transactionAmount',
            colNum: 5,
            datatype: 'decimal',
            length: 15,
            scale: 2,
            nulls: true,
            default: true,
            defaultValue: '0.00',
            isPrimaryKey: false,
            ixName: null,
            ixColSeq: null
          }
        },
        apiInfo: [
          {
            spName: 'getTransactionInfo',
            resultsetNum: 1,
            rsName: 'transaction-details',
            tagName: 'amount',
            position: 3,
            formatting: {
              applied: true,
              formatNumeric: true,
              other: false
            },
            transformationLogic: {
              type: 'numeric validation',
              expression: 'validate positive amounts and round to 2 decimals'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'transaction-control.txt',
          datafile: 'transaction-data.txt',
          fieldname: 'transaction-amount',
          datatype: 'decimal',
          length: 15,
          position: 3
        }
      },
      date: {
        displayName: 'Transaction Date',
        description: 'Date when the transaction was processed',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'transaction.txt',
              recType: '30',
              fieldname: 'TxnDate',
              datatype: 'date',
              length: 10,
              startPos: 66,
              endPos: 76
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'transactionProcessed',
                datatype: 'timestamp',
                length: 19,
                startPos: 36,
                endPos: 55
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'transaction_details',
            colName: 'transactionDate',
            colNum: 3,
            datatype: 'timestamp',
            length: 19,
            scale: 0,
            nulls: false,
            default: true,
            defaultValue: 'CURRENT_TIMESTAMP',
            isPrimaryKey: false,
            ixName: 'txn_date_idx',
            ixColSeq: 1
          }
        },
        apiInfo: [
          {
            spName: 'getTransactionInfo',
            resultsetNum: 1,
            rsName: 'transaction-details',
            tagName: 'transactionDate',
            position: 4,
            formatting: {
              applied: true,
              formatNumeric: false,
              other: true
            },
            transformationLogic: {
              type: 'date formatting',
              expression: 'format as ISO 8601 with timezone'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'transaction-control.txt',
          datafile: 'transaction-data.txt',
          fieldname: 'transaction-date',
          datatype: 'date',
          length: 10,
          position: 4
        }
      },
      status: {
        displayName: 'Record Status',
        description: 'Current processing status of the record',
        origin: {
          batch: {
            updated: true,
            feedFileDetails: {
              name: 'status.txt',
              recType: '40',
              fieldname: 'Status',
              datatype: 'char',
              length: 1,
              startPos: 1,
              endPos: 2
            }
          },
          realTime: {
            updated: true,
            events: [
              {
                eventName: 'statusUpdate',
                datatype: 'string',
                length: 10,
                startPos: 56,
                endPos: 66
              }
            ]
          }
        },
        pgTableInfo: {
          tableInfo: {
            name: 'record_status',
            colName: 'statusCode',
            colNum: 2,
            datatype: 'varchar',
            length: 10,
            scale: 0,
            nulls: false,
            default: true,
            defaultValue: 'PENDING',
            isPrimaryKey: false,
            ixName: 'status_idx',
            ixColSeq: 1
          }
        },
        apiInfo: [
          {
            spName: 'getRecordStatus',
            resultsetNum: 1,
            rsName: 'status-info',
            tagName: 'status',
            position: 1,
            formatting: {
              applied: true,
              formatNumeric: false,
              other: true
            },
            transformationLogic: {
              type: 'enum validation',
              expression: 'validate against allowed status values'
            }
          }
        ],
        downstreamFeedDtls: {
          controlFile: 'status-control.txt',
          datafile: 'status-data.txt',
          fieldname: 'record-status',
          datatype: 'string',
          length: 10,
          position: 6
        }
      }
    }
    
    return fieldMappings[fieldKey] || {
      displayName: fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1),
      description: 'Field information not available in current schema mapping',
      origin: {
        batch: {
          updated: false,
          feedFileDetails: {
            name: 'unknown.txt',
            recType: 'N/A',
            fieldname: fieldKey,
            datatype: 'unknown',
            length: null,
            startPos: null,
            endPos: null
          }
        },
        realTime: {
          updated: false,
          events: []
        }
      },
      pgTableInfo: {
        tableInfo: {
          name: 'unknown_table',
          colName: fieldKey,
          colNum: null,
          datatype: 'varchar',
          length: 255,
          scale: 0,
          nulls: true,
          default: false,
          defaultValue: '',
          isPrimaryKey: false,
          ixName: null,
          ixColSeq: null
        }
      },
      apiInfo: [],
      downstreamFeedDtls: {
        controlFile: 'unknown-control.txt',
        datafile: 'unknown-data.txt',
        fieldname: fieldKey,
        datatype: 'string',
        length: null,
        position: null
      }
    }
  }

  /**
   * Formats a value for display based on the field key and NOD settings
   * @param {string} key - The field key
   * @param {any} value - The value to format
   * @param {string} tableName - The name of the table (for context)
   * @returns {string} The formatted value
   */
  const formatValue = (key, value, tableName) => {
    if (typeof value === 'number') {
      // Check if this is an amount field that should use NOD formatting
      if (DEFAULT_AMOUNT_FIELDS.includes(key)) {
        // Use NOD formatting if applied, otherwise use default formatting
        const decimals = nodApplied ? nodValue : 2;
        return formatAmount(value, decimals, { 
          showCurrency: true,
          useLocaleString: true 
        });
      }
      return value.toString()
    }
    return value?.toString() || ''
  }

  /**
   * Gets the display name for a field
   * @param {string} field - The field key
   * @returns {string} The display name for the field
   */
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
  /**
   * Renders the cell value for a table row
   * @param {string} key - The field key
   * @param {any} value - The value to render
   * @returns {JSX.Element} The rendered cell value
   */
  const renderCellValue = (key, value) => {
    // Check if this is pipe-delimited data first
    if (isPipeDelimitedData(value)) {
      const itemCount = countPipeDelimitedItems(value)
      const preview = getPipeDelimitedPreview(value, 2)
      
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                {preview}
              </Typography>
              <Chip 
                label={`${itemCount} items`} 
                size="small" 
                color="info" 
                variant="outlined"
                sx={{ fontSize: '0.65rem', height: 18 }}
              />
              <IconButton
                size="small"
                onClick={() => handleOpenPipeDelimitedModal(value, key)}
                sx={{ 
                  p: 0.25,
                  color: 'primary.main',
                  mr: 0.5,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
                title="View pipe-delimited data in table format"
              >
                <LaunchIcon sx={{ fontSize: 14 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleOpenPipeDelimitedVerticalModal(value, key)}
                sx={{ 
                  p: 0.25,
                  color: 'secondary.main',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'white'
                  }
                }}
                title="View pipe-delimited data in vertical format"
              >
                <ViewColumnIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.7rem' }}
            >
              Pipe-delimited data • Click icon to view in table
            </Typography>
          </Box>
        </Box>
      )
    }

    // Handle regular field types
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
  /**
   * Gets all row data for the selected row
   * @returns {Array} Array of all row data objects
   */
  const getAllRowData = () => {
    if (!selectedRow) return []
    return Object.entries(selectedRow)
      .filter(([key]) => key !== 'id')
      .map(([key, value], index) => ({ key, value, index }))
  }

  // Mock function to generate inactive schema data (simulated)
  /**
   * Simulates inactive schema data for the selected row
   * @returns {Object} Simulated inactive schema data
   */
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
  /**
   * Gets the combined data for active and inactive schemas for side-by-side display
   * @returns {Array} Array of combined row data objects
   */
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
  /**
   * Closes the modal and resets state
   */
  const handleClose = () => {
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
        >          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={!schemaActive}
                    onChange={(e) => setSchemaActive(!e.target.checked)}
                    size="small"
                    color="success"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#4caf50',
                            opacity: 1,
                            border: 'none',
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          },
                        },
                      },
                      '& .MuiSwitch-thumb': {
                        width: 18,
                        height: 18,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease-in-out',
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 12,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                        opacity: 1,
                        transition: 'all 0.2s ease-in-out',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    }
                  }}>
                    <SchemaIcon sx={{ 
                      fontSize: '1rem',
                      color: !schemaActive ? 'success.main' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out',
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: !schemaActive ? 600 : 400,
                        color: !schemaActive ? 'success.main' : 'text.primary',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {schemaActive ? 'Active Schema Only' : 'Show Inactive Schema'}
                    </Typography>
                  </Box>
                }
                sx={{ 
                  mr: 2,
                  p: 1,
                  borderRadius: 2,
                  border: `1px solid ${!schemaActive ? 'rgba(76, 175, 80, 0.3)' : 'transparent'}`,
                  backgroundColor: !schemaActive ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: !schemaActive ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              />
              

              <FormControlLabel
                control={
                  <Switch
                    checked={fullDataMode}
                    onChange={(e) => setFullDataMode(e.target.checked)}
                    size="small"
                    color="primary"
                    disabled={schemaActive}
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#2196f3',
                            opacity: 1,
                            border: 'none',
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          },
                        },
                        '&.Mui-disabled': {
                          '& .MuiSwitch-thumb': {
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.26)',
                          },
                          '& + .MuiSwitch-track': {
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                          },
                        },
                      },
                      '& .MuiSwitch-thumb': {
                        width: 18,
                        height: 18,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease-in-out',
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 12,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                        opacity: 1,
                        transition: 'all 0.2s ease-in-out',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: schemaActive ? 'none' : 'translateY(-1px)',
                    }
                  }}>
                    <DataObjectIcon sx={{ 
                      fontSize: '1rem',
                      color: schemaActive 
                        ? 'text.disabled' 
                        : (fullDataMode ? 'primary.main' : 'secondary.main'),
                      transition: 'color 0.2s ease-in-out',
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: (!schemaActive && fullDataMode) ? 600 : 400,
                        color: schemaActive ? 'text.disabled' : 'inherit',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      {fullDataMode ? 'Full Data' : 'Delta Data'}
                    </Typography>
                  </Box>
                }
                sx={{ 
                  mr: 2,
                  p: 1,
                  borderRadius: 2,
                  border: `1px solid ${(!schemaActive && fullDataMode) ? 'rgba(33, 150, 243, 0.3)' : 'transparent'}`,
                  backgroundColor: (!schemaActive && fullDataMode) ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
                  opacity: schemaActive ? 0.6 : 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: schemaActive 
                      ? 'transparent' 
                      : ((!schemaActive && fullDataMode) ? 'rgba(33, 150, 243, 0.1)' : 'rgba(0,0,0,0.04)'),
                    transform: schemaActive ? 'none' : 'translateY(-1px)',
                    boxShadow: schemaActive ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              />
                <FormControlLabel
                control={
                  <Switch
                    checked={nodApplied}
                    onChange={(e) => setNodApplied(e.target.checked)}
                    size="small"
                    color="warning"
                    sx={{
                      '& .MuiSwitch-switchBase': {
                        '&.Mui-checked': {
                          transform: 'translateX(16px)',
                          '& + .MuiSwitch-track': {
                            backgroundColor: '#ff9800',
                            opacity: 1,
                            border: 'none',
                          },
                          '& .MuiSwitch-thumb': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          },
                        },
                      },
                      '& .MuiSwitch-thumb': {
                        width: 18,
                        height: 18,
                        backgroundColor: '#ffffff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        transition: 'all 0.2s ease-in-out',
                      },
                      '& .MuiSwitch-track': {
                        borderRadius: 12,
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)',
                        opacity: 1,
                        transition: 'all 0.2s ease-in-out',
                        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                    }
                  }}>
                    <FilterAltIcon sx={{ 
                      fontSize: '1rem',
                      color: nodApplied ? 'warning.main' : 'text.secondary',
                      transition: 'color 0.2s ease-in-out',
                    }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '0.8rem',
                        fontWeight: nodApplied ? 600 : 400,
                        color: nodApplied ? 'warning.main' : 'text.primary',
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      Apply NOD
                    </Typography>
                  </Box>
                }
                sx={{ 
                  p: 1,
                  borderRadius: 2,
                  border: `1px solid ${nodApplied ? 'rgba(255, 152, 0, 0.3)' : 'transparent'}`,
                  backgroundColor: nodApplied ? 'rgba(255, 152, 0, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: nodApplied ? 'rgba(255, 152, 0, 0.1)' : 'rgba(0,0,0,0.04)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              />
                  {/* NOD Value Selector - only show when NOD is applied */}
              {nodApplied && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  ml: 2,
                  p: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 152, 0, 0.05)',
                  border: '1px solid rgba(255, 152, 0, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateX(-20px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                  },
                }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '0.75rem', 
                      color: 'warning.main',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    Decimals:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[0, 1, 2, 3, 4].map((decimals) => (
                      <Chip
                        key={decimals}
                        label={decimals}
                        size="small"
                        clickable
                        color={nodValue === decimals ? 'warning' : 'default'}
                        variant={nodValue === decimals ? 'filled' : 'outlined'}
                        onClick={() => setNodValue(decimals)}
                        sx={{ 
                          height: 22, 
                          fontSize: '0.7rem',
                          minWidth: 28,
                          fontWeight: nodValue === decimals ? 700 : 500,
                          '& .MuiChip-label': { 
                            px: 0.8,
                            py: 0.2,
                          },
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          border: nodValue === decimals 
                            ? '2px solid #ff9800' 
                            : `1px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'}`,
                          boxShadow: nodValue === decimals 
                            ? '0 2px 8px rgba(255, 152, 0, 0.3)' 
                            : '0 1px 3px rgba(0,0,0,0.1)',
                          '&:hover': {
                            backgroundColor: nodValue === decimals 
                              ? 'warning.dark' 
                              : (darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
                            transform: 'translateY(-2px) scale(1.05)',
                            boxShadow: nodValue === decimals 
                              ? '0 4px 12px rgba(255, 152, 0, 0.4)' 
                              : '0 3px 6px rgba(0,0,0,0.15)',
                          },
                          '&:active': {
                            transform: 'translateY(0) scale(0.98)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </FormGroup>
          </Box>          {/* Status indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={schemaActive ? 'Active Only' : 'Active + Inactive'} 
              size="small" 
              color={schemaActive ? 'primary' : 'success'}
              sx={{ 
                height: 24, 
                fontSize: '0.7rem',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                }
              }}
            />
            {!schemaActive && (
              <>
                <Chip 
                  label={fullDataMode ? 'Full' : 'Delta'} 
                  size="small" 
                  color={fullDataMode ? 'primary' : 'secondary'}
                  sx={{ 
                    height: 24, 
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                    }
                  }}
                />
                {!fullDataMode && (
                  <Chip 
                    label={`${getCombinedRowData().length} changed`} 
                    size="small" 
                    color="info"
                    variant="outlined"
                    sx={{ 
                      height: 24, 
                      fontSize: '0.6rem',
                      fontWeight: 500,
                      border: '1px solid rgba(33, 150, 243, 0.5)',
                      backgroundColor: 'rgba(33, 150, 243, 0.05)',
                      transition: 'all 0.2s ease-in-out',
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': {
                          boxShadow: '0 0 0 0 rgba(33, 150, 243, 0.4)',
                        },
                        '70%': {
                          boxShadow: '0 0 0 10px rgba(33, 150, 243, 0)',
                        },
                        '100%': {
                          boxShadow: '0 0 0 0 rgba(33, 150, 243, 0)',
                        },
                      },
                      '&:hover': {
                        transform: 'translateY(-1px) scale(1.05)',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      }
                    }}
                  />
                )}
              </>
            )}
          </Box>
        </Toolbar>
          <DialogContent sx={{ p: 0 }}>
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
                  }
                }}
              >
                {!schemaActive && (
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Field</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Active Value</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.7rem' }}>Inactive Value</TableCell>
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {(schemaActive ? getAllRowData() : getCombinedRowData())
                    .filter((_, index) => !hiddenModalRows.has(index))
                    .map((rowData, index) => {
                      const isDifferent = !schemaActive && rowData.isDifferent
                      
                      return (
                        <TableRow 
                          key={schemaActive ? rowData.key : `${rowData.key}-combined`}
                          sx={{
                            backgroundColor: isDifferent 
                              ? (darkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.1)')
                              : 'transparent',
                            '&:hover': {
                              backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
                            }
                          }}
                        >
                          <TableCell 
                            component="th" 
                            sx={{ 
                              fontWeight: 600,
                              backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : '#f6f8fa',
                              width: '30%',
                              position: 'sticky',
                              left: 0,
                              zIndex: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleRowVisibility(index)
                              }}
                              sx={{ p: 0.25 }}
                            >
                              <VisibilityOffIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => handleShowFieldInfo(e, schemaActive ? rowData.key : rowData.key)}
                              sx={{ p: 0.25 }}
                            >
                              <InfoIcon sx={{ fontSize: '0.9rem' }} />
                            </IconButton>
                            {getFieldDisplayName(schemaActive ? rowData.key : rowData.key)}
                            {isDifferent && (
                              <Chip 
                                label="Changed" 
                                size="small" 
                                color="warning" 
                                variant="outlined"
                                sx={{ 
                                  height: 16, 
                                  fontSize: '0.6rem',
                                  '& .MuiChip-label': { px: 0.5 },
                                  ml: 'auto'
                                }} 
                              />
                            )}
                          </TableCell>
                          <TableCell sx={{ wordBreak: 'break-word' }}>
                            {renderCellValue(schemaActive ? rowData.key : rowData.key, schemaActive ? rowData.value : rowData.activeValue)}
                          </TableCell>
                          {!schemaActive && (
                            <TableCell sx={{ 
                              wordBreak: 'break-word',
                              opacity: 0.7,
                              fontStyle: isDifferent ? 'italic' : 'normal'
                            }}>
                              {renderCellValue(rowData.key, rowData.inactiveValue)}
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#d0d7de'}`,
          p: 2, 
          gap: 1 
        }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            size="small"
          >
            Close
          </Button>
          {selectedRow && (
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(selectedRow, null, 2));
                // Could add a snackbar notification here
              }}
              variant="contained"
              size="small"
            >
              Copy JSON
            </Button>
          )}        </DialogActions>

        {/* Field Info Popover */}
        <FieldInfoPopover
          open={Boolean(fieldInfoAnchor)}
          anchorEl={fieldInfoAnchor}
          onClose={handleCloseFieldInfo}
          selectedFieldInfo={selectedFieldInfo}
          darkMode={darkMode}
        />

        {/* Pipe-Delimited Data Modal */}
        <PipeDelimitedDataModal
          open={pipeDelimitedModal.open}
          onClose={handleClosePipeDelimitedModal}
          data={pipeDelimitedModal.data}
          fieldName={pipeDelimitedModal.fieldName}
          darkMode={darkMode}
        />
        {/* Pipe-Delimited Vertical Data Modal */}
        <PipeDelimitedVerticalModal
          open={pipeDelimitedVerticalModal.open}
          onClose={handleClosePipeDelimitedVerticalModal}
          data={pipeDelimitedVerticalModal.data}
          fieldName={pipeDelimitedVerticalModal.fieldName}
          darkMode={darkMode}
        />
      </Dialog>
    </>
  );
};

export default RecordDetailsModal;