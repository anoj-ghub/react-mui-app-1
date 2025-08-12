/**
 * @fileoverview Custom hook for managing table data state and API interactions
 * @author System
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { fetchDataForTable } from '../services/api';
// Removed import of tableOptions - now loaded dynamically from database

// Key used to persist the selected environment in localStorage
const ENV_STORAGE_KEY = 'app.environment.selected';

// Safely read initial environment from localStorage, defaulting to 'Production'
const getInitialEnvironment = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = window.localStorage.getItem(ENV_STORAGE_KEY);
            return saved || 'Production';
        }
    } catch (_) {
        // ignore storage access issues
    }
    return 'Production';
};

/**
 * Custom hook for managing table data state, form inputs, and API calls
 * 
 * Features:
 * - Table selection management
 * - Account number and date filtering
 * - Environment selection
 * - Data fetching with loading states
 * - Error handling
 * - Input clearing functionality
 * - Automatic refetch on parameter changes
 * 
 * @hook
 * @returns {Object} Hook return object
 * @returns {string} returns.selectedTable - Currently selected table
 * @returns {Function} returns.setSelectedTable - Function to update selected table
 * @returns {string} returns.accountNumber - Current account number filter
 * @returns {Function} returns.setAccountNumber - Function to update account number
 * @returns {string} returns.environment - Current environment selection
 * @returns {Function} returns.setEnvironment - Function to update environment
 * @returns {string} returns.date - Current date filter
 * @returns {Function} returns.setDate - Function to update date filter
 * @returns {Array} returns.data - Fetched table data array
 * @returns {boolean} returns.loading - Loading state indicator
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.clearInputs - Function to reset all inputs
 * 
 * @example
 * ```jsx
 * const {
 *   selectedTable,
 *   setSelectedTable,
 *   data,
 *   loading,
 *   error,
 *   clearInputs
 * } = useTableData();
 * ```
 */
const useTableData = () => {
    const [selectedTable, setSelectedTable] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [environment, setEnvironment] = useState(getInitialEnvironment);
    const [date, setDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchDataForTable(selectedTable, accountNumber, environment, date);
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedTable, accountNumber, environment, date]);

    // Persist environment selection whenever it changes
    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(ENV_STORAGE_KEY, environment);
            }
        } catch (_) {
            // ignore storage access issues
        }
    }, [environment]);

    const clearInputs = () => {
        setAccountNumber('');
        setDate('');
        setSelectedTable('');
    // Intentionally do NOT reset environment so it persists unless manually changed
    };

    return {
        selectedTable,
        setSelectedTable,
        accountNumber,
        setAccountNumber,
        environment,
        setEnvironment,
        date,
        setDate,
        data,
        loading,
        error,
        clearInputs,
    };
};

export default useTableData;