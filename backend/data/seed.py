import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "demo.db")

try:
    from data.synthetic_data_generator import generate_demo_payload, save_demo_payload
except ModuleNotFoundError:
    from synthetic_data_generator import generate_demo_payload, save_demo_payload

def reset_demo_state():
    payload = generate_demo_payload()
    save_demo_payload(payload)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS demo_state")
    cursor.execute("CREATE TABLE demo_state (key TEXT PRIMARY KEY, value TEXT)")
    cursor.executemany(
        "INSERT INTO demo_state (key, value) VALUES (?, ?)",
        [
            ("journey_date", payload["journey_date"]),
            ("generated_with", payload["generated_with"]),
            ("generated_at", payload["generated_at"]),
            ("payload", json.dumps(payload)),
        ],
    )
    conn.commit()
    conn.close()
    print(f"Demo state reset with {payload['generated_with']} data.")

if __name__ == "__main__":
    reset_demo_state()
