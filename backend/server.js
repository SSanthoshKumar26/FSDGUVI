const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { exec } = require("child_process");

const transactionRoutes = require("./routes/transactions");
const mailRoutes = require("./routes/mail");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- Middleware -------------------- */
app.use(express.json());

app.use(
    cors({
        origin: "*", // later you can restrict to frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

/* -------------------- Routes -------------------- */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend API is running successfully 🚀",
    });
});

app.use("/api/v1", transactionRoutes);
app.use("/api/v1/mail", mailRoutes);

/* -------------------- MongoDB Connection -------------------- */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

connectDB();

/* -------------------- Cron Jobs -------------------- */
/**
 * NOTE:
 * Render free tier may sleep.
 * Cron jobs will only run when the service is awake.
 */

cron.schedule("0 8 * * *", () => {
    console.log("⏰ Running scheduled motivation mail...");
    exec("node scripts/motivationMail.js", (err, stdout, stderr) => {
        if (err) console.error("Cron Error (Motivation):", err);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    });
});

cron.schedule("0 22 * * *", () => {
    console.log("⏰ Running scheduled summary mail...");
    exec("node scripts/summaryMail.js", (err, stdout, stderr) => {
        if (err) console.error("Cron Error (Summary):", err);
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    });
});

/* -------------------- Server -------------------- */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
