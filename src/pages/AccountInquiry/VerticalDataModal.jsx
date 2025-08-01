/**
 * @fileoverview Vertical data modal for detailed field view
 * @author System
 * @version 1.0.0
 */

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Fade
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ViewListIcon from '@mui/icons-material/ViewList'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

/**
 * Vertical data modal component
 * 
 * Features:
 * - Vertical table layout
 * - Field type indicators
 * - Copy functionality
 * - Responsive design
 * - Beautiful styling
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {Array} props.data - Data fields
 * @param {boolean} props.darkMode - Dark mode state
 * @returns {JSX.Element} Vertical data modal
 */
function VerticalDataModal({ open, onClose, title, data, darkMode }) {
  /**
   * Copies all data to clipboard
   */
  const handleCopyAll = () => {
    const text = data.map(field => `${field.label}: ${field.value}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
        background: 'linear-gradient(45deg, #673AB7 30%, #9C27B0 90%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ViewListIcon />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title} - Vertical View
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {data.length} fields in detailed view
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyAll}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            Copy All
          </Button>
          
          <IconButton
            onClick={onClose}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Fade in timeout={300}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              maxHeight: 600,
              backgroundColor: 'transparent',
              boxShadow: 'none'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700, 
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                    }}
                  >
                    Field Name
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700,
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      borderBottom: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                    }}
                  >
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((field, index) => (
                  <TableRow 
                    key={index}
                    sx={{
                      transition: 'background-color 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
                      }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {field.label}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {field.type === 'chip' ? (
                          <Chip
                            label={field.value}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ) : field.type === 'status' ? (
                          <Chip
                            label={field.value}
                            size="small"
                            color={
                              field.value === 'Active' || field.value === 'Enabled' ? 'success' :
                              field.value === 'Error' || field.value === 'Failed' ? 'error' :
                              field.value === 'Pending' ? 'warning' : 'default'
                            }
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ) : field.type === 'amount' ? (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace', 
                              fontWeight: 700,
                              color: 'success.main'
                            }}
                          >
                            {typeof field.value === 'number' 
                              ? `$${field.value.toLocaleString()}`
                              : field.value
                            }
                          </Typography>
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: '0.9rem',
                              wordBreak: 'break-word'
                            }}
                          >
                            {field.value}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Total fields: {data.length}
          </Typography>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default VerticalDataModal
