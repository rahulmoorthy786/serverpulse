require("dotenv").config();

const app = require("./app");
const pool = require("./config/database");

const port = process.env.PORT || process.env.BACKEND_PORT || 5000;

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const connectToDatabase = async (maxAttempts = 10) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");

      console.log("PostgreSQL connection established");
      return;
    } catch (error) {
      console.error(
        `Database connection attempt ${attempt}/${maxAttempts} failed: ${error.message}`
      );

      if (attempt === maxAttempts) {
        throw error;
      }

      await delay(5000);
    }
  }
};

const startServer = async () => {
  try {
    await connectToDatabase();

    app.listen(port, "0.0.0.0", () => {
      console.log(`ServerPulse backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start ServerPulse:");
    console.error(error);
    process.exit(1);
  }
};

startServer();