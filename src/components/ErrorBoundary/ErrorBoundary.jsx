/**
 * @fileoverview Error Boundary Component for catching React errors
 * @author System
 * @version 1.0.0
 */

import React from 'react'
import { Box, Typography, Button, Paper, Alert } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

/**
 * Error Boundary component to catch and display React errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            m: 2,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto',
            mt: 4
          }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 64, 
              color: 'error.main', 
              mb: 2 
            }} 
          />
          
          <Typography variant="h5" gutterBottom color="error">
            Something went wrong
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred while rendering this component.
          </Typography>

          <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" component="div">
              <strong>Error:</strong> {this.state.error?.message}
            </Typography>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Typography variant="body2" component="pre" sx={{ mt: 1, fontSize: '0.75rem' }}>
                {this.state.errorInfo.componentStack}
              </Typography>
            )}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={this.handleReset}
              startIcon={<RefreshIcon />}
            >
              Try Again
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>
        </Paper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
