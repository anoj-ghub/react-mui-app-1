/**
 * @fileoverview Main application component for React MUI Data Browser
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import AppDrawer from './components/Drawer/AppDrawer'
import Home from './pages/Home/Home'
import DataBrowser from './pages/DataBrowser/DataBrowser'
import { AccountInquiry } from './pages/AccountInquiry'
import { UpdateConfigTable, EnableDisableRegions, UpdateConfigEntries } from './pages/UpdateConfigTable'
import { CustomerProfiles } from './pages/CustomerProfiles'
import Other from './pages/Other/Other'
import TableDemo from './pages/TableDemo/TableDemo'
import IndexedDBTest from './examples/IndexedDBTest'
import RulesEvaluationDemo from './examples/RulesEvaluationDemo'
import RulesEvaluationModalDemo from './examples/RulesEvaluationModalDemo'
import RulesEvaluationStepperDemo from './examples/RulesEvaluationStepperDemo'

/**
 * Main App component that manages global application state and routing
 * 
 * Features:
 * - Page navigation and routing
 * - Global state management (theme, environment)
 * - Drawer navigation integration
 * - Responsive layout structure
 * 
 * @component
 * @returns {JSX.Element} The main application component
 */
function App() {
  /** @type {[string, Function]} Current selected page state */
  const [selectedPage, setSelectedPage] = useState('Home')
  
  /** @type {[boolean, Function]} Drawer open/closed state */
  const [drawerOpen, setDrawerOpen] = useState(false) // Start collapsed by default
  
  /**
   * Persisted environment state (Development / Pre-prod / Production)
   * Initializes from localStorage and syncs on change
   */
  const ENV_STORAGE_KEY = 'app.environment.selected'
  const [environment, setEnvironmentState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(ENV_STORAGE_KEY) || 'Development'
      }
    } catch (_) {
      // ignore storage issues
    }
    return 'Development'
  })

  // Wrapped setEnvironment with logging
  const setEnvironment = (newEnv) => {
    console.log('setEnvironment called with:', newEnv)
    console.log('Current environment before update:', environment)
    setEnvironmentState(newEnv)
  }

  // Log environment changes
  useEffect(() => {
    console.log('Environment state updated to:', environment)
  }, [environment])

  // Sync environment to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(ENV_STORAGE_KEY, environment)
      }
    } catch (_) {
      // ignore storage issues
    }
  }, [environment])
  
  /** @type {[boolean, Function]} Dark mode theme state */
  const [darkMode, setDarkMode] = useState(false)
  
  /**
   * Toggles the navigation drawer open/closed state
   */
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  /**
   * Renders the appropriate page component based on selected page
   * @returns {JSX.Element} The page component to render
   */
  const renderPage = () => {
    switch (selectedPage) {
      case 'Home':
        return <Home />
      case 'Data Browser':
        return <DataBrowser environment={environment} darkMode={darkMode} setEnvironment={setEnvironment} setDarkMode={setDarkMode} />
      case 'Account Inquiry':
        return <AccountInquiry darkMode={darkMode} />
      case 'Update Config Table':
        return <UpdateConfigTable darkMode={darkMode} environment={environment} />
      case 'Enable/Disable Regions':
        return <EnableDisableRegions darkMode={darkMode} environment={environment} />
      case 'Update Config Entries':
        return <UpdateConfigEntries darkMode={darkMode} environment={environment} />
      case 'Customer Profiles':
        return <CustomerProfiles darkMode={darkMode} environment={environment} />
      case 'Table Demo':
        return <TableDemo />
      case 'Other':
        return <Other />
      case 'IndexedDB Test':
        return <IndexedDBTest />
      case 'Rules Evaluation':
        return <RulesEvaluationDemo />
      case 'Rules Modal Demo':
        return <RulesEvaluationModalDemo />
      case 'Rules Stepper Demo':
        return <RulesEvaluationStepperDemo />
      default:
        return <Home />
    }
  }

  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#121212' : '#fafafa'
    }}>
      <AppDrawer 
        open={drawerOpen}
        onMenuClick={handleDrawerToggle}
        selectedPage={selectedPage}
        onPageSelect={setSelectedPage}
        environment={environment}
        setEnvironment={setEnvironment}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          mt: 8,
          ml: { sm: drawerOpen ? '240px' : '60px' },
          backgroundColor: darkMode ? '#121212' : '#fafafa',
          minHeight: '100vh',
          transition: (theme) => theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  )
}

export default App