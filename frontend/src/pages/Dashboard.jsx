import { useEffect, useMemo, useState } from "react";

import AddServerForm from "../components/AddServerForm";
import Header from "../components/Header";
import ServerTable from "../components/ServerTable";
import SummaryCards from "../components/SummaryCards";
import {
  createServer,
  getServers,
} from "../services/api";

function Dashboard() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [environmentFilter, setEnvironmentFilter] =
    useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadServers = async () => {
    try {
      setError("");

      const response = await getServers();
      setServers(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError("Unable to load server information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServers();
  }, []);

  const handleCreateServer = async (formData) => {
    try {
      setSubmitting(true);

      const response = await createServer(formData);

      setServers((currentServers) => [
        response.data,
        ...currentServers,
      ]);

      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServers = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLowerCase();

    return servers.filter((server) => {
      const matchesSearch =
        !normalizedSearch ||
        server.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        server.hostname
          .toLowerCase()
          .includes(normalizedSearch) ||
        server.ip_address
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesProvider =
        !providerFilter ||
        server.provider === providerFilter;

      const matchesEnvironment =
        !environmentFilter ||
        server.environment === environmentFilter;

      const matchesStatus =
        !statusFilter ||
        server.status === statusFilter;

      return (
        matchesSearch &&
        matchesProvider &&
        matchesEnvironment &&
        matchesStatus
      );
    });
  }, [
    servers,
    searchTerm,
    providerFilter,
    environmentFilter,
    statusFilter,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setProviderFilter("");
    setEnvironmentFilter("");
    setStatusFilter("");
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="dashboard">
        <div className="dashboard-heading dashboard-heading-row">
          <div>
            <h2>Infrastructure Overview</h2>
            <p>
              Monitor server health, status, and resource usage.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Add Server
            </button>
          )}
        </div>

        {showForm && (
          <AddServerForm
            onSubmit={handleCreateServer}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
          />
        )}

        {loading && (
          <div className="message-box">
            Loading server information...
          </div>
        )}

        {error && (
          <div className="message-box error-message">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <SummaryCards servers={servers} />

            <section className="filter-card">
              <div className="filter-grid">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search by name, hostname, or IP"
                />

                <select
                  value={providerFilter}
                  onChange={(event) =>
                    setProviderFilter(event.target.value)
                  }
                >
                  <option value="">All providers</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                  <option value="DigitalOcean">
                    DigitalOcean
                  </option>
                  <option value="On-Prem">On-Prem</option>
                </select>

                <select
                  value={environmentFilter}
                  onChange={(event) =>
                    setEnvironmentFilter(event.target.value)
                  }
                >
                  <option value="">
                    All environments
                  </option>
                  <option value="development">
                    Development
                  </option>
                  <option value="staging">
                    Staging
                  </option>
                  <option value="production">
                    Production
                  </option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="">All statuses</option>
                  <option value="online">Online</option>
                  <option value="warning">Warning</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">
                    Maintenance
                  </option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              <div className="filter-footer">
                <span>
                  Showing {filteredServers.length} of{" "}
                  {servers.length} servers
                </span>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            </section>

            <ServerTable servers={filteredServers} />
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
