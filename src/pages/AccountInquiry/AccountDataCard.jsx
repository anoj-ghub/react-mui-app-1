/**
 * @fileoverview Interactive account data card component
 * @author System
 * @version 1.0.0
 */

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Collapse,
  Badge,
  Fade
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ViewListIcon from '@mui/icons-material/ViewList'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'

/**
 * Interactive account data card component
 * 
 * Features:
 * - Expandable/collapsible content
 * - Multiple data field types
 * - Interactive buttons
 * - Error highlighting
 * - Beautiful styling and animations
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.icon - Card icon (emoji)
 * @param {string} props.color - Card theme color
 * @param {Array} props.data - Card data fields (max 20)
 * @param {boolean} props.darkMode - Dark mode state
 * @param {Function} props.onOpenVertical - Vertical view handler
 * @param {Function} props.onOpenErrors - Error view handler
 * @param {boolean} props.hasErrors - Whether card has errors
 * @returns {JSX.Element} Account data card
 */
function AccountDataCard({ 
  title, 
  icon, 
  color, 
  data, 
  darkMode, 
  onOpenVertical, 
  onOpenErrors, 
  hasErrors = false 
}) {
  const [expanded, setExpanded] = useState(false)
  const [hovering, setHovering] = useState(false)

  // Show first 5 fields by default, expand to show all
  const visibleData = expanded ? data : data.slice(0, 5)
  const hasMoreData = data.length > 5
  const hasData = data && data.length > 0

  /**
   * Toggles card expansion
   */
  const handleExpandToggle = () => {
    setExpanded(!expanded)
  }

  /**
   * Renders field value based on type
   * @param {Object} field - Field data
   * @returns {JSX.Element} Rendered field value
   */
  const renderFieldValue = (field) => {
    switch (field.type) {
      case 'chip':
        return (
          <Chip
            label={field.value}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        )
      case 'status':
        const statusColor = 
          field.value === 'Active' || field.value === 'Enabled' || field.value === 'Complete' || field.value === 'Clear' ? 'success' :
          field.value === 'Error' || field.value === 'Failed' || field.value === 'High' ? 'error' :
          field.value === 'Pending' || field.value === 'Medium' ? 'warning' : 'default'
        
        return (
          <Chip
            label={field.value}
            size="small"
            color={statusColor}
            icon={
              statusColor === 'success' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> :
              statusColor === 'error' ? <ErrorIcon sx={{ fontSize: 14 }} /> :
              statusColor === 'warning' ? <WarningIcon sx={{ fontSize: 14 }} /> : undefined
            }
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        )
      case 'amount':
        const amount = typeof field.value === 'number' ? field.value : parseFloat(field.value.replace(/[$,]/g, '')) || 0
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'monospace', 
              fontWeight: 700,
              color: amount >= 0 ? 'success.main' : 'error.main'
            }}
          >
            ${amount.toLocaleString()}
          </Typography>
        )
      case 'date':
        return (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            {new Date(field.value).toLocaleDateString()}
          </Typography>
        )
      case 'datetime':
        return (
          <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
            {new Date(field.value).toLocaleString()}
          </Typography>
        )
      default:
        return (
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            {field.value}
          </Typography>
        )
    }
  }

  // Generate mock error data for demonstration
  const mockErrors = hasErrors ? [
    { field: 'Validation Error', message: 'Account validation failed', severity: 'high' },
    { field: 'Compliance Issue', message: 'KYC documentation incomplete', severity: 'medium' },
    { field: 'System Warning', message: 'Unusual transaction pattern detected', severity: 'low' }
  ] : []

  return (
    <Card
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovering ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovering 
          ? `0 12px 32px rgba(0,0,0,0.15), 0 0 0 1px ${color}20`
          : '0 4px 12px rgba(0,0,0,0.1)',
        background: darkMode
          ? `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
          : `linear-gradient(145deg, #ffffff 0%, ${color}08 100%)`,
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : `${color}20`}`,
        overflow: 'visible',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(45deg, ${color} 30%, ${color}80 90%)`,
          borderRadius: '12px 12px 0 0'
        }
      }}
    >
      {/* Card Header */}
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(45deg, ${color}20 30%, ${color}10 90%)`,
            border: `2px solid ${color}30`,
            fontSize: '1.2rem',
            mr: 1.5
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                fontSize: '1rem',
                color: darkMode ? 'white' : 'text.primary'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {hasData ? `${data.length} fields` : 'No data available'}
            </Typography>
          </Box>
          
          {hasErrors && (
            <Badge badgeContent={mockErrors.length} color="error">
              <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />
            </Badge>
          )}
        </Box>

        <Divider sx={{ mb: 2, borderColor: `${color}20` }} />

        {/* Data Fields */}
        <Box sx={{ minHeight: 200 }}>
          {!hasData ? (
            // Show "Data not available" message when no data
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                height: 200,
                textAlign: 'center'
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'error.main',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  mb: 1
                }}
              >
                Data not available
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'error.light',
                  fontSize: '0.9rem'
                }}
              >
                No information to display for this section
              </Typography>
            </Box>
          ) : (
            // Show data fields when data is available
            <>
              {visibleData.map((field, index) => (
                <Fade in key={index} timeout={200 + index * 50}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 1,
                      px: 1,
                      borderRadius: 1,
                      transition: 'background-color 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : `${color}08`
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        fontSize: '0.8rem',
                        color: 'text.secondary',
                        minWidth: '40%'
                      }}
                    >
                      {field.label}:
                    </Typography>
                    <Box sx={{ textAlign: 'right', minWidth: '55%' }}>
                      {renderFieldValue(field)}
                    </Box>
                  </Box>
                </Fade>
              ))}

              {/* Collapse for additional fields */}
              <Collapse in={expanded}>
                {data.slice(5).map((field, index) => (
                  <Fade in key={index + 5} timeout={200 + (index + 5) * 50}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1,
                        px: 1,
                        borderRadius: 1,
                        transition: 'background-color 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : `${color}08`
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                          minWidth: '40%'
                        }}
                      >
                        {field.label}:
                      </Typography>
                      <Box sx={{ textAlign: 'right', minWidth: '55%' }}>
                        {renderFieldValue(field)}
                      </Box>
                    </Box>
                  </Fade>
                ))}
              </Collapse>
            </>
          )}
        </Box>

        {/* Expand/Collapse Button */}
        {hasMoreData && hasData && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Tooltip title={expanded ? 'Show less' : 'Show more'}>
              <IconButton
                onClick={handleExpandToggle}
                sx={{
                  color: color,
                  backgroundColor: `${color}10`,
                  '&:hover': {
                    backgroundColor: `${color}20`,
                    transform: 'scale(1.1)'
                  }
                }}
              >
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </CardContent>

      {/* Card Actions */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ViewListIcon />}
          onClick={() => onOpenVertical(title, data)}
          disabled={!hasData}
          sx={{
            borderColor: !hasData ? 'action.disabled' : `${color}50`,
            color: !hasData ? 'action.disabled' : color,
            '&:hover': {
              borderColor: !hasData ? 'action.disabled' : color,
              backgroundColor: !hasData ? 'transparent' : `${color}10`,
              transform: !hasData ? 'none' : 'translateY(-2px)'
            },
            transition: 'all 0.2s ease-in-out',
            flex: 1
          }}
        >
          Vertical View
        </Button>
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<ErrorIcon />}
          onClick={() => onOpenErrors(title, mockErrors)}
          disabled={!hasErrors || !hasData}
          color={hasErrors && hasData ? 'error' : 'inherit'}
          sx={{
            '&:hover': {
              transform: (hasErrors && hasData) ? 'translateY(-2px)' : 'none'
            },
            transition: 'all 0.2s ease-in-out',
            flex: 1
          }}
        >
          Errors ({mockErrors.length})
        </Button>
      </CardActions>
    </Card>
  )
}

export default AccountDataCard
