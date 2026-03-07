import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from db.clickhouse import get_client

HOUSEHOLD_ID = "wei_ling_demo"
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 1, 31)

# Seasonal multipliers — April-June is hotter, more aircon
SEASONAL_MULTIPLIER = {
    1: 0.90, 2: 0.88, 3: 0.95,
    4: 1.15, 5: 1.20, 6: 1.18,
    7: 1.05, 8: 1.05, 9: 1.00,
    10: 0.95, 11: 0.92, 12: 0.93
}

# Typical weekday half-hourly profile (slot 0 = midnight)
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
    0.98, 0.90, 0.82, 0.72, 0.60, 0.48
]

BASE_KWH = 0.45

# Spike events
SPIKE_EVENTS = [
    {"date": "2024-11-14", "slot": 28, "kwh_extra": 2.0, "appliance": "aircon"},
    {"date": "2024-10-22", "slot": 38, "kwh_extra": 1.5, "appliance": "dryer"},
    {"date": "2024-09-07", "slot": 24, "kwh_extra": 1.8, "appliance": "water_heater"},
    {"date": "2024-08-19", "slot": 34, "kwh_extra": 2.2, "appliance": "aircon"},
    {"date": "2024-07-03", "slot": 40, "kwh_extra": 1.2, "appliance": "oven"},
    {"date": "2024-05-28", "slot": 30, "kwh_extra": 1.6, "appliance": "aircon"},
    {"date": "2024-04-11", "slot": 36, "kwh_extra": 1.9, "appliance": "dryer"},
    {"date": "2024-02-20", "slot": 22, "kwh_extra": 1.3, "appliance": "water_heater"},
]

def get_day_type(dt):
    ph = ["2024-02-10", "2024-04-10", "2024-05-01", "2024-05-23",
          "2024-08-09", "2024-10-31", "2024-12-25", "2025-01-01"]
    if dt.strftime("%Y-%m-%d") in ph:
        return "public_holiday"
    return "weekend" if dt.weekday() >= 5 else "weekday"

def generate_rows():
    rows = []
    spike_lookup = {
        (s["date"], s["slot"]): s["kwh_extra"]
        for s in SPIKE_EVENTS
    }

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

            spike_extra = spike_lookup.get((date_str, slot), 0)
            kwh += spike_extra

            rows.append({
                "household_id": HOUSEHOLD_ID,
                "timestamp": ts,
                "kwh": round(kwh, 4),
                "day_type": day_type,
                "time_slot": slot,
                "month": current.month,
                "year": current.year
            })

        current += timedelta(days=1)

    return rows

def load_to_clickhouse(rows):
    client = get_client()
    df = pd.DataFrame(rows)

    batch_size = 5000
    for i in range(0, len(df), batch_size):
        batch = df.iloc[i:i+batch_size]
        client.insert_df("sp_energy_pulse.consumption", batch)
        print(f"Inserted rows {i}–{i+len(batch)}")

    print(f"Total rows loaded: {len(rows)}")

if __name__ == "__main__":
    print("Generating synthetic data...")
    rows = generate_rows()
    print(f"Generated {len(rows)} rows. Loading to ClickHouse...")
    load_to_clickhouse(rows)
    print("Done.")
