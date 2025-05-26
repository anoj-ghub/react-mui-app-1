import { useState, useEffect } from 'react';
import { fetchDataForTable } from '../services/api';
import { tableOptions } from '../utils/constants';

const useTableData = () => {
    const [selectedTable, setSelectedTable] = useState(tableOptions[0]);
    const [accountNumber, setAccountNumber] = useState('');
    const [environment, setEnvironment] = useState('Production');
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

    const clearInputs = () => {
        setAccountNumber('');
        setDate('');
        setSelectedTable(tableOptions[0]);
        setEnvironment('Production');
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