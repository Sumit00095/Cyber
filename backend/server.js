const dns = require("node:dns");

// Configure DNS before connecting to MongoDB
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const phishingRoutes = require("./routes/phishingRoutes");
const alertRoutes = require("./routes/alertRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const threatRoutes = require("./routes/threatRoutes");
const aiAlertRoutes = require("./routes/aiAlertRoutes");

const app = express();

app.use(cors({ origin: "https://onrender.com" }));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "CyberShield Backend is running!"
  });
});

app.use("/api/phishing", phishingRoutes);
app.use("/api/ai-alerts", aiAlertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/threats", threatRoutes);
app.use("/api/alerts", alertRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0:${PORT}`);
});

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
