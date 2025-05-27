/**
 * @fileoverview Home page component with application overview and features
 * @author System
 * @version 1.0.0
 */

import { Typography, Paper, Box } from '@mui/material'

/**
 * Home page component displaying welcome message and application features
 * 
 * Features:
 * - Welcome message
 * - Application overview
 * - Feature list
 * - Technology stack information
 * 
 * @component
 * @returns {JSX.Element} Home page component
 */
function Home() {
  return (
    <Paper elevation={3} sx={{ p: 4, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to React 19 with MUI v6
      </Typography>
      <Typography variant="body1" paragraph>
        This application is built with the latest versions of React 19 and Material-UI v6.
        Navigate through the application using the drawer menu accessible via the hamburger icon.
      </Typography>
      <Typography variant="body1" paragraph>
        Features included:
      </Typography>
      <Box component="ul" sx={{ ml: 2 }}>
        <Typography component="li" variant="body1">
          React 19 with latest features
        </Typography>
        <Typography component="li" variant="body1">
          Material-UI v6 components
        </Typography>
        <Typography component="li" variant="body1">
          Responsive drawer navigation
        </Typography>
        <Typography component="li" variant="body1">
          Advanced Data Browser with MUI X DataGrid v7
        </Typography>
      </Box>
    </Paper>
  )
}

export default Home