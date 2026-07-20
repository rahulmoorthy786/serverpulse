# ServerPulse — Infrastructure Monitoring Dashboard

ServerPulse is a simple infrastructure monitoring application built to understand how different parts of a modern application work together.

Instead of monitoring websites or containers, ServerPulse monitors Linux servers.

It collects system information such as CPU usage, memory usage, disk usage, uptime, network traffic, load averages and running processes, stores everything in PostgreSQL, and displays the information through a React dashboard.

The goal of this project isn't to compete with tools like Prometheus or Grafana. It's to understand how a monitoring system is built from the ground up.

Four services work together:

```
Browser
   │
   ▼
Frontend (React)
   │
   ▼
Backend API (Express)
   │
   ▼
PostgreSQL
   ▲
   │
Agent (Metrics Collector)
```

Each service has a specific job.

- **Frontend** – Displays the dashboard and communicates with the backend API.
- **Backend** – Handles API requests, stores server information and metrics, and returns data to the frontend.
- **PostgreSQL** – Stores servers, historical metrics, and alerts.
- **Agent** – Runs on Linux machines, collects system metrics, and sends them to the backend at regular intervals.

The services are independent, which makes the project easier to understand, test, and deploy.

---

# What you'll need

You don't need to install Node.js or PostgreSQL directly on your machine.

Everything will eventually run inside Docker containers.

The only requirements are:

- Docker
- Docker Compose

We'll first run everything manually so it's easier to understand how the services communicate.

After that, Docker Compose will automate the whole setup.

---

# Project Structure

```
serverpulse/
│
├── frontend/          React dashboard
├── backend/           Express REST API
├── agent/             Linux metrics collector
├── init/
│   └── postgres/      Database schema and seed data
│
├── docker-compose.yml
├── .env.example
├── Makefile
└── README.md
```

---

# Part 1 — Running everything manually

Before using Docker Compose, we'll build and run every service ourselves.

Doing it manually helps explain what Docker Compose is actually doing behind the scenes.

We'll build each image, create a network, start every container, and finally connect them together.

By the end of this section you'll understand:

- why Docker networks exist
- how containers discover each other
- why environment variables are needed
- how the frontend communicates with the backend
- how the backend communicates with PostgreSQL
- how the monitoring agent sends metrics to the API

After you've done it once manually, Docker Compose will make much more sense.

## Step 1 — Clone the repository

```bash
git clone https://github.com/rahulmoorthy786/serverpulse.git

cd serverpulse
```

---

## Step 2 — Build the backend image

```bash
docker build -t serverpulse-backend ./backend
```

This builds the Express API image.

---

## Step 3 — Build the frontend image

```bash
docker build -t serverpulse-frontend ./frontend
```

This builds the React dashboard.

---

## Step 4 — Build the agent image

```bash
docker build -t serverpulse-agent ./agent
```

This builds the Linux metrics collector.

---

## Step 5 — Create a Docker network

```bash
docker network create serverpulse-net
```

All four containers will join this network so they can communicate using container names instead of IP addresses.
