import axios from 'axios';
import NiftyData from '../models/NiftyData.js'; // Adjust the path as needed

// Function to fetch Nifty 50 data
export const fetchNifty50Data = async () => {
  console.log("✅ Inside fetchNifty50Data function...");

  try {
    console.log("📡 Initializing session with NSE...");

    const baseURL = "https://www.nseindia.com";
    const apiURL = "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050";

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
      'Accept': '/',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'Referer': 'https://www.nseindia.com/market-data/live-equity-market',
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'Cookie': '_ga=GA1.1.887963696.1737917672; bm_mi=017740FE718CD85EE9FE2B3A912B0E76~YAAQjc8uF4B4z6eUAQAA9JQAqRo0g+r5Evm8XL6QThm7/BDuyHrVx22l8iLaxSN4TQ2tfp5gPKrfm+T1iBRorLBatVJrEbDz42QIGdoXhKES4zSwt0c7CEcsLjEwpQQa/MFyzI9YuAab2CBGJb5GOo24QIeF6h+GRzOms6VjvMpH68YpFFoy09HNe5oPgJNc2m8FJrg7U1O9e/dOazaEjQJr9Ql51GJbizxBw4aSHKUnulbs65shSBlV4f96+bD0+Z7Ht70a12ZUpHWJ1eoPGcb7bBw+5rILAf4vjE0puBri/oQNULQR8V7Ptj1CnutBkfDOrYmAG95N46iXpR6Q8a4jTJ/bEKnvHbNOXMq8NDiY6Pq4HtZ+~1; nsit=TEWhspfLt4UIuXQGcpg13vRv; nseQuoteSymbols=[{"symbol":"BRITANNIA","identifier":"","type":"equity"}]; AKA_A2=A; nseappid=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkubnNlIiwiYXVkIjoiYXBpLm5zZSIsImlhdCI6MTczODAwODA1MywiZXhwIjoxNzM4MDE1MjUzfQ.Lr1M5XsxNQe92d3QV7Huo86h9gh7J3iGlfe_nSTcFaI; bm_sz=4694FAA2B1CFFE281385061ABAAA03E2~YAAQjc8uF9Uk06eUAQAA9kZaqRp67/1a+F+AIzRSUPZNiMlikDwv2xGzG/c7aSgaCC/B9rmci5YAzF/eUCl4TuWPdCXIykekzm+lb2hYM1fHwcOTsolw2x7z0GAtYSO6mm7CD6+emQhug84O7kR7Iuh2G5TqPnfLEQoPJwKXJPAyAtKQ2wfdE/Q3DZekJTDPHMw2gSMqSDf+RtH0sJE/APihIx3RWQdyMm6bqr2TCdnQ5AknPbqJowe/ppQK6qvn8wgOiYX8lsCmzKG4L015TCw7p+GZEpWFeYEHlvKGFGNJBN4nlqRyLwB8iKrZ0Rwyaz6qqtzJ4tpaAdtMMCmrZDxNj0NOcQQgqJmDLsY0iVABJb02cYifgxIo+juis6MZA3VKEM5pSdk8VPyxUtIrIl3lYBoHvpWc5GogMsVXvaVbNk8OjcnUlkq9lfIjTsV7CFZNDx/MmLuxoo5vm92jSWEh5b5KJ75+F5B1KJ5YGdiQgN0v0w8h24Rr2os0zwqvz/k+Rn4hDQoM06g1+nIFW5PNiqonh1/yyj1+rhK6DHT1cZuK5Kak87YYZZWrtSzVAgskOz95NVmBW2pPk+XuTQ==~3289666~3224899', // Replace with actual cookies
    };

     // Create an Axios instance with session handling
     const session = axios.create({
      headers,
      withCredentials: true,
      timeout: 10000, // 10 seconds timeout
    });

    // Step 1: Send a request to base URL to initialize cookies
    await session.get(baseURL);
    console.log("🍪 Session initialized, cookies set.");

    // Step 2: Fetch the actual data from NSE API
    console.log("📡 Fetching NIFTY 50 data...");
    const response = await session.get(apiURL);

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    console.log("Fetched data:", response.data);


    const apiData = response.data;
    if (!apiData || !apiData.data || !Array.isArray(apiData.data)) {
      throw new Error('❌ Invalid response structure from NSE API');
    }

    // Step 3: Extract and format data to match batchSchema
    const formattedData = {
      fetchTime: new Date(),
      stocks: apiData.data.map(item => ({
        symbol: item.symbol || 'N/A',
        open: item.open || 0,
        dayHigh: item.dayHigh || 0,
        dayLow: item.dayLow || 0,
        lastPrice: item.lastPrice || 0,
        previousClose: item.previousClose || 0,
        change: item.change || 0,
        pChange: item.pChange || 0,
        totalTradedVolume: item.totalTradedVolume || 0,
        totalTradedValue: item.totalTradedValue || 0,
        lastUpdateTime: item.lastUpdateTime || 'N/A',
        yearHigh: item.yearHigh || 0,
        yearLow: item.yearLow || 0,
        perChange365d: item.perChange365d === '-' ? null : parseFloat(item.perChange365d),
        date365dAgo: item.date365dAgo || 'N/A',
        date30dAgo: item.date30dAgo || 'N/A',
        perChange30d: item.perChange30d === '-' ? null : parseFloat(item.perChange30d),
        timestamp: new Date(),
      }))
    };
    console.log("Formatted data:", formattedData);

    // Step 4: Save the formatted data to the database
    await saveNiftyDataToDB(formattedData);
    console.log('✅ Data saved to the database successfully!');

    return formattedData;
  } catch (error) {
    console.error('❌ Error fetching the API:', error.response?.status );
  }
};

// Function to save data to the database
const saveNiftyDataToDB = async (formattedData) => {
  try {
    // Insert the data into the database (with stocks array)
    const result = await NiftyData.create(formattedData);  // Use create for batch insert
    console.log(`${result.stocks.length} records inserted.`);
  } catch (err) {
    console.error('❌ Error saving data to DB:', err);
  }
};