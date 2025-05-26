import { useState } from 'react'
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
  FormControlLabel
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import HomeIcon from '@mui/icons-material/Home'
import DatasetIcon from '@mui/icons-material/Dataset'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SettingsIcon from '@mui/icons-material/Settings'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import EnvironmentIcon from '@mui/icons-material/Computer'
import CloseIcon from '@mui/icons-material/Close'

const drawerWidth = 240
const miniDrawerWidth = 60
const environmentOptions = ['Development', 'Pre-prod', 'Production']

const menuItems = [
  { name: 'Home', icon: <HomeIcon /> },
  { name: 'Data Browser', icon: <DatasetIcon /> },
  { name: 'Other', icon: <MoreHorizIcon /> }
]

function AppDrawer({ open, onClose, onMenuClick, selectedPage, onPageSelect, environment, setEnvironment, darkMode, setDarkMode }) {
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null)
  const settingsOpen = Boolean(settingsAnchorEl)

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget)
  }

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null)
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
          ...(open && {
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }),
          ...(!open && {
            '& .MuiDrawer-paper': {
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
          <IconButton onClick={onMenuClick}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        
        <Divider />
        
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? item.name : ''} placement="right">
                  <ListItemButton
                    selected={selectedPage === item.name}
                    onClick={() => {
                      onPageSelect(item.name)
                      // Don't close drawer in mini variant mode
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name} 
                      sx={{ 
                        opacity: open ? 1 : 0,
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
                  {environmentOptions.map((env) => (
                    <MenuItem key={env} value={env}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>{env}</span>
                        <Box 
                          sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%',
                            backgroundColor: 
                              env === 'Production' ? 'error.main' :
                              env === 'Development' ? 'info.main' :
                              env === 'Pre-prod' ? 'warning.main' : 'default',
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