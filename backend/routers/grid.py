from fastapi import APIRouter
from openai import OpenAI

from config import settings
from db.clickhouse import query

router = APIRouter(prefix="/api/grid", tags=["grid"])


def _build_summary(timeline: list, grid_status: dict) -> str:
    """Call OpenAI to produce a plain-English grid summary from real data."""
    # Condense timeline to hourly averages to keep prompt short
    hourly = {}
    for t in timeline:
        h = t["hour"]
        hourly.setdefault(h, []).append(t["utilisation_pct"])
    hourly_avg = {h: round(sum(v) / len(v), 1) for h, v in hourly.items()}

    peak_hour = max(hourly_avg, key=hourly_avg.get)
    low_hour  = min(hourly_avg, key=hourly_avg.get)

    prompt = f"""You are an energy advisor for a Singapore household electricity app.
Given this real Singapore grid data for today, write a SHORT (2–3 sentence) plain-English summary
a regular person would understand. Be specific with the numbers. Do NOT use jargon.
Mention what time demand peaks and what a household can do about it.

Data:
- Current utilisation: {grid_status['stress_score']}% ({grid_status['current_level']} load)
- Current demand: {grid_status['demand_mw']} MW out of {grid_status['capacity_mw']} MW capacity
- Peak utilisation hour: {peak_hour}:00 ({hourly_avg[peak_hour]}%)
- Lowest utilisation hour: {low_hour}:00 ({hourly_avg[low_hour]}%)
- Peak window: {grid_status['peak_window']}
- Day type: {timeline[0]['day_type']}

Write only the summary, no headings or bullet points."""

    client = OpenAI(api_key=settings.openai_api_key)
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=120,
        temperature=0.5,
    )
    return resp.choices[0].message.content.strip()


@router.get("/")
def get_grid_demand():
    # Latest full day from ClickHouse
    rows = list(query(
        """
        SELECT
            timestamp,
            demand_mw,
            capacity_mw,
            utilisation_pct,
            time_slot,
            day_type
        FROM grid_demand
        WHERE toDate(timestamp) = (SELECT max(toDate(timestamp)) FROM grid_demand)
        ORDER BY timestamp ASC
        """
    ))

    if not rows:
        return {"grid_status": None, "timeline": []}

    timeline = [
        {
            "timestamp": r["timestamp"].isoformat(),
            "hour": r["timestamp"].hour,
            "minute": r["timestamp"].minute,
            "demand_mw": round(r["demand_mw"], 1),
            "capacity_mw": round(r["capacity_mw"], 1),
            "utilisation_pct": round(r["utilisation_pct"], 1),
            "time_slot": r["time_slot"],
            "day_type": r["day_type"],
        }
        for r in rows
    ]

    # Derive current status from the last slot
    latest = timeline[-1]
    util = latest["utilisation_pct"]
    current_level = "High" if util >= 65 else "Moderate" if util >= 52 else "Low"

    # Find peak window (highest 4 consecutive slots = 2 hrs)
    max_util = max(t["utilisation_pct"] for t in timeline)
    peak_slot = next(t for t in timeline if t["utilisation_pct"] == max_util)
    peak_hour = peak_slot["hour"]
    def fmt(h): return f"{h % 12 or 12}{'am' if h < 12 else 'pm'}"
    peak_window = f"{fmt(peak_hour)} – {fmt(peak_hour + 2)}"

    grid_status = {
        "current_level": current_level,
        "stress_score": round(util),
        "peak_window": peak_window,
        "demand_mw": latest["demand_mw"],
        "capacity_mw": latest["capacity_mw"],
    }

    try:
        summary = _build_summary(timeline, grid_status)
    except Exception:
        summary = (
            f"The grid is currently at {round(util)}% utilisation ({current_level} load), "
            f"drawing {latest['demand_mw']} MW of its {latest['capacity_mw']} MW capacity. "
            f"Peak demand occurs around {peak_window} — shifting heavy appliances outside this window helps reduce stress on the grid."
        )

    return {
        "grid_status": {**grid_status, "summary": summary},
        "timeline": timeline,
    }
