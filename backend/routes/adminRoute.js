import express from 'express';
import NiftyData from '../models/NiftyData.js';  // Import the model
const router = express.Router();

// Endpoint to fetch data from MongoDB
router.get('/', async (req, res) => {
  try {
    const data = await NiftyData.find();  // Fetch all data from the NiftyData collection
    res.json(data);  // Send the data as a response
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
});


// Endpoint to save data to MongoDB
router.post('/', async (req, res) => {
  try {
    const { name, value } = req.body;  // Assuming the data being sent is { name, value }
    const newData = new NiftyData({ name, value });
    await newData.save();  // Save the data to MongoDB
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save data to the database.' });
  }
});

export default router;
