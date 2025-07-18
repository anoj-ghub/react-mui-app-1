/**
 * @fileoverview API service functions for data fetching and external API communication
 * @author System
 * @version 1.0.0
 */

import axios from 'axios';

/** @constant {string} Base URL for API endpoints */
const API_BASE_URL = 'https://api.company-database.com'; // External database API endpoint

/** @constant {string} Database connection timeout in milliseconds */
const DB_TIMEOUT = 5000;

/**
 * Fetches available tables from the external database
 * @async
 * @function fetchTables
 * @returns {Promise<Array>} Promise resolving to array of table objects with value/label format
 * @throws {Error} When API request fails or database is unreachable
 * 
 * @example
 * ```javascript
 * const tables = await fetchTables();
 * console.log(tables); // [{ value: 'users', label: 'User Accounts' }, ...]
 * ```
 */
export const fetchTables = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/metadata/tables`, {
            timeout: DB_TIMEOUT,
            headers: {
                'Authorization': 'Bearer your-api-token',
                'Content-Type': 'application/json'
            }
        });
        
        // Transform API response to match application format
        return response.data.map(table => ({
            value: table.id,
            label: table.name,
            group: table.schema || 'Default'
        }));
    } catch (error) {
        console.error('Error fetching tables from database:', error);
        
        // For demo purposes, return mock data when external DB is not available
        // In production, you would handle this error appropriately
        const mockTables = [
            // Original test tables for debugging
            { value: 'Table 1', label: 'Table 1 (Test)', group: 'Test Tables' },
            { value: 'Table 2', label: 'Table 2 (Test)', group: 'Test Tables' },
            { value: 'Table 3', label: 'Table 3 (Test)', group: 'Test Tables' },
            { value: 'Table 4', label: 'Table 4 (Test)', group: 'Test Tables' },
            
            // Customer & User Management
            { value: 'customer_accounts', label: 'Customer Accounts', group: 'Customer Management' },
            { value: 'user_sessions', label: 'User Sessions', group: 'Customer Management' },
            { value: 'customer_support_tickets', label: 'Customer Support Tickets', group: 'Customer Management' },
            
            // Sales & Orders
            { value: 'order_details', label: 'Order Details', group: 'Sales & Orders' },
            { value: 'transaction_history', label: 'Transaction History', group: 'Sales & Orders' },
            { value: 'payment_methods', label: 'Payment Methods', group: 'Sales & Orders' },
            
            // Inventory & Products
            { value: 'product_catalog', label: 'Product Catalog', group: 'Inventory & Products' },
            { value: 'inventory_items', label: 'Inventory Items', group: 'Inventory & Products' },
            
            // Marketing & Analytics
            { value: 'marketing_campaigns', label: 'Marketing Campaigns', group: 'Marketing & Analytics' },
            { value: 'user_analytics', label: 'User Analytics', group: 'Marketing & Analytics' },
            { value: 'campaign_performance', label: 'Campaign Performance', group: 'Marketing & Analytics' },
            
            // Financial & Reporting
            { value: 'financial_reports', label: 'Financial Reports', group: 'Financial & Reporting' },
            { value: 'revenue_tracking', label: 'Revenue Tracking', group: 'Financial & Reporting' },
            { value: 'expense_records', label: 'Expense Records', group: 'Financial & Reporting' },
            
            // System & Logs
            { value: 'audit_logs', label: 'Audit Logs', group: 'System & Logs' },
            { value: 'error_logs', label: 'Error Logs', group: 'System & Logs' },
            { value: 'system_config', label: 'System Configuration', group: 'System & Logs' }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        return mockTables;
    }
};

/**
 * Fetches data for a specific table with filters from the API
 * @async
 * @function fetchDataForTable
 * @param {string} tableName - The name of the table to fetch data for
 * @param {string} accountNumber - Account number filter
 * @param {string} environment - Environment filter
 * @param {string} date - Date filter
 * @returns {Promise<Array>} Promise resolving to array of table data
 * @throws {Error} When API request fails
 * 
 * @example
 * ```javascript
 * const data = await fetchDataForTable('users', '123456', 'Production', '2025-01-01');
 * console.log(data);
 * ```
 */
export const fetchDataForTable = async (tableName, accountNumber = '', environment = 'Production', date = '') => {
    try {
        // For demo purposes, we'll generate mock data when external API fails
        // In production, you would make an actual API call
        const response = await axios.get(`${API_BASE_URL}/data/${tableName}`, {
            timeout: DB_TIMEOUT,
            params: {
                accountNumber,
                environment,
                date
            },
            headers: {
                'Authorization': 'Bearer your-api-token',
                'Content-Type': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        
        // Fallback to mock data generator for demo purposes
        const { generateMockData } = await import('../utils/mockDataGenerator');
        const mockData = generateMockData(tableName);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return mockData;
    }
};

/**
 * Fetches data for a specific table from the API
 * @async
 * @function fetchDataByTable
 * @param {string} tableName - The name of the table to fetch data for
 * @returns {Promise<Object>} Promise resolving to an object containing the table data
 * @throws {Error} When API request fails
 * 
 * @example
 * ```javascript
 * const tableData = await fetchDataByTable('users');
 * console.log(tableData);
 * ```
 */
export const fetchDataByTable = async (tableName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/${tableName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        throw error;
    }
};

/**
 * Fetches available dates from the API
 * @async
 * @function fetchDates
 * @returns {Promise<Array>} Promise resolving to array of date objects
 * @throws {Error} When API request fails
 * 
 * @example
 * ```javascript
 * const dates = await fetchDates();
 * console.log(dates);
 * ```
 */
export const fetchDates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dates`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dates:', error);
        throw error;
    }
};