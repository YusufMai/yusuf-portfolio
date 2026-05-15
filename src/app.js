require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to HiveTechNG Cloud Database'))
    .catch(err => console.error('Database connection error:', err));

// 2. Define the Blueprint for your Inquiries
const InquirySchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Inquiry = mongoose.model('Inquiry', InquirySchema);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// 3. The New Cloud-Ready Contact Route
app.post('/contact', async (req, res) => {
    try {
        const newInquiry = new Inquiry({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        
        await newInquiry.save(); // Saves to MongoDB Atlas
        res.send('<h1>Success!</h1><p>Your message reached HiveTechNG. I will get back to you soon.</p><a href="/">Go Back</a>');
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).send('Server Error. Please try again later.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));