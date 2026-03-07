from db.clickhouse import get_client
from data.synthetic_data_generator import generate_rows, load_to_clickhouse
from data.generate_cohort import generate_cohort_baselines
from data.generate_grid import generate_grid_demand
import sqlite3, os

def reset_sqlite():
    db_path = os.path.join(os.path.dirname(__file__), "demo.db")
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
    print("SQLite reset OK")

def verify_clickhouse():
    client = get_client()
    counts = {
        "consumption": client.query("SELECT count() FROM cekcek.consumption").result_rows[0][0],
        "cohort_baselines": client.query("SELECT count() FROM cekcek.cohort_baselines").result_rows[0][0],
        "grid_demand": client.query("SELECT count() FROM cekcek.grid_demand").result_rows[0][0],
    }
    for table, count in counts.items():
        print(f"  {table}: {count:,} rows")
    return all(c > 0 for c in counts.values())

if __name__ == "__main__":
    print("=== Seeding SP Energy Pulse demo data ===")
    print("\n1. Resetting SQLite...")
    reset_sqlite()

    print("\n2. Loading ClickHouse data...")
    print("   consumption table...")
    rows = generate_rows()
    load_to_clickhouse(rows)
    print("   cohort baselines...")
    generate_cohort_baselines()
    print("   grid demand...")
    generate_grid_demand()

    print("\n3. Verifying row counts...")
    ok = verify_clickhouse()

    if ok:
        print("\nSeed complete. Demo is ready.")
    else:
        print("\nERROR: Some tables are empty. Check ClickHouse connection.")
