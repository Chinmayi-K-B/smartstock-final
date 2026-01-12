const mongoose = require('mongoose');

// 1. Load the .env file
require('dotenv').config(); 

// 2. Read the variable named 'MONGO_URI' from .env
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);

    if (!mongoURI) {
        throw new Error("MONGO_URI is missing from .env file");
    }

    // 3. Connect using the Cloud Link
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Cloud (Atlas) Successfully!");
  } catch (error) {
    console.log("Database Connection Failed:", error);
  }
};

module.exports = connectToMongo;