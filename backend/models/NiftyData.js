import mongoose from 'mongoose';

const niftySchema = new mongoose.Schema(
  {
    symbol: String,
    open: Number,
    dayHigh: Number, 
    dayLow: Number,
    lastPrice: Number,
    previousClose: Number,
    change: Number,
    pChange: Number,
    totalTradedVolume: Number,
    totalTradedValue: Number,
    lastUpdateTime: String,
    yearHigh: Number, 
    yearLow: Number, 
    perChange365d: Number,
    date365dAgo: Date,
    date30dAgo: Date,
    perChange30d: Number,
  });

// Fix in niftydata.js
const NiftyData = mongoose.model('NiftyData', niftySchema, 'niftydatas');

export default NiftyData;

