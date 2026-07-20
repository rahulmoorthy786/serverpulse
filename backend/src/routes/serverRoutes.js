const express = require("express");

const {
  getServers,
  getServerById,
  createServer,
  updateServerStatus,
  updateServerMetrics,
  getServerMetrics,
  getAlerts,
  acknowledgeAlert,
} = require("../controllers/serverController");

const router = express.Router();

router.get("/alerts", getAlerts);
router.patch("/alerts/:id/acknowledge", acknowledgeAlert);

router.get("/", getServers);
router.post("/", createServer);

router.get("/:id", getServerById);
router.get("/:id/metrics", getServerMetrics);

router.patch("/:id/status", updateServerStatus);
router.patch("/:id/metrics", updateServerMetrics);

module.exports = router;
