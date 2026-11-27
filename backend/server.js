const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const phishingRoutes = require("./routes/phishingRoutes");
const alertRoutes = require("./routes/alertRoutes");
const authRoutes = require("./routes/authRoutes");
const threatRoutes = require("./routes/threatRoutes");
const aiAlertRoutes = require("./routes/aiAlertRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection (cached)
let dbPromise;

const ensureDB = async () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }

  return dbPromise;
};

// Ensure database is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "CyberShield Backend is running!"
  });
});

// API Routes
app.use("/api/phishing", phishingRoutes);
app.use("/api/ai-alerts", aiAlertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/threats", threatRoutes);
app.use("/api/alerts", alertRoutes);

// Local server only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export Express app for Vercel
module.exports = app;