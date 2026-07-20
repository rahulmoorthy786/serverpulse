const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const serverRoutes = require("./routes/serverRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    application: "ServerPulse",
    message: "ServerPulse API is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "serverpulse-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/servers", serverRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
