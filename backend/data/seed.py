"""
seed.py — SP Energy Pulse demo data seeder

Creates all ClickHouse tables if they don't exist, then loads
synthetic data. Safe to run multiple times — tables use
CREATE IF NOT EXISTS and data is truncated before reload.

Usage:
    cd backend
    python data/seed.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from db.clickhouse import get_client


# ── SCHEMA ────────────────────────────────────────────────────────────────────

TABLES = {
    "consumption": """
        CREATE TABLE IF NOT EXISTS CekCek.consumption
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
        PARTITION BY toYYYYMM(timestamp)
    """,
    "cohort_baselines": """
        CREATE TABLE IF NOT EXISTS CekCek.cohort_baselines
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
        ORDER BY (hdb_type, household_size, month, time_slot, day_type)
    """,
    "grid_demand": """
        CREATE TABLE IF NOT EXISTS CekCek.grid_demand
        (
            timestamp       DateTime,
            demand_mw       Float32,
            capacity_mw     Float32,
            utilisation_pct Float32,
            time_slot       UInt8,
            day_type        Enum8('weekday' = 1, 'weekend' = 2, 'public_holiday' = 3)
        )
        ENGINE = MergeTree()
        ORDER BY timestamp
    """,
    "appliance_signatures": """
        CREATE TABLE IF NOT EXISTS CekCek.appliance_signatures
        (
            appliance_name       String,
            tick_rating          UInt8,
            typical_watt_min     UInt16,
            typical_watt_max     UInt16,
            avg_daily_kwh        Float32,
            monthly_cost_sgd     Float32,
            monthly_cost_tou     Float32,
            spike_duration_slots UInt8
        )
        ENGINE = MergeTree()
        ORDER BY (appliance_name, tick_rating)
    """
}


# ── DATA GENERATORS ───────────────────────────────────────────────────────────

HOUSEHOLD_ID = "wei_ling_demo"
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 1, 31)

SEASONAL_MULTIPLIER = {
    1: 0.90, 2: 0.88, 3: 0.95,
    4: 1.15, 5: 1.20, 6: 1.18,
    7: 1.05, 8: 1.05, 9: 1.00,
    10: 0.95, 11: 0.92, 12: 0.93
}

WEEKDAY_PROFILE = [
    0.30, 0.28, 0.27, 0.26, 0.26, 0.27,
    0.30, 0.40, 0.65, 0.70, 0.60, 0.55,
    0.70, 0.85, 0.75, 0.65, 0.60, 0.58,
    0.50, 0.45, 0.42, 0.40, 0.40, 0.42,
    0.55, 0.60, 0.55, 0.50, 0.48, 0.48,
    0.50, 0.52, 0.55, 0.58, 0.60, 0.65,
    0.80, 1.00, 1.10, 1.15, 1.10, 1.05,
    0.95, 0.85, 0.75, 0.65, 0.55, 0.45
]

WEEKEND_PROFILE = [
    0.35, 0.30, 0.28, 0.27, 0.27, 0.28,
    0.32, 0.38, 0.55, 0.70, 0.80, 0.85,
    0.90, 0.85, 0.80, 0.75, 0.70, 0.68,
    0.65, 0.70, 0.72, 0.70, 0.68, 0.65,
    0.68, 0.72, 0.75, 0.78, 0.80, 0.82,
    0.88, 0.95, 1.05, 1.10, 1.08, 1.05,
    0.98, 0.90, 0.82, 0.72, 0.60, 0.48,
    0.42, 0.38, 0.34, 0.32, 0.30, 0.28
]

BASE_KWH = 0.45

SPIKE_EVENTS = {
    ("2024-11-14", 28): 2.0,
    ("2024-10-22", 38): 1.5,
    ("2024-09-07", 24): 1.8,
    ("2024-08-19", 34): 2.2,
    ("2024-07-03", 40): 1.2,
    ("2024-05-28", 30): 1.6,
    ("2024-04-11", 36): 1.9,
    ("2024-02-20", 22): 1.3,
}

PUBLIC_HOLIDAYS = {
    "2024-02-10", "2024-04-10", "2024-05-01", "2024-05-23",
    "2024-08-09", "2024-10-31", "2024-12-25", "2025-01-01"
}

DEMAND_PROFILE = [
    0.62, 0.60, 0.58, 0.57, 0.57, 0.58,
    0.60, 0.63, 0.70, 0.76, 0.78, 0.78,
    0.79, 0.82, 0.80, 0.78, 0.76, 0.74,
    0.74, 0.75, 0.76, 0.77, 0.77, 0.77,
    0.79, 0.81, 0.80, 0.79, 0.78, 0.77,
    0.77, 0.78, 0.79, 0.80, 0.82, 0.85,
    0.88, 0.92, 0.96, 0.98, 0.97, 0.95,
    0.91, 0.87, 0.82, 0.76, 0.70, 0.65
]

APPLIANCE_DATA = [
    ("aircon",           2, 900,  1800, 4.2,  38.0, 28.0, 4),
    ("fridge",           1, 80,   150,  1.8,  16.2, 14.0, 2),
    ("washing_machine",  3, 400,  800,  0.9,  8.1,  5.5,  3),
    ("dryer",            2, 1500, 2500, 1.5,  13.5, 9.0,  3),
    ("water_heater",     3, 2000, 3500, 1.2,  10.8, 7.5,  1),
    ("oven",             2, 1000, 2000, 0.6,  5.4,  3.8,  2),
    ("ev_charger",       4, 3000, 7200, 6.0,  54.0, 35.0, 6),
    ("standby_load",     0, 50,   150,  2.4,  21.6, 18.0, 0),
]


def get_day_type(dt):
    if dt.strftime("%Y-%m-%d") in PUBLIC_HOLIDAYS:
        return "public_holiday"
    return "weekend" if dt.weekday() >= 5 else "weekday"


def generate_consumption():
    rows = []
    current = START_DATE
    while current <= END_DATE:
        day_type = get_day_type(current)
        profile = WEEKEND_PROFILE if day_type != "weekday" else WEEKDAY_PROFILE
        seasonal = SEASONAL_MULTIPLIER[current.month]
        date_str = current.strftime("%Y-%m-%d")

        for slot in range(48):
            ts = current + timedelta(minutes=slot * 30)
            base = BASE_KWH * profile[slot] * seasonal
            noise = np.random.normal(0, base * 0.08)
            kwh = max(0.05, base + noise)
            kwh += SPIKE_EVENTS.get((date_str, slot), 0)

            rows.append({
                "household_id": HOUSEHOLD_ID,
                "timestamp": ts,
                "kwh": round(float(kwh), 4),
                "day_type": day_type,
                "time_slot": slot,
                "month": current.month,
                "year": current.year
            })

        current += timedelta(days=1)
    return rows


def generate_cohort():
    rows = []
    for month in range(1, 13):
        seasonal = SEASONAL_MULTIPLIER[month]
        for slot in range(48):
            for day_type in ["weekday", "weekend"]:
                base = BASE_KWH * seasonal
                samples = np.random.normal(base, base * 0.25, 500)
                samples = np.clip(samples, 0.05, None)
                rows.append({
                    "hdb_type": "4-room",
                    "household_size": 4,
                    "month": month,
                    "time_slot": slot,
                    "day_type": day_type,
                    "p25_kwh": round(float(np.percentile(samples, 25)), 4),
                    "p50_kwh": round(float(np.percentile(samples, 50)), 4),
                    "p75_kwh": round(float(np.percentile(samples, 75)), 4),
                    "p90_kwh": round(float(np.percentile(samples, 90)), 4),
                    "mean_kwh": round(float(np.mean(samples)), 4),
                    "sample_size": 500
                })
    return rows


def generate_grid():
    rows = []
    start = datetime(2025, 1, 1)
    for day in range(30):
        current = start + timedelta(days=day)
        day_type = get_day_type(current)
        for slot in range(48):
            ts = current + timedelta(minutes=slot * 30)
            base = 7200 * DEMAND_PROFILE[slot]
            noise = np.random.normal(0, base * 0.02)
            demand = max(4000, base + noise)
            capacity = 10000.0
            rows.append({
                "timestamp": ts,
                "demand_mw": round(float(demand), 1),
                "capacity_mw": capacity,
                "utilisation_pct": round(float(demand / capacity * 100), 2),
                "time_slot": slot,
                "day_type": day_type
            })
    return rows


def generate_appliances():
    return [
        {
            "appliance_name": row[0],
            "tick_rating": row[1],
            "typical_watt_min": row[2],
            "typical_watt_max": row[3],
            "avg_daily_kwh": row[4],
            "monthly_cost_sgd": row[5],
            "monthly_cost_tou": row[6],
            "spike_duration_slots": row[7]
        }
        for row in APPLIANCE_DATA
    ]


# ── SQLITE RESET ──────────────────────────────────────────────────────────────

def reset_sqlite(db_path="demo.db"):
    if os.path.exists(db_path):
        os.remove(db_path)
    conn = sqlite3.connect(db_path)
    conn.executescript("""
        CREATE TABLE user (
            id INTEGER PRIMARY KEY,
            name TEXT DEFAULT 'Wei Ling',
            hdb_type TEXT DEFAULT '4-room',
            household_size INTEGER DEFAULT 4,
            tou_enrolled INTEGER DEFAULT 0,
            analogy_persona TEXT DEFAULT 'commuter',
            analogy_unit TEXT DEFAULT 'bubble_tea',
            grid_familiarity TEXT DEFAULT 'low',
            onboarding_complete INTEGER DEFAULT 0
        );
        INSERT INTO user DEFAULT VALUES;

        CREATE TABLE points (
            id INTEGER PRIMARY KEY,
            total INTEGER DEFAULT 0,
            last_updated TEXT
        );
        INSERT INTO points (total) VALUES (0);

        CREATE TABLE badges (
            id TEXT PRIMARY KEY,
            earned INTEGER DEFAULT 0,
            earned_at TEXT
        );
        INSERT INTO badges VALUES ('grid_hero', 0, NULL);
        INSERT INTO badges VALUES ('streak_7', 0, NULL);
        INSERT INTO badges VALUES ('first_label', 0, NULL);

        CREATE TABLE spike_labels (
            spike_id TEXT PRIMARY KEY,
            appliance TEXT,
            labelled_at TEXT
        );

        CREATE TABLE appliance_profile (
            appliance_name TEXT PRIMARY KEY,
            tick_rating INTEGER,
            logged_at TEXT
        );
        INSERT INTO appliance_profile VALUES ('aircon', 2, '2023-06-01');
        INSERT INTO appliance_profile VALUES ('fridge', 1, '2018-03-15');
        INSERT INTO appliance_profile VALUES ('washing_machine', 3, '2021-09-10');
    """)
    conn.commit()
    conn.close()


# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    client = get_client()

    print("=" * 50)
    print("SP Energy Pulse — Demo Seeder")
    print("=" * 50)

    # ── 1. Create tables ──────────────────────────────
    print("\n[1/6] Creating tables...")
    for name, sql in TABLES.items():
        try:
            client.command(sql)
            print(f"  ✓ {name}")
        except Exception as e:
            print(f"  ✗ {name}: {e}")
            sys.exit(1)

    # ── 2. Truncate existing data ─────────────────────
    print("\n[2/6] Clearing existing data...")
    for name in TABLES:
        try:
            client.command(f"TRUNCATE TABLE IF EXISTS CekCek.{name}")
            print(f"  ✓ {name} cleared")
        except Exception as e:
            print(f"  ✗ Could not clear {name}: {e}")

    # ── 3. Load consumption ───────────────────────────
    print("\n[3/6] Generating consumption data (13 months)...")
    rows = generate_consumption()
    print(f"  Generated {len(rows):,} rows")
    df = pd.DataFrame(rows)
    batch_size = 5000
    for i in range(0, len(df), batch_size):
        client.insert_df("CekCek.consumption", df.iloc[i:i+batch_size])
    print(f"  ✓ Loaded consumption")

    # ── 4. Load cohort baselines ──────────────────────
    print("\n[4/6] Generating cohort baselines...")
    rows = generate_cohort()
    print(f"  Generated {len(rows):,} rows")
    client.insert_df("CekCek.cohort_baselines", pd.DataFrame(rows))
    print(f"  ✓ Loaded cohort_baselines")

    # ── 5. Load grid demand ───────────────────────────
    print("\n[5/6] Generating grid demand data (30 days)...")
    rows = generate_grid()
    client.insert_df("CekCek.grid_demand", pd.DataFrame(rows))
    print(f"  ✓ Loaded grid_demand ({len(rows):,} rows)")

    # Load appliance signatures
    rows = generate_appliances()
    client.insert_df("CekCek.appliance_signatures", pd.DataFrame(rows))
    print(f"  ✓ Loaded appliance_signatures ({len(rows)} rows)")

    # ── 6. Reset SQLite ───────────────────────────────
    print("\n[6/6] Resetting SQLite demo state...")
    reset_sqlite()
    print("  ✓ demo.db reset")

    # ── Verify ────────────────────────────────────────
    print("\nVerifying row counts...")
    tables_to_check = ["consumption", "cohort_baselines", "grid_demand", "appliance_signatures"]
    all_ok = True
    for table in tables_to_check:
        count = client.query(
            f"SELECT count() FROM CekCek.{table}"
        ).result_rows[0][0]
        status = "✓" if count > 0 else "✗ EMPTY"
        print(f"  {status}  {table}: {count:,} rows")
        if count == 0:
            all_ok = False

    print()
    if all_ok:
        print("✓ Seed complete. Demo is ready.")
        print("  Run: uvicorn main:app --reload")
    else:
        print("✗ Some tables are empty. Check the errors above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
