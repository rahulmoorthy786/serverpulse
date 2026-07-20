import { useEffect, useState } from "react";

import { getServerMetrics } from "../../services/api";
import MetricChart from "./MetricChart";

function prepareChartData(metrics) {
  return metrics.map((metric) => ({
    time: new Date(metric.collected_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    cpu: Number(metric.cpu_usage),
    memory: Number(metric.memory_usage),
    disk: Number(metric.disk_usage),
  }));
}

function MetricsOverview({ serverId }) {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadMetrics = async () => {
      try {
        setError("");

        const response = await getServerMetrics(serverId, 120);

        if (active) {
          setMetrics(prepareChartData(response.data));
        }
      } catch (requestError) {
        console.error(requestError);

        if (active) {
          setError("Unable to load historical metrics.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    const interval = setInterval(loadMetrics, 30000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [serverId]);

  if (loading) {
    return (
      <div className="message-box">
        Loading historical metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="message-box error-message">
        {error}
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="message-box">
        No historical metrics are available yet.
      </div>
    );
  }

  return (
    <section className="charts-section">
      <div className="section-heading">
        <div>
          <h2>Metric History</h2>
          <p>Updated every 30 seconds</p>
        </div>
      </div>

      <div className="charts-grid">
        <MetricChart
          title="CPU Usage"
          data={metrics}
          dataKey="cpu"
          stroke="#2563eb"
        />

        <MetricChart
          title="Memory Usage"
          data={metrics}
          dataKey="memory"
          stroke="#16a34a"
        />

        <MetricChart
          title="Disk Usage"
          data={metrics}
          dataKey="disk"
          stroke="#ea580c"
        />
      </div>
    </section>
  );
}

export default MetricsOverview;
