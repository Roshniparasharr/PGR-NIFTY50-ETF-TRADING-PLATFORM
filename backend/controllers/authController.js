import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fetchDataFromNSE } from '../scripts/dataService.js';  // Import the function from dataService
import { checkDataExists } from '../scripts/dataService.js'; // Utility functions for Nifty data handling


// User registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
};

// User login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Successfully logged in", token, user });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

export const refreshData = async (req, res) => {
  try {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Check if data for today already exists in the database
    const dataExists = await checkDataExists(currentDate);

    if (dataExists) {
      return res.json({ status: 'already_exists' }); // Data already exists, no need to fetch
    }

    // If data doesn't exist, trigger the scraper to fetch fresh data
    await fetchDataFromNSE();
    return res.json({ status: 'fetched' }); // Data fetched and stored successfully
  } catch (error) {
    console.error('Error while handling refresh:', error);
    return res.status(500).json({ status: 'error', message: 'An error occurred' });
  }
};