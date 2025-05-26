import { Typography, Chip, Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

export const getColumns = (tableName, handleViewDetails) => {
  const baseColumns = {
    'Table 1': [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'name', headerName: 'Name', width: 150, filterable: true, sortable: true },
      { field: 'account', headerName: 'Account', width: 100, filterable: true, sortable: true },
      { 
        field: 'amount', 
        headerName: 'Amount', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
            ${params.value?.toLocaleString()}
          </Typography>
        )
      },
      { 
        field: 'date', 
        headerName: 'Date', 
        width: 120, 
        type: 'date', 
        filterable: true, 
        sortable: true,
        valueGetter: (params) => {
          return params ? new Date(params) : null
        }
      },
    ],
    'Table 2': [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'product', headerName: 'Product', width: 150, filterable: true, sortable: true },
      { 
        field: 'category', 
        headerName: 'Category', 
        width: 130,
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Chip 
            label={params.value} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 18 }}
          />
        )
      },
      { 
        field: 'price', 
        headerName: 'Price', 
        width: 100, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.8rem' }}>
            ${params.value}
          </Typography>
        )
      },
      { field: 'stock', headerName: 'Stock', width: 80, type: 'number', filterable: true, sortable: true },
    ],
    'Table 3': [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'order', headerName: 'Order', width: 100, filterable: true, sortable: true },
      { field: 'customer', headerName: 'Customer', width: 150, filterable: true, sortable: true },
      { 
        field: 'status', 
        headerName: 'Status', 
        width: 130,
        filterable: true,
        sortable: true,
        renderCell: (params) => {
          const getStatusColor = (status) => {
            switch (status) {
              case 'Shipped': return 'info'
              case 'Delivered': return 'success'
              case 'Pending': return 'warning'
              case 'Processing': return 'secondary'
              case 'Cancelled': return 'error'
              case 'Returned': return 'default'
              default: return 'default'
            }
          }
          return (
            <Chip 
              label={params.value} 
              size="small" 
              color={getStatusColor(params.value)}
              sx={{ fontSize: '0.7rem', height: 18 }}
            />
          )
        }
      },
      { 
        field: 'total', 
        headerName: 'Total', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.8rem' }}>
            ${params.value?.toFixed(2)}
          </Typography>
        )
      },
    ],
    'Table 4': [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'employee', headerName: 'Employee', width: 150, filterable: true, sortable: true },
      { 
        field: 'department', 
        headerName: 'Department', 
        width: 130,
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Chip 
            label={params.value} 
            size="small" 
            color="secondary" 
            variant="outlined"
            sx={{ fontSize: '0.7rem', height: 18 }}
          />
        )
      },
      { 
        field: 'salary', 
        headerName: 'Salary', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
            ${params.value?.toLocaleString()}
          </Typography>
        )
      },
      { 
        field: 'hire_date', 
        headerName: 'Hire Date', 
        width: 120, 
        type: 'date', 
        filterable: true, 
        sortable: true,
        valueGetter: (params) => {
          return params ? new Date(params) : null
        }
      },
    ]
  }

  // Create action column as first column
  const actionColumn = {
    field: 'actions',
    headerName: 'Actions',
    width: 80,
    sortable: false,
    filterable: false,
    disableExport: true,
    renderCell: (params) => (
      <Button
        size="small"
        variant="outlined"
        onClick={() => handleViewDetails(params.row)}
        sx={{ 
          fontSize: '0.65rem',
          minWidth: 30,
          height: 22,
          padding: '2px 6px'
        }}
      >
        <VisibilityIcon sx={{ fontSize: '0.7rem' }} />
      </Button>
    ),
  }

  // Return action column first, then other columns
  return [actionColumn, ...(baseColumns[tableName] || [])]
}