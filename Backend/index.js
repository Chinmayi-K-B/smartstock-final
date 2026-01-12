// 1. IMPORTS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./Routes/router");

// --- NEW: Import Prometheus Bundle ---
const promBundle = require("express-prom-bundle");

const app = express();

// 2. PROMETHEUS MIDDLEWARE (MUST be before router)
// This automatically adds the /metrics endpoint
const metricsMiddleware = promBundle({
  includeMethod: true, 
  includePath: true, 
  customLabels: {'app_name': 'inventory_backend'},
  promClient: {
    collectDefaultMetrics: {
    }
  }
});
app.use(metricsMiddleware);

// 3. STANDARD MIDDLEWARE
app.use(cors());
app.use(express.json());

// 4. USE ROUTER
app.use(router);

// 5. DATABASE CONNECTION
// Note: Ensure your Docker Compose sets the MONGO_URI variable.
// I removed the < > brackets from your password string below as they are usually placeholders.
const DB = process.env.MONGO_URI || "mongodb+srv://chinmayikb_db_user:vJuTcTeM1b07U7C2@cluster0.xiqjmyf.mongodb.net/?appName=Cluster0"; 

mongoose.connect(DB)
    .then(() => {
        console.log("Connected to MongoDB Successfully");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });

// 6. START SERVER
const port = 3001;
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});