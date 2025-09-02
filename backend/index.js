// backend/index.js

const express = require('express');
const app = express();
const cors = require('cors');
const mongoDb = require('./mongodb');
const axios = require('axios'); // <-- Add this line to import axios

require('dotenv').config();

// Connect to MongoDB
mongoDb();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Your existing authentication routes
app.use('/api/auth', require('./routes/signup'));
app.use('/api/auth', require('./routes/login'));
app.use('/api/profile', require('./routes/profile'));

// <-- Add this new route for your ML model
app.post('/api/predict', async (req, res) => {
    try {
        const inputData = req.body;
        // Make a POST request to your Python ML service
        const response = await axios.post('http://localhost:5001/predict', inputData);
        // Send the prediction back to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error calling ML service:", error);
        res.status(500).send("Error generating prediction");
    }
});
// <-- End of new route

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));