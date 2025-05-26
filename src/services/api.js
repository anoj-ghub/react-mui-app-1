import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchTables = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tables`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tables:', error);
        throw error;
    }
};

export const fetchDataByTable = async (tableName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/data/${tableName}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for table ${tableName}:`, error);
        throw error;
    }
};

export const fetchDates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dates`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dates:', error);
        throw error;
    }
};