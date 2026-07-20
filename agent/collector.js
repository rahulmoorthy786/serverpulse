const os = require("os");
const fs = require("fs/promises");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const API_URL =
  process.env.SERVERPULSE_API_URL ||
  "http://127.0.0.1:5000/api/servers/1/metrics";

const INTERVAL_SECONDS = Number(
  process.env.COLLECTION_INTERVAL || 30
);

function sleep(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function readCpuTimes() {
  return os.cpus().reduce(
    (totals, cpu) => {
      const times = cpu.times;

      totals.idle += times.idle;
      totals.total +=
        times.user +
        times.nice +
        times.sys +
        times.idle +
        times.irq;

      return totals;
    },
    { idle: 0, total: 0 }
  );
}

async function getCpuUsage() {
  const first = readCpuTimes();

  await sleep(1000);

  const second = readCpuTimes();

  const idleDifference = second.idle - first.idle;
  const totalDifference = second.total - first.total;

  if (totalDifference === 0) {
    return 0;
  }

  return Number(
    ((1 - idleDifference / totalDifference) * 100).toFixed(2)
  );
}

function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const usedMemory = totalMemory - os.freemem();

  return Number(
    ((usedMemory / totalMemory) * 100).toFixed(2)
  );
}

async function getFilesystems() {
  const { stdout } = await execFileAsync("df", [
    "-P",
    "-x",
    "tmpfs",
    "-x",
    "devtmpfs",
  ]);

  const lines = stdout.trim().split("\n").slice(1);

  return lines.map((line) => {
    const columns = line.trim().split(/\s+/);

    return {
      filesystem: columns[0],
      totalKb: Number(columns[1]),
      usedKb: Number(columns[2]),
      availableKb: Number(columns[3]),
      usagePercent: Number(columns[4].replace("%", "")),
      mountPoint: columns.slice(5).join(" "),
    };
  });
}

async function getNetworkStatistics() {
  const content = await fs.readFile(
    "/proc/net/dev",
    "utf8"
  );

  let networkRxBytes = 0;
  let networkTxBytes = 0;

  const lines = content.trim().split("\n").slice(2);

  for (const line of lines) {
    const [interfaceName, valuesText] = line.split(":");
    const name = interfaceName.trim();

    if (name === "lo") {
      continue;
    }

    const values = valuesText.trim().split(/\s+/);

    networkRxBytes += Number(values[0]);
    networkTxBytes += Number(values[8]);
  }

  return {
    networkRxBytes,
    networkTxBytes,
  };
}

async function getProcessCount() {
  const entries = await fs.readdir("/proc");

  return entries.filter((entry) => /^\d+$/.test(entry))
    .length;
}

async function collectMetrics() {
  const [
    cpuUsage,
    filesystems,
    network,
    processCount,
  ] = await Promise.all([
    getCpuUsage(),
    getFilesystems(),
    getNetworkStatistics(),
    getProcessCount(),
  ]);

  const rootFilesystem = filesystems.find(
    (filesystem) => filesystem.mountPoint === "/"
  );

  const loadAverage = os.loadavg();

  return {
    cpuUsage,
    memoryUsage: getMemoryUsage(),
    diskUsage: rootFilesystem?.usagePercent || 0,
    uptimeSeconds: Math.floor(os.uptime()),
    networkRxBytes: network.networkRxBytes,
    networkTxBytes: network.networkTxBytes,
    processCount,
    loadAverage1: Number(loadAverage[0].toFixed(2)),
    loadAverage5: Number(loadAverage[1].toFixed(2)),
    loadAverage15: Number(loadAverage[2].toFixed(2)),
    filesystems,
  };
}

async function sendMetrics(metrics) {
  const response = await fetch(API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metrics),
  });

  if (!response.ok) {
    const responseBody = await response.text();

    throw new Error(
      `API returned ${response.status}: ${responseBody}`
    );
  }

  return response.json();
}

async function runCollector() {
  console.log("ServerPulse agent started");
  console.log(`API endpoint: ${API_URL}`);
  console.log(
    `Collection interval: ${INTERVAL_SECONDS} seconds`
  );

  while (true) {
    try {
      const metrics = await collectMetrics();

      await sendMetrics(metrics);

      console.log(
        `[${new Date().toISOString()}]`,
        `CPU ${metrics.cpuUsage}%`,
        `Memory ${metrics.memoryUsage}%`,
        `Disk ${metrics.diskUsage}%`,
        `Processes ${metrics.processCount}`,
        `Load ${metrics.loadAverage1}`
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Collection failed:`,
        error.message
      );
    }

    await sleep(INTERVAL_SECONDS * 1000);
  }
}

runCollector();
