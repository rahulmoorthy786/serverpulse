BEGIN;

CREATE TABLE IF NOT EXISTS servers (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    hostname VARCHAR(255) NOT NULL,
    ip_address INET NOT NULL,

    provider VARCHAR(100),
    environment VARCHAR(50) NOT NULL,
    operating_system VARCHAR(150),

    status VARCHAR(20) NOT NULL DEFAULT 'unknown',

    cpu_usage NUMERIC(5,2) DEFAULT 0,
    memory_usage NUMERIC(5,2) DEFAULT 0,
    disk_usage NUMERIC(5,2) DEFAULT 0,

    uptime_seconds BIGINT DEFAULT 0,

    last_checked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT servers_status_check
        CHECK (
            status IN (
                'online',
                'offline',
                'warning',
                'maintenance',
                'unknown'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_servers_status
ON servers(status);

CREATE INDEX IF NOT EXISTS idx_servers_environment
ON servers(environment);

CREATE INDEX IF NOT EXISTS idx_servers_created_at
ON servers(created_at DESC);

COMMIT;
