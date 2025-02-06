import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../assets/styles/table.css';

const Table = () => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/niftydata');
        console.log('Fetched data:', response.data);
        if (response.data && Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => new Date(b.fetchTime) - new Date(a.fetchTime));
          setNiftyData([sortedData[0]]); // Only using the most recent data
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'none';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (sortConfig.direction === 'none') {
      return data;
    }
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <h3 className="table-header">Nifty Data</h3>
          <div className="ag-theme-custom">
            <table className="ag-header">
              <thead>
                <tr>
                  {['symbol', 'open', 'dayHigh', 'dayLow', 'previousClose', 'lastPrice', 'change', 'pChange', 'totalTradedVolume', 'totalTradedValue', 'yearHigh', 'yearLow', 'perChange365d', 'perChange30d'].map((column) => (
                    <th
                      key={column}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort(column)}
                    >
                      {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      {sortConfig.key === column && (sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {niftyData[0]?.stocks && getSortedData(niftyData[0].stocks).map((row, index) => (
                  <tr key={index} className="ag-header-cell">
                    <td className="ag-row">
                      <Link to={`/company/${row.symbol}`} className="text-blue-500 hover:text-blue-800">
                        {row.symbol}
                      </Link>
                    </td>
                    {['open', 'dayHigh', 'dayLow', 'previousClose', 'lastPrice', 'change', 'pChange', 'totalTradedVolume', 'totalTradedValue', 'yearHigh', 'yearLow', 'perChange365d', 'perChange30d'].map((field, index) => (
                      <td key={index} className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {row[field]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
