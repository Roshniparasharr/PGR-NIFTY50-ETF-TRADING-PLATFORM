import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import css from '../../../assets/styles/table.css';
const Table = ({ color }) => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/api/niftydata')
      .then(response => {
        console.log("Fetched Data:", response.data);
        if (response.data && Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => new Date(b.fetchTime) - new Date(a.fetchTime));
          setNiftyData([sortedData[0]]);
        } else {
          setError('Invalid data format received');
        }
        setLoading(false);
      })
      .catch(error => {
        setError(`Error fetching data: ${error.message}`);
        setLoading(false);
      });
  }, []);

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

  const columnDefs = [
    { headerName: "S No.", valueGetter: "node.rowIndex + 1", width: 100 },
    { headerName: "Company", field: "symbol", sortable: true, filter: true },
    { headerName: "Open", field: "open", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Day High", field: "dayHigh", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Day Low", field: "dayLow", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Last Price", field: "lastPrice", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Previous Close", field: "previousClose", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Change", field: "change", cellClass: "numeric change-column", sortable: true, filter: true },
    { headerName: "Volume", field: "totalTradedVolume", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Value", field: "totalTradedValue", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Last Update Time", field: "lastUpdateTime", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true },
    { headerName: "Year High", field: "yearHigh", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Year Low", field: "yearLow", cellClass: "numeric", sortable: true, filter: true },
    { headerName: "Per Change 365d", field: "perChange365d", cellClass: "numeric change-column", sortable: true, filter: true },
    { headerName: "Date 365d Ago", field: "date365dAgo", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true },
    { headerName: "Date 30d Ago", field: "date30dAgo", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true },
    { headerName: "Per Change 30d", field: "perChange30d", cellClass: "numeric change-column", sortable: true, filter: true }
  ];

  const cellStyle = (params) => {
    if (params && params.colDef && params.colDef.field) {
      if (params.colDef.field === "change" || params.colDef.field === "perChange365d" || params.colDef.field === "perChange30d") {
        return {
          color: params.value < 0 ? 'red' : 'green',
          fontWeight: 'bold',
        };
      }
    }
    return {};
  };

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
    <div className={'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ' + (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')}>
      <div className="rounded-t mb-0 px-4 py-4 border-0">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex relative w-full px-4 max-w-full flex-grow flex-1 items-center justify-between">
            <h3 className={'font-semibold text-lg ' + (color === 'light' ? 'text-blueGray-700' : 'text-white')}>Nifty Data</h3>
          </div>
        </div>
      </div>

      <div className={`ag-theme-alpine w-full} style={{ height: '500px', overflowY: 'auto' }`}>
        {niftyData.length === 0 ? (
          <div className="p-4">No data available</div>
        ) : (
          <AgGridReact
            columnDefs={columnDefs}
            rowData={niftyData[0]?.stocks || []}
            rowModelType="clientSide"
            domLayout="autoHeight"
            getRowStyle={cellStyle}
            pinnedTopRowData={niftyData[0]?.stocks && niftyData[0].stocks.length > 0 ? [niftyData[0].stocks[0]] : []} // Pin the first row
            suppressHorizontalScroll={true} // Ensure horizontal scroll is suppressed
            headerHeight={50} // Set header height
            rowHeight={40} // Set row height
            className="ag-theme-alpine"
          />
        )}
      </div>
    </div>
  );
};

export default Table;