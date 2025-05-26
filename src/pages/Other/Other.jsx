import { Typography, Paper, Box } from '@mui/material'
import ConstructionIcon from '@mui/icons-material/Construction'

function Other() {
  return (
    <Paper elevation={3} sx={{ p: 4, m: 2, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <ConstructionIcon sx={{ fontSize: 60, color: 'warning.main' }} />
      </Box>
      <Typography variant="h4" gutterBottom>
        Under Construction
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is currently under development. Please check back later!
      </Typography>
    </Paper>
  )
}

export default Other