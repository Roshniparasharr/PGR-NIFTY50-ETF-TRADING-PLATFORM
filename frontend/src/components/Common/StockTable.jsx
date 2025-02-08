import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../assets/styles/table.css";

const StockTable = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "none" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data/stocks");
        console.log("Fetched stock data:", response.data);
        
        // Ensure stockData is an array before setting
        if (Array.isArray(response.data)) {
          setStockData(response.data);
        } else {
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Error fetching stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "none";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (sortConfig.direction === "none" || !sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key] ?? ""; // Handle null/undefined
      const valueB = b[sortConfig.key] ?? "";

      if (!isNaN(valueA) && !isNaN(valueB)) {
        // Numeric sorting
        return sortConfig.direction === "ascending" ? valueA - valueB : valueB - valueA;
      } else {
        // String sorting
        return sortConfig.direction === "ascending"
          ? valueA.toString().localeCompare(valueB.toString())
          : valueB.toString().localeCompare(valueA.toString());
      }
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
      <h3 className="table-header">ETF Data</h3>
      <div className="ag-theme-custom">
        <table className="ag-header">
          <thead>
            <tr>
              {[
                "symbol",
                "open",
                "dayHigh",
                "dayLow",
                "previousClose",
                "lastPrice",
                "change",
                "pChange",
                "totalTradedVolume",
                "totalTradedValue",
                "yearHigh",
                "yearLow",
                "perChange365d",
                "perChange30d",
              ].map((column) => (
                <th
                  key={column}
                  className="sortable"
                  onClick={() => requestSort(column)}
                >
                  {column.replace(/([A-Z])/g, " $1").toUpperCase()}
                  {sortConfig.key === column &&
                    (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getSortedData(stockData).map((row, index) => (
              <tr key={index} className="ag-header-cell">
                <td className="ag-row">
                  <Link to={`/company/${row.symbol}`} className="text-blue-500 hover:text-blue-800">
                    {row.symbol}
                  </Link>
                </td>
                {[
                  "open",
                  "dayHigh",
                  "dayLow",
                  "previousClose",
                  "lastPrice",
                  "change",
                  "pChange",
                  "totalTradedVolume",
                  "totalTradedValue",
                  "yearHigh",
                  "yearLow",
                  "perChange365d",
                  "perChange30d",
                ].map((field, index) => (
                  <td key={index} className="table-cell">
                    {row[field] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
