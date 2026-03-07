import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "demo.db")

def reset_demo_state():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DROP TABLE IF EXISTS demo_state")
    cursor.execute("CREATE TABLE demo_state (key TEXT PRIMARY KEY, value TEXT)")
    conn.commit()
    conn.close()
    print("Demo state reset.")

if __name__ == "__main__":
    reset_demo_state()
