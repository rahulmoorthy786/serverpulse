function formatBytes(value) {
  const bytes = Number(value);

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const amount = bytes / 1024 ** index;

  return `${amount.toFixed(index === 0 ? 0 : 2)} ${
    units[index]
  }`;
}

function formatLoad(value) {
  const number = Number(value);

  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function SystemOverview({ server }) {
  return (
    <section className="details-card">
      <h3>System Metrics</h3>

      <div className="system-metrics-grid">
        <div className="system-metric-card">
          <span>Network received</span>
          <strong>
            {formatBytes(server.network_rx_bytes)}
          </strong>
        </div>

        <div className="system-metric-card">
          <span>Network transmitted</span>
          <strong>
            {formatBytes(server.network_tx_bytes)}
          </strong>
        </div>

        <div className="system-metric-card">
          <span>Running processes</span>
          <strong>{server.process_count ?? 0}</strong>
        </div>
      </div>

      <div className="load-average-section">
        <h4>Load Average</h4>

        <div className="load-grid">
          <div>
            <span>1 minute</span>
            <strong>
              {formatLoad(server.load_average_1)}
            </strong>
          </div>

          <div>
            <span>5 minutes</span>
            <strong>
              {formatLoad(server.load_average_5)}
            </strong>
          </div>

          <div>
            <span>15 minutes</span>
            <strong>
              {formatLoad(server.load_average_15)}
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SystemOverview;
