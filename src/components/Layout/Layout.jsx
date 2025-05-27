/**
 * @fileoverview Main layout component providing application structure
 * @author System
 * @version 1.0.0
 */

import React from 'react';
import { Box } from '@mui/material';
import AppDrawer from '../Drawer/AppDrawer';

/**
 * Main layout component that provides the overall application structure
 * 
 * Features:
 * - Flexible box layout with drawer and main content
 * - Integration with AppDrawer navigation
 * - Responsive content area with proper spacing
 * - Material-UI theming support
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render in main content area
 * @returns {JSX.Element} Layout component
 * 
 * @example
 * ```jsx
 * <Layout>
 *   <YourPageComponent />
 * </Layout>
 * ```
 */
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