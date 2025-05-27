/**
 * @fileoverview Demo page showcasing ReusableDataTable component features
 * @author System
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material'
import ReusableDataTable from '../../components/ReusableDataTable'

/**
 * Demo page component showcasing different configurations of ReusableDataTable
 * 
 * Features:
 * - Multiple table examples with different configurations
 * - Loading state demonstration
 * - Search functionality showcase
 * - Dark/light mode toggle
 * - Various data sets and column configurations
 * 
 * @component
 * @returns {JSX.Element} Demo page component
 * 
 * @example
 * ```jsx
 * <TableDemo />
 * ```
 */
const TableDemo = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [searchText1, setSearchText1] = useState('')
  const [searchText2, setSearchText2] = useState('')

  // Sample data for demo tables
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', salary: 75000.50 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', salary: 65000.25 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager', salary: 85000.75 },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Developer', salary: 70000.00 },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Designer', salary: 68000.30 }
  ]

  const sampleProducts = [
    { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299.99, stock: 15 },
    { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 29.99, stock: 150 },
    { id: 3, name: 'Keyboard RGB', category: 'Accessories', price: 89.50, stock: 75 },
    { id: 4, name: 'Monitor 4K', category: 'Electronics', price: 399.99, stock: 25 },
    { id: 5, name: 'Webcam HD', category: 'Electronics', price: 79.99, stock: 45 }
  ]

  const userColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    { 
      field: 'salary', 
      headerName: 'Salary', 
      width: 120,
      renderCell: (params) => `$${params.value.toLocaleString()}`
    }
  ]

  const productColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Product Name', width: 180 },
    { field: 'category', headerName: 'Category', width: 130 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    { field: 'stock', headerName: 'Stock', width: 80 }
  ]

  /**
   * Simulate loading for table 1
   */
  const handleLoadData1 = () => {
    setLoading1(true)
    setTimeout(() => {
      setLoading1(false)
    }, 2000)
  }

  /**
   * Simulate loading for table 2
   */
  const handleLoadData2 = () => {
    setLoading2(true)
    setTimeout(() => {
      setLoading2(false)
    }, 1500)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          ReusableDataTable Demo
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Showcasing the features and flexibility of the ReusableDataTable component
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          }
          label="Dark Mode"
        />
      </Box>

      <Grid container spacing={3}>
        {/* Table 1 - Users */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Users Table</Typography>
                <Button 
                  variant="contained" 
                  onClick={handleLoadData1}
                  disabled={loading1}
                >
                  {loading1 ? 'Loading...' : 'Reload Data'}
                </Button>
              </Box>
              
              <Box sx={{ height: 500 }}>
                <ReusableDataTable
                  title="User Management"
                  data={sampleUsers}
                  columns={userColumns}
                  loading={loading1}
                  searchText={searchText1}
                  onSearchChange={setSearchText1}
                  darkMode={darkMode}
                  height="400px"
                  initialPageSize={10}
                  searchPlaceholder="Search users by name, email, or role"
                  emptyMessage="No users found"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table 2 - Products */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Products Table</Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleLoadData2}
                  disabled={loading2}
                >
                  {loading2 ? 'Loading...' : 'Refresh Products'}
                </Button>
              </Box>
              
              <Box sx={{ height: 500 }}>
                <ReusableDataTable
                  title="Product Inventory"
                  data={sampleProducts}
                  columns={productColumns}
                  loading={loading2}
                  searchText={searchText2}
                  onSearchChange={setSearchText2}
                  darkMode={darkMode}
                  height="400px"
                  initialPageSize={5}
                  pageSizeOptions={[5, 10, 25]}
                  searchPlaceholder="Search products by name or category"
                  searchMaxLength={30}
                  emptyMessage="No products in inventory"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table 3 - Empty State Demo */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>Empty State Demo</Typography>
              
              <Box sx={{ height: 300 }}>
                <ReusableDataTable
                  title="Empty Dataset"
                  data={[]}
                  columns={userColumns}
                  loading={false}
                  darkMode={darkMode}
                  height="200px"
                  emptyMessage="This table intentionally has no data to show the empty state"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Table 4 - Search Disabled Demo */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>Search Disabled Demo</Typography>
              
              <Box sx={{ height: 300 }}>
                <ReusableDataTable
                  title="Read-Only View"
                  data={sampleProducts.slice(0, 3)}
                  columns={productColumns}
                  loading={false}
                  darkMode={darkMode}
                  height="200px"
                  enableSearch={false}
                  initialPageSize={5}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: darkMode ? 'grey.900' : 'grey.100', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Component Features Demonstrated:
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li><strong>Loading States:</strong> Click the reload buttons to see loading spinners</li>
            <li><strong>Search Functionality:</strong> Type in the search boxes to filter data</li>
            <li><strong>Dark/Light Mode:</strong> Toggle the switch at the top to see theme changes</li>
            <li><strong>Different Page Sizes:</strong> Tables have different initial page sizes and options</li>
            <li><strong>Empty States:</strong> The third table shows the empty data message</li>
            <li><strong>Disabled Search:</strong> The fourth table has search functionality disabled</li>
            <li><strong>Custom Styling:</strong> Each table can have different heights and configurations</li>
          </ul>
        </Typography>
      </Box>
    </Container>
  )
}

export default TableDemo
