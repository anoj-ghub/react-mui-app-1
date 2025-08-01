/**
 * @fileoverview Error records modal for displaying validation errors
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
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Paper,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ErrorIcon from '@mui/icons-material/Error'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import BugReportIcon from '@mui/icons-material/BugReport'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

/**
 * Error records modal component
 * 
 * Features:
 * - Error severity levels
 * - Detailed error descriptions
 * - Resolution suggestions
 * - Beautiful error styling
 * - Expandable error details
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {Array} props.errors - Error data
 * @param {boolean} props.darkMode - Dark mode state
 * @returns {JSX.Element} Error records modal
 */
function ErrorRecordsModal({ open, onClose, title, errors, darkMode }) {
  /**
   * Gets error icon based on severity
   * @param {string} severity - Error severity
   * @returns {JSX.Element} Error icon
   */
  const getErrorIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon sx={{ color: 'error.main' }} />
      case 'medium':
        return <WarningIcon sx={{ color: 'warning.main' }} />
      case 'low':
        return <InfoIcon sx={{ color: 'info.main' }} />
      default:
        return <BugReportIcon sx={{ color: 'text.secondary' }} />
    }
  }

  /**
   * Gets error color based on severity
   * @param {string} severity - Error severity
   * @returns {string} Color name
   */
  const getErrorColor = (severity) => {
    switch (severity) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'info'
      default: return 'default'
    }
  }

  /**
   * Gets error background color based on severity
   * @param {string} severity - Error severity
   * @returns {string} Background color
   */
  const getErrorBackground = (severity) => {
    switch (severity) {
      case 'high': 
        return darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)'
      case 'medium': 
        return darkMode ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)'
      case 'low': 
        return darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)'
      default: 
        return darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
    }
  }

  // Generate detailed error information
  const detailedErrors = errors.map((error, index) => ({
    ...error,
    id: index + 1,
    timestamp: new Date().toLocaleString(),
    code: `ERR-${String(index + 1).padStart(3, '0')}`,
    resolution: getResolutionSuggestion(error.field, error.severity),
    affectedSystems: getAffectedSystems(error.field),
    priority: getPriority(error.severity)
  }))

  /**
   * Gets resolution suggestion based on error type
   * @param {string} field - Error field
   * @param {string} severity - Error severity
   * @returns {string} Resolution suggestion
   */
  function getResolutionSuggestion(field, severity) {
    if (field.includes('Validation')) {
      return 'Review account validation rules and update customer documentation.'
    }
    if (field.includes('Compliance')) {
      return 'Complete KYC documentation and submit required verification documents.'
    }
    if (field.includes('System')) {
      return 'Monitor transaction patterns and review automated risk assessment rules.'
    }
    return 'Contact system administrator for detailed investigation and resolution.'
  }

  /**
   * Gets affected systems based on error field
   * @param {string} field - Error field
   * @returns {Array} Affected systems
   */
  function getAffectedSystems(field) {
    if (field.includes('Validation')) {
      return ['Account Management', 'Customer Portal']
    }
    if (field.includes('Compliance')) {
      return ['KYC System', 'Regulatory Reporting']
    }
    if (field.includes('System')) {
      return ['Transaction Processing', 'Risk Management']
    }
    return ['Core Banking']
  }

  /**
   * Gets priority level based on severity
   * @param {string} severity - Error severity
   * @returns {string} Priority level
   */
  function getPriority(severity) {
    switch (severity) {
      case 'high': return 'Critical'
      case 'medium': return 'High'
      case 'low': return 'Medium'
      default: return 'Low'
    }
  }

  if (errors.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ mb: 3 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No Errors Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This section is currently error-free!
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
        background: 'linear-gradient(45deg, #F44336 30%, #E91E63 90%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ErrorIcon />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title} - Error Records
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {errors.length} error{errors.length !== 1 ? 's' : ''} detected
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{ color: 'white' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Summary Alert */}
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-message': { width: '100%' }
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Error Summary</AlertTitle>
          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`High: ${errors.filter(e => e.severity === 'high').length}`}
              color="error" 
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label={`Medium: ${errors.filter(e => e.severity === 'medium').length}`}
              color="warning" 
              size="small"
              sx={{ fontWeight: 600 }}
            />
            <Chip 
              label={`Low: ${errors.filter(e => e.severity === 'low').length}`}
              color="info" 
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        </Alert>

        {/* Error Details */}
        <Fade in timeout={300}>
          <Box>
            {detailedErrors.map((error, index) => (
              <Accordion 
                key={error.id}
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: getErrorBackground(error.severity),
                  border: `1px solid ${getErrorColor(error.severity) === 'error' ? '#f44336' : 
                                       getErrorColor(error.severity) === 'warning' ? '#ff9800' : 
                                       '#2196f3'}20`,
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    {getErrorIcon(error.severity)}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {error.field}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {error.message}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={error.priority}
                        color={getErrorColor(error.severity)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip
                        label={error.code}
                        variant="outlined"
                        size="small"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                
                <AccordionDetails>
                  <Box sx={{ pl: 5 }}>
                    <Divider sx={{ mb: 2 }} />
                    
                    {/* Error Details */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Error Details:
                      </Typography>
                      <Paper sx={{ p: 2, backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Timestamp:</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {error.timestamp}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Error Code:</Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {error.code}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>

                    {/* Affected Systems */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Affected Systems:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {error.affectedSystems.map((system, idx) => (
                          <Chip
                            key={idx}
                            label={system}
                            variant="outlined"
                            size="small"
                            color="secondary"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Resolution */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Recommended Resolution:
                      </Typography>
                      <Alert 
                        severity="info" 
                        sx={{ 
                          backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                          '& .MuiAlert-icon': { fontSize: 16 }
                        }}
                      >
                        {error.resolution}
                      </Alert>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
            Total errors: {errors.length}
          </Typography>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorRecordsModal
