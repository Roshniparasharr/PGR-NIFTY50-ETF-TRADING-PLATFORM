import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import NiftyData from './models/NiftyData.js';
import niftyRoute from './routes/adminRoute.js';
import './scripts/scraper.js'; 
import { fetchNifty50Data } from './scripts/scraper.js';

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Function to read and save Nifty data
async function readAndSaveNiftyData() {
    try {
      // Fetch fresh data using the scraper function
      const freshData = await fetchNifty50Data(); // Directly call the function
  
      if (!Array.isArray(freshData) || freshData.length === 0) {
        console.log('❌ Invalid or empty data format:', freshData);
        return;
      }
  
      console.log(freshData);  // Log the fetched data to ensure it's correct
  
      // Clean the data (convert "-" to null or a valid number)
      freshData.forEach(stock => {
        if (stock.perChange365d === "-") {
          stock.perChange365d = null;
        }
        if (stock.perChange30d === "-") {
          stock.perChange30d = null;
        }
      });
  
      console.log(freshData);  // Check the cleaned data before saving
  
      if (freshData.length > 0) {
        // Create a new batch with the current timestamp
        const newBatch = new NiftyData({
          stocks: freshData,
          fetchTime: new Date(),
        });
  
        await newBatch.save();
        console.log(`Data batch saved at: ${newBatch.fetchTime}`);
      } else {
        console.log('❌ No valid data to save.');
      }
    } catch (error) {
      console.error('❌ Error reading or saving data:', error);
    }
  }
  
  // Route to trigger the scraper and fetch new data
  app.post('/api/refresh', async (req, res) => {
    try {
      console.log('Triggered scraper...');
      await fetchNifty50Data(); // Call the scraper function directly
      res.send('Data refreshed successfully');
    } catch (error) {
      console.error('Error running scraper:', error);
      res.status(500).send('Failed to refresh data');
    }
  });
  
  // Use the Nifty route for admin-specific tasks (if you have it)
  app.use('/api/nifty', niftyRoute);

  
  // Route to fetch all Nifty data from the database
  app.get('/api/nifty-data', async (req, res) => {
    try {
      console.log('Fetching Nifty data...');
      const data = await NiftyData.find().sort({ fetchTime: -1 });
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching Nifty data:', error);
      res.status(500).json({ message: 'Error fetching Nifty data' });
    }
  });
  
  export default app;
// Initial Data Setup (Optional)
// const readAndSaveNiftyData = async () => {
//   try {
//     const fs = await import('fs'); // Dynamic import for efficiency
//     const data = fs.readFileSync('./scripts/nifty50Data.json', 'utf8');
//     const parsedData = JSON.parse(data);

//     if (parsedData.length > 0) {
//       await mongoose.model('NiftyData').deleteMany();
//       await mongoose.model('NiftyData').insertMany(parsedData);
//       console.log('Nifty data initialized');
//     } else {
//       console.log('No data to insert!');
//     }
//   } catch (error) {
//     console.error('Error initializing Nifty data:', error);
//   }
// };

