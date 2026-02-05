require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactions");
const mailRoutes = require("./routes/mail");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Test root route
app.get("/", (req, res) => res.json({ message: "Backend API running 🚀" }));

// Mount transaction routes - Mail first to avoid greedy matching issues
app.use("/api/v1/mail", mailRoutes);
app.use("/api/v1", transactionRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
        console.log("📂 Connected to DB Name:", mongoose.connection.name);
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} - MAIL ROUTES ENABLED`));
