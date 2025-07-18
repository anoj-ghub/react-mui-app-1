/**
 * @fileoverview Column Configuration for MUI DataGrid Tables
 * @author System
 * @version 1.0.0
 * 
 * This utility provides column configurations for different table types in the data browser.
 * Includes custom renderers for amount fields using the NOD formatting system.
 * 
 * Features:
 * - 4 different table configurations
 * - Custom cell renderers for amounts, status, and categories
 * - Integrated NOD (Number of Decimals) formatting
 * - Action buttons for viewing record details
 * - Sorting and filtering capabilities
 */

import { Typography, Chip, Button } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { formatAmount } from './amountFormatter'

/**
 * Gets column configuration for a specific table type
 * @param {string} tableName - The name of the table ('Table 1', 'Table 2', etc.)
 * @param {Function} handleViewDetails - Callback function for viewing record details
 * @param {Array} sampleData - Sample data to infer column types from (optional)
 * @returns {Array<Object>} Array of column configuration objects for MUI DataGrid
 * @example
 * const columns = getColumns('Table 1', (row) => console.log(row))
 */
export const getColumns = (tableName, handleViewDetails, sampleData = []) => {
  /**
   * Base column configurations for different table types
   * Each table has different fields and custom renderers
   * @type {Object<string, Array>}
   */
  const baseColumns = {
    'Table 1': [
      { field: 'id', headerName: 'ID', width: 60 },
      { field: 'name', headerName: 'Name', width: 150, filterable: true, sortable: true },
      { field: 'account', headerName: 'Account', width: 100, filterable: true, sortable: true },      { 
        field: 'amount', 
        headerName: 'Amount', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
            {formatAmount(params.value, 2, { showCurrency: true, useLocaleString: true })}
          </Typography>
        )
      },      { 
        field: 'date', 
        headerName: 'Date', 
        width: 120, 
        type: 'date', 
        filterable: true, 
        sortable: true,
        valueGetter: (value, row) => {
          if (!value) return null
          const date = new Date(value)
          return isNaN(date.getTime()) ? null : date
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
      },      { 
        field: 'price', 
        headerName: 'Price', 
        width: 100, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.8rem' }}>
            {formatAmount(params.value, 2, { showCurrency: true, useLocaleString: false })}
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
      },      { 
        field: 'total', 
        headerName: 'Total', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ fontSize: '0.8rem' }}>
            {formatAmount(params.value, 2, { showCurrency: true, useLocaleString: true })}
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
      },      { 
        field: 'salary', 
        headerName: 'Salary', 
        width: 120, 
        type: 'number',
        filterable: true,
        sortable: true,
        renderCell: (params) => (
          <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
            {formatAmount(params.value, 2, { showCurrency: true, useLocaleString: true })}
          </Typography>
        )
      },      { 
        field: 'hire_date', 
        headerName: 'Hire Date', 
        width: 120, 
        type: 'date', 
        filterable: true, 
        sortable: true,
        valueGetter: (value, row) => {
          if (!value) return null
          const date = new Date(value)
          return isNaN(date.getTime()) ? null : date
        }
      },
    ]
  }
  /**
   * Action column configuration for viewing record details
   * Appears as the first column in all tables
   * @type {Object}
   */
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
  }  // Return action column first, then other columns
  let columns = baseColumns[tableName];
  
  // If no predefined columns exist, generate them dynamically
  if (!columns) {
    console.warn(`No column configuration found for table: ${tableName}. Generating dynamic columns.`);
    columns = generateDynamicColumns(tableName, sampleData);
  }
  
  return [actionColumn, ...columns];
}

/**
 * Generates dynamic column configuration for unknown table names
 * @param {string} tableName - The name of the table
 * @param {Array} sampleData - Sample data to infer column types from
 * @returns {Array<Object>} Array of dynamically generated column configurations
 */
const generateDynamicColumns = (tableName, sampleData = []) => {
  // Common column types based on field names
  const columnGenerators = {
    id: () => ({ field: 'id', headerName: 'ID', width: 60 }),
    name: (field) => ({ field, headerName: formatHeaderName(field), width: 150, filterable: true, sortable: true }),
    account: (field) => ({ field, headerName: formatHeaderName(field), width: 120, filterable: true, sortable: true }),
    amount: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 120,
      type: 'number',
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
          {formatAmount(params.value || 0, 2, { showCurrency: true, useLocaleString: true })}
        </Typography>
      )
    }),
    price: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 100,
      type: 'number',
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.8rem' }}>
          {formatAmount(params.value || 0, 2, { showCurrency: true, useLocaleString: false })}
        </Typography>
      )
    }),
    total: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 120,
      type: 'number',
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <Typography sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
          {formatAmount(params.value || 0, 2, { showCurrency: true, useLocaleString: true })}
        </Typography>
      )
    }),
    salary: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 120,
      type: 'number',
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '0.8rem' }}>
          {formatAmount(params.value || 0, 2, { showCurrency: true, useLocaleString: true })}
        </Typography>
      )
    }),
    status: (field) => ({
      field,
      headerName: formatHeaderName(field),
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
            case 'Active': return 'success'
            case 'Inactive': return 'default'
            default: return 'default'
          }
        }
        return (
          <Chip 
            label={params.value || 'N/A'}
            size="small"
            color={getStatusColor(params.value)}
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
        )
      }
    }),
    category: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 120,
      filterable: true,
      sortable: true,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'N/A'}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.7rem', height: 20 }}
        />
      )
    }),    date: (field) => ({
      field,
      headerName: formatHeaderName(field),
      width: 120,
      type: 'date',
      filterable: true,
      sortable: true,
      valueGetter: (value, row) => {
        if (!value) return null
        const date = new Date(value)
        return isNaN(date.getTime()) ? null : date
      },
      renderCell: (params) => (
        <Typography sx={{ fontSize: '0.8rem' }}>
          {params.value ? params.value.toLocaleDateString() : 'N/A'}
        </Typography>
      )
    }),
    stock: (field) => ({ field, headerName: formatHeaderName(field), width: 80, type: 'number', filterable: true, sortable: true }),
    default: (field) => ({ field, headerName: formatHeaderName(field), width: 150, filterable: true, sortable: true })
  };
  // Get fields from sample data if available, otherwise use fallback
  let fieldsToGenerate = ['id', 'name', 'amount', 'date', 'status']; // Fallback fields
  
  if (sampleData && sampleData.length > 0) {
    // Get field names from the first data object
    fieldsToGenerate = Object.keys(sampleData[0]);
  }
  
  return fieldsToGenerate.map(field => {
    const generator = columnGenerators[getFieldType(field)] || columnGenerators.default;
    return generator(field);
  });
};

/**
 * Determines the field type based on field name patterns
 * @param {string} fieldName - The name of the field
 * @returns {string} The field type for column generation
 */
const getFieldType = (fieldName) => {
  const name = fieldName.toLowerCase();
  
  if (name.includes('amount') || name.includes('balance') || name.includes('revenue') || name.includes('spend')) return 'amount';
  if (name.includes('price') || name.includes('cost')) return 'price';
  if (name.includes('total')) return 'total';
  if (name.includes('salary')) return 'salary';
  if (name.includes('status') || name.includes('priority')) return 'status';
  if (name.includes('category') || name.includes('type') || name.includes('department')) return 'category';
  if (name.includes('date') || name.includes('time') || name.includes('timestamp')) return 'date';
  if (name.includes('stock') || name.includes('quantity') || name.includes('count') || name.includes('number')) return 'stock';
  if (name.includes('name') || name.includes('customer') || name.includes('employee')) return 'name';
  if (name.includes('account') || name.includes('id') && name !== 'id') return 'account';
  if (name === 'id') return 'id';
  
  return 'default';
};

/**
 * Formats field names into human-readable header names
 * @param {string} fieldName - The field name to format
 * @returns {string} Formatted header name
 */
const formatHeaderName = (fieldName) => {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};