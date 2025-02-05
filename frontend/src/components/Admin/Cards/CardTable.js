import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Table component to display data
const Table = ({ color }) => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFetchTime, setExpandedFetchTime] = useState(null);
  const [selectedFetchTime, setSelectedFetchTime] = useState('');
  const [message, setMessage] = useState(""); // Define the message state here

  useEffect(() => {
    const fetchDataWrapper = async () => {
      try {
        await fetchData();  // Calls fetchData which returns a promise
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
    };
  
    fetchDataWrapper();  // Ensure this is called correctly
  }, []);
  

  const fetchData = () => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/nifty-data') // Fetch Nifty data
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setNiftyData(response.data);
        } else {
          setError('Invalid data format received');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(`Error fetching data: ${error.message}`);
        setLoading(false);
      });
  };

  // Format the date properly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date)
      ? date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      : 'Invalid Date';
  };

  // Function to check if the current date and time match any date in the dropdown
  const isDatePresentInDropdown = (dropdownDates, currentDate) => {
    return dropdownDates.some(
      (date) => formatDate(date) === formatDate(currentDate)
    );
  };

  // Handle the refresh button click
  const handleRefreshClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Ensure the response is in JSON format
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data.message); // Should log: "Data refreshed successfully!"
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  // Trigger scraper.js function (you can define it based on your script)
  const triggerScraperScript = () => {
    fetch('http://localhost:5000/scraper')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Scraper result:', data);
        // Do something with the data, e.g., update your table
      })
      .catch((error) => console.error('Error fetching data:', error));
  };
  
  

  // Update the table with the new data (you can customize this)
  const updateTable = (data) => {
    // Logic to update your table with new data
  };

  const handleFetchTimeSelect = (e) => {
    setSelectedFetchTime(e.target.value);
  };

  const filteredData = selectedFetchTime
    ? niftyData.filter((batch) => formatDate(batch.fetchTime) === selectedFetchTime)
    : niftyData;

  if (loading) {
    return (
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="p-4">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="p-4 text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ' + (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')}
    >
      <div className="rounded-t mb-0 px-4 py-4 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex relative w-full px-4 max-w-full flex-grow flex-1 items-center justify-between">
            <h3 className={'font-semibold text-lg ' + (color === 'light' ? 'text-blueGray-700' : 'text-white')}>Nifty Data</h3>
            {/* Add a button to trigger refresh */}
            <button onClick={handleRefreshClick} className="bg-blue-500 text-white p-2 rounded">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown for selecting the fetch time */}
      <div className="flex items-center space-x-6 p-4">
        <select
          onChange={handleFetchTimeSelect}
          className="border p-1 text-blueGray-700 rounded-lg focus:outline-none"
          value={selectedFetchTime}
        >
          <option value="">Select Time</option>
          {niftyData.map((batch, index) => (
            <option key={index} value={formatDate(batch.fetchTime)}>
              Time: {formatDate(batch.fetchTime)}
            </option>
          ))}
        </select>
      </div>

      {/* Only render the table if a fetch time is selected */}
      {selectedFetchTime && (
        <div className="block w-full overflow-x-auto">
          {filteredData.length === 0 ? (
            <div className="p-4">No data available for this time</div>
          ) : (
            <table className="items-center w-full bg-transparent border-collapse">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className={`sticky left-0 z-20 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700'}`}>S No.</th>
                  {['Company', 'Open', 'Day High', 'Day Low', 'Last Price', 'Previous Close', 'Change', 'Volume', 'Value', 'Last Update Time', 'Year High', 'Year Low', 'Per Change 365d', 'Date 365d Ago', 'Date 30d Ago', 'Per Change 30d'].map((header, index) => (
                    <th key={index} className={`px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ${color === 'light' ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100' : 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700'}`}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="text-center py-4">No data available</td>
                  </tr>
                ) : (
                  filteredData.map((batch, batchIndex) => (
                    <React.Fragment key={batch._id || batchIndex}>
                      {batch.stocks.map((stock, stockIndex) => (
                        <tr key={`stock._id || ${batchIndex}-${stockIndex}`} className="border-b">
                          <td className="sticky left-0 bg-inherit border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {stockIndex + 1}
                          </td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.symbol}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.open}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.dayHigh}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.dayLow}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.lastPrice}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.previousClose}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.change}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.totalTradedVolume}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.totalTradedValue}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{formatDate(stock.lastUpdateTime)}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.yearHigh}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.yearLow}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.perChange365d}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{formatDate(stock.date365dAgo)}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{formatDate(stock.date30dAgo)}</td>
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{stock.perChange30d}</td>
</tr>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Table;