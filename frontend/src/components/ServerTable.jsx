import { Link } from "react-router-dom";

function formatUsage(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0%";
  }

  return `${number.toFixed(1)}%`;
}

function ServerTable({ servers }) {
  if (servers.length === 0) {
    return (
      <section className="server-section">
        <div className="section-heading">
          <div>
            <h2>Server Inventory</h2>
            <p>No servers have been added yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="server-section">
      <div className="section-heading">
        <div>
          <h2>Server Inventory</h2>
          <p>Current infrastructure and resource usage</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Server</th>
              <th>Provider</th>
              <th>Environment</th>
              <th>Status</th>
              <th>CPU</th>
              <th>Memory</th>
              <th>Disk</th>
            </tr>
          </thead>

          <tbody>
            {servers.map((server) => (
              <tr key={server.id}>
                <td>
                  <div className="server-name">
                    <Link
                      className="server-link"
                      to={`/servers/${server.id}`}
                    >
                      {server.name}
                    </Link>

                    <span>{server.hostname}</span>
                  </div>
                </td>

                <td>{server.provider || "Not set"}</td>

                <td>
                  <span className="environment-badge">
                    {server.environment}
                  </span>
                </td>

                <td>
                  <span
                    className={`server-status status-${server.status}`}
                  >
                    {server.status}
                  </span>
                </td>

                <td>{formatUsage(server.cpu_usage)}</td>
                <td>{formatUsage(server.memory_usage)}</td>
                <td>{formatUsage(server.disk_usage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ServerTable;
