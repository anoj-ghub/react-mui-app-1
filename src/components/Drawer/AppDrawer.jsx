/**
 * @fileoverview Application drawer component with navigation and settings
 * @author System
 * @version 1.0.0
 */

import { useState, useMemo } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Divider,
  Tooltip,
  Popover,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Collapse
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import DatasetIcon from '@mui/icons-material/Dataset'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import TableViewIcon from '@mui/icons-material/TableView'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SettingsIcon from '@mui/icons-material/Settings'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import StorageIcon from '@mui/icons-material/Storage'
import AssessmentIcon from '@mui/icons-material/Assessment'
import EnvironmentIcon from '@mui/icons-material/Computer'
import CloseIcon from '@mui/icons-material/Close'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import PeopleIcon from '@mui/icons-material/People'
import PublicIcon from '@mui/icons-material/Public'
import EditIcon from '@mui/icons-material/Edit'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getRecentEnvironments } from '../../utils/environmentRecentValues'

/** @constant {number} Width of the drawer when expanded */
const drawerWidth = 240

/** @constant {number} Width of the drawer when collapsed */
const miniDrawerWidth = 60

/** @constant {string[]} Available environment options */
const environmentOptions = ['Development', 'Pre-prod', 'Production']

/** @constant {Object[]} Menu items with names and icons */
const menuItems = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Data Browser', icon: <DatasetIcon /> },
  { name: 'Account Inquiry', icon: <AccountBalanceIcon /> },
  { 
    name: 'Update Config Table', 
    icon: <SettingsApplicationsIcon />,
    subItems: [
      { name: 'Enable/Disable Regions', icon: <PublicIcon /> },
      { name: 'Update Config Entries', icon: <EditIcon /> }
    ]
  },
  { name: 'Customer Profiles', icon: <PeopleIcon /> },
  { name: 'Rules Evaluation', icon: <AssessmentIcon /> },
  { name: 'Rules Modal Demo', icon: <AssessmentIcon /> },
  { name: 'Rules Stepper Demo', icon: <AssessmentIcon /> },
  { name: 'Table Demo', icon: <TableViewIcon /> },
  { name: 'IndexedDB Test', icon: <StorageIcon /> },
  { name: 'Other', icon: <MoreHorizIcon /> }
]

/**
 * Application drawer component providing navigation and global settings
 * 
 * Features:
 * - Collapsible navigation drawer
 * - Menu items with icons and tooltips
 * - Environment selection
 * - Dark/light mode toggle
 * - Settings popover
 * - Responsive design
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Drawer open/closed state
 * @param {Function} props.onClose - Function to close the drawer
 * @param {Function} props.onMenuClick - Function to toggle drawer
 * @param {string} props.selectedPage - Currently selected page
 * @param {Function} props.onPageSelect - Function to select a page
 * @param {string} props.environment - Current environment
 * @param {Function} props.setEnvironment - Function to set environment
 * @param {boolean} props.darkMode - Dark mode state
 * @param {Function} props.setDarkMode - Function to toggle dark mode
 * @returns {JSX.Element} Application drawer component
 */
function AppDrawer({ open, onClose, onMenuClick, selectedPage, onPageSelect, environment, setEnvironment, darkMode, setDarkMode }) {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null)
  const settingsOpen = Boolean(settingsAnchorEl)
  const [expandedMenus, setExpandedMenus] = useState({})

  // Get recent environments from recent values storage
  const recentEnvironments = useMemo(() => getRecentEnvironments(), [settingsOpen])
  
  // Combine default environments with recent ones, ensuring no duplicates
  const allEnvironments = useMemo(() => {
    const combined = [...environmentOptions]
    recentEnvironments.forEach(env => {
      if (!combined.includes(env)) {
        combined.push(env)
      }
    })
    return combined
  }, [recentEnvironments])

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget)
  }

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null)
  }

  const handleSubMenuToggle = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }))
  }

  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'Production': return 'error'
      case 'Development': return 'info'
      case 'Pre-prod': return 'warning'
      default: return 'default'
    }
  }
  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { sm: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)` },
          ml: { sm: `${open ? drawerWidth : miniDrawerWidth}px` },
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={onMenuClick}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            React 19 MUI App
          </Typography>
          
          {/* Settings Button */}
          <IconButton
            color="inherit"
            aria-label="settings"
            onClick={handleSettingsClick}
            sx={{ ml: 1 }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : miniDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
          },
          ...(open && {
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }),
          ...(!open && {
            '& .MuiDrawer-paper': {
              backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
              color: darkMode ? '#ffffff' : '#000000',
              borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
              width: miniDrawerWidth,
            },
          }),
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton 
            onClick={onMenuClick}
            sx={{ 
              color: darkMode ? '#ffffff' : '#000000' 
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <div key={item.name}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <Tooltip title={!open ? item.name : ''} placement="right">
                    <ListItemButton
                      selected={selectedPage === item.name || (item.subItems && item.subItems.some(subItem => selectedPage === subItem.name))}
                      onClick={() => {
                        if (item.subItems) {
                          handleSubMenuToggle(item.name)
                          if (!open) {
                            // If drawer is collapsed, expand it when clicking on menu with sub-items
                            onMenuClick()
                          }
                        } else {
                          onPageSelect(item.name)
                        }
                      }}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: darkMode ? '#ffffff' : '#000000',
                          '& .MuiSvgIcon-root': {
                            color: darkMode ? '#ffffff' : '#000000'
                          }
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      
                      {/* Text and Arrow Container */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          width: '100%',
                          opacity: open ? 1 : 0,
                          transition: (theme) => theme.transitions.create('opacity', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                          }),
                        }}
                      >
                        <Typography
                          sx={{
                            color: darkMode ? '#ffffff' : '#000000',
                            flex: 1,
                          }}
                        >
                          {item.name}
                        </Typography>
                        
                        {item.subItems && open && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              ml: 1,
                              color: darkMode ? '#ffffff' : '#000000',
                            }}
                          >
                            {expandedMenus[item.name] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </Box>
                        )}
                      </Box>
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                
                {/* Sub-menu items */}
                {item.subItems && (
                  <Collapse in={expandedMenus[item.name] && open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem key={subItem.name} disablePadding sx={{ display: 'block' }}>
                          <Tooltip title={!open ? subItem.name : ''} placement="right">
                            <ListItemButton
                              selected={selectedPage === subItem.name}
                              onClick={() => onPageSelect(subItem.name)}
                              sx={{
                                minHeight: 40,
                                pl: 4,
                                justifyContent: open ? 'initial' : 'center',
                                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: open ? 2 : 'auto',
                                  justifyContent: 'center',
                                  color: darkMode ? '#bbbbbb' : '#666666',
                                  '& .MuiSvgIcon-root': {
                                    fontSize: '1.2rem',
                                    color: darkMode ? '#bbbbbb' : '#666666'
                                  }
                                }}
                              >
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText 
                                primary={subItem.name} 
                                sx={{ 
                                  opacity: open ? 1 : 0,
                                  color: darkMode ? '#bbbbbb' : '#666666',
                                  '& .MuiTypography-root': {
                                    fontSize: '0.9rem',
                                    color: darkMode ? '#bbbbbb' : '#666666'
                                  },
                                  transition: (theme) => theme.transitions.create('opacity', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.leavingScreen,
                                  }),
                                }} 
                              />
                            </ListItemButton>
                          </Tooltip>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </div>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Settings Popover */}
      <Popover
        open={settingsOpen}
        anchorEl={settingsAnchorEl}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Card sx={{ minWidth: 280, maxWidth: 320 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Settings
                </Typography>
              </Box>
              <IconButton
                onClick={handleSettingsClose}
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    color: 'text.primary'
                  }
                }}
                aria-label="Close settings"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Environment Selection */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <EnvironmentIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Environment
                </Typography>
                {recentEnvironments.length > 0 && (
                  <Chip 
                    label={`${recentEnvironments.length} recent`}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{ ml: 'auto', fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Box>
              
              <FormControl fullWidth size="small">
                <InputLabel>Select Environment</InputLabel>
                <Select
                  value={environment}
                  label="Select Environment"
                  onChange={(e) => setEnvironment(e.target.value)}
                  sx={{ 
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }
                  }}
                >
                  {allEnvironments.map((env) => (
                    <MenuItem key={env} value={env}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{env}</span>
                          {recentEnvironments.includes(env) && !environmentOptions.includes(env) && (
                            <Chip 
                              label="Recent" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 16 }}
                            />
                          )}
                        </Box>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%',
                            backgroundColor: 
                              env === 'Production' ? 'error.main' :
                              env === 'Development' ? 'info.main' :
                              env === 'Pre-prod' ? 'warning.main' : 'success.main',
                            ml: 1
                          }} 
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Theme Toggle */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                {darkMode ? <DarkModeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} /> : <LightModeIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />}
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Theme
                </Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LightModeIcon sx={{ fontSize: 16, color: darkMode ? 'text.secondary' : 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ mx: 1 }}>
                      {darkMode ? 'Dark Mode' : 'Light Mode'}
                    </Typography>
                    <DarkModeIcon sx={{ fontSize: 16, color: darkMode ? 'info.main' : 'text.secondary', ml: 0.5 }} />
                  </Box>
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Popover>
    </>
  )
}

export default AppDrawer