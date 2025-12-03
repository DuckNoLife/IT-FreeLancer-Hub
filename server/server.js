// Dependencies & Configuration
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Database connection
connectDB();

// Global Middleware
// CORS Configuration: Allows both Production (CLIENT_URL) and Localhost
app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Webhook handling: Must be placed before express.json()
app.use('/webhook', express.raw({ type: 'application/json' }), require('./routes/webhook')); 

// Body parser middleware
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/payment'));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Server initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});