# 🚀 ServerPulse

ServerPulse is a full-stack infrastructure monitoring platform built to simulate how modern monitoring systems collect, store, and visualize server health metrics.

The project started as a way to practice building a complete three-tier application, but it has grown into a portfolio project that demonstrates both software development and DevOps practices.

ServerPulse monitors Linux servers, stores historical metrics in PostgreSQL, generates alerts when resource thresholds are exceeded, and presents everything through a responsive web dashboard.

---

# Architecture

```
                 Linux Server
                      │
                      │
              Metrics Collector
                      │
                      ▼
             Express REST API
                      │
                      ▼
                 PostgreSQL
                      │
                      ▼
             React Dashboard
```

The application consists of five logical components:

- **Collector** – Collects system metrics from Linux servers.
- **Backend API** – Stores metrics and exposes REST endpoints.
- **Database** – Persists server information, historical metrics, and alerts.
- **Frontend** – Displays infrastructure health through an interactive dashboard.
- **Future AI Layer** – Will provide intelligent incident summaries using Ollama.

---

# Features

## Dashboard

- Server inventory
- Infrastructure overview
- Search and filtering
- Responsive layout
- Dark mode

## Monitoring

ServerPulse collects:

- CPU Usage
- Memory Usage
- Disk Usage
- Network Receive
- Network Transmit
- Running Processes
- Load Average (1m / 5m / 15m)
- Filesystem Usage
- Server Status
- Last Check Time
- System Uptime

---

## Historical Metrics

Every metric update is stored inside PostgreSQL.

The dashboard displays historical charts for:

- CPU
- Memory
- Disk

Charts refresh automatically every 30 seconds.

---

## Alert System

ServerPulse automatically generates alerts whenever configured thresholds are exceeded.

Current capabilities include:

- Alert history
- Alert acknowledgement
- Alert status tracking
- Alert severity

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- React Router
- Recharts

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL

## Monitoring

- Custom Metrics Collector

---

# Project Structure

```
serverpulse
│
├── frontend/          React Dashboard
├── backend/           Express REST API
├── collector/         Linux Metrics Collector
├── database/          SQL schema
├── docker/            Docker files (coming soon)
├── k8s/               Kubernetes manifests (coming soon)
└── README.md
```

---

# Getting Started

## Requirements

- Git
- Node.js
- PostgreSQL

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/serverpulse.git

cd serverpulse
```

---

## Backend

```bash
cd backend

npm install

npm start
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Collector

```bash
cd collector

npm install

node collector.js
```

---

# REST API

## Servers

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/servers` | List all servers |
| POST | `/servers` | Create a server |
| GET | `/servers/:id` | Get server details |
| PATCH | `/servers/:id/status` | Update server status |
| PATCH | `/servers/:id/metrics` | Store collected metrics |
| GET | `/servers/:id/metrics` | Retrieve historical metrics |

---

## Alerts

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/alerts` | List alerts |
| PATCH | `/alerts/:id/acknowledge` | Acknowledge an alert |

---

## Health

| Method | Endpoint |
|---------|----------|
| GET | `/health` |

---

# Screenshots

Screenshots will be added as the project evolves.

- Dashboard
- Server Details
- Historical Charts
- Alerts
- Dark Mode

---

# Roadmap

## Application

- [x] Server Inventory
- [x] Historical Metrics
- [x] Charts
- [x] Search
- [x] Filtering
- [x] Dark Mode
- [x] Alert System
- [x] Filesystem Monitoring

---

## Docker

- [ ] Dockerfile
- [ ] Multi-stage Docker Build
- [ ] Docker Compose

---

## DevSecOps

- [ ] ESLint
- [ ] Unit Tests
- [ ] SonarQube
- [ ] Gitleaks
- [ ] npm audit
- [ ] Trivy Filesystem Scan
- [ ] Trivy Image Scan

---

## CI/CD

- [ ] GitHub Actions
- [ ] Docker Hub Push
- [ ] Automated Deployment

---

## Kubernetes

- [ ] Namespace
- [ ] ConfigMap
- [ ] Secret
- [ ] Deployment
- [ ] Service
- [ ] Ingress
- [ ] Persistent Volume
- [ ] Horizontal Pod Autoscaler

---

## AI

- [ ] Ollama Integration
- [ ] AI Incident Summary
- [ ] Root Cause Suggestions

---

# Future Improvements

Some ideas planned for future releases include:

- Email notifications
- Slack notifications
- Microsoft Teams notifications
- User authentication
- Role-Based Access Control (RBAC)
- Multiple organizations
- Server auto-discovery
- Predictive alerting using AI

---

# Why I Built This

I wanted a project that would let me practice more than just writing application code.

ServerPulse gives me a place to work with backend development, frontend development, databases, Docker, CI/CD, DevSecOps, Kubernetes, cloud deployment, and AI in a single project. As the project grows, the infrastructure around it will evolve alongside the application.

---

# License

This project is licensed under the MIT License.
