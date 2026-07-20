const pool = require("../config/database");

const CPU_THRESHOLD = 80;
const MEMORY_THRESHOLD = 85;
const DISK_THRESHOLD = 85;

const getServers = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM servers
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getServerById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM servers
        WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Server not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const createServer = async (req, res, next) => {
  const {
    name,
    hostname,
    ipAddress,
    provider,
    environment,
    operatingSystem,
  } = req.body;

  if (!name || !hostname || !ipAddress || !environment) {
    return res.status(400).json({
      success: false,
      message:
        "Name, hostname, IP address, and environment are required",
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO servers (
          name,
          hostname,
          ip_address,
          provider,
          environment,
          operating_system
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
      [
        name,
        hostname,
        ipAddress,
        provider || null,
        environment,
        operatingSystem || null,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Server added successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateServerStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "online",
    "offline",
    "warning",
    "maintenance",
    "unknown",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid server status",
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE servers
        SET
          status = $1,
          last_checked_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `,
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Server not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Server status updated",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

async function manageAlert(
  client,
  serverId,
  alertType,
  currentValue,
  threshold
) {
  if (Number(currentValue) >= threshold) {
    await client.query(
      `
        INSERT INTO alerts (
          server_id,
          alert_type,
          severity,
          message,
          threshold_value,
          current_value,
          status
        )
        VALUES ($1, $2, 'warning', $3, $4, $5, 'open')
        ON CONFLICT (server_id, alert_type)
        WHERE status = 'open'
        DO UPDATE SET
          current_value = EXCLUDED.current_value,
          message = EXCLUDED.message,
          updated_at = CURRENT_TIMESTAMP
      `,
      [
        serverId,
        alertType,
        `${alertType} usage is ${currentValue}%`,
        threshold,
        currentValue,
      ]
    );
  } else {
    await client.query(
      `
        UPDATE alerts
        SET
          status = 'resolved',
          current_value = $1,
          resolved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE server_id = $2
          AND alert_type = $3
          AND status = 'open'
      `,
      [currentValue, serverId, alertType]
    );
  }
}

const updateServerMetrics = async (req, res, next) => {
  const { id } = req.params;

  const {
    cpuUsage,
    memoryUsage,
    diskUsage,
    uptimeSeconds,
    networkRxBytes = 0,
    networkTxBytes = 0,
    processCount = 0,
    loadAverage1 = 0,
    loadAverage5 = 0,
    loadAverage15 = 0,
    filesystems = [],
  } = req.body;

  const requiredMetrics = [
    cpuUsage,
    memoryUsage,
    diskUsage,
    uptimeSeconds,
  ];

  if (requiredMetrics.some((value) => value === undefined)) {
    return res.status(400).json({
      success: false,
      message:
        "CPU, memory, disk, and uptime metrics are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const serverResult = await client.query(
      `
        UPDATE servers
        SET
          cpu_usage = $1,
          memory_usage = $2,
          disk_usage = $3,
          uptime_seconds = $4,
          network_rx_bytes = $5,
          network_tx_bytes = $6,
          process_count = $7,
          load_average_1 = $8,
          load_average_5 = $9,
          load_average_15 = $10,
          filesystems = $11,
          status = 'online',
          last_checked_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $12
        RETURNING *
      `,
      [
        cpuUsage,
        memoryUsage,
        diskUsage,
        uptimeSeconds,
        networkRxBytes,
        networkTxBytes,
        processCount,
        loadAverage1,
        loadAverage5,
        loadAverage15,
        JSON.stringify(filesystems),
        id,
      ]
    );

    if (serverResult.rowCount === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Server not found",
      });
    }

    await client.query(
      `
        INSERT INTO server_metrics (
          server_id,
          cpu_usage,
          memory_usage,
          disk_usage,
          uptime_seconds,
          network_rx_bytes,
          network_tx_bytes,
          process_count,
          load_average_1,
          load_average_5,
          load_average_15,
          filesystems
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12
        )
      `,
      [
        id,
        cpuUsage,
        memoryUsage,
        diskUsage,
        uptimeSeconds,
        networkRxBytes,
        networkTxBytes,
        processCount,
        loadAverage1,
        loadAverage5,
        loadAverage15,
        JSON.stringify(filesystems),
      ]
    );

    await manageAlert(
      client,
      id,
      "cpu",
      cpuUsage,
      CPU_THRESHOLD
    );

    await manageAlert(
      client,
      id,
      "memory",
      memoryUsage,
      MEMORY_THRESHOLD
    );

    await manageAlert(
      client,
      id,
      "disk",
      diskUsage,
      DISK_THRESHOLD
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Server metrics updated",
      data: serverResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
};

const getServerMetrics = async (req, res, next) => {
  const { id } = req.params;

  const limit = Math.min(
    Math.max(Number(req.query.limit) || 120, 1),
    1000
  );

  try {
    const result = await pool.query(
      `
        SELECT *
        FROM server_metrics
        WHERE server_id = $1
        ORDER BY collected_at DESC
        LIMIT $2
      `,
      [id, limit]
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

const getAlerts = async (req, res, next) => {
  const { status } = req.query;

  try {
    const values = [];
    let whereClause = "";

    if (status) {
      values.push(status);
      whereClause = "WHERE a.status = $1";
    }

    const result = await pool.query(
      `
        SELECT
          a.*,
          s.name AS server_name,
          s.hostname
        FROM alerts a
        JOIN servers s ON s.id = a.server_id
        ${whereClause}
        ORDER BY a.created_at DESC
      `,
      values
    );

    return res.status(200).json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const acknowledgeAlert = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        UPDATE alerts
        SET
          status = 'acknowledged',
          acknowledged_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND status = 'open'
        RETURNING *
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Open alert not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alert acknowledged",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServers,
  getServerById,
  createServer,
  updateServerStatus,
  updateServerMetrics,
  getServerMetrics,
  getAlerts,
  acknowledgeAlert,
};
