/**
 * @fileoverview Demo page for Rules Evaluation Stepper Modal
 * @author System
 * @version 1.0.0
 */

import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material'
import {
  Timeline as TimelineIcon,
  PlayArrow as PlayArrowIcon,
  ViewModule as ViewModuleIcon,
  Assessment as AssessmentIcon,
  ViewKanban as ViewKanbanIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material'
import RulesEvaluationStepperModal from '../components/RulesEvaluationStepperModal'
import RulesEvaluationKanbanModal from '../components/RulesEvaluationKanbanModal'
import RulesEvaluationTimelineModal from '../components/RulesEvaluationTimelineModal'
import RulesEvaluationMD3Modal from '../components/RulesEvaluationMD3Modal'

/**
 * Demo page for the Rules Evaluation Stepper Modal
 * 
 * @component
 * @returns {JSX.Element} Demo page
 */
function RulesEvaluationStepperDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false)
  const [timelineModalOpen, setTimelineModalOpen] = useState(false)
  const [md3ModalOpen, setMd3ModalOpen] = useState(false)

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleOpenKanbanModal = () => {
    setKanbanModalOpen(true)
  }

  const handleCloseKanbanModal = () => {
    setKanbanModalOpen(false)
  }

  const handleOpenTimelineModal = () => {
    setTimelineModalOpen(true)
  }

  const handleCloseTimelineModal = () => {
    setTimelineModalOpen(false)
  }

  const handleOpenMd3Modal = () => {
    setMd3ModalOpen(true)
  }

  const handleCloseMd3Modal = () => {
    setMd3ModalOpen(false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: '#F9F9FB',
          border: '1px solid #E5E5EA',
          mb: 4
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <TimelineIcon sx={{ fontSize: 64, color: '#007AFF' }} />
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
            Advanced Rules Evaluation Modals
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#8E8E93', maxWidth: 800 }}>
            Explore different UI approaches for rules evaluation including stepper navigation, 
            kanban boards, and timeline views. Each modal showcases unique Material-UI components 
            and interaction patterns.
          </Typography>

          <Grid container spacing={2} sx={{ maxWidth: 1000 }}>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PlayArrowIcon />}
                onClick={handleOpenModal}
                sx={{
                  backgroundColor: '#007AFF',
                  '&:hover': { backgroundColor: '#0056CC' },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Stepper Modal
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ViewKanbanIcon />}
                onClick={handleOpenKanbanModal}
                sx={{
                  backgroundColor: '#34C759',
                  '&:hover': { backgroundColor: '#30A54B' },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Kanban Board
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AccessTimeIcon />}
                onClick={handleOpenTimelineModal}
                sx={{
                  backgroundColor: '#FF9500',
                  '&:hover': { backgroundColor: '#E6850E' },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Timeline View
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AssessmentIcon />}
                onClick={handleOpenMd3Modal}
                sx={{
                  backgroundColor: '#8E4EC6',
                  '&:hover': { backgroundColor: '#7A3EAB' },
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Material Design 3
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #007AFF20' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 32, color: '#007AFF', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Stepper Modal
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Advanced modal with stepper navigation and tabbed interface
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Three-tab interface
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Vertical stepper navigation
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Category overview grid
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Executive summary report
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #34C75920' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ViewKanbanIcon sx={{ fontSize: 32, color: '#34C759', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Kanban Board
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Project management style board with status columns
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Passed/Warning/Failed columns
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Card-based rule display
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Priority indicators
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Business impact metrics
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #FF950020' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ fontSize: 32, color: '#FF9500', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Timeline View
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Sequential execution timeline with live progress tracking
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Real-time evaluation progress
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Alternating timeline layout
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Execution time display
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Step-by-step completion
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 32, color: '#34C759', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Step-by-Step View
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Navigate through rule categories using Material-UI Stepper component
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Vertical stepper navigation
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Expandable accordions for each rule
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Category-based organization
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Progress tracking through categories
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ViewModuleIcon sx={{ fontSize: 32, color: '#FF9500', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Category Overview
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Visual grid layout showing all rule categories at once
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Card-based category display
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Color-coded category themes
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Quick status overview
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Responsive grid layout
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 32, color: '#FF3B30', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Summary Report
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Executive summary with key metrics and progress bars
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Overall compliance score
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Category breakdown with progress bars
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Action required alerts
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Executive-level metrics
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4, backgroundColor: 'white', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Modal Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#007AFF', fontWeight: 600 }}>
              Navigation
            </Typography>
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Three-tab interface with stepper, overview, and summary views
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#34C759', fontWeight: 600 }}>
              Organization
            </Typography>
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Rules grouped by Financial, Risk, Compliance, and Performance
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#FF9500', fontWeight: 600 }}>
              Interaction
            </Typography>
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Expandable accordions, progress tracking, and detailed recommendations
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ color: '#FF3B30', fontWeight: 600 }}>
              Design
            </Typography>
            <Typography variant="body2" sx={{ color: '#8E8E93' }}>
              Apple-inspired design with color coding and smooth animations
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Rules Evaluation Stepper Modal */}
      <RulesEvaluationStepperModal 
        open={modalOpen}
        onClose={handleCloseModal}
      />

      {/* Rules Evaluation Kanban Modal */}
      <RulesEvaluationKanbanModal 
        open={kanbanModalOpen}
        onClose={handleCloseKanbanModal}
      />

      {/* Rules Evaluation Timeline Modal */}
      <RulesEvaluationTimelineModal 
        open={timelineModalOpen}
        onClose={handleCloseTimelineModal}
      />

      {/* Rules Evaluation Material Design 3 Modal */}
      <RulesEvaluationMD3Modal 
        open={md3ModalOpen}
        onClose={handleCloseMd3Modal}
      />
    </Container>
  )
}

export default RulesEvaluationStepperDemo
