const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const transactionRoutes = require('./routes/transactions');
const mailRoutes = require('./routes/mail');
const cron = require('node-cron');
const { exec } = require('child_process');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/v1', transactionRoutes);
app.use('/api/v1/mail', mailRoutes);

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
}

connectDB();

app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Schedule Motivation Mail (Every morning at 8:00 AM)
    cron.schedule('0 8 * * *', () => {
        console.log('Running scheduled motivation mail...');
        exec('node scripts/motivationMail.js', (err, stdout, stderr) => {
            if (err) console.error('Cron Error (Motivation):', err);
            if (stdout) console.log('Cron Output:', stdout);
        });
    });

    // Schedule Daily Summary Mail (Every night at 10:00 PM)
    cron.schedule('0 22 * * *', () => {
        console.log('Running scheduled summary mail...');
        exec('node scripts/summaryMail.js', (err, stdout, stderr) => {
            if (err) console.error('Cron Error (Summary):', err);
            if (stdout) console.log('Cron Output:', stdout);
        });
    });
});
