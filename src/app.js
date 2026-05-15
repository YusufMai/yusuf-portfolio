const path = require('path');
const express = require('express');
const fs = require('fs'); 
const app = express();

// Middlewares to handle Form Data from your website
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your website files (HTML, CSS, JS/main.js) from the root folder
app.use(express.static(path.join(__dirname, '../')));

// Path to save your client inquiries
const messagesFilePath = path.join(__dirname, '../inquiries.json');

// Ensure the inquiries file exists so the server doesn't error out
if (!fs.existsSync(messagesFilePath)) {
    fs.writeFileSync(messagesFilePath, '[]');
}

// --- CONTACT FORM ROUTE ---
app.post('/contact', (req, res) => {
    // ADD THIS LINE HERE:
    console.log("DEBUG: Raw Form Data Received ->", req.body);

    const { name, email, service, subject, message } = req.body;
    // ... rest of your code
    try {
        // Read existing messages
        const data = fs.readFileSync(messagesFilePath);
        const inquiries = JSON.parse(data);

        // Create the new inquiry object with a timestamp
        const newInquiry = { 
            name, 
            email, 
            service, 
            subject, 
            message, 
            date: new Date().toLocaleString() 
        };
        
        // Add to the list and save back to the file
        inquiries.push(newInquiry);
        fs.writeFileSync(messagesFilePath, JSON.stringify(inquiries, null, 2));

        // Send a professional "Thank You" response
        res.send(`
            <div style="font-family: 'Segoe UI', sans-serif; text-align: center; padding: 100px 20px; color: #333;">
                <h1 style="color: #007bff;">Thank You, ${name}!</h1>
                <p style="font-size: 18px;">Your request for <strong>${service}</strong> has been received.</p>
                <p>I will review the details and get back to you at <strong>${email}</strong> soon.</p>
                <br>
                <a href="/" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Return to Portfolio</a>
            </div>
        `);

        // Log to terminal so you see it immediately
        console.log(`New Inquiry from: ${name} (${service})`);

    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).send("Server Error. Please try again later.");
    }
});

// Start the server
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});