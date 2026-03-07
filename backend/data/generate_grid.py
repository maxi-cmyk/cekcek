import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from db.clickhouse import get_client

CAPACITY_MW = 10000

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
PEAK_DEMAND_MW = 7200

def generate_grid_demand():
    rows = []
    start = datetime(2025, 1, 1)
    for day in range(30):
        current = start + timedelta(days=day)
        day_type = "weekend" if current.weekday() >= 5 else "weekday"

        for slot in range(48):
            ts = current + timedelta(minutes=slot * 30)
            base_demand = PEAK_DEMAND_MW * DEMAND_PROFILE[slot]
            noise = np.random.normal(0, base_demand * 0.02)
            demand = max(4000, base_demand + noise)
            utilisation = (demand / CAPACITY_MW) * 100

            rows.append({
                "timestamp": ts,
                "demand_mw": round(demand, 1),
                "capacity_mw": float(CAPACITY_MW),
                "utilisation_pct": round(utilisation, 2),
                "time_slot": slot,
                "day_type": day_type
            })

    client = get_client()
    df = pd.DataFrame(rows)
    client.insert_df("cekcek.grid_demand", df)
    print(f"Loaded {len(rows)} grid demand rows")

if __name__ == "__main__":
    generate_grid_demand()
