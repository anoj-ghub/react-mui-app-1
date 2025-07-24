import React, { useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Avatar,
  Badge,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Paper
} from '@mui/material';
import {
  Schema as SchemaIcon,
  Close as CloseIcon,
  Storage as StorageIcon,
  CloudSync as CloudSyncIcon,
  TableChart as TableChartIcon,
  Api as ApiIcon,
  FolderOpen as FolderIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Transform as TransformIcon,
  Code as CodeIcon
} from '@mui/icons-material';

const FieldInfoPopover = ({
  open,
  anchorEl,
  onClose,
  selectedFieldInfo,
  darkMode
}) => {
  const [activeSection, setActiveSection] = useState('all');
  const [expandedAccordions, setExpandedAccordions] = useState({
    origin: true,
    database: false,
    api: false,
    downstream: false
  });

  if (!selectedFieldInfo) return null;

  const handleAccordionChange = (section) => (event, isExpanded) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [section]: isExpanded
    }));
  };

  const handleSectionFilter = (event, newSection) => {
    if (newSection !== null) {
      setActiveSection(newSection);
    }
  };

  const renderDataTypeChip = (datatype, length, scale) => {
    const getTypeColor = (type) => {
      if (type?.toLowerCase().includes('char') || type?.toLowerCase().includes('string')) return 'primary';
      if (type?.toLowerCase().includes('decimal') || type?.toLowerCase().includes('numeric')) return 'success';
      if (type?.toLowerCase().includes('date') || type?.toLowerCase().includes('timestamp')) return 'warning';
      return 'default';
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip
          label={datatype}
          size="small"
          color={getTypeColor(datatype)}
          sx={{ fontSize: '0.7rem', height: 22 }}
        />
        {length && (
          <Box sx={{
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderRadius: 1,
            px: 0.8,
            py: 0.3,
            border: '1px solid rgba(25, 118, 210, 0.3)'
          }}>
            <Typography variant="caption" sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: '#1976d2',
              fontFamily: 'monospace'
            }}>
              {length}{scale !== undefined && scale > 0 ? `.${scale}` : ''}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const renderPositionIndicator = (startPos, endPos) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: 1,
        px: 0.8,
        py: 0.3,
        fontSize: '0.6rem',
        fontFamily: 'monospace',
        fontWeight: 600,
        minWidth: 24,
        justifyContent: 'center'
      }}>
        {startPos}
      </Box>
      <Box sx={{ 
        width: 8, 
        height: 1.5, 
        backgroundColor: 'primary.main',
        borderRadius: 1
      }} />
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'primary.main',
        color: 'white',
        borderRadius: 1,
        px: 0.8,
        py: 0.3,
        fontSize: '0.6rem',
        fontFamily: 'monospace',
        fontWeight: 600,
        minWidth: 24,
        justifyContent: 'center'
      }}>
        {endPos}
      </Box>
    </Box>
  );

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            boxShadow: darkMode
              ? '0 24px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
              : '0 24px 48px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            width: '95vw',
            maxWidth: 1000,
            height: '90vh',
            maxHeight: 800,
            background: darkMode
              ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1e1e1e 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
            display: 'flex',
            flexDirection: 'column',
          }
        }
      }}
    >
      {/* Enhanced Header */}
      <Box sx={{
        background: darkMode
          ? 'linear-gradient(135deg, #424242 0%, #616161 100%)'
          : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Cpath d="M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z"/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <SchemaIcon sx={{ fontSize: '1.8rem' }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{
              fontWeight: 800,
              fontSize: '1.4rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 0.5
            }}>
              {selectedFieldInfo.displayName}
            </Typography>
            <Typography variant="body2" sx={{
              opacity: 0.9,
              fontWeight: 500,
              fontSize: '0.9rem'
            }}>
              {selectedFieldInfo.description}
            </Typography>
          </Box>
          <IconButton
            size="large"
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            <CloseIcon sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Buttons */}
      <Box sx={{
        p: 2,
        borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'
      }}>
        <ToggleButtonGroup
          value={activeSection}
          exclusive
          onChange={handleSectionFilter}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 2,
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'none',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)'}`,
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1565c0',
                }
              }
            }
          }}
        >
          <ToggleButton value="all">All Sections</ToggleButton>
          <ToggleButton value="origin">Data Origin</ToggleButton>
          <ToggleButton value="database">Database</ToggleButton>
          <ToggleButton value="api">API Config</ToggleButton>
          <ToggleButton value="downstream">Downstream</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          borderRadius: '4px',
          '&:hover': {
            background: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          }
        }
      }}>
        {/* Data Origin Section */}
        {(activeSection === 'all' || activeSection === 'origin') && (
          <Accordion
            expanded={expandedAccordions.origin}
            onChange={handleAccordionChange('origin')}
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: darkMode ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.05)',
                borderRadius: '12px 12px 0 0',
                '& .MuiAccordionSummary-content': { alignItems: 'center' }
              }}
            >
              <CloudSyncIcon sx={{ mr: 1, color: '#2196f3' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Data Origin & Processing
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                {/* Batch Processing */}
                <Card sx={{
                  borderRadius: 3,
                  backgroundColor: darkMode ? 'rgba(33,150,243,0.1)' : 'rgba(33,150,243,0.05)',
                  border: `1px solid ${darkMode ? 'rgba(33,150,243,0.3)' : 'rgba(33,150,243,0.2)'}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(33,150,243,0.2)'
                  }
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <StorageIcon sx={{ color: '#2196f3' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        Batch Processing
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Switch
                        checked={selectedFieldInfo.origin.batch.updated}
                        size="small"
                        disabled
                        sx={{
                          '& .MuiSwitch-thumb': {
                            backgroundColor: selectedFieldInfo.origin.batch.updated ? '#2196f3' : '#9e9e9e'
                          }
                        }}
                      />
                    </Box>
                    {selectedFieldInfo.origin.batch.updated && (
                      <Box sx={{
                        backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                        borderRadius: 2,
                        p: 2
                      }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                              File Name
                            </Typography>
                            <Chip
                              label={selectedFieldInfo.origin.batch.feedFileDetails.name}
                              size="small"
                              color="primary"
                              sx={{ fontSize: '0.65rem', height: 20 }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                              Record Type
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: 'primary.main' }}>
                                R
                              </Avatar>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                {selectedFieldInfo.origin.batch.feedFileDetails.recType}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                              Field Name
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                              {selectedFieldInfo.origin.batch.feedFileDetails.fieldname}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 0.5 }}>
                              Data Type
                            </Typography>
                            {renderDataTypeChip(
                              selectedFieldInfo.origin.batch.feedFileDetails.datatype,
                              selectedFieldInfo.origin.batch.feedFileDetails.length
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem', display: 'block', mb: 1 }}>
                            Position Range
                          </Typography>
                          {renderPositionIndicator(
                            selectedFieldInfo.origin.batch.feedFileDetails.startPos,
                            selectedFieldInfo.origin.batch.feedFileDetails.endPos
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                {/* Real-time Processing */}
                <Card sx={{
                  borderRadius: 3,
                  backgroundColor: darkMode ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.05)',
                  border: `1px solid ${darkMode ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)'}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(76,175,80,0.2)'
                  }
                }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CloudSyncIcon sx={{ color: '#4caf50' }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        Real-time Events
                      </Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Switch
                        checked={selectedFieldInfo.origin.realTime.updated}
                        size="small"
                        disabled
                        sx={{
                          '& .MuiSwitch-thumb': {
                            backgroundColor: selectedFieldInfo.origin.realTime.updated ? '#4caf50' : '#9e9e9e'
                          }
                        }}
                      />
                    </Box>
                    {selectedFieldInfo.origin.realTime.updated && selectedFieldInfo.origin.realTime.events ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {/* Column Headers */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          px: 1.5,
                          py: 0.5,
                          backgroundColor: darkMode ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.05)',
                          borderRadius: 1,
                          border: `1px solid ${darkMode ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)'}`
                        }}>
                          <Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4caf50' }}>
                              ✓
                            </Typography>
                          </Box>
                          <Box sx={{ width: 110 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4caf50' }}>
                              Event Name
                            </Typography>
                          </Box>
                          <Box sx={{ width: 70 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4caf50' }}>
                              Data Type
                            </Typography>
                          </Box>
                          <Box sx={{ width: 50 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4caf50', textAlign: 'center' }}>
                              Length
                            </Typography>
                          </Box>
                          <Box sx={{ width: 120 }}>
                            <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 700, color: '#4caf50', textAlign: 'center' }}>
                              Position Range
                            </Typography>
                          </Box>
                        </Box>

                        {/* Event Rows */}
                        {selectedFieldInfo.origin.realTime.events.map((event, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1.5,
                              backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
                              borderRadius: 2,
                              border: `1px solid ${darkMode ? 'rgba(76,175,80,0.2)' : 'rgba(76,175,80,0.3)'}`,
                              '&:hover': {
                                backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.9)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(76,175,80,0.2)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: '0.8rem', color: '#4caf50', flexShrink: 0 }} />
                            <Box sx={{ width: 110 }}>
                              <Chip
                                label={event.eventName}
                                size="small"
                                color="success"
                                sx={{ fontSize: '0.65rem', height: 20, maxWidth: '100%' }}
                              />
                            </Box>
                            <Box sx={{ width: 70 }}>
                              {renderDataTypeChip(event.datatype, null)}
                            </Box>
                            <Box sx={{ width: 50, display: 'flex', justifyContent: 'center' }}>
                              <Chip
                                label={`${event.length}`}
                                size="small"
                                color="info"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.6rem', 
                                  height: 18,
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  minWidth: 30,
                                  '& .MuiChip-label': { 
                                    px: 0.5,
                                    py: 0.2,
                                  }
                                }}
                              />
                            </Box>
                            <Box sx={{ width: 120, display: 'flex', justifyContent: 'center' }}>
                              {renderPositionIndicator(event.startPos, event.endPos)}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 80,
                        opacity: 0.5
                      }}>
                        <Typography variant="caption" sx={{ fontSize: '0.75rem', fontStyle: 'italic' }}>
                          Real-time processing not configured
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Database Schema Section */}
        {(activeSection === 'all' || activeSection === 'database') && (
          <Accordion
            expanded={expandedAccordions.database}
            onChange={handleAccordionChange('database')}
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: darkMode ? 'rgba(255,152,0,0.1)' : 'rgba(255,152,0,0.05)',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <TableChartIcon sx={{ mr: 1, color: '#ff9800' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Database Schema Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Card sx={{
                borderRadius: 3,
                backgroundColor: darkMode ? 'rgba(255,152,0,0.1)' : 'rgba(255,152,0,0.05)',
                border: `1px solid ${darkMode ? 'rgba(255,152,0,0.3)' : 'rgba(255,152,0,0.2)'}`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2.5, mb: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                        Table Name
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff9800' }}>
                        {selectedFieldInfo.pgTableInfo.tableInfo.name}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                        Column Name
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff9800' }}>
                        {selectedFieldInfo.pgTableInfo.tableInfo.colName}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                        Data Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {renderDataTypeChip(
                          selectedFieldInfo.pgTableInfo.tableInfo.datatype,
                          selectedFieldInfo.pgTableInfo.tableInfo.length,
                          selectedFieldInfo.pgTableInfo.tableInfo.scale
                        )}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                        Column Position
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'warning.main' }}>
                          #
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff9800', fontFamily: 'monospace' }}>
                          {selectedFieldInfo.pgTableInfo.tableInfo.colNum}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2.5 }}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!selectedFieldInfo.pgTableInfo.tableInfo.nulls}
                            size="small"
                            color="error"
                            disabled
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Not Null</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedFieldInfo.pgTableInfo.tableInfo.isPrimaryKey}
                            size="small"
                            color="warning"
                            disabled
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Primary Key</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedFieldInfo.pgTableInfo.tableInfo.default}
                            size="small"
                            color="info"
                            disabled
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Has Default</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!!selectedFieldInfo.pgTableInfo.tableInfo.ixName}
                            size="small"
                            color="success"
                            disabled
                          />
                        }
                        label={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Indexed</Typography>}
                        sx={{ m: 0 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        )}

        {/* API Configuration Section */}
        {(activeSection === 'all' || activeSection === 'api') && selectedFieldInfo.apiInfo && selectedFieldInfo.apiInfo.length > 0 && (
          <Accordion
            expanded={expandedAccordions.api}
            onChange={handleAccordionChange('api')}
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: darkMode ? 'rgba(156,39,176,0.1)' : 'rgba(156,39,176,0.05)',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <ApiIcon sx={{ mr: 1, color: '#9c27b0' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                API Configuration & Transformations
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              {selectedFieldInfo.apiInfo.map((api, index) => (
                <Card key={index} sx={{
                  borderRadius: 3,
                  backgroundColor: darkMode ? 'rgba(156,39,176,0.1)' : 'rgba(156,39,176,0.05)',
                  border: `1px solid ${darkMode ? 'rgba(156,39,176,0.3)' : 'rgba(156,39,176,0.2)'}`,
                  mb: index < selectedFieldInfo.apiInfo.length - 1 ? 2 : 0,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(156,39,176,0.2)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 2.5, mb: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                          Stored Procedure
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#9c27b0' }}>
                          {api.spName}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                          Tag Name
                        </Typography>
                        <Chip
                          label={api.tagName}
                          size="small"
                          color="secondary"
                          sx={{ fontSize: '0.7rem', height: 22 }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                          Position
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'secondary.main' }}>
                            #
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#9c27b0', fontFamily: 'monospace' }}>
                            {api.position}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8, display: 'block', mb: 1 }}>
                          Result Set
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={api.rsName}
                            size="small"
                            color="secondary"
                            sx={{ fontSize: '0.7rem', height: 22 }}
                          />
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600, fontFamily: 'monospace', color: '#9c27b0' }}>
                            #{api.resultsetNum}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'rgba(156,39,176,0.2)' }} />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 1 }}>
                          Formatting Options:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Switch
                            checked={api.formatting.applied}
                            size="small"
                            color="success"
                            disabled
                          />
                          {api.formatting.formatNumeric && (
                            <Chip label="Numeric" size="small" color="info" sx={{ fontSize: '0.65rem', height: 18 }} />
                          )}
                          {api.formatting.other && (
                            <Chip label="Custom" size="small" color="warning" sx={{ fontSize: '0.65rem', height: 18 }} />
                          )}
                        </Box>
                      </Box>

                      {api.transformationLogic && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 1.5 }}>
                            Transformation Logic:
                          </Typography>
                          <Box sx={{
                            backgroundColor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.8)',
                            borderRadius: 2,
                            p: 2.5,
                            border: `1px solid ${darkMode ? 'rgba(156,39,176,0.2)' : 'rgba(156,39,176,0.15)'}`,
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <TransformIcon sx={{ fontSize: '1rem', color: 'secondary.main' }} />
                              <Chip
                                label={api.transformationLogic.type}
                                size="small"
                                color="secondary"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: 18 }}
                              />
                            </Box>
                            <Box sx={{
                              backgroundColor: '#1e1e1e',
                              borderRadius: 2,
                              p: 2.5,
                              border: '1px solid #3c3c3c',
                              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4)',
                              position: 'relative',
                              '&::before': {
                                content: '"Code"',
                                position: 'absolute',
                                top: 8,
                                right: 12,
                                fontSize: '0.6rem',
                                color: '#858585',
                                fontFamily: 'monospace',
                                opacity: 0.7
                              }
                            }}>
                              <Box
                                component="pre"
                                sx={{
                                  fontSize: '0.75rem',
                                  fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", "Monaco", "Consolas", monospace',
                                  color: '#d4d4d4',
                                  fontWeight: 400,
                                  lineHeight: 1.6,
                                  margin: 0,
                                  padding: 0,
                                  letterSpacing: '0.025em',
                                  wordBreak: 'break-word',
                                  whiteSpace: 'pre-wrap',
                                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                              >
                                {api.transformationLogic.expression.split(/(\b(?:if|then|else|and|or|not|null|true|false)\b|['"][^'"]*['"]|\b\d+(?:\.\d+)?\b|[><=!]+)/g).map((part, index) => {
                                  if (/\b(if|then|else|and|or|not|null|true|false)\b/.test(part)) {
                                    return <span key={index} style={{ color: '#569cd6', fontWeight: 600 }}>{part}</span>;
                                  } else if (/['"][^'"]*['"]/.test(part)) {
                                    return <span key={index} style={{ color: '#ce9178' }}>{part}</span>;
                                  } else if (/\b\d+(?:\.\d+)?\b/.test(part)) {
                                    return <span key={index} style={{ color: '#b5cea8' }}>{part}</span>;
                                  } else if (/[><=!]+/.test(part)) {
                                    return <span key={index} style={{ color: '#d4d4d4', fontWeight: 600 }}>{part}</span>;
                                  }
                                  return <span key={index}>{part}</span>;
                                })}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Downstream Feed Section */}
        {(activeSection === 'all' || activeSection === 'downstream') && (
          <Accordion
            expanded={expandedAccordions.downstream}
            onChange={handleAccordionChange('downstream')}
            sx={{
              mb: 2,
              borderRadius: 3,
              '&:before': { display: 'none' },
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: darkMode ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.05)',
                borderRadius: '12px 12px 0 0',
              }}
            >
              <FolderIcon sx={{ mr: 1, color: '#4caf50' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
                Downstream Feed Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <Card sx={{
                borderRadius: 3,
                backgroundColor: darkMode ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.05)',
                border: `1px solid ${darkMode ? 'rgba(76,175,80,0.3)' : 'rgba(76,175,80,0.2)'}`,
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>
                        Control File
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <FolderIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {selectedFieldInfo.downstreamFeedDtls.controlFile}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>
                        Data File
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <StorageIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          {selectedFieldInfo.downstreamFeedDtls.datafile}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>
                        Field Name
                      </Typography>
                      <Chip
                        label={selectedFieldInfo.downstreamFeedDtls.fieldname}
                        size="small"
                        color="success"
                        sx={{ fontSize: '0.7rem', height: 22, mt: 0.5 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem', opacity: 0.8 }}>
                        Position & Type
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.25) 100%)',
                          borderRadius: 2,
                          px: 1.5,
                          py: 0.8,
                          border: '1px solid rgba(76, 175, 80, 0.4)',
                          position: 'relative',
                          overflow: 'hidden',
                          minWidth: 40,
                          textAlign: 'center',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'shine 2s infinite',
                            '@keyframes shine': {
                              '0%': { left: '-100%' },
                              '100%': { left: '100%' }
                            }
                          }
                        }}>
                          <Typography variant="caption" sx={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#4caf50',
                            fontFamily: 'monospace',
                            position: 'relative',
                            zIndex: 1
                          }}>
                            {selectedFieldInfo.downstreamFeedDtls.position}
                          </Typography>
                        </Box>
                        {renderDataTypeChip(
                          selectedFieldInfo.downstreamFeedDtls.datatype,
                          selectedFieldInfo.downstreamFeedDtls.length
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{
                    backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.8)',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: '1.1rem', color: 'success.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
                        Feed Status: Active & Processing
                      </Typography>
                    </Box>
                    <Chip
                      label="Last Updated: 2 mins ago"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Popover>
  );
};

export default FieldInfoPopover; 