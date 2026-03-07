from db.clickhouse import get_client

TABLES = [
    """
    CREATE TABLE IF NOT EXISTS sp_energy_pulse.consumption
    (
        household_id   String,
        timestamp      DateTime,
        kwh            Float32,
        day_type       Enum8('weekday' = 1, 'weekend' = 2, 'public_holiday' = 3),
        time_slot      UInt8,
        month          UInt8,
        year           UInt16
    )
    ENGINE = MergeTree()
    ORDER BY (household_id, timestamp)
    PARTITION BY toYYYYMM(timestamp);
    """,
    """
    CREATE TABLE IF NOT EXISTS sp_energy_pulse.cohort_baselines
    (
        hdb_type       String,
        household_size UInt8,
        month          UInt8,
        time_slot      UInt8,
        day_type       Enum8('weekday' = 1, 'weekend' = 2, 'public_holiday' = 3),
        p25_kwh        Float32,
        p50_kwh        Float32,
        p75_kwh        Float32,
        p90_kwh        Float32,
        mean_kwh       Float32,
        sample_size    UInt32
    )
    ENGINE = MergeTree()
    ORDER BY (hdb_type, household_size, month, time_slot, day_type);
    """,
    """
    CREATE TABLE IF NOT EXISTS sp_energy_pulse.grid_demand
    (
        timestamp      DateTime,
        demand_mw      Float32,
        capacity_mw    Float32,
        utilisation_pct Float32,
        time_slot      UInt8,
        day_type       Enum8('weekday' = 1, 'weekend' = 2, 'public_holiday' = 3)
    )
    ENGINE = MergeTree()
    ORDER BY timestamp;
    """,
    """
    CREATE TABLE IF NOT EXISTS sp_energy_pulse.appliance_signatures
    (
        appliance_name     String,
        tick_rating        UInt8,
        typical_watt_min   UInt16,
        typical_watt_max   UInt16,
        avg_daily_kwh      Float32,
        monthly_cost_sgd   Float32,
        monthly_cost_tou   Float32,
        spike_duration_slots UInt8
    )
    ENGINE = MergeTree()
    ORDER BY (appliance_name, tick_rating);
    """
]

if __name__ == "__main__":
    client = get_client()
    for sql in TABLES:
        client.command(sql)
        print("Created table OK")
    print("Migration complete")
