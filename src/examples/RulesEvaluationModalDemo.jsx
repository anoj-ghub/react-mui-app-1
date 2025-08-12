/**
 * @fileoverview Demo page for Rules Evaluation Modal
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
  Assessment as AssessmentIcon,
  PlayArrow as PlayArrowIcon,
  ViewKanban as ViewKanbanIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material'
import RulesEvaluationModal from '../components/RulesEvaluationModal'
import RulesEvaluationKanbanModal from '../components/RulesEvaluationKanbanModal'
import RulesEvaluationTimelineModal from '../components/RulesEvaluationTimelineModal'
import RulesEvaluationMD3Modal from '../components/RulesEvaluationMD3Modal'

/**
 * Demo page for the Rules Evaluation Modal
 * 
 * @component
 * @returns {JSX.Element} Demo page
 */
function RulesEvaluationModalDemo() {
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: '#F9F9FB',
          border: '1px solid #E5E5EA'
        }}
      >
        <Stack spacing={3} alignItems="center" textAlign="center">
          <AssessmentIcon sx={{ fontSize: 64, color: '#007AFF' }} />
          
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1D1D1F' }}>
            Rules Evaluation Modal Variants
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#8E8E93', maxWidth: 800 }}>
            Multiple UI layout variations for rules evaluation dashboards. Each modal provides 
            a different user experience and visual approach to displaying business rule compliance data.
          </Typography>

          <Grid container spacing={2} sx={{ maxWidth: 800 }}>
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
                Compact Modal
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
                startIcon={<TimelineIcon />}
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

          <Typography variant="caption" sx={{ color: '#8E8E93' }}>
            Click the button above to see the modal in action with realistic failure scenarios
          </Typography>
        </Stack>
      </Paper>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #007AFF20' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 32, color: '#007AFF', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Compact Modal
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Traditional list-based modal with expandable details
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Summary dashboard at top
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Scrollable rules list
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Click to expand details
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Pass/Fail status chips
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #34C75920' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ViewKanbanIcon sx={{ fontSize: 32, color: '#34C759', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Kanban Board
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Three-column board organized by rule status
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Passed, Warning, Failed columns
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Drag-and-drop style cards
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Priority and impact indicators
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Rule detail popups
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #FF950020' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 32, color: '#FF9500', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Timeline View
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Sequential evaluation process with real-time progress
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Step-by-step execution
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Alternating timeline layout
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Live progress indicators
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Execution time tracking
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', borderRadius: 3, border: '2px solid #8E4EC620' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ fontSize: 32, color: '#8E4EC6', mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Material Design 3
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8E8E93', mb: 2 }}>
                Industrial/technical theme with bold colors and sharp edges
              </Typography>
              <Stack spacing={1}>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Dark theme with neon accents
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Terminal/console aesthetics
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • Monospace fonts
                </Typography>
                <Typography variant="caption" sx={{ color: '#3A3A3C' }}>
                  • System log displays
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rules Evaluation Modal */}
      <RulesEvaluationModal 
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

export default RulesEvaluationModalDemo
