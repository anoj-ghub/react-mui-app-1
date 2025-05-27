/**
 * @fileoverview Custom DataGrid wrapper component using MUI X DataGrid
 * @author System
 * @version 1.0.0
 */

import React from 'react';
import { DataGrid as MUIDataGrid } from '@mui/x-data-grid';

/**
 * Custom DataGrid wrapper component providing configured MUI X DataGrid
 * 
 * Features:
 * - Pre-configured height and width
 * - Pagination with selectable page sizes
 * - Checkbox selection enabled
 * - Responsive design
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.rows - Array of data objects to display
 * @param {Array} props.columns - Column configuration for the grid
 * @returns {JSX.Element} DataGrid component
 * 
 * @example
 * ```jsx
 * <DataGrid
 *   rows={[{id: 1, name: "Item"}]}
 *   columns={[{field: "name", headerName: "Name"}]}
 * />
 * ```
 */
const DataGrid = ({ rows, columns }) => {
    return (
        <div style={{ height: 400, width: '100%' }}>
            <MUIDataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
            />
        </div>
    );
};

export default DataGrid;