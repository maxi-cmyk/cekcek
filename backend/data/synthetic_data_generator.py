import json
import os
import random
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError

HOUSEHOLD_ID = "wei_ling_demo"
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 1, 31)

DATA_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = DATA_DIR.parent.parent
DATA_FILE = DATA_DIR / "demo_outputs.json"

load_dotenv(PROJECT_ROOT / ".env")

SEASONAL_MULTIPLIER = {1: 0.90, 2: 0.88, 3: 0.95, 4: 1.15, 5: 1.20, 6: 1.18, 7: 1.05, 8: 1.05, 9: 1.00, 10: 0.95, 11: 0.92, 12: 0.93}
WEEKDAY_PROFILE = [0.30, 0.28, 0.27, 0.26, 0.26, 0.27, 0.30, 0.40, 0.65, 0.70, 0.60, 0.55, 0.70, 0.85, 0.75, 0.65, 0.60, 0.58, 0.50, 0.45, 0.42, 0.40, 0.40, 0.42, 0.55, 0.60, 0.55, 0.50, 0.48, 0.48, 0.50, 0.52, 0.55, 0.58, 0.60, 0.65, 0.80, 1.00, 1.10, 1.15, 1.10, 1.05, 0.95, 0.85, 0.75, 0.65, 0.55, 0.45]
WEEKEND_PROFILE = [0.35, 0.30, 0.28, 0.27, 0.27, 0.28, 0.32, 0.38, 0.55, 0.70, 0.80, 0.85, 0.90, 0.85, 0.80, 0.75, 0.70, 0.68, 0.65, 0.70, 0.72, 0.70, 0.68, 0.65, 0.68, 0.72, 0.75, 0.78, 0.80, 0.82, 0.88, 0.95, 1.05, 1.10, 1.08, 1.05, 0.98, 0.90, 0.82, 0.72, 0.60, 0.48, 0.42, 0.38, 0.34, 0.32, 0.30, 0.28]
BASE_KWH = 0.45
SPIKE_EVENTS = [
    {"date": "2024-11-14", "slot": 28, "kwh_extra": 2.0},
    {"date": "2024-10-22", "slot": 38, "kwh_extra": 1.5},
    {"date": "2024-09-07", "slot": 24, "kwh_extra": 1.8},
    {"date": "2024-08-19", "slot": 34, "kwh_extra": 2.2},
    {"date": "2024-07-03", "slot": 40, "kwh_extra": 1.2},
    {"date": "2024-05-28", "slot": 30, "kwh_extra": 1.6},
    {"date": "2024-04-11", "slot": 36, "kwh_extra": 1.9},
    {"date": "2024-02-20", "slot": 22, "kwh_extra": 1.3},
]


class UserProfile(BaseModel):
    name: str
    persona: str
    home_type: str
    household_size: int = Field(ge=1, le=8)
    tariff_plan: str
    city: str
    analogy_preferences: list[str]


class DashboardPoint(BaseModel):
    time: str
    kwh: float = Field(ge=0)
    estimated_cost_sgd: float = Field(ge=0)
    bubble_tea_equivalent: int = Field(ge=0)
    peak_flag: bool


class InsightImpact(BaseModel):
    cost_sgd: float = Field(ge=0)
    carbon_kg: float = Field(ge=0)
    savings_if_shifted_sgd: float = Field(ge=0)


class InsightCard(BaseModel):
    id: str
    title: str
    summary: str
    analogy: str
    impact: InsightImpact
    action: str


class SpikeEvent(BaseModel):
    date: str
    spike_time: str
    display_time: str
    reading_kwh: float = Field(ge=0)
    baseline_kwh: float = Field(ge=0)
    stddev_kwh: float = Field(ge=0)
    z_score: float = Field(ge=0)
    estimated_cost_sgd: float = Field(ge=0)
    bubble_tea_equivalent: int = Field(ge=0)
    likely_appliances: list[str]
    recommended_actions: list[str]
    explanation: str


class BillRange(BaseModel):
    min: float = Field(ge=0)
    max: float = Field(ge=0)


class ForecastResults(BaseModel):
    forecast_month: str
    predicted_bill_sgd: BillRange
    confidence: Literal["low", "medium", "high"]
    context: str
    drivers: list[str]
    top_tip: str


class ApplianceAttribution(BaseModel):
    name: str
    share_pct: int = Field(ge=0, le=100)
    monthly_cost_sgd: float = Field(ge=0)
    monthly_kwh: float = Field(ge=0)
    tip: str


class UpgradeOpportunity(BaseModel):
    appliance: str
    current_issue: str
    recommended_model: str
    annual_savings_sgd: float = Field(ge=0)
    points_bonus: int = Field(ge=0)


class DisaggregationAttributions(BaseModel):
    top_appliances: list[ApplianceAttribution]
    upgrade_opportunities: list[UpgradeOpportunity]


class LeaderboardEntry(BaseModel):
    alias: str
    points: int = Field(ge=0)


class PercentileRankings(BaseModel):
    neighbourhood_percentile: int = Field(ge=0, le=100)
    streak_days: int = Field(ge=0)
    tree_status: Literal["Thriving", "Healthy", "Wilting", "Dormant"]
    points: int = Field(ge=0)
    leaderboard: list[LeaderboardEntry]
    next_reward: str


class GridPoint(BaseModel):
    time: str
    demand_mw: int = Field(ge=0)
    stress_level: Literal["Low", "Moderate", "High"]


class GridStatus(BaseModel):
    current_level: Literal["Low", "Moderate", "High"]
    stress_score: int = Field(ge=0, le=100)
    current_demand_mw: int = Field(ge=0)
    peak_window: str
    analogy: str
    timeline: list[GridPoint]


class OptimiserAction(BaseModel):
    rank: int = Field(ge=1)
    title: str
    savings_sgd: float = Field(ge=0)
    difficulty: Literal["Easy", "Moderate", "High"]
    rationale: str
    schedule_hint: str


class OptimiserPayload(BaseModel):
    monthly_savings_potential_sgd: float = Field(ge=0)
    recommended_actions: list[OptimiserAction]
    savings_report_headline: str


class DemoPayload(BaseModel):
    user: UserProfile
    journey_date: str
    dashboard_timeseries: list[DashboardPoint]
    insights: list[InsightCard]
    spike_events: list[SpikeEvent]
    forecast_results: ForecastResults
    disaggregation_attributions: DisaggregationAttributions
    percentile_rankings: PercentileRankings
    grid_status: GridStatus
    optimiser: OptimiserPayload
    generated_with: Literal["openai", "hardcoded"]
    generated_at: str
    scenario_id: str
    scenario_label: str


def get_day_type(dt: datetime) -> str:
    public_holidays = {"2024-02-10", "2024-04-10", "2024-05-01", "2024-05-23", "2024-08-09", "2024-10-31", "2024-12-25", "2025-01-01"}
    if dt.strftime("%Y-%m-%d") in public_holidays:
        return "public_holiday"
    return "weekend" if dt.weekday() >= 5 else "weekday"


def generate_rows() -> list[dict]:
    rows: list[dict] = []
    spike_lookup = {(item["date"], item["slot"]): item["kwh_extra"] for item in SPIKE_EVENTS}
    current = START_DATE
    while current <= END_DATE:
        day_type = get_day_type(current)
        profile = WEEKEND_PROFILE if day_type != "weekday" else WEEKDAY_PROFILE
        seasonal = SEASONAL_MULTIPLIER[current.month]
        date_str = current.strftime("%Y-%m-%d")
        for slot in range(48):
            timestamp = current + timedelta(minutes=slot * 30)
            base = BASE_KWH * profile[slot] * seasonal
            noise = np.random.normal(0, base * 0.08)
            kwh = max(0.05, base + noise) + spike_lookup.get((date_str, slot), 0)
            rows.append({"household_id": HOUSEHOLD_ID, "timestamp": timestamp, "kwh": round(kwh, 4), "day_type": day_type, "time_slot": slot, "month": current.month, "year": current.year})
        current += timedelta(days=1)
    return rows


def load_to_clickhouse(rows: list[dict]) -> None:
    from db.clickhouse import get_client

    client = get_client()
    dataframe = pd.DataFrame(rows)
    for start in range(0, len(dataframe), 5000):
        batch = dataframe.iloc[start:start + 5000]
        client.insert_df("sp_energy_pulse.consumption", batch)
        print(f"Inserted rows {start}-{start + len(batch)}")
    print(f"Total rows loaded: {len(rows)}")


def _slots() -> list[str]:
    return [f"{hour:02d}:{minute:02d}" for hour in range(24) for minute in (0, 30)]


def _next_month(value: date) -> str:
    return f"{value.year + 1}-01" if value.month == 12 else f"{value.year}-{value.month + 1:02d}"


def _tree_status(streak_days: int) -> str:
    if streak_days >= 5:
        return "Thriving"
    if streak_days >= 2:
        return "Healthy"
    if streak_days == 1:
        return "Wilting"
    return "Dormant"


def _base_user() -> dict:
    return {"name": "Wei Ling", "persona": "Working mother optimising weekday energy use for her family.", "home_type": "4-room HDB", "household_size": 4, "tariff_plan": "Time-of-Use", "city": "Singapore", "analogy_preferences": ["Bubble tea", "MRT trips", "Aircon hours"]}


def _build_timeseries(spike_time: str, spike_kwh: float, load_profile: str) -> list[dict]:
    adjustments = {
        "aircon": {"morning": 0.00, "midday": 0.12, "evening": 0.08, "night": 0.00},
        "laundry": {"morning": 0.03, "midday": 0.04, "evening": 0.18, "night": 0.02},
        "cooking": {"morning": 0.06, "midday": 0.10, "evening": 0.24, "night": 0.00},
    }[load_profile]
    items: list[dict] = []
    for slot in _slots():
        hour = int(slot[:2])
        minute = int(slot[3:])
        band = "night" if hour < 6 or hour >= 22 else "morning" if hour < 12 else "midday" if hour < 18 else "evening"
        base = {"night": 0.18 if minute == 0 else 0.16, "morning": 0.58 if hour < 8 else 0.74 if minute == 30 else 0.68, "midday": 1.12 if minute == 30 else 1.02, "evening": 1.24 if minute == 30 else 1.12}[band]
        kwh = base + adjustments[band]
        if band == "night" and hour >= 22:
            kwh = (0.48 if minute == 0 else 0.42) + adjustments[band]
        if slot == spike_time:
            kwh = spike_kwh
        if slot == "14:30" and spike_time == "14:00":
            kwh = max(kwh, spike_kwh - 0.56)
        if slot == "19:30" and spike_time == "19:00":
            kwh = max(kwh, spike_kwh - 0.42)
        if slot == "12:30" and spike_time == "12:00":
            kwh = max(kwh, spike_kwh - 0.36)
        kwh = round(kwh, 2)
        items.append({"time": slot, "kwh": kwh, "estimated_cost_sgd": round(kwh * 0.27, 2), "bubble_tea_equivalent": max(1, round(kwh * 2)), "peak_flag": 18 <= hour <= 21})
    return items


def _build_grid_timeline(level: str) -> list[dict]:
    config = {"Low": (4950, 150, 40, 90), "Moderate": (5100, 170, 55, 125), "High": (5250, 200, 70, 165)}[level]
    base, morning_step, day_step, evening_step = config
    items: list[dict] = []
    for slot in _slots():
        hour = int(slot[:2])
        minute = int(slot[3:])
        if hour < 6:
            demand = base + (45 if minute == 30 else 0)
        elif hour < 9:
            demand = base + 500 + ((hour - 6) * morning_step) + (65 if minute == 30 else 0)
        elif hour < 17:
            demand = base + 980 + ((hour - 9) * day_step) + (25 if minute == 30 else 0)
        elif hour < 21:
            demand = base + 1450 + ((hour - 17) * evening_step) + (40 if minute == 30 else 0)
        else:
            demand = base + 950 - ((hour - 21) * 180) - (30 if minute == 30 else 0)
        items.append({"time": slot, "demand_mw": demand, "stress_level": "Low" if demand < 5800 else "Moderate" if demand < 7000 else "High"})
    return items


def _build_hardcoded_payloads(journey_date: str | None = None) -> list[dict]:
    target_date = date.fromisoformat(journey_date) if journey_date else date.today()
    yesterday = target_date - timedelta(days=1)
    forecast_month = _next_month(target_date)
    generated_at = datetime.now(timezone.utc).isoformat()
    configs = [
        {
            "scenario_id": "aircon-afternoon-spike",
            "scenario_label": "Afternoon Aircon Spike",
            "spike_time": "14:00",
            "display_time": "2:00 PM",
            "spike_kwh": 2.48,
            "load_profile": "aircon",
            "appliances": ["Aircon", "Dryer", "Oven", "Other"],
            "appliance_focus": "Aircon",
            "forecast_range": {"min": 98.0, "max": 112.0},
            "confidence": "medium",
            "streak_days": 6,
            "points": 358,
            "grid_level": "Moderate",
            "grid_score": 72,
            "grid_demand": 6940,
            "peak_window": "18:30-21:30",
            "monthly_savings": 41.0,
            "top_tip": "Raising the aircon to 25C could lower the next bill by about SGD 14.",
            "summary": "Yesterday at 2:00 PM your usage climbed well above the weekday baseline, which strongly suggests a longer cooling session than usual.",
            "analogy": "That extra burst was like buying 4 bubble teas in one afternoon.",
            "action": "Raise the aircon to 25C after lunch or delay the cooling cycle by 30 minutes.",
        },
        {
            "scenario_id": "laundry-night-shift",
            "scenario_label": "Off-Peak Laundry Shift",
            "spike_time": "19:00",
            "display_time": "7:00 PM",
            "spike_kwh": 2.34,
            "load_profile": "laundry",
            "appliances": ["Dryer", "Washer", "Aircon", "Other"],
            "appliance_focus": "Dryer",
            "forecast_range": {"min": 91.0, "max": 105.0},
            "confidence": "high",
            "streak_days": 4,
            "points": 332,
            "grid_level": "High",
            "grid_score": 81,
            "grid_demand": 7155,
            "peak_window": "18:00-21:00",
            "monthly_savings": 33.0,
            "top_tip": "Moving two weekly dryer cycles off-peak could cut the next bill by about SGD 12.",
            "summary": "Your dryer and washer usage clusters around 7:00 PM, which is one of the least efficient times to run heavy appliances.",
            "analogy": "It is like joining the longest hawker queue instead of going later.",
            "action": "Shift full laundry cycles to after 11:00 PM on weekdays.",
        },
        {
            "scenario_id": "weekend-cooking-surge",
            "scenario_label": "Weekend Cooking Surge",
            "spike_time": "12:00",
            "display_time": "12:00 PM",
            "spike_kwh": 2.21,
            "load_profile": "cooking",
            "appliances": ["Oven", "Rice Cooker", "Induction Hob", "Other"],
            "appliance_focus": "Cooking appliances",
            "forecast_range": {"min": 94.0, "max": 108.0},
            "confidence": "medium",
            "streak_days": 3,
            "points": 341,
            "grid_level": "Low",
            "grid_score": 54,
            "grid_demand": 6120,
            "peak_window": "18:30-20:30",
            "monthly_savings": 24.0,
            "top_tip": "Staggering lunch prep appliances could trim the next bill by about SGD 9.",
            "summary": "Your kitchen appliances are creating a strong noon surge, especially on heavier meal-prep days.",
            "analogy": "It is like using several hawker stalls at once instead of one at a time.",
            "action": "Stagger rice cooker, oven, and induction hob use during lunch prep.",
        },
    ]
    payloads: list[dict] = []
    for item in configs:
        streak_days = item["streak_days"]
        points = item["points"]
        payloads.append(
            DemoPayload.model_validate(
                {
                    "scenario_id": item["scenario_id"],
                    "scenario_label": item["scenario_label"],
                    "user": _base_user(),
                    "journey_date": target_date.isoformat(),
                    "dashboard_timeseries": _build_timeseries(item["spike_time"], item["spike_kwh"], item["load_profile"]),
                    "insights": [
                        {"id": f"{item['scenario_id']}-primary", "title": item["scenario_label"], "summary": item["summary"], "analogy": item["analogy"], "impact": {"cost_sgd": round(item["spike_kwh"] * 0.27, 2), "carbon_kg": round(item["spike_kwh"] * 0.37, 2), "savings_if_shifted_sgd": round(item["monthly_savings"] * 0.4, 2)}, "action": item["action"]},
                        {"id": f"{item['scenario_id']}-grid", "title": "Grid timing matters", "summary": f"Your {item['appliance_focus'].lower()} usage overlaps with a more stressed period on the grid.", "analogy": "It is easier on the grid when flexible loads avoid the busiest window.", "impact": {"cost_sgd": 0.42, "carbon_kg": 0.22, "savings_if_shifted_sgd": 8.0}, "action": "Move flexible appliance use away from the peak period when possible."},
                        {"id": f"{item['scenario_id']}-reward", "title": "Your streak still matters", "summary": "Small routine changes here are enough to protect your streak and move you closer to the next reward.", "analogy": "It adds up like skipping a few bubble teas over the month.", "impact": {"cost_sgd": 0.30, "carbon_kg": 0.15, "savings_if_shifted_sgd": 6.0}, "action": "Keep heavy usage clustered outside the busiest evening window."},
                    ],
                    "spike_events": [
                        {"date": yesterday.isoformat(), "spike_time": item["spike_time"], "display_time": item["display_time"], "reading_kwh": item["spike_kwh"], "baseline_kwh": round(item["spike_kwh"] / 2, 2), "stddev_kwh": 0.38, "z_score": round(item["spike_kwh"] / 0.78, 2), "estimated_cost_sgd": round(item["spike_kwh"] * 0.27, 2), "bubble_tea_equivalent": max(1, round(item["spike_kwh"] * 2)), "likely_appliances": item["appliances"], "recommended_actions": [item["action"], "Reduce overlap between heavy appliances.", "Shift flexible loads later when possible."], "explanation": f"The spike pattern is most consistent with {item['appliance_focus'].lower()} usage."}
                    ],
                    "forecast_results": {"forecast_month": forecast_month, "predicted_bill_sgd": item["forecast_range"], "confidence": item["confidence"], "context": f"{item['appliance_focus']} is the main driver of the next bill range.", "drivers": [f"{item['appliance_focus']} usage is above your recent baseline.", "Flexible appliance timing can still improve your bill.", "Your home remains comparable to similar 4-room HDB households."], "top_tip": item["top_tip"]},
                    "disaggregation_attributions": {"top_appliances": [{"name": item["appliance_focus"], "share_pct": 28, "monthly_cost_sgd": 26.0, "monthly_kwh": 94.0, "tip": item["action"]}, {"name": "Aircon", "share_pct": 24, "monthly_cost_sgd": 22.0, "monthly_kwh": 80.0, "tip": "Use a slightly higher temperature during warm afternoons."}, {"name": "Fridge", "share_pct": 16, "monthly_cost_sgd": 15.0, "monthly_kwh": 55.0, "tip": "Keep the door seal tight and avoid storing hot food."}], "upgrade_opportunities": [{"appliance": item["appliance_focus"], "current_issue": "The appliance pattern suggests avoidable runtime or overlap.", "recommended_model": "Higher-efficiency replacement", "annual_savings_sgd": 54.0, "points_bonus": 80}, {"appliance": "Fridge", "current_issue": "Baseline overnight draw suggests an older compressor pattern.", "recommended_model": "5-tick inverter fridge", "annual_savings_sgd": 51.0, "points_bonus": 85}]},
                    "percentile_rankings": {"neighbourhood_percentile": 60 + (streak_days % 4), "streak_days": streak_days, "tree_status": _tree_status(streak_days), "points": points, "leaderboard": [{"alias": "GridGuardian", "points": 396}, {"alias": "HDB_Hero_99", "points": 420}, {"alias": "WeiLing_EcoHome", "points": points}], "next_reward": "Next voucher unlocks at 400 points" if points < 400 else "Reward ready to redeem"},
                    "grid_status": {"current_level": item["grid_level"], "stress_score": item["grid_score"], "current_demand_mw": item["grid_demand"], "peak_window": item["peak_window"], "analogy": "The grid feels like the MRT during a busier commute window.", "timeline": _build_grid_timeline(item["grid_level"])},
                    "optimiser": {"monthly_savings_potential_sgd": item["monthly_savings"], "recommended_actions": [{"rank": 1, "title": f"Reduce {item['appliance_focus'].lower()} overlap", "savings_sgd": round(item["monthly_savings"] * 0.4, 2), "difficulty": "Easy", "rationale": "This is the clearest source of avoidable usage in the profile.", "schedule_hint": item["action"]}, {"rank": 2, "title": "Use more off-peak timing", "savings_sgd": round(item["monthly_savings"] * 0.3, 2), "difficulty": "Moderate", "rationale": "Flexible timing reduces both tariff cost and grid stress.", "schedule_hint": "Move non-urgent loads later at night."}, {"rank": 3, "title": "Avoid overlapping heavy loads", "savings_sgd": round(item["monthly_savings"] * 0.3, 2), "difficulty": "Easy", "rationale": "Peak usage is easier to control when loads are staggered.", "schedule_hint": "Run only one heavy appliance at a time."}], "savings_report_headline": f"You could save about SGD {int(item['monthly_savings'])} next month with a few routine changes."},
                    "generated_with": "hardcoded",
                    "generated_at": generated_at,
                }
            ).model_dump()
        )
    return payloads


def _openai_prompt(base_payload: dict) -> str:
    spike_event = base_payload["spike_events"][0]
    forecast = base_payload["forecast_results"]
    optimiser = base_payload["optimiser"]
    return f"""
Return valid JSON only.

You are writing concise demo copy for an energy app in Singapore called SP Energy Pulse.
Keep the existing facts exactly as given and only create polished natural-language text.

Facts:
- journey_date: {base_payload["journey_date"]}
- household: Wei Ling, 4-room HDB, Time-of-Use tariff
- scenario_id: {base_payload["scenario_id"]}
- current scenario label: {base_payload["scenario_label"]}
- spike time: {spike_event["display_time"]}
- likely appliance focus: {spike_event["likely_appliances"][0]}
- forecast bill range: SGD {forecast["predicted_bill_sgd"]["min"]} to SGD {forecast["predicted_bill_sgd"]["max"]}
- monthly savings potential: SGD {optimiser["monthly_savings_potential_sgd"]}
- next reward: {base_payload["percentile_rankings"]["next_reward"]}

Return exactly this structure:
{{
  "scenario_label": "string",
  "insights": [
    {{"title": "string", "summary": "string", "analogy": "string", "action": "string"}},
    {{"title": "string", "summary": "string", "analogy": "string", "action": "string"}},
    {{"title": "string", "summary": "string", "analogy": "string", "action": "string"}}
  ],
  "spike_explanation": "string",
  "forecast_context": "string",
  "forecast_drivers": ["string", "string", "string"],
  "forecast_top_tip": "string",
  "grid_analogy": "string",
  "optimiser_headline": "string",
  "optimiser_actions": [
    {{"title": "string", "rationale": "string", "schedule_hint": "string"}},
    {{"title": "string", "rationale": "string", "schedule_hint": "string"}},
    {{"title": "string", "rationale": "string", "schedule_hint": "string"}}
  ],
  "next_reward": "string"
}}
""".strip()


def _generate_openai_payload(journey_date: str) -> dict | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    try:
        base_payload = random.choice(_build_hardcoded_payloads(journey_date))
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": "You generate concise structured JSON copy for a product demo."},
                {"role": "user", "content": _openai_prompt(base_payload)},
            ],
        )
        content = response.choices[0].message.content
        if not content:
            return None

        copy_payload = json.loads(content)
        merged = json.loads(json.dumps(base_payload))
        merged["scenario_id"] = f"openai-{base_payload['scenario_id']}"
        merged["scenario_label"] = copy_payload.get("scenario_label") or base_payload["scenario_label"]
        merged["generated_with"] = "openai"
        merged["generated_at"] = datetime.now(timezone.utc).isoformat()

        for index, insight in enumerate(merged["insights"]):
            if index < len(copy_payload.get("insights", [])):
                generated = copy_payload["insights"][index]
                insight["title"] = generated.get("title", insight["title"])
                insight["summary"] = generated.get("summary", insight["summary"])
                insight["analogy"] = generated.get("analogy", insight["analogy"])
                insight["action"] = generated.get("action", insight["action"])

        merged["spike_events"][0]["explanation"] = copy_payload.get("spike_explanation", merged["spike_events"][0]["explanation"])
        merged["forecast_results"]["context"] = copy_payload.get("forecast_context", merged["forecast_results"]["context"])
        drivers = copy_payload.get("forecast_drivers")
        if isinstance(drivers, list) and drivers:
            merged["forecast_results"]["drivers"] = drivers[:3]
        merged["forecast_results"]["top_tip"] = copy_payload.get("forecast_top_tip", merged["forecast_results"]["top_tip"])
        merged["grid_status"]["analogy"] = copy_payload.get("grid_analogy", merged["grid_status"]["analogy"])
        merged["optimiser"]["savings_report_headline"] = copy_payload.get("optimiser_headline", merged["optimiser"]["savings_report_headline"])
        merged["percentile_rankings"]["next_reward"] = copy_payload.get("next_reward", merged["percentile_rankings"]["next_reward"])

        for index, action in enumerate(merged["optimiser"]["recommended_actions"]):
            if index < len(copy_payload.get("optimiser_actions", [])):
                generated = copy_payload["optimiser_actions"][index]
                action["title"] = generated.get("title", action["title"])
                action["rationale"] = generated.get("rationale", action["rationale"])
                action["schedule_hint"] = generated.get("schedule_hint", action["schedule_hint"])

        return DemoPayload.model_validate(merged).model_dump()
    except Exception:
        return None


def generate_demo_payload(journey_date: str | None = None, force_fallback: bool = False) -> dict:
    target_date = journey_date or date.today().isoformat()
    if not force_fallback:
        openai_payload = _generate_openai_payload(target_date)
        if openai_payload:
            return openai_payload
    return random.choice(_build_hardcoded_payloads(target_date))


def get_random_demo_payload(journey_date: str | None = None, save: bool = False, force_fallback: bool = False) -> dict:
    payload = generate_demo_payload(journey_date=journey_date, force_fallback=force_fallback)
    if save:
        save_demo_payload(payload)
    return payload


def save_demo_payload(payload: dict, destination: Path | None = None) -> Path:
    target = destination or DATA_FILE
    target.write_text(json.dumps(DemoPayload.model_validate(payload).model_dump(), indent=2), encoding="utf-8")
    return target


def load_demo_payload(force_refresh: bool = False, force_fallback: bool = False) -> dict:
    if not force_refresh and DATA_FILE.exists():
        try:
            return DemoPayload.model_validate(json.loads(DATA_FILE.read_text(encoding="utf-8"))).model_dump()
        except (json.JSONDecodeError, ValidationError):
            pass
    return get_random_demo_payload(save=True, force_fallback=force_fallback)


if __name__ == "__main__":
    print("Generating synthetic data...")
    generated_rows = generate_rows()
    print(f"Generated {len(generated_rows)} rows. Loading to ClickHouse...")
    load_to_clickhouse(generated_rows)
    print("Done.")
