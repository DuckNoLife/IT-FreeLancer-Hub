const mongoose = require('mongoose');

// Dependencies
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connection successful.');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Process exit
        process.exit(1);
    }
};

// Module export
module.exports = connectDB;