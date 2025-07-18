/**
 * @fileoverview TimeZone Display Component
 * @author System
 * @version 1.0.0
 * 
 * Component that displays current time in multiple time zones (MST, UTC, Local)
 * with real-time updates and premium styling.
 */

import { useState, useEffect } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

/**
 * Formats time for a specific timezone
 * @param {Date} date - The date to format
 * @param {string} timeZone - The timezone identifier
 * @param {string} label - Display label for the timezone
 * @returns {Object} Formatted time object with label and time string
 */
const formatTimeForZone = (date, timeZone, label) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    
    return {
      label,
      time: formatter.format(date)
    }
  } catch (error) {
    return {
      label,
      time: 'Invalid timezone'
    }
  }
}

/**
 * Real-time timezone display component
 * 
 * Features:
 * - Shows current time in MST, UTC, and Local timezone
 * - Updates every second
 * - Premium styling with gradients and animations
 * - Color-coded timezone labels
 * - Responsive design
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Dark mode theme flag
 * @returns {JSX.Element} TimeZone display component
 * 
 * @example
 * ```jsx
 * <TimeZoneDisplay darkMode={false} />
 * ```
 */
function TimeZoneDisplay({ darkMode = false }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeZones = [
    formatTimeForZone(currentTime, 'America/Denver', 'MST'),
    formatTimeForZone(currentTime, 'UTC', 'UTC'),
    formatTimeForZone(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone, 'Local')
  ]

  const getTimezoneColor = (label) => {
    switch (label) {
      case 'MST': return '#4caf50' // Green
      case 'UTC': return '#ff9800' // Orange  
      case 'Local': return '#2196f3' // Blue
      default: return '#757575' // Gray
    }
  }

  return (
    <Paper
      elevation={6}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderRadius: '12px',
        background: darkMode 
          ? 'linear-gradient(135deg, rgba(30,30,30,0.95) 0%, rgba(60,60,60,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,248,255,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: darkMode
          ? '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: darkMode
            ? '0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
        }
      }}
    >
      {/* Clock Icon */}
      <Box sx={{ 
        marginRight: 2,
        animation: 'pulse 2s infinite',
        '@keyframes pulse': {
          '0%': { opacity: 0.8 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.8 }
        }
      }}>
        <AccessTimeIcon 
          sx={{ 
            color: darkMode ? '#90caf9' : '#1976d2',
            fontSize: '1.2rem',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} 
        />
      </Box>

      {/* Timezone Display */}
      {timeZones.map((tz, index) => (
        <Box 
          key={tz.label}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: index < timeZones.length - 1 ? 3 : 0,
            position: 'relative'
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 'bold',
              fontSize: '0.65rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: getTimezoneColor(tz.label),
              textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.8)',
              marginBottom: '2px'
            }}
          >
            {tz.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              fontWeight: '600',
              fontSize: '0.75rem',
              color: darkMode ? '#f5f5f5' : '#333',
              textShadow: darkMode ? '0 1px 2px rgba(0,0,0,0.8)' : '0 1px 2px rgba(255,255,255,0.9)',
              lineHeight: 1.2
            }}
          >
            {tz.time}
          </Typography>
        </Box>
      ))}
    </Paper>
  )
}

export default TimeZoneDisplay