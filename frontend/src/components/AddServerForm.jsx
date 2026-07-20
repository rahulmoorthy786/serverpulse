import { useState } from "react";

const initialForm = {
  name: "",
  hostname: "",
  ipAddress: "",
  provider: "",
  environment: "production",
  operatingSystem: "",
};

function AddServerForm({ onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (
      !formData.name.trim() ||
      !formData.hostname.trim() ||
      !formData.ipAddress.trim()
    ) {
      setFormError(
        "Server name, hostname, and IP address are required."
      );
      return;
    }

    try {
      await onSubmit(formData);
      setFormData(initialForm);
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
          "Unable to add the server."
      );
    }
  };

  return (
    <section className="form-card">
      <div className="form-heading">
        <div>
          <h2>Add Server</h2>
          <p>Add a server to the infrastructure inventory.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      <form className="server-form" onSubmit={handleSubmit}>
        {formError && (
          <div className="form-error">{formError}</div>
        )}

        <div className="form-grid">
          <label>
            <span>Server name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Production API Server"
            />
          </label>

          <label>
            <span>Hostname</span>
            <input
              type="text"
              name="hostname"
              value={formData.hostname}
              onChange={handleChange}
              placeholder="api-01.serverpulse.local"
            />
          </label>

          <label>
            <span>IP address</span>
            <input
              type="text"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder="172.31.10.25"
            />
          </label>

          <label>
            <span>Provider</span>
            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
            >
              <option value="">Select provider</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
              <option value="GCP">GCP</option>
              <option value="DigitalOcean">
                DigitalOcean
              </option>
              <option value="On-Prem">On-Prem</option>
            </select>
          </label>

          <label>
            <span>Environment</span>
            <select
              name="environment"
              value={formData.environment}
              onChange={handleChange}
            >
              <option value="development">
                Development
              </option>
              <option value="staging">Staging</option>
              <option value="production">
                Production
              </option>
            </select>
          </label>

          <label>
            <span>Operating system</span>
            <input
              type="text"
              name="operatingSystem"
              value={formData.operatingSystem}
              onChange={handleChange}
              placeholder="Ubuntu 24.04 LTS"
            />
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Adding server..." : "Add Server"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddServerForm;
