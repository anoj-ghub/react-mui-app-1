/**
 * Simple storage toggle component
 * Provides easy switching between localStorage and IndexedDB
 */

import React, { useState } from 'react'
import {
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  Tooltip
} from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'

export default function StorageToggle({ 
  onStorageChange, 
  defaultSecure = false,
  showLabels = true,
  size = 'medium' 
}) {
  const [isSecure, setIsSecure] = useState(defaultSecure)

  const handleToggle = (event) => {
    const newValue = event.target.checked
    setIsSecure(newValue)
    onStorageChange?.(newValue)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StorageIcon fontSize="small" color={!isSecure ? 'primary' : 'disabled'} />
          <Typography 
            variant="caption" 
            color={!isSecure ? 'primary.main' : 'text.disabled'}
            sx={{ minWidth: 60 }}
          >
            localStorage
          </Typography>
        </Box>
      )}

      <Tooltip 
        title={`Switch to ${isSecure ? 'localStorage' : 'secure IndexedDB'} storage`}
        arrow
      >
        <Switch
          checked={isSecure}
          onChange={handleToggle}
          color="success"
          size={size}
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: isSecure ? '#4caf50' : '#2196f3'
            }
          }}
        />
      </Tooltip>

      {showLabels && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SecurityIcon fontSize="small" color={isSecure ? 'success' : 'disabled'} />
          <Typography 
            variant="caption" 
            color={isSecure ? 'success.main' : 'text.disabled'}
            sx={{ minWidth: 70 }}
          >
            IndexedDB 🔒
          </Typography>
        </Box>
      )}

      <Chip
        label={isSecure ? 'Secure' : 'Standard'}
        color={isSecure ? 'success' : 'primary'}
        size="small"
        variant="outlined"
        sx={{ ml: 1 }}
      />
    </Box>
  )
}
