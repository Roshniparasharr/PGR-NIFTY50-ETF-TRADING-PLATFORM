import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { MenuModule, ColumnsToolPanelModule } from 'ag-grid-enterprise';
import '../../assets/styles/table.css';

const Table = () => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/nifty-data');
        if (response.data && Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => new Date(b.fetchTime) - new Date(a.fetchTime));
          setNiftyData([sortedData[0]]);
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
    { headerName: "Company", field: "symbol", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Open", field: "open", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Day High", field: "dayHigh", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Day Low", field: "dayLow", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Last Price", field: "lastPrice", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Previous Close", field: "previousClose", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Change", field: "change", cellClass: "numeric change-column", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Volume", field: "totalTradedVolume", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Value", field: "totalTradedValue", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Last Update Time", field: "lastUpdateTime", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Year High", field: "yearHigh", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Year Low", field: "yearLow", cellClass: "numeric", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Per Change 365d", field: "perChange365d", cellClass: "numeric change-column", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Date 365d Ago", field: "date365dAgo", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Date 30d Ago", field: "date30dAgo", valueFormatter: ({ value }) => formatDate(value), sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] },
    { headerName: "Per Change 30d", field: "perChange30d", cellClass: "numeric change-column", sortable: true, filter: true, menuTabs: ['filterMenuTab', 'generalMenuTab'] }
  ];

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
      <div className="table-header">
        <h3>Nifty Data</h3>
      </div>
      <div className={`ag-theme-custom`} style={{ height: '500px', width: '100%' }}>
        {niftyData.length === 0 ? (
          <div className="no-data-message">No data available</div>
        ) : (
          <AgGridReact
            modules={[ClientSideRowModelModule, MenuModule, ColumnsToolPanelModule]}
            columnDefs={columnDefs}
            rowData={niftyData.length > 0 && niftyData[0]?.stocks ? niftyData[0].stocks : []}
            rowModelType="clientSide"
            pinnedTopRowData={niftyData[0]?.stocks && niftyData[0].stocks.length > 0 ? [niftyData[0].stocks[0]] : []}
            suppressHorizontalScroll={true}
            headerHeight={50}
            rowHeight={40}
            popupParent={document.body}
            suppressMenuHide={true}
            defaultColDef={{
              menuTabs: ['filterMenuTab', 'generalMenuTab'], // Enable filter and general menu tabs
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Table;