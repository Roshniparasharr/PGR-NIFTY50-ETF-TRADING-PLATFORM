import { fetchNifty50Data } from './scraper.js';  // Correct import
import NiftyData from '../models/NiftyData.js';

export const fetchDataFromNSE = async () => {
  try {
    // Fetch data from the NSE (this is where your raw data is obtained)
    const newData = await fetchNifty50Data();
    
    // Clean the data: Replace '-' with null or a valid number
    const cleanData = newData.map(stock => {
      stock.perChange365d = stock.perChange365d === '-' ? null : parseFloat(stock.perChange365d);
      stock.perChange30d = stock.perChange30d === '-' ? null : parseFloat(stock.perChange30d);
      return stock;
    });

    // Log the cleaned data for debugging
    console.log("Cleaned Data: ", cleanData);

    // Save the cleaned data to MongoDB
    await saveNiftyDataToDB(cleanData);

    console.log("Data saved successfully!");
  } catch (error) {
    console.error("Error fetching fresh data:", error);
  }
};

// Function to save the cleaned data to MongoDB
const saveNiftyDataToDB = async (data) => {
  try {
    await NiftyData.insertMany(data);  // Assuming you're inserting an array of documents
  } catch (error) {
    console.error("Error saving data to DB:", error);
  }
};

export const checkDataExists = async (date) => {
  try {
    // Convert the date string to a Date object to compare with the stored fetchTime (which is a Date object)
    const dateToCheck = new Date(date);  // This converts the date string to a Date object
    
    // Logic to check if data for the given date exists
    const data = await NiftyData.findOne({
      fetchTime: { $gte: dateToCheck.setHours(0, 0, 0, 0), $lt: dateToCheck.setHours(23, 59, 59, 999) }
    });

    return data ? true : false;
  } catch (err) {
    console.error('Error checking data existence:', err);
    throw err;
  }
};