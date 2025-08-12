import React, { useMemo, useState } from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Divider
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import CloseIcon from '@mui/icons-material/Close'
import { getRecentValues, clearRecentValues } from '../../utils/recentValuesStorage'
import { DataGrid } from '@mui/x-data-grid'
import Radio from '@mui/material/Radio'

/**
 * RecentValuesButton
 * A reusable button that opens a dialog listing the most recent 50 input values for a given storageKey.
 * On selecting an item, it calls onSelect(item) and closes.
 */
export default function RecentValuesButton({
  storageKey,
  onSelect,
  renderItem,
  buttonProps = {},
  title = 'Recent entries',
  columns: providedColumns,
}) {
  const [open, setOpen] = useState(false)
  const items = useMemo(() => getRecentValues(storageKey), [storageKey, open])
  const [selectedId, setSelectedId] = useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleClearAll = () => {
    clearRecentValues(storageKey)
    // Re-render by toggling open state
    setOpen(o => !o)
    setOpen(o => !o)
    setSelectedId(null)
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

  const autoColumns = useMemo(() => {
    if (!items.length) return []
    const keys = Object.keys(items[0] || {})
    return keys.map(k => ({
      field: k,
      headerName: k.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()),
      flex: 1,
      minWidth: 120,
      sortable: false,
      headerClassName: 'rvb--header',
      cellClassName: 'rvb--cell'
    }))
  }, [items])

  const selectionCol = {
    field: '__select__',
    headerName: '',
    width: 56,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <Radio
        size="small"
        checked={params.id === selectedId}
        onChange={() => setSelectedId(params.id)}
        inputProps={{ 'aria-label': `Select row ${params.id}` }}
      />
    )
  }

  const columns = useMemo(() => {
    const cols = providedColumns && providedColumns.length ? providedColumns : autoColumns
    return [selectionCol, ...cols]
  }, [providedColumns, autoColumns])

  return (
    <>
      <Tooltip title="Show recent entries">
        <Button
          size="small"
          variant="outlined"
          startIcon={<HistoryIcon sx={{ fontSize: '0.9rem' }} />}
          onClick={handleOpen}
          {...buttonProps}
        >
          Recent
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          timeout: 300
        }}
        PaperProps={{
          sx: (theme) => ({
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
            boxShadow: theme.palette.mode === 'dark' 
              ? '0 20px 40px rgba(0,0,0,0.8), 0 8px 16px rgba(0,0,0,0.4)'
              : '0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(0,0,0,0.08)',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, rgba(30,30,30,0.98) 0%, rgba(24,24,24,0.98) 50%, rgba(18,18,18,0.98) 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #fafbfc 50%, #f5f6f7 100%)',
            backdropFilter: 'blur(10px)',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.9) translateY(-20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1) translateY(0)'
              }
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
            background: theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.06) 100%)',
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
              background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
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
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.3)' : 'rgba(59, 130, 246, 0.2)'
              })}
            >
              <HistoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
                {title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {items.length} {items.length === 1 ? 'entry' : 'entries'} available
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
          {items.length === 0 ? (
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
                <HistoryIcon sx={{ fontSize: 28, opacity: 0.7, color: 'primary.main' }} />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                  No recent entries yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Submit the form to save your first entry and see it here.
                </Typography>
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
                onRowDoubleClick={(params) => {
                  const entry = items[params.id]
                  onSelect?.(entry)
                  setOpen(false)
                }}
                sx={(theme) => ({
                  border: 0,
                  '& .rvb--header': {
                    background: theme.palette.mode === 'dark' 
                      ? 'linear-gradient(135deg, rgba(56, 139, 253, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 0%, rgba(147, 51, 234, 0.04) 100%)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    borderBottom: '2px solid',
                    borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(56, 139, 253, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                    color: 'primary.main'
                  },
                  '& .rvb--cell': {
                    fontSize: '0.85rem',
                    borderBottom: '1px solid',
                    borderBottomColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                  },
                  '& .MuiDataGrid-row': {
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:nth-of-type(odd)': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(56, 139, 253, 0.08)' 
                        : 'rgba(59, 130, 246, 0.06)',
                      transform: 'scale(1.002)',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(56, 139, 253, 0.15)'
                        : '0 2px 8px rgba(59, 130, 246, 0.1)'
                    }
                  },
                  '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                    outline: 'none'
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    '&::-webkit-scrollbar': {
                      width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                      }
                    }
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
                  Double-click to select
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
            Most recent first • {items.length > 0 ? 'Select with radio or double-click' : 'Submit form to add entries'}
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
                ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                : undefined,
              '&:hover': selectedId != null ? {
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
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
