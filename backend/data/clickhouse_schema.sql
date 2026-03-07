CREATE TABLE IF NOT EXISTS energy_usage (
    timestamp DateTime,
    user_id Int32,
    energy_kwh Float32,
    appliance_type String
) ENGINE = MergeTree()
ORDER BY (user_id, timestamp);
