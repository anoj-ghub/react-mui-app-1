import React from 'react';
import { DataGrid as MUIDataGrid } from '@mui/x-data-grid';

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