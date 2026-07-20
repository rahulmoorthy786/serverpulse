BEGIN;

ALTER TABLE servers
ADD COLUMN IF NOT EXISTS network_rx_bytes BIGINT,
ADD COLUMN IF NOT EXISTS network_tx_bytes BIGINT,
ADD COLUMN IF NOT EXISTS process_count INTEGER,
ADD COLUMN IF NOT EXISTS load_average_1 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS load_average_5 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS load_average_15 NUMERIC(8,2),
ADD COLUMN IF NOT EXISTS filesystems JSONB DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS server_metrics (
    id BIGSERIAL PRIMARY KEY,
    server_id INTEGER NOT NULL
        REFERENCES servers(id)
        ON DELETE CASCADE,

    cpu_usage NUMERIC(5,2) NOT NULL,
    memory_usage NUMERIC(5,2) NOT NULL,
    disk_usage NUMERIC(5,2) NOT NULL,

    uptime_seconds BIGINT NOT NULL,

    network_rx_bytes BIGINT DEFAULT 0,
    network_tx_bytes BIGINT DEFAULT 0,

    process_count INTEGER DEFAULT 0,

    load_average_1 NUMERIC(8,2) DEFAULT 0,
    load_average_5 NUMERIC(8,2) DEFAULT 0,
    load_average_15 NUMERIC(8,2) DEFAULT 0,

    filesystems JSONB DEFAULT '[]'::jsonb,

    collected_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_server_metrics_server_time
ON server_metrics(server_id, collected_at DESC);

CREATE TABLE IF NOT EXISTS alerts (
    id BIGSERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL
        REFERENCES servers(id)
        ON DELETE CASCADE,

    alert_type VARCHAR(50) NOT NULL,

    severity VARCHAR(20) NOT NULL
        DEFAULT 'warning',

    message TEXT NOT NULL,

    threshold_value NUMERIC(10,2),
    current_value NUMERIC(10,2),

    status VARCHAR(20) NOT NULL
        DEFAULT 'open',

    created_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_alerts_server
ON alerts(server_id);

CREATE INDEX IF NOT EXISTS idx_alerts_status
ON alerts(status);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_open_alert
ON alerts(server_id, alert_type)
WHERE status = 'open';

COMMIT;
