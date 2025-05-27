/**
 * @fileoverview Main application component for React MUI Data Browser
 * @author System
 * @version 1.0.0
 */

import { useState } from 'react'
import { Box } from '@mui/material'
import AppDrawer from './components/Drawer/AppDrawer'
import Home from './pages/Home/Home'
import DataBrowser from './pages/DataBrowser/DataBrowser'
import Other from './pages/Other/Other'
import TableDemo from './pages/TableDemo/TableDemo'

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
  
  /** @type {[string, Function]} Current environment state (Development/Production) */
  const [environment, setEnvironment] = useState('Development')
  
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
      case 'Table Demo':
        return <TableDemo />
      case 'Other':
        return <Other />
      default:
        return <Home />
    }
  }

  return (
    <Box sx={{ display: 'flex' }}>
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