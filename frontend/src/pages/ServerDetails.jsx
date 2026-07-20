import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AlertsPanel from "../components/AlertsPanel";
import FilesystemTable from "../components/FilesystemTable";
import Header from "../components/Header";
import SystemOverview from "../components/SystemOverview";
import MetricsOverview from "../components/charts/MetricsOverview";
import { getServerById } from "../services/api";

function formatUsage(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0.0%";
  }

  return `${number.toFixed(1)}%`;
}

function formatUptime(seconds) {
  const totalSeconds = Number(seconds);

  if (!totalSeconds) {
    return "Not available";
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

function ServerDetails() {
  const { id } = useParams();

  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadServer = async () => {
      try {
        setError("");

        const response = await getServerById(id);

        if (active) {
          setServer(response.data);
        }
      } catch (requestError) {
        console.error(requestError);

        if (active) {
          setError(
            "Unable to load the server details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadServer();

    const interval = setInterval(loadServer, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [id]);

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        <Link className="back-link" to="/">
          ← Back to dashboard
        </Link>

        {loading && (
          <div className="message-box">
            Loading server details...
          </div>
        )}

        {error && (
          <div className="message-box error-message">
            {error}
          </div>
        )}

        {!loading && !error && server && (
          <>
            <div className="details-heading">
              <div>
                <h2>{server.name}</h2>
                <p>{server.hostname}</p>
              </div>

              <span
                className={`server-status status-${server.status}`}
              >
                {server.status}
              </span>
            </div>

            <section className="details-card">
              <h3>Server Information</h3>

              <div className="details-grid">
                <div>
                  <span>IP address</span>
                  <strong>{server.ip_address}</strong>
                </div>

                <div>
                  <span>Provider</span>
                  <strong>
                    {server.provider || "Not set"}
                  </strong>
                </div>

                <div>
                  <span>Environment</span>
                  <strong>{server.environment}</strong>
                </div>

                <div>
                  <span>Operating system</span>
                  <strong>
                    {server.operating_system ||
                      "Not set"}
                  </strong>
                </div>

                <div>
                  <span>Uptime</span>
                  <strong>
                    {formatUptime(
                      server.uptime_seconds
                    )}
                  </strong>
                </div>

                <div>
                  <span>Last checked</span>
                  <strong>
                    {server.last_checked_at
                      ? new Date(
                          server.last_checked_at
                        ).toLocaleString()
                      : "Never"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="details-card">
              <h3>Resource Usage</h3>

              <div className="metrics-grid">
                <div className="metric-card">
                  <span>CPU Usage</span>
                  <strong>
                    {formatUsage(server.cpu_usage)}
                  </strong>
                </div>

                <div className="metric-card">
                  <span>Memory Usage</span>
                  <strong>
                    {formatUsage(
                      server.memory_usage
                    )}
                  </strong>
                </div>

                <div className="metric-card">
                  <span>Disk Usage</span>
                  <strong>
                    {formatUsage(server.disk_usage)}
                  </strong>
                </div>
              </div>
            </section>

            <SystemOverview server={server} />

            <FilesystemTable
              filesystems={server.filesystems || []}
            />

            <MetricsOverview serverId={id} />

            <AlertsPanel serverId={id} />
          </>
        )}
      </main>
    </div>
  );
}

export default ServerDetails;
