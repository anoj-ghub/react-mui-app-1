/**
 * @fileoverview Custom hook for managing table list loading from external database
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { fetchTables } from '../services/api';

/**
 * Custom hook for loading available tables from external database
 * 
 * Features:
 * - Automatic loading on mount
 * - Loading state management
 * - Error handling with fallback
 * - Retry functionality
 * - Caching to prevent unnecessary API calls
 * 
 * @hook
 * @returns {Object} Hook return object
 * @returns {Array} returns.tableOptions - Array of table options with value/label format
 * @returns {boolean} returns.loading - Loading state indicator
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.refetch - Function to manually refetch table list
 * 
 * @example
 * ```jsx
 * const { tableOptions, loading, error, refetch } = useTableList();
 * 
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage onRetry={refetch} />;
 * return <TableSelector options={tableOptions} />;
 * ```
 */
const useTableList = () => {
    const [tableOptions, setTableOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetches table list from API and updates state
     * @async
     * @function fetchTableList
     */
    const fetchTableList = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const tables = await fetchTables();
            setTableOptions(tables);
            
            // Log successful fetch for debugging
            console.log('Successfully loaded table list from database:', tables.length, 'tables');
        } catch (err) {
            console.error('Failed to load table list:', err);
            setError(err.message || 'Failed to load table list from database');
            
            // Fallback to empty array if all fails
            setTableOptions([]);
        } finally {
            setLoading(false);
        }
    };

    // Load table list on component mount
    useEffect(() => {
        fetchTableList();
    }, []); // Empty dependency array - only load once on mount

    /**
     * Manual refetch function for retry scenarios
     * @function refetch
     */
    const refetch = () => {
        fetchTableList();
    };

    return {
        tableOptions,
        loading,
        error,
        refetch
    };
};

export default useTableList;
