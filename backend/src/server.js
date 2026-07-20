require("dotenv").config({
  path: "../.env",
});

const app = require("./app");
const pool = require("./config/database");

const port = process.env.BACKEND_PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL connection established");

    app.listen(port, () => {
      console.log(`ServerPulse backend running on port ${port}`);
    });
  } catch (error) {
    console.error("Unable to start ServerPulse:", error.message);
    process.exit(1);
  }
};

startServer();
