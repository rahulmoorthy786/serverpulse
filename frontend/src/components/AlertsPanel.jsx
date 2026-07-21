import { useCallback, useEffect, useState } from "react";

import {
  acknowledgeAlert,
  getAlerts,
} from "../services/api";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString();
}

function AlertsPanel({ serverId }) {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [acknowledgingId, setAcknowledgingId] =
    useState(null);
  const [error, setError] = useState("");

  const loadAlerts = useCallback(async () => {
    try {
      const response = await getAlerts(filter);

      const serverAlerts = response.data.filter(
        (alert) =>
          Number(alert.server_id) === Number(serverId)
      );

      setAlerts(serverAlerts);
      setError("");
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to load alerts.");
    } finally {
      setLoading(false);
    }
  }, [filter, serverId]);

  useEffect(() => {
    let cancelled = false;

    const fetchAlerts = async () => {
      try {
        const response = await getAlerts(filter);

        if (cancelled) {
          return;
        }

        const serverAlerts = response.data.filter(
          (alert) =>
            Number(alert.server_id) === Number(serverId)
        );

        setAlerts(serverAlerts);
        setError("");
      } catch (requestError) {
        console.error(requestError);

        if (!cancelled) {
          setError("Unable to load alerts.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchAlerts();

    const intervalId = setInterval(() => {
      void fetchAlerts();
    }, 30000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [filter, serverId]);

  const handleAcknowledge = async (alertId) => {
    try {
      setAcknowledgingId(alertId);
      setError("");

      await acknowledgeAlert(alertId);
      await loadAlerts();
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to acknowledge the alert.");
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <section className="details-card">
      <div className="alerts-heading">
        <div>
          <h3>Alerts</h3>
          <p>Threshold alerts and alert history</p>
        </div>

        <select
          className="alert-filter"
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
        >
          <option value="">All alerts</option>
          <option value="open">Open</option>
          <option value="acknowledged">
            Acknowledged
          </option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {error && (
        <div className="message-box error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="empty-state">
          No alerts found for this server.
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <article
              className={`alert-item alert-${alert.severity}`}
              key={alert.id}
            >
              <div className="alert-main">
                <div className="alert-title-row">
                  <strong>{alert.alert_type}</strong>

                  <span
                    className={`alert-status alert-status-${alert.status}`}
                  >
                    {alert.status}
                  </span>
                </div>

                <p>{alert.message}</p>

                <div className="alert-meta">
                  <span>
                    Current: {alert.current_value}
                  </span>

                  <span>
                    Threshold: {alert.threshold_value}
                  </span>

                  <span>
                    Created: {formatDate(alert.created_at)}
                  </span>
                </div>
              </div>

              {alert.status === "open" && (
                <button
                  type="button"
                  className="secondary-button"
                  disabled={
                    acknowledgingId === alert.id
                  }
                  onClick={() =>
                    handleAcknowledge(alert.id)
                  }
                >
                  {acknowledgingId === alert.id
                    ? "Acknowledging..."
                    : "Acknowledge"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AlertsPanel;