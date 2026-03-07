from fastapi import APIRouter

from db.clickhouse import query

router = APIRouter(prefix="/api/consumption", tags=["consumption"])


@router.get("/")
def get_latest_consumption():
    rows = list(query(
        """
        SELECT
            household_id,
            timestamp,
            kwh,
            day_type,
            time_slot,
            month,
            year
        FROM consumption
        WHERE toDate(timestamp) = (SELECT max(toDate(timestamp)) FROM consumption)
        ORDER BY timestamp ASC
        """
    ))
    return {
        "count": len(rows),
        "rows": [
            {
                **r,
                "timestamp": r["timestamp"].isoformat(),
                "hour": r["timestamp"].hour,
                "minute": r["timestamp"].minute,
            }
            for r in rows
        ],
    }
