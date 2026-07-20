CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hostname VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET NOT NULL,
    provider VARCHAR(100),
    environment VARCHAR(30) NOT NULL
        CHECK (environment IN ('development', 'staging', 'production')),
    operating_system VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'unknown'
        CHECK (status IN ('online', 'offline', 'warning', 'maintenance', 'unknown')),
    cpu_usage NUMERIC(5, 2) DEFAULT 0
        CHECK (cpu_usage >= 0 AND cpu_usage <= 100),
    memory_usage NUMERIC(5, 2) DEFAULT 0
        CHECK (memory_usage >= 0 AND memory_usage <= 100),
    disk_usage NUMERIC(5, 2) DEFAULT 0
        CHECK (disk_usage >= 0 AND disk_usage <= 100),
    uptime_seconds BIGINT DEFAULT 0,
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
