require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const port = process.env.BACKEND_PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("✅ PostgreSQL connection established");

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 ServerPulse backend running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to start ServerPulse:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
