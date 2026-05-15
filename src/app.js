require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Improved Connection Logic (Handles the "ENOTFOUND" and "Buffering" issues)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
        });
        console.log('Connected to HiveTechNG Cloud Database');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};

// 2. Schema
// 2. Updated Blueprint to include Service and Subject
const InquirySchema = new mongoose.Schema({
    name: String,
    email: String,
    service: String,  // Added
    subject: String,  // Added
    message: String,
    date: { type: Date, default: Date.now }
});
const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);

app.post('/contact', async (req, res) => {
    try {
        await connectDB();

        const newInquiry = new Inquiry({
            name: req.body.name,
            email: req.body.email,
            service: req.body.service, // Added
            subject: req.body.subject, // Added
            message: req.body.message
        });
        
        await newInquiry.save(); 
        res.status(200).send('Success'); // Send a simple status for the JS fetch to catch
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).send('Server Error');
    }
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app; // Required for Vercel