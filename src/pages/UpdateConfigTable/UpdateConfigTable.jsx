/**
 * @fileoverview Update Config Table main page with sub-menu navigation
 * @author System
 * @version 1.0.0
 */

import { useState } from 'react'
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  AppBar,
  Paper
} from '@mui/material'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import PublicIcon from '@mui/icons-material/Public'
import EditIcon from '@mui/icons-material/Edit'
import EnableDisableRegions from './EnableDisableRegions'
import UpdateConfigEntries from './UpdateConfigEntries'

/**
 * TabPanel component for tab content display
 */
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

/**
 * Tab properties generator for accessibility
 */
function a11yProps(index) {
  return {
    id: `config-tab-${index}`,
    'aria-controls': `config-tabpanel-${index}`,
  }
}

/**
 * Update Config Table main component with sub-menu navigation
 * 
 * Features:
 * - Tabbed interface for different config operations
 * - Enable/Disable Regions management
 * - Update Config Entries form
 * - Modern Material Design styling
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.darkMode - Current theme mode
 * @returns {JSX.Element} Update Config Table page
 */
function UpdateConfigTable({ darkMode = false }) {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <SettingsApplicationsIcon 
            sx={{ 
              fontSize: 32,
              color: darkMode ? '#90caf9' : '#1976d2'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              color: darkMode ? '#fff' : '#1976d2'
            }}
          >
            Update Config Table
          </Typography>
        </Box>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ fontSize: '1.1rem' }}
        >
          Manage system configuration settings and regional parameters
        </Typography>
      </Box>

      {/* Configuration Management Card */}
      <Card 
        elevation={2}
        sx={{ 
          mb: 3,
          backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
          borderRadius: 2
        }}
      >
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: darkMode ? '#424242' : '#f5f5f5',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                color: darkMode ? '#fff' : '#424242',
                '&.Mui-selected': {
                  color: darkMode ? '#90caf9' : '#1976d2',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: darkMode ? '#90caf9' : '#1976d2',
                height: 3
              }
            }}
          >
            <Tab
              icon={<PublicIcon />}
              iconPosition="start"
              label="Enable/Disable Regions"
              {...a11yProps(0)}
            />
            <Tab
              icon={<EditIcon />}
              iconPosition="start"
              label="Update Config Entries"
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>

        <CardContent sx={{ p: 0 }}>
          <TabPanel value={tabValue} index={0}>
            <EnableDisableRegions darkMode={darkMode} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <UpdateConfigEntries darkMode={darkMode} />
          </TabPanel>
        </CardContent>
      </Card>

      {/* Help Information */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 3,
          backgroundColor: darkMode ? '#1e1e1e' : '#f8f9fa',
          borderRadius: 2,
          border: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: darkMode ? '#90caf9' : '#1976d2',
            fontWeight: 500
          }}
        >
          Configuration Management Help
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • <strong>Enable/Disable Regions:</strong> Control regional access and availability for different geographic areas
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • <strong>Update Config Entries:</strong> Modify system-wide configuration parameters and settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          All changes are validated before submission and require appropriate authorization levels.
        </Typography>
      </Paper>
    </Container>
  )
}

export default UpdateConfigTable
