import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = ({ color }) => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/niftydata')
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
  }, []);

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
      className={
        'relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ' +
        (color === 'light' ? 'bg-white' : 'bg-lightBlue-900 text-white')
      }
    >
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3
              className={
                'font-semibold text-lg ' +
                (color === 'light' ? 'text-blueGray-700' : 'text-white')
              }
            >
              Nifty Data
            </h3>
          </div>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                <th
                  className={
                    `sticky left-0 z-20 px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left ` +
                    (color === 'light'
                      ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                      : 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
                  }
                >
                  S No.
                </th>
                {[
                  'Company',
                  'Open',
                  'Day High',
                  'Day Low',
                  'Last Price',
                  'Previous Close',
                  'Change',
                  'Volume',
                  'Value',
                  'Last Update Time',
                  'Year High',
                  'Year Low',
                  'Per Change 365d',
                  'Date 365d Ago',
                  'Date 30d Ago',
                  'Per Change 30d',
                ].map((header, index) => (
                  <th
                    key={index}
                    className={
                      `px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left  ` +
                      (color === 'light'
                        ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                        : 'bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700')
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {niftyData.map((data, index) => (
                <tr key={data._id} className="border-b">
                  <td className="sticky left-0 bg-inherit border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {index + 1}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.symbol}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.open}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.dayHigh}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.dayLow}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.lastPrice}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.previousClose}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.change}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.totalTradedVolume}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.totalTradedValue}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.lastUpdateTime}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.yearHigh}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.yearLow}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.perChange365d}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.date365dAgo}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.date30dAgo}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {data.perChange30d}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;