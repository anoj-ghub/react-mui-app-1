import React, { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import CloseIcon from '@mui/icons-material/Close'
import SecurityIcon from '@mui/icons-material/Security'
import { DataGrid } from '@mui/x-data-grid'
import Radio from '@mui/material/Radio'

// Import both storage methods
import { getRecentValues, addRecentValue, clearRecentValues } from '../../utils/recentValuesStorage'
import { useSecureRecentValues } from '../../hooks/useSecureStorage'

/**
 * Enhanced RecentValuesButton with IndexedDB support
 * Generic component that can be used on any screen with any number of input elements
 * 
 * @param {string} storageKey - Unique key for storing entries
 * @param {function} onSelect - Callback when an entry is selected
 * @param {function} renderItem - Custom render function for display text (optional)
 * @param {object} buttonProps - Props to pass to the button
 * @param {string} title - Dialog title
 * @param {array} columns - Custom column configuration (optional)
 * @param {boolean} useSecureStorage - Whether to start in secure mode
 * @param {boolean} showStorageToggle - Whether to show storage mode toggle
 * @param {function} onStorageModeChange - Callback when storage mode changes
 * @param {function} onSaveEntry - Callback to expose save functionality
 * @param {object} fieldConfig - Configuration for form fields and display
 * @param {number} maxEntries - Maximum number of entries to store (default: 50)
 * @param {boolean} compact - Whether to use compact display mode
 * @param {string} emptyMessage - Custom message when no entries exist
 * @param {function} customFilter - Custom filter function for entries
 * @param {boolean} allowDuplicates - Whether to allow duplicate entries
 */
export default function SecureRecentValuesButton({
  storageKey,
  onSelect,
  renderItem,
  buttonProps = {},
  title = 'Recent entries',
  columns: providedColumns,
  useSecureStorage = false,
  showStorageToggle = true,
  onStorageModeChange,
  onSaveEntry,
  // New generic configuration props
  fieldConfig = null,
  maxEntries = 50,
  compact = false,
  emptyMessage = 'No recent entries yet',
  customFilter = null,
  allowDuplicates = true
}) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [secureMode, setSecureMode] = useState(useSecureStorage)

  // IndexedDB hook (only used when secureMode is true)
  const { 
    entries: secureEntries, 
    loading: secureLoading, 
    addEntry: addSecureEntry,
    isReady: secureReady 
  } = useSecureRecentValues(storageKey, maxEntries)

  // Create stable save function
  const saveFunction = React.useCallback(async (entry) => {
    console.log('SecureRecentValuesButton saveFunction called with:', { entry, secureMode, secureReady })
    
    // Apply custom filter if provided
    if (customFilter && !customFilter(entry)) {
      console.log('Entry filtered out by customFilter')
      return false
    }
    
    // Check for duplicates if not allowed
    if (!allowDuplicates) {
      const existingEntries = secureMode ? secureEntries : getRecentValues(storageKey)
      const isDuplicate = existingEntries.some(existing => 
        JSON.stringify(existing) === JSON.stringify(entry)
      )
      if (isDuplicate) {
        console.log('Duplicate entry detected, skipping save')
        return false
      }
    }
    
    if (secureMode) {
      // Do NOT fall back to localStorage when secure mode is enabled
      // If not ready yet, attempt and let the hook decide (it returns false when not ready)
      const ok = await addSecureEntry(entry)
      console.log('IndexedDB save attempted; success:', ok)
      return ok
    }

    // Non-secure mode explicitly uses localStorage
    console.log('Saving to localStorage:', entry)
    addRecentValue(storageKey, entry)
    return true
  }, [secureMode, addSecureEntry, storageKey, customFilter, allowDuplicates, secureEntries])

  // Expose save functionality to parent
  React.useEffect(() => {
    console.log('SecureRecentValuesButton useEffect called:', { 
      onSaveEntry: !!onSaveEntry, 
      secureMode, 
      secureReady,
      addSecureEntry: typeof addSecureEntry 
    })
    
    if (onSaveEntry) {
      console.log('Calling onSaveEntry with saveFunction - type:', typeof saveFunction, 'function:', saveFunction)
      
      // Make sure we're not accidentally calling the function
      if (typeof saveFunction === 'function') {
        onSaveEntry(saveFunction)
      } else {
        console.error('saveFunction is not a function!', saveFunction)
      }
    } else {
      console.log('No onSaveEntry callback provided')
    }
  }, [saveFunction, onSaveEntry]) // Only depend on the stable saveFunction and onSaveEntry

  // Get items based on storage mode
  const items = useMemo(() => {
    if (secureMode) {
      return secureReady ? secureEntries : []
    } else {
      return getRecentValues(storageKey)
    }
  }, [secureMode, secureReady, secureEntries, storageKey, open])

  const loading = secureMode ? secureLoading : false

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedId(null)
  }

  const handleClearAll = () => {
    if (secureMode) {
      // For IndexedDB, we'd need to implement a clear method
      console.log('Clear IndexedDB entries not implemented in this demo')
    } else {
      clearRecentValues(storageKey)
    }
    // Force refresh by toggling open state
    setOpen(false)
    setTimeout(() => setOpen(true), 100)
    setSelectedId(null)
  }

  const handleStorageModeChange = (event) => {
    const newValue = event.target.checked
    setSecureMode(newValue)
    // Notify parent component about the change
    onStorageModeChange?.(newValue)
  }

  const rows = useMemo(() => (
    items.map((item, idx) => {
      const flat = {}
      Object.entries(item || {}).forEach(([k, v]) => {
        flat[k] = typeof v === 'object' ? JSON.stringify(v) : v
      })
      return { id: idx, ...flat, __raw__: item }
    })
  ), [items])

  // Generate display text for entries using fieldConfig or renderItem
  const getDisplayText = React.useCallback((item) => {
    if (renderItem) {
      return renderItem(item)
    }
    
    if (fieldConfig && fieldConfig.displayFields) {
      // Use fieldConfig to generate display text
      return fieldConfig.displayFields
        .map(field => {
          const value = item[field.key] || field.fallback || '(not set)'
          return field.label ? `${field.label}: ${value}` : value
        })
        .join(fieldConfig.separator || ' • ')
    }
    
    // Default: show all non-internal fields
    return Object.entries(item || {})
      .filter(([key]) => !key.startsWith('_') && !key.startsWith('__'))
      .map(([key, value]) => `${key}: ${value}`)
      .join(' • ')
  }, [renderItem, fieldConfig])

  const autoColumns = useMemo(() => {
    if (!items.length) return []
    
    // Use fieldConfig if provided
    if (fieldConfig && fieldConfig.columns) {
      return fieldConfig.columns.map(col => ({
        field: col.key,
        headerName: col.label || col.key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()),
        flex: col.flex || 1,
        minWidth: col.minWidth || (compact ? 100 : 120),
        maxWidth: col.maxWidth,
        sortable: col.sortable !== false,
        headerClassName: 'rvb--header',
        cellClassName: 'rvb--cell',
        renderCell: col.renderCell || ((params) => params.value)
      }))
    }
    
    // Auto-generate columns from data
    const keys = Object.keys(items[0] || {}).filter(k => !k.startsWith('_') && !k.startsWith('__'))
    return keys.map(k => ({
      field: k,
      headerName: k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()),
      flex: 1,
      minWidth: compact ? 100 : 120,
      sortable: false,
      headerClassName: 'rvb--header',
      cellClassName: 'rvb--cell'
    }))
  }, [items, fieldConfig, compact])

  const selectionCol = {
    field: '__select__',
    headerName: '',
    width: compact ? 40 : 48,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Radio
        size={compact ? "small" : "small"}
        checked={params.id === selectedId}
        onChange={() => setSelectedId(params.id)}
        inputProps={{ 'aria-label': `Select row ${params.id}` }}
        sx={(theme) => ({
          p: compact ? 0.25 : 0.5,
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'scale(1.1)'
          },
          '& .MuiSvgIcon-root': {
            fontSize: compact ? '1rem' : '1.1rem'
          },
          transition: 'transform 0.15s ease'
        })}
      />
    )
  }

  const columns = useMemo(() => {
    const cols = providedColumns && providedColumns.length ? providedColumns : autoColumns
    return [selectionCol, ...cols]
  }, [providedColumns, autoColumns])

  return (
    <>
      <Tooltip title={`Show recent entries (${secureMode ? 'Secure IndexedDB' : 'localStorage'})`}>
        <Button
          size="small"
          variant="outlined"
          startIcon={secureMode ? <SecurityIcon sx={{ fontSize: '0.9rem' }} /> : <HistoryIcon sx={{ fontSize: '0.9rem' }} />}
          onClick={handleOpen}
          {...buttonProps}
          sx={{
            ...buttonProps.sx,
            borderColor: secureMode ? 'success.main' : undefined,
            color: secureMode ? 'success.main' : undefined
          }}
        >
          Recent {secureMode && '🔒'}
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        TransitionProps={{
          timeout: 400
        }}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: secureMode 
              ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(76, 175, 80, 0.3)')
              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 25px 50px rgba(0,0,0,0.9), 0 12px 24px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)'
              : '0 25px 50px rgba(0,0,0,0.2), 0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.08)',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, rgba(30,30,30,0.98) 0%, rgba(24,24,24,0.98) 30%, rgba(18,18,18,0.98) 70%, rgba(15,15,15,0.98) 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafbfc 30%, #f5f6f7 70%, #f0f1f2 100%)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: secureMode
                ? 'radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 195, 74, 0.05) 0%, transparent 50%)'
                : 'radial-gradient(circle at 20% 20%, rgba(56, 139, 253, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
              pointerEvents: 'none'
            }
          })
        }}
      >
        <DialogTitle
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: 3,
            background: secureMode 
              ? (theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(76, 175, 80, 0.06) 0%, rgba(139, 195, 74, 0.06) 100%)')
              : (theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.06) 100%)'),
            borderBottom: '1px solid',
            borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: secureMode 
                ? 'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)'
                : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              opacity: 0.7
            }
          })}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: secureMode
                  ? (theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)')
                  : (theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)'),
                border: '1px solid',
                borderColor: secureMode
                  ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)')
                  : (theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.3)' : 'rgba(59, 130, 246, 0.2)')
              })}
            >
              {secureMode ? 
                <SecurityIcon sx={{ fontSize: 16, color: 'success.main' }} /> :
                <HistoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
              }
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                {title} {secureMode && '(Secure)'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {loading ? 'Loading...' : `${items.length} ${items.length === 1 ? 'entry' : 'entries'} available`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {items.length > 0 && (
              <Tooltip title="Clear all entries">
                <IconButton 
                  size="small" 
                  onClick={handleClearAll} 
                  sx={(theme) => ({
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(244, 67, 54, 0.1)' 
                        : 'rgba(244, 67, 54, 0.08)',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  })}
                >
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton 
              size="small" 
              onClick={handleClose}
              sx={(theme) => ({
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.08)' 
                    : 'rgba(0,0,0,0.04)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {showStorageToggle && (
            <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={secureMode}
                    onChange={handleStorageModeChange}
                    color="success"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SecurityIcon fontSize="small" />
                    <Typography variant="body2">
                      Use Secure Storage (IndexedDB with encryption)
                    </Typography>
                  </Box>
                }
              />
              {secureMode && !secureReady && (
                <Alert severity="warning" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  Secure storage is initializing...
                </Alert>
              )}
            </Box>
          )}

          {loading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Loading entries...</Typography>
            </Box>
          ) : items.length === 0 ? (
            <Box
              sx={(theme) => ({
                p: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'text.secondary',
                minHeight: 200,
                gap: 2,
                background: theme.palette.mode === 'dark'
                  ? 'radial-gradient(circle at center, rgba(56, 139, 253, 0.05) 0%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.03) 0%, transparent 70%)'
              })}
            >
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)',
                  border: '2px dashed',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.6 }
                  }
                })}
              >
                {secureMode ? 
                  <SecurityIcon sx={{ fontSize: 28, opacity: 0.7, color: 'success.main' }} /> :
                  <HistoryIcon sx={{ fontSize: 28, opacity: 0.7, color: 'primary.main' }} />
                }
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  {emptyMessage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {fieldConfig && fieldConfig.emptySubtext 
                    ? fieldConfig.emptySubtext 
                    : "Submit the form to save your first entry and see it here."}
                </Typography>
                {secureMode && (
                  <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                    🔒 Entries will be stored securely with encryption
                  </Typography>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ height: 420, position: 'relative' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                hideFooter
                disableColumnMenu
                disableColumnSorting
                rowHeight={compact ? 28 : 32}
                headerHeight={compact ? 32 : 36}
                onRowDoubleClick={(params) => {
                  const entry = items[params.id]
                  onSelect?.(entry)
                  setOpen(false)
                }}
                onRowClick={(params) => {
                  setSelectedId(params.id)
                }}
                sx={(theme) => ({
                  border: 0,
                  fontSize: compact ? '0.75rem' : '0.8rem',
                  '& .rvb--header': {
                    background: secureMode
                      ? (theme.palette.mode === 'dark' 
                          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(139, 195, 74, 0.12) 100%)'
                          : 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(139, 195, 74, 0.08) 100%)')
                      : (theme.palette.mode === 'dark' 
                          ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)'
                          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)'),
                    fontWeight: 700,
                    fontSize: compact ? '0.7rem' : '0.75rem',
                    borderBottom: '2px solid',
                    borderBottomColor: secureMode
                      ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)')
                      : (theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.3)' : 'rgba(59, 130, 246, 0.2)'),
                    color: secureMode ? 'success.main' : 'primary.main',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  },
                  '& .rvb--cell': {
                    fontSize: compact ? '0.75rem' : '0.8rem',
                    borderBottom: '1px solid',
                    borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    padding: compact ? '2px 6px' : '4px 8px',
                    lineHeight: 1.2
                  },
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    transition: 'all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
                    position: 'relative',
                    '&:nth-of-type(odd)': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.01)'
                    },
                    '&:hover': {
                      backgroundColor: secureMode
                        ? (theme.palette.mode === 'dark' 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(76, 175, 80, 0.08)')
                        : (theme.palette.mode === 'dark' 
                            ? 'rgba(56, 139, 253, 0.1)' 
                            : 'rgba(59, 130, 246, 0.08)'),
                      transform: 'translateX(2px)',
                      boxShadow: secureMode
                        ? (theme.palette.mode === 'dark'
                            ? 'inset 3px 0 0 rgba(76, 175, 80, 0.6), 0 2px 8px rgba(76, 175, 80, 0.15)'
                            : 'inset 3px 0 0 rgba(76, 175, 80, 0.8), 0 2px 8px rgba(76, 175, 80, 0.12)')
                        : (theme.palette.mode === 'dark'
                            ? 'inset 3px 0 0 rgba(56, 139, 253, 0.6), 0 2px 8px rgba(56, 139, 253, 0.15)'
                            : 'inset 3px 0 0 rgba(59, 130, 246, 0.8), 0 2px 8px rgba(59, 130, 246, 0.12)'),
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '2px',
                        background: secureMode
                          ? 'linear-gradient(180deg, rgba(76, 175, 80, 0.8) 0%, rgba(139, 195, 74, 0.8) 100%)'
                          : 'linear-gradient(180deg, rgba(56, 139, 253, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
                        transform: 'scaleY(0)',
                        transition: 'transform 0.2s ease'
                      }
                    },
                    '&:hover::before': {
                      transform: 'scaleY(1)'
                    },
                    '&:active': {
                      transform: 'translateX(1px) scale(0.998)',
                      transition: 'all 0.1s ease'
                    }
                  },
                  '& .MuiDataGrid-cell': {
                    '&:focus, &:focus-within': {
                      outline: `2px solid ${secureMode ? theme.palette.success.main : theme.palette.primary.main}`,
                      outlineOffset: '-2px'
                    }
                  },
                  '& .MuiDataGrid-columnHeader': {
                    '&:focus, &:focus-within': {
                      outline: `2px solid ${secureMode ? theme.palette.success.main : theme.palette.primary.main}`,
                      outlineOffset: '-2px'
                    }
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      height: '6px'
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      borderRadius: '3px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: secureMode
                        ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.4)')
                        : (theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.3)' : 'rgba(59, 130, 246, 0.4)'),
                      borderRadius: '3px',
                      transition: 'background-color 0.2s ease',
                      '&:hover': {
                        backgroundColor: secureMode
                          ? (theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(76, 175, 80, 0.6)')
                          : (theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.5)' : 'rgba(59, 130, 246, 0.6)')
                      }
                    }
                  },
                  '& .MuiDataGrid-columnSeparator': {
                    display: 'none'
                  }
                })}
              />
              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(18,18,18,0.9)' 
                    : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                })}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {secureMode ? '🔒 Secure • ' : ''}Double-click to select
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions 
          sx={(theme) => ({ 
            px: 3, 
            py: 2,
            borderTop: '1px solid',
            borderTopColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            background: theme.palette.mode === 'dark' 
              ? 'rgba(255,255,255,0.02)' 
              : 'rgba(0,0,0,0.01)',
            gap: 1
          })}
        >
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ mr: 'auto', fontSize: '0.75rem', fontStyle: 'italic' }}
          >
            {secureMode ? '🔒 Secure storage' : 'localStorage'} • Most recent first • {items.length > 0 ? 'Select with radio or double-click' : 'Submit form to add entries'}
          </Typography>
          <Button
            onClick={() => {
              if (selectedId == null) return
              const entry = items[selectedId]
              onSelect?.(entry)
              setOpen(false)
            }}
            size="small"
            variant="contained"
            disabled={selectedId == null}
            sx={(theme) => ({
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              background: selectedId != null 
                ? (secureMode
                    ? 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)')
                : undefined,
              '&:hover': selectedId != null ? {
                background: secureMode
                  ? 'linear-gradient(135deg, #43a047 0%, #7cb342 100%)'
                  : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
                boxShadow: secureMode
                  ? '0 4px 12px rgba(76, 175, 80, 0.3)'
                  : '0 4px 12px rgba(59, 130, 246, 0.3)'
              } : {},
              transition: 'all 0.2s ease'
            })}
          >
            Use Selection
          </Button>
          <Button 
            onClick={handleClose} 
            size="small" 
            variant="outlined"
            sx={(theme) => ({
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              fontWeight: 600,
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              '&:hover': {
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
              },
              transition: 'all 0.2s ease'
            })}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
