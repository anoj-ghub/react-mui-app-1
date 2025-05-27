/**
 * @fileoverview API service functions for data fetching and external API communication
 * @author System
 * @version 1.0.0
 */

import axios from 'axios';

/** @constant {string} Base URL for API endpoints */
const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

/**
 * Fetches available tables from the API
 * @async
 * @function fetchTables
 * @returns {Promise<Array>} Promise resolving to array of table objects
 * @throws {Error} When API request fails
 * 
 * @example
 * ```javascript
 * const tables = await fetchTables();
 * console.log(tables);
 * ```
 */
export const fetchTables = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tables:', error);
        throw error;
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