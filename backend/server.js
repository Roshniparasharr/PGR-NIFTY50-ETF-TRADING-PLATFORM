import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import NiftyData from './models/NiftyData.js';
import niftyRoute from './routes/adminRoute.js';  // Ensure this file exists
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { fetchNifty50Data } from './scripts/scraper.js';

 // This will fetch and store Nifty data when the server starts

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/nifty', niftyRoute);

// API endpoint to get Nifty data from MongoDB
app.get('/api/niftydata', async (req, res) => {
  try {
    const data = await NiftyData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/company/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // Get the latest stored data entry
    const latestData = await NiftyData.findOne().sort({ fetchTime: -1 });

    if (!latestData || !latestData.stocks) {
      return res.status(404).json({ message: 'No stock data available' });
    }

    // Find the company inside the `stocks` array
    const company = latestData.stocks.find(stock => stock.symbol === symbol);

    if (!company) {
      return res.status(404).json({ message: `Company with symbol ${symbol} not found` });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/symbol/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;

    // Fetch all batches from the database
    const allBatches = await NiftyData.find();

    if (!allBatches || allBatches.length === 0) {
      return res.status(404).json({ message: 'No stock data available' });
    }

    // Filter all the batches for the given symbol
    const companyData = allBatches.map(batch => {
      // Find the company inside the `stocks` array in each batch
      return batch.stocks.filter(stock => stock.symbol === symbol);
    }).flat(); // Flatten the array to get all matching companies

    if (companyData.length === 0) {
      return res.status(404).json({ message: `Company with symbol ${symbol} not found` });
    }

    res.json(companyData); // Return all company data across batches
  } catch (error) {
    console.error('Error fetching company data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
fetchNifty50Data();