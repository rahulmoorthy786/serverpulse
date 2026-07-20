import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getServers = async () => {
  const response = await api.get("/servers");
  return response.data;
};

export const getServerById = async (id) => {
  const response = await api.get(`/servers/${id}`);
  return response.data;
};

export const getServerMetrics = async (id, limit = 120) => {
  const response = await api.get(
    `/servers/${id}/metrics?limit=${limit}`
  );

  return response.data;
};

export const getAlerts = async (status = "") => {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : "";

  const response = await api.get(`/servers/alerts${query}`);

  return response.data;
};

export const acknowledgeAlert = async (id) => {
  const response = await api.patch(
    `/servers/alerts/${id}/acknowledge`
  );

  return response.data;
};

export const createServer = async (serverData) => {
  const response = await api.post("/servers", serverData);
  return response.data;
};

export default api;
