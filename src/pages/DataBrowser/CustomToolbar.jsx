import { Box, Button } from '@mui/material'
import { 
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'

function CustomToolbar({ tableData, selectedTable, environment }) {
  const downloadJSON = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const exportData = {
      table: selectedTable,
      environment: environment,
      exportDate: new Date().toISOString(),
      totalRecords: tableData.length,
      data: tableData
    }
    downloadJSON(exportData, `${selectedTable.replace(' ', '_')}_all_records.json`)
  }

  return (
    <GridToolbarContainer sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      p: 1,
      borderBottom: '1px solid #e0e0e0',
      backgroundColor: 'background.paper'
    }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport 
          csvOptions={{
            fileName: `${selectedTable.replace(' ', '_')}_export`,
            utf8WithBom: true,
          }}
          printOptions={{
            hideFooter: true,
            hideToolbar: true,
          }}
          slotProps={{
            button: {
              variant: 'text',
              size: 'small'
            }
          }}
        />
      </Box>
      <Button
        variant="contained"
        size="small"
        startIcon={<DownloadIcon sx={{ fontSize: '0.8rem' }} />}
        onClick={handleExportJSON}
        sx={{
          fontSize: '0.75rem',
          height: 28,
          background: 'linear-gradient(45deg, #FF8E53 30%, #FF6B6B 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FF7043 30%, #E57373 90%)',
          }
        }}
      >
        Export JSON ({tableData.length})
      </Button>
    </GridToolbarContainer>
  )
}

export default CustomToolbar