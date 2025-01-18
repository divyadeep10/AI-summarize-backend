const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors({
  origin: "*", // Replace "*" with your frontend URL if you want to restrict origins
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
}));

// Import routes from server.js
const summarizeRoutes = require('./backend/server');
app.use('/api', summarizeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
