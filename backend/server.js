import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import NiftyData from './models/NiftyData.js';
import niftyRoute from './routes/adminRoute.js';  // Ensure this file exists
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';

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

 // Adjust the path as needed

// Example route handler to get data for a specific company symbol
app.get('/api/company/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    // Find all batches containing the company symbol in the 'stocks' array
    const batches = await NiftyData.find({
      'stocks.symbol': symbol
    });

    // Extract the relevant stock data from each batch
    const companyData = [];
    batches.forEach(batch => {
      batch.stocks.forEach(stock => {
        if (stock.symbol === symbol) {
          companyData.push(stock);  // Add the stock data of the company symbol to the result array
        }
      });
    });

    if (companyData.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified company' });
    }

    res.json(companyData);  // Send the collected data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch company data' });
  }
});


