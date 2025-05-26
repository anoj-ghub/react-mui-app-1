import { useState } from 'react'
import { Box } from '@mui/material'
import AppDrawer from './components/Drawer/AppDrawer'
import Home from './pages/Home/Home'
import DataBrowser from './pages/DataBrowser/DataBrowser'
import Other from './pages/Other/Other'

function App() {
  const [selectedPage, setSelectedPage] = useState('Home')
  const [drawerOpen, setDrawerOpen] = useState(false) // Start collapsed by default
  const [environment, setEnvironment] = useState('Development')
  const [darkMode, setDarkMode] = useState(false)
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const renderPage = () => {
    switch (selectedPage) {
      case 'Home':
        return <Home />
      case 'Data Browser':
        return <DataBrowser environment={environment} darkMode={darkMode} setEnvironment={setEnvironment} setDarkMode={setDarkMode} />
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