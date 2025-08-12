/**
 * @fileoverview Rules Evaluation Dashboard Demo Page
 * @author System
 * @version 1.0.0
 */

import React from 'react'
import { Box, Typography, Paper, Button, Grid } from '@mui/material'
import { RulesEvaluationDashboard } from '../components'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'

/**
 * Demo page for the Rules Evaluation Dashboard component
 * 
 * Features:
 * - Full-screen rules evaluation interface
 * - Apple-inspired design principles
 * - Interactive rule expansion and details
 * - Color-coded status indicators
 * - Mock business data for testing
 * 
 * @component
 * @returns {JSX.Element} Rules evaluation demo page
 */
function RulesEvaluationDemo() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#F2F2F7',
      position: 'relative'
    }}>
      {/* Navigation Header */}
      <Box sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        p: 2
      }}>
        <Box sx={{ 
          maxWidth: 1200, 
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            sx={{ 
              color: '#007AFF',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(0, 122, 255, 0.1)'
              }
            }}
            onClick={() => window.history.back()}
          >
            Back to Examples
          </Button>
          
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#1D1D1F',
            textAlign: 'center',
            flex: 1
          }}>
            Rules Evaluation Dashboard Demo
          </Typography>
          
          <Box sx={{ width: 120 }} /> {/* Spacer for centering */}
        </Box>
      </Box>

      {/* Main Content */}
      <RulesEvaluationDashboard />

      {/* Feature Highlights */}
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 4,
        mt: 4
      }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#1D1D1F', 
            mb: 3,
            textAlign: 'center'
          }}>
            Dashboard Features
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: '#34C759',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    ✓
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                  Real-time Evaluation
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  Business rules are evaluated automatically when the dashboard loads, 
                  providing instant feedback on compliance and performance metrics.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: '#007AFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    ↕
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                  Interactive Details
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  Click on any rule card to expand detailed explanations, 
                  evaluation criteria, and specific recommendations for improvement.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: '#FF9500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    🎨
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                  Apple Design
                </Typography>
                <Typography variant="body2" sx={{ color: '#8E8E93' }}>
                  Built with Apple's design principles featuring smooth animations, 
                  consistent color schemes, and intuitive user interactions.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Technical Details */}
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        p: 4,
        mb: 4
      }}>
        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: '#F9F9FB',
          border: '1px solid #E5E5EA'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#1D1D1F', 
            mb: 2
          }}>
            Implementation Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                Business Rules Covered
              </Typography>
              <Typography variant="body2" sx={{ color: '#3A3A3C', mb: 2 }}>
                • Credit Score Validation<br />
                • Minimum Balance Requirements<br />
                • Transaction Velocity Monitoring<br />
                • AML Compliance Scoring<br />
                • System Performance Metrics<br />
                • KYC Verification Status<br />
                • Risk Assessment Calculations<br />
                • Response Time Monitoring<br />
                • International Transaction Tracking<br />
                • Documentation Completeness
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1D1D1F', mb: 1 }}>
                Design Features
              </Typography>
              <Typography variant="body2" sx={{ color: '#3A3A3C' }}>
                • Color-coded status indicators (Green/Orange/Red)<br />
                • Smooth expand/collapse animations<br />
                • Apple-inspired card design<br />
                • Responsive grid layout<br />
                • Interactive hover effects<br />
                • Loading states with progress indicators<br />
                • Comprehensive mock data for testing<br />
                • Accessibility-friendly interactions<br />
                • Mobile-responsive design<br />
                • Sticky navigation header
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  )
}

export default RulesEvaluationDemo
