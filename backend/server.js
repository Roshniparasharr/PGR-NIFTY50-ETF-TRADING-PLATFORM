import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import NiftyData from './models/NiftyData.js';
import niftyRoute from './routes/niftyRoute.js';  // Ensure this file exists
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('MongoDB connection error:', err);
});

// Fetch and save Nifty data
async function readAndSaveNiftyData() {
  try {
    // Read the JSON file
    const data = fs.readFileSync('./scripts/nifty50Data.json', 'utf8');
    const parsedData = JSON.parse(data);

    // Check if the data exists
    if (parsedData.length === 0) {
      console.log('No data to insert!');
      return;
    }

    // Insert the data into the database
    await NiftyData.insertMany(parsedData);
    console.log('Data saved to database');
  } catch (error) {
    console.error('Error reading or saving data:', error);
  }
}

// API endpoint to get Nifty data from MongoDB
app.get('/api/niftydata', async (req, res) => {
  try {
    const data = await NiftyData.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});


// Use the Nifty route (if you have separate route file)
app.use('/api/nifty', niftyRoute);

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await readAndSaveNiftyData();  // Ensure it runs when the server starts
});
