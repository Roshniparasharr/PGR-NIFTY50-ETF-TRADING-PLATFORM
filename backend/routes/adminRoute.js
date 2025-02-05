import express from 'express';
const router = express.Router();
import { fetchDataFromNSE } from '../scripts/dataService.js';  // Import the function from dataService
import { checkDataExists } from '../scripts/dataService.js';

router.get('/api/refresh-data', async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0];  // Get the current date in YYYY-MM-DD format

    // Check if data for today already exists in the database
    const dataExists = await checkDataExists(currentDate);

    if (dataExists) {
      return res.json({ status: 'already_exists' });  // Data already exists, no need to fetch
    }

    // If data doesn't exist, trigger the scraper to fetch fresh data
    await fetchDataFromNSE();
    return res.json({ status: 'fetched' });  // Data fetched and stored successfully
  } catch (error) {
    console.error('Error while handling refresh:', error);
    return res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
});
// router.get('/scraper', (req, res) => {
//   const scraperPath = path.join(__dirname, 'scripts', 'scraper.js'); // Correct path to scraper.js
  
//   // Execute scraper.js
//   exec(node ${scraperPath}, (error, stdout, stderr) => {
//     if (error) {
//       console.error(exec error: ${error});
//       return res.status(500).json({ message: 'Error executing scraper' });
//     }
//     console.log(stdout: ${stdout});
//     console.error(stderr: ${stderr});
//     res.json({ message: 'Scraper executed successfully', data: stdout }); // You can send data if needed
//   });
// });


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