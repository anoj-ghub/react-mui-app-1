import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  TableView as TableViewIcon,
  DataObject as DataObjectIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

/**
 * Modal component for displaying pipe-delimited data in a structured DataGrid format
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.data - Raw pipe-delimited data string
 * @param {string} props.fieldName - Name of the field containing the data
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Pipe-delimited data modal component
 */
function PipeDelimitedDataModal({ 
  open, 
  onClose, 
  data, 
  fieldName, 
  darkMode = false 
}) {

  /**
   * Detect the data type of a value
   * @param {string} value - Value to analyze
   * @returns {string} Detected data type
   */
  const detectDataType = (value) => {
    if (!value || typeof value !== 'string') return 'String';
    
    // Number detection
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return 'Number';
    }
    
    // Date detection (basic patterns)
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
    ];
    if (datePatterns.some(pattern => pattern.test(value))) {
      return 'Date';
    }
    
    // Email detection
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email';
    }
    
    // URL detection
    if (/^https?:\/\/.+/.test(value)) {
      return 'URL';
    }
    
    return 'String';
  };

  /**
   * Detect appropriate headers based on data content
   * @param {Array} firstRecord - First record data to analyze
   * @returns {Array} Suggested headers
   */
  const detectHeaders = (firstRecord) => {
    if (!firstRecord || firstRecord.length !== 7) return [];
    
    const headers = [];
    firstRecord.forEach((value, index) => {
      const lowerValue = value.toLowerCase();
      
      // Smart header detection based on content patterns and position
      if (lowerValue.match(/^[a-z]{3}-\d+$/) || (index === 0 && lowerValue.includes('id'))) {
        headers.push('ID');
      } else if (lowerValue.includes('@')) {
        headers.push('Email');
      } else if (lowerValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        headers.push('Date');
      } else if (lowerValue.match(/^\d{3}-\d{4}$/) || lowerValue.match(/^\d{3}-\d{3}-\d{4}$/)) {
        headers.push('Phone');
      } else if (value.match(/^\d+\.?\d*$/) && parseFloat(value) > 1000) {
        headers.push('Amount');
      } else if (value.match(/^\d+$/) && parseInt(value) < 1000) {
        headers.push('Quantity');
      } else if (lowerValue.includes('active') || lowerValue.includes('pending') || lowerValue.includes('shipped') || lowerValue.includes('delivered') || lowerValue.includes('processing') || lowerValue.includes('completed') || lowerValue.includes('planning') || lowerValue.includes('cleared')) {
        headers.push('Status');
      } else if (lowerValue.includes('engineering') || lowerValue.includes('marketing') || lowerValue.includes('sales') || lowerValue.includes('electronics') || lowerValue.includes('tools')) {
        headers.push('Department/Category');
      } else if (index === 0) {
        // First field is usually Name or ID
        headers.push('Name');
      } else if (index === 1 && !lowerValue.includes('@')) {
        // Second field is usually Category, Department, or Type
        headers.push('Type/Category');
      } else {
        // Generic fallback based on position
        switch (index) {
          case 2: headers.push('Value'); break;
          case 3: headers.push('Detail'); break;
          case 4: headers.push('Reference'); break;
          case 5: headers.push('Source'); break;
          case 6: headers.push('Status'); break;
          default: headers.push(`Field ${index + 1}`); break;
        }
      }
    });
    
    return headers;
  };

  /**
   * Get color for data type chips
   * @param {string} type - Data type
   * @returns {string} Color name
   */
  const getTypeColor = (type) => {
    switch (type) {
      case 'Number': return 'success';
      case 'Date': return 'info';
      case 'Email': return 'warning';
      case 'URL': return 'secondary';
      default: return 'default';
    }
  };

  /**
   * Parse pipe-delimited data into structured format
   */
  const parsedData = useMemo(() => {
    console.log('PipeDelimitedDataModal - Raw data received:', data);
    console.log('PipeDelimitedDataModal - Data type:', typeof data);
    console.log('PipeDelimitedDataModal - Data length:', data?.length);
    
    if (!data || typeof data !== 'string') {
      return { rows: [], columns: [], error: 'Invalid data format' };
    }

    try {
      // Split by pipes and clean up whitespace
      const items = data.split('|').map(item => item.trim()).filter(item => item.length > 0);
      console.log('PipeDelimitedDataModal - Split items:', items);
      console.log('PipeDelimitedDataModal - Number of items:', items.length);
      
      if (items.length === 0) {
        return { rows: [], columns: [], error: 'No data found' };
      }

      // Check if items can be grouped into records of 7 fields
      const fieldsPerRecord = 7;
      const numberOfRecords = Math.floor(items.length / fieldsPerRecord);
      
      if (numberOfRecords === 0) {
        return { rows: [], columns: [], error: 'Not enough data for structured records (need at least 7 fields)' };
      }

      // Define standard column headers for structured data
      const standardHeaders = ['Field 1', 'Field 2', 'Field 3', 'Field 4', 'Field 5', 'Field 6', 'Field 7'];
      
      // Try to detect the data type and suggest better headers
      const detectedHeaders = detectHeaders(items.slice(0, fieldsPerRecord));
      const headers = detectedHeaders.length === fieldsPerRecord ? detectedHeaders : standardHeaders;

      // Create columns for DataGrid
      const columns = [
        {
          field: 'id',
          headerName: 'Record #',
          width: 100,
          type: 'number',
          align: 'center',
          headerAlign: 'center'
        },
        ...headers.map((header, index) => ({
          field: `field${index + 1}`,
          headerName: header,
          flex: 1,
          minWidth: 100,
          renderCell: (params) => (
            <Box sx={{ 
              py: 0.25,
              px: 0.5,
              wordBreak: 'break-word',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.8rem',
                  lineHeight: 1.2,
                  fontWeight: 400
                }}
                title={params.value} // Show full value on hover
              >
                {params.value}
              </Typography>
            </Box>
          )
        }))
      ];

      // Create rows for DataGrid - group items into records of 7 fields
      const rows = [];
      for (let i = 0; i < numberOfRecords; i++) {
        const recordStart = i * fieldsPerRecord;
        const recordData = {
          id: i + 1,
        };
        
        // Assign each field to the record
        for (let j = 0; j < fieldsPerRecord; j++) {
          recordData[`field${j + 1}`] = items[recordStart + j] || '';
        }
        
        rows.push(recordData);
      }

      // Check for remaining fields that don't form a complete record
      const remainingFields = items.length % fieldsPerRecord;
      const unusedFields = remainingFields > 0 ? items.slice(-remainingFields) : [];

      return { 
        rows, 
        columns, 
        error: null,
        totalFields: items.length,
        recordsCreated: numberOfRecords,
        unusedFields: unusedFields
      };
    } catch (error) {
      console.error('Error parsing pipe-delimited data:', error);
      return { rows: [], columns: [], error: 'Failed to parse data' };
    }
  }, [data]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '70vh',
          maxHeight: '90vh',
          backgroundColor: darkMode ? 'grey.900' : 'background.paper',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          pt: 2,
          px: 3,
          background: darkMode 
            ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderBottom: `3px solid ${darkMode ? '#4fc3f7' : '#42a5f5'}`,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TableViewIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
          </Box>
          <Box>
            <Typography variant="h5" component="div" sx={{ 
              fontWeight: 700,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              mb: 0.5
            }}>
              Pipe-Delimited Data
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              opacity: 0.9,
              fontWeight: 400
            }}>
              Field: {fieldName}
            </Typography>
          </Box>
          <Chip 
            label={`${parsedData.recordsCreated || parsedData.rows.length} records`} 
            size="medium" 
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: darkMode ? '#1e3c72' : '#667eea',
              fontWeight: 600,
              fontSize: '0.85rem',
              '& .MuiChip-label': {
                px: 2
              }
            }}
          />
        </Box>
        <IconButton
          onClick={handleClose}
          size="medium"
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {parsedData.error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" icon={<DataObjectIcon />}>
              <Typography variant="body2">
                {parsedData.error}
              </Typography>
            </Alert>
          </Box>
        ) : (
          <>
            {/* Info Section */}
            <Box sx={{ 
              p: 2.5, 
              background: darkMode 
                ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)' 
                : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                <Chip 
                  icon={<TableViewIcon />} 
                  label={`${parsedData.recordsCreated || 0} records created`}
                  sx={{
                    backgroundColor: darkMode ? '#4caf50' : '#e8f5e8',
                    color: darkMode ? 'white' : '#2e7d32',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: darkMode ? 'white' : '#2e7d32'
                    }
                  }}
                  size="medium"
                />
                <Chip 
                  icon={<DataObjectIcon />} 
                  label={`${parsedData.totalFields || 0} total fields`}
                  sx={{
                    backgroundColor: darkMode ? '#2196f3' : '#e3f2fd',
                    color: darkMode ? 'white' : '#1565c0',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: darkMode ? 'white' : '#1565c0'
                    }
                  }}
                  size="medium"
                />
                {parsedData.unusedFields && parsedData.unusedFields.length > 0 && (
                  <Chip 
                    icon={<DataObjectIcon />} 
                    label={`${parsedData.unusedFields.length} unused fields`}
                    sx={{
                      backgroundColor: darkMode ? '#ff9800' : '#fff3e0',
                      color: darkMode ? 'white' : '#ef6c00',
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: darkMode ? 'white' : '#ef6c00'
                      }
                    }}
                    size="medium"
                    title={`Unused fields: ${parsedData.unusedFields.join(', ')}`}
                  />
                )}
              </Box>
              <Typography variant="body1" sx={{ 
                mb: 1.5,
                fontWeight: 500,
                color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)'
              }}>
                📊 Data parsed as structured records with 7 fields each. Each row represents one complete record.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontFamily: 'monospace',
                backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                padding: 1.5,
                borderRadius: 1,
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                fontSize: '0.8rem'
              }}>
                <strong>Original Data:</strong><br />
                {data.length > 150 ? `${data.substring(0, 150)}...` : data}
              </Typography>
            </Box>

            {/* DataGrid Section */}
            <Box sx={{ 
              flexGrow: 1, 
              height: '500px', // Fixed height to enable proper scrolling
              maxHeight: '60vh', // Responsive max height
              border: '2px solid',
              borderColor: darkMode ? 'grey.700' : 'grey.300',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <DataGrid
                rows={parsedData.rows}
                columns={parsedData.columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25, page: 0 }
                  }
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableSelectionOnClick
                autoHeight={false}
                density="compact"
                rowHeight={32}
                headerHeight={44}
                scrollbarSize={12}
                sx={{
                  border: 'none',
                  borderRadius: 0,
                  height: '100%',
                  '& .MuiDataGrid-main': {
                    height: '100%',
                    overflow: 'auto'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    height: '100% !important',
                    overflow: 'auto !important',
                    // Custom scrollbar styling
                    '&::-webkit-scrollbar': {
                      width: '12px',
                      height: '12px'
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '6px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '6px',
                      border: `2px solid ${darkMode ? '#424242' : '#f5f5f5'}`,
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                      },
                      '&:active': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
                      }
                    },
                    '&::-webkit-scrollbar-corner': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                    }
                  },
                  '& .MuiDataGrid-scrollbar': {
                    '&--vertical': {
                      width: '12px',
                    },
                    '&--horizontal': {
                      height: '12px',
                    }
                  },
                  '& .MuiDataGrid-cell': {
                    borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    padding: '2px 6px'
                  },
                  '& .MuiDataGrid-columnHeader': {
                    background: darkMode 
                      ? 'linear-gradient(135deg, #424242 0%, #616161 100%)' 
                      : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: darkMode ? '#ffffff' : '#333333',
                    borderRight: `2px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    '&:hover': {
                      background: darkMode 
                        ? 'linear-gradient(135deg, #616161 0%, #757575 100%)' 
                        : 'linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)'
                    }
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  },
                  '& .MuiDataGrid-row': {
                    '&:nth-of-type(even)': {
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
                    },
                    '&:hover': {
                      backgroundColor: darkMode ? 'rgba(33,150,243,0.08)' : 'rgba(33,150,243,0.08)',
                      transform: 'scale(1.001)',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: darkMode 
                        ? '0 2px 4px rgba(33,150,243,0.2)' 
                        : '0 2px 4px rgba(33,150,243,0.15)'
                    }
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: `2px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)',
                    minHeight: '44px'
                  }
                }}
                components={{
                  NoRowsOverlay: () => (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      flexDirection: 'column',
                      gap: 1,
                      backgroundColor: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.02)'
                    }}>
                      <DataObjectIcon sx={{ 
                        fontSize: 48, 
                        color: 'text.secondary',
                        opacity: 0.5
                      }} />
                      <Typography color="text.secondary" variant="body2">
                        No pipe-delimited data found
                      </Typography>
                    </Box>
                  )
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            {parsedData.rows.length > 0 && (
              `Showing ${parsedData.rows.length} parsed items from pipe-delimited data`
            )}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={handleClose} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default PipeDelimitedDataModal;
