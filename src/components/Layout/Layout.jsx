import React from 'react';
import { Box } from '@mui/material';
import AppDrawer from '../Drawer/AppDrawer';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppDrawer />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;