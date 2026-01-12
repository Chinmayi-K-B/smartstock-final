const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors'); 
const router = require('./Routes/router'); // IMPORTANT: Check this folder name below!

// Connect to Database
connectToMongo();

const app = express();

// --- CRITICAL FIX: Use Render's Port or fallback to 3001 locally ---
const port = process.env.PORT || 3001; 

// Enable CORS (Allows your Frontend to talk to this Backend)
app.use(cors());

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`);
});