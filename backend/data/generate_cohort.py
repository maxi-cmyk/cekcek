import numpy as np
import pandas as pd
from db.clickhouse import get_client

def generate_cohort_baselines():
    rows = []
    for month in range(1, 13):
        seasonal = {1:0.90,2:0.88,3:0.95,4:1.15,5:1.20,6:1.18,
                    7:1.05,8:1.05,9:1.00,10:0.95,11:0.92,12:0.93}[month]

        for slot in range(48):
            for day_type in ["weekday", "weekend"]:
                base = 0.45 * seasonal
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

    client = get_client()
    df = pd.DataFrame(rows)
    client.insert_df("cekcek.cohort_baselines", df)
    print(f"Loaded {len(rows)} cohort baseline rows")

if __name__ == "__main__":
    generate_cohort_baselines()
