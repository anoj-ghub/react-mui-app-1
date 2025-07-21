import React, { useMemo } from 'react';
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
  Alert,
  Paper,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  ViewColumn as ViewColumnIcon,
  DataObject as DataObjectIcon
} from '@mui/icons-material';

/**
 * Vertical modal component for displaying pipe-delimited data in a vertical grid format
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.data - Raw pipe-delimited data string
 * @param {string} props.fieldName - Name of the field containing the data
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} Vertical pipe-delimited data modal component
 */
function PipeDelimitedVerticalModal({ 
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
   * Detect appropriate field labels based on data content and position
   * @param {Array} items - All items to analyze
   * @param {number} fieldsPerRecord - Number of fields per record
   * @returns {Array} Suggested field labels
   */
  const detectFieldLabels = (items, fieldsPerRecord) => {
    const labels = [];
    const firstRecord = items.slice(0, fieldsPerRecord);
    
    firstRecord.forEach((value, index) => {
      const lowerValue = value.toLowerCase();
      
      // Smart label detection based on content patterns and position
      if (lowerValue.match(/^[a-z]{3}-\d+$/) || lowerValue.includes('id')) {
        labels.push('ID');
      } else if (lowerValue.includes('@')) {
        labels.push('Email');
      } else if (lowerValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        labels.push('Date');
      } else if (lowerValue.match(/^\d{3}-\d{4}$/) || lowerValue.match(/^\d{3}-\d{3}-\d{4}$/)) {
        labels.push('Phone');
      } else if (value.match(/^\d+\.?\d*$/) && parseFloat(value) > 1000) {
        labels.push('Amount');
      } else if (value.match(/^\d+$/) && parseInt(value) < 1000) {
        labels.push('Quantity');
      } else if (lowerValue.includes('active') || lowerValue.includes('pending') || lowerValue.includes('shipped') || lowerValue.includes('delivered') || lowerValue.includes('processing') || lowerValue.includes('completed') || lowerValue.includes('planning') || lowerValue.includes('cleared')) {
        labels.push('Status');
      } else if (lowerValue.includes('engineering') || lowerValue.includes('marketing') || lowerValue.includes('sales') || lowerValue.includes('electronics') || lowerValue.includes('tools')) {
        labels.push('Department/Category');
      } else if (index === 0) {
        // First field is usually Name or ID
        labels.push('Name');
      } else if (index === 1 && !lowerValue.includes('@')) {
        // Second field is usually Category, Department, or Type
        labels.push('Type/Category');
      } else {
        // Generic fallback based on position
        switch (index % 10) {
          case 0: labels.push('Name/ID'); break;
          case 1: labels.push('Category'); break;
          case 2: labels.push('Value'); break;
          case 3: labels.push('Detail'); break;
          case 4: labels.push('Reference'); break;
          case 5: labels.push('Source'); break;
          case 6: labels.push('Status'); break;
          case 7: labels.push('Description'); break;
          case 8: labels.push('Location'); break;
          case 9: labels.push('Notes'); break;
          default: labels.push(`Field ${index + 1}`); break;
        }
      }
    });
    
    return labels;
  };

  /**
   * Get color for data type indicators
   * @param {string} type - Data type
   * @returns {string} Color name
   */
  const getTypeColor = (type) => {
    switch (type) {
      case 'Number': return '#4caf50';
      case 'Date': return '#2196f3';
      case 'Email': return '#ff9800';
      case 'URL': return '#9c27b0';
      default: return '#757575';
    }
  };

  /**
   * Parse pipe-delimited data into structured format for vertical display
   */
  const parsedData = useMemo(() => {
    console.log('PipeDelimitedVerticalModal - Raw data received:', data);
    
    if (!data || typeof data !== 'string') {
      return { fields: [], error: 'Invalid data format' };
    }

    try {
      // Split by pipes and clean up whitespace
      const items = data.split('|').map(item => item.trim()).filter(item => item.length > 0);
      console.log('PipeDelimitedVerticalModal - Split items:', items);
      
      if (items.length === 0) {
        return { fields: [], error: 'No data found' };
      }

      // Always assume single record - each field becomes a row
      const fieldsPerRecord = items.length; // Use all items as fields for single record
      
      // Generate field labels based on content analysis
      const fieldLabels = detectFieldLabels(items, fieldsPerRecord);
      
      // Create field objects for vertical display (1 field per row)
      const fields = [];
      for (let i = 0; i < items.length; i++) {
        const value = items[i];
        fields.push({
          label: fieldLabels[i] || `Field ${i + 1}`,
          value: value,
          type: detectDataType(value),
          index: i + 1
        });
      }

      return { 
        fields, 
        error: null,
        totalFields: items.length,
        recordsCreated: 1, // Always 1 record
        unusedFields: [] // No unused fields since we use all
      };
    } catch (error) {
      console.error('Error parsing pipe-delimited data:', error);
      return { fields: [], error: 'Failed to parse data' };
    }
  }, [data]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '95vh',
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
            <ViewColumnIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
          </Box>
          <Box>
            <Typography variant="h5" component="div" sx={{ 
              fontWeight: 700,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              mb: 0.5
            }}>
              Vertical Data View
            </Typography>
            <Typography variant="subtitle2" sx={{ 
              opacity: 0.9,
              fontWeight: 400
            }}>
              Field: {fieldName}
            </Typography>
          </Box>
          <Chip 
            label={`${parsedData.recordsCreated || 1} record`} 
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
                  icon={<ViewColumnIcon />} 
                  label={`${parsedData.recordsCreated || 1} record`}
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
                <Chip 
                  icon={<DataObjectIcon />} 
                  label={`${parsedData.totalFields || 0} total fields`}
                  sx={{
                    backgroundColor: darkMode ? '#9c27b0' : '#f3e5f5',
                    color: darkMode ? 'white' : '#7b1fa2',
                    fontWeight: 600,
                    '& .MuiChip-icon': {
                      color: darkMode ? 'white' : '#7b1fa2'
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
                📊 Data displayed in vertical format with {parsedData.totalFields || 0} fields total. Each field is shown as a separate row.
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

            {/* Vertical Grid Section */}
            <Box sx={{ 
              flexGrow: 1, 
              height: '600px',
              overflow: 'auto',
              p: 2,
              backgroundColor: darkMode ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.01)',
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '12px'
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
                }
              }
            }}>
              {/* Single record display - each field as a row */}
              <Paper
                elevation={3}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  background: darkMode 
                    ? 'linear-gradient(135deg, #424242 0%, #616161 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: darkMode ? '0 8px 16px rgba(0,0,0,0.4)' : '0 8px 16px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease-in-out'
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2,
                  pb: 1,
                  borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: darkMode ? '#ffffff' : '#333333',
                    mr: 2
                  }}>
                    Record Data
                  </Typography>
                  <Chip 
                    label={`${parsedData.fields.length} fields`}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(33,150,243,0.8)' : 'rgba(33,150,243,0.1)',
                      color: darkMode ? 'white' : '#1565c0',
                      fontWeight: 600
                    }}
                  />
                </Box>
                
                {/* Display each field as a row with 2 columns: Field Name | Value */}
                <Box sx={{ 
                  border: `2px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: darkMode ? '0 4px 8px rgba(0,0,0,0.3)' : '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  {/* Column Headers */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: 0
                  }}>
                    {/* Field Name Header */}
                    <Box sx={{
                      p: 1.5,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #424242 0%, #616161 100%)' 
                        : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      borderRight: `2px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                      borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#333333',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Field Name
                      </Typography>
                    </Box>

                    {/* Field Value Header */}
                    <Box sx={{
                      p: 1.5,
                      background: darkMode 
                        ? 'linear-gradient(135deg, #424242 0%, #616161 100%)' 
                        : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                      borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 700,
                        color: darkMode ? '#ffffff' : '#333333',
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Field Value
                      </Typography>
                    </Box>
                  </Box>

                  {/* Data Rows */}
                  <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: 0
                  }}>
                  {parsedData.fields.map((field, fieldIndex) => (
                    <React.Fragment key={fieldIndex}>
                      {/* Field Name Column */}
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
                          borderBottom: fieldIndex < parsedData.fields.length - 1 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none',
                          borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '36px',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)',
                            transform: 'translateX(2px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <Typography variant="body2" sx={{ 
                            fontWeight: 700,
                            color: darkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                            fontSize: '0.85rem'
                          }}>
                            {field.label}
                          </Typography>
                          <Chip
                            label={field.type}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              backgroundColor: (() => {
                                switch (field.type) {
                                  case 'Number': return darkMode ? '#4caf50' : '#e8f5e8';
                                  case 'Date': return darkMode ? '#2196f3' : '#e3f2fd';
                                  case 'Email': return darkMode ? '#ff9800' : '#fff3e0';
                                  case 'URL': return darkMode ? '#9c27b0' : '#f3e5f5';
                                  default: return darkMode ? '#757575' : '#f5f5f5';
                                }
                              })(),
                              color: (() => {
                                switch (field.type) {
                                  case 'Number': return darkMode ? 'white' : '#2e7d32';
                                  case 'Date': return darkMode ? 'white' : '#1565c0';
                                  case 'Email': return darkMode ? 'white' : '#ef6c00';
                                  case 'URL': return darkMode ? 'white' : '#7b1fa2';
                                  default: return darkMode ? 'white' : '#424242';
                                }
                              })(),
                              '& .MuiChip-label': {
                                px: 0.75
                              },
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Field Value Column */}
                      <Box
                        sx={{
                          p: 1,
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                          borderBottom: fieldIndex < parsedData.fields.length - 1 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` : 'none',
                          display: 'flex',
                          alignItems: 'center',
                          minHeight: '36px',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,1)',
                            boxShadow: darkMode ? 'inset 2px 0 4px rgba(33,150,243,0.1)' : 'inset 2px 0 4px rgba(33,150,243,0.1)'
                          }
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: darkMode ? '#ffffff' : '#333333',
                            wordBreak: 'break-word',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                            width: '100%'
                          }}
                          title={field.value}
                        >
                          {field.value}
                        </Typography>
                      </Box>
                    </React.Fragment>
                  ))}
                  </Box>
                </Box>
              </Paper>
              
              {parsedData.fields.length === 0 && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '300px',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <DataObjectIcon sx={{ 
                    fontSize: 64, 
                    color: 'text.secondary',
                    opacity: 0.5
                  }} />
                  <Typography color="text.secondary" variant="h6">
                    No pipe-delimited data found
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderTopColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            {parsedData.fields.length > 0 && (
              `Displaying ${parsedData.fields.length} fields in vertical format`
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

export default PipeDelimitedVerticalModal;
