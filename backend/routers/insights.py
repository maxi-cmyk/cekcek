from fastapi import APIRouter
import json
import os

router = APIRouter(prefix="/api/insights", tags=["insights"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "demo_outputs.json")

@router.get("/")
def get_insights():
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
        return {"data": data}
    except FileNotFoundError:
        return {"error": "Data file not found"}
