import json
import os
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError

DATA_DIR = Path(__file__).resolve().parent
BACKEND_DIR = DATA_DIR.parent
PROJECT_ROOT = BACKEND_DIR.parent
DATA_FILE = DATA_DIR / "demo_outputs.json"
ENV_FILE = PROJECT_ROOT / ".env"

load_dotenv(ENV_FILE)


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
    generated_with: Literal["openai", "fallback"] = "fallback"
    generated_at: str


def _half_hour_slots() -> list[str]:
    return [f"{hour:02d}:{minute:02d}" for hour in range(24) for minute in (0, 30)]


def _tree_status_for_streak(streak_days: int) -> str:
    if streak_days >= 5:
        return "Thriving"
    if streak_days >= 2:
        return "Healthy"
    if streak_days == 1:
        return "Wilting"
    return "Dormant"


def _fallback_timeseries() -> list[dict]:
    profile: list[dict] = []
    for slot in _half_hour_slots():
        hour = int(slot[:2])
        minute = int(slot[3:])

        if hour < 6:
            kwh = 0.18 if minute == 0 else 0.16
        elif hour < 8:
            kwh = 0.42 if minute == 0 else 0.56
        elif hour < 12:
            kwh = 0.68 if minute == 0 else 0.74
        elif hour == 12:
            kwh = 0.96 if minute == 0 else 1.08
        elif hour == 13:
            kwh = 1.22 if minute == 0 else 1.34
        elif slot == "14:00":
            kwh = 2.48
        elif slot == "14:30":
            kwh = 1.92
        elif hour < 18:
            kwh = 1.12 if minute == 0 else 0.96
        elif hour < 22:
            kwh = 1.14 if minute == 0 else 1.28
        else:
            kwh = 0.52 if minute == 0 else 0.44

        profile.append(
            {
                "time": slot,
                "kwh": round(kwh, 2),
                "estimated_cost_sgd": round(kwh * 0.27, 2),
                "bubble_tea_equivalent": max(1, round(kwh * 2)),
                "peak_flag": 18 <= hour <= 21,
            }
        )
    return profile


def _fallback_grid_timeline() -> list[dict]:
    timeline: list[dict] = []
    for slot in _half_hour_slots():
        hour = int(slot[:2])
        minute = int(slot[3:])

        if hour < 6:
            demand = 5050 + (50 if minute == 30 else 0)
        elif hour < 9:
            demand = 5600 + ((hour - 6) * 180) + (80 if minute == 30 else 0)
        elif hour < 17:
            demand = 6200 + ((hour - 9) * 55) + (25 if minute == 30 else 0)
        elif hour < 21:
            demand = 6900 + ((hour - 17) * 140) + (40 if minute == 30 else 0)
        else:
            demand = 6100 - ((hour - 21) * 190) - (40 if minute == 30 else 0)

        stress = "Low" if demand < 5800 else "Moderate" if demand < 7000 else "High"
        timeline.append({"time": slot, "demand_mw": demand, "stress_level": stress})
    return timeline


def _fallback_payload(journey_date: str | None = None) -> dict:
    target_date = date.fromisoformat(journey_date) if journey_date else date.today()
    yesterday = target_date - timedelta(days=1)
    timeline = _fallback_timeseries()
    grid_timeline = _fallback_grid_timeline()
    streak_days = 6
    points = 358

    payload = {
        "user": {
            "name": "Wei Ling",
            "persona": "Working mother optimising weekday energy use for her family.",
            "home_type": "4-room HDB",
            "household_size": 4,
            "tariff_plan": "Time-of-Use",
            "city": "Singapore",
            "analogy_preferences": ["Bubble tea", "MRT trips", "Aircon hours"],
        },
        "journey_date": target_date.isoformat(),
        "dashboard_timeseries": timeline,
        "insights": [
            {
                "id": "weekday-aircon-spike",
                "title": "Afternoon aircon spike detected",
                "summary": "Yesterday at 2:00 PM your usage jumped far above the usual weekday baseline, which points to a longer or colder aircon run than normal.",
                "analogy": "That extra burst was like buying 4 bubble teas in one afternoon.",
                "impact": {
                    "cost_sgd": 0.67,
                    "carbon_kg": 0.92,
                    "savings_if_shifted_sgd": 14.0,
                },
                "action": "Raise the aircon by 1-2C after lunch or start it 30 minutes later.",
            },
            {
                "id": "off-peak-laundry",
                "title": "Laundry is cheaper after 11:00 PM",
                "summary": "Running one dryer cycle during off-peak hours would cut both cost and grid pressure without changing your weekly routine.",
                "analogy": "It is the energy equivalent of skipping one MRT ride every week.",
                "impact": {
                    "cost_sgd": 0.4,
                    "carbon_kg": 0.21,
                    "savings_if_shifted_sgd": 9.0,
                },
                "action": "Set a nightly reminder for laundry after 11:00 PM.",
            },
            {
                "id": "forest-streak",
                "title": "Your streak is helping your tree thrive",
                "summary": "You have maintained six lower-usage days, which keeps your Resilience Forest tree in a thriving state.",
                "analogy": "Your streak is like saving enough energy to power a laptop for most of a workday.",
                "impact": {
                    "cost_sgd": 1.2,
                    "carbon_kg": 0.55,
                    "savings_if_shifted_sgd": 18.0,
                },
                "action": "Protect the streak by avoiding heavy appliance use from 7:00 PM to 9:00 PM.",
            },
        ],
        "spike_events": [
            {
                "date": yesterday.isoformat(),
                "spike_time": "14:00",
                "display_time": "2:00 PM",
                "reading_kwh": 2.48,
                "baseline_kwh": 1.21,
                "stddev_kwh": 0.43,
                "z_score": 2.95,
                "estimated_cost_sgd": 0.67,
                "bubble_tea_equivalent": 4,
                "likely_appliances": ["Aircon", "Dryer", "Oven", "Other"],
                "recommended_actions": [
                    "Set the aircon to 25C during the afternoon.",
                    "Pre-cool the bedroom for 30 minutes instead of running for the full afternoon.",
                    "Move any dryer cycle to after 11:00 PM.",
                ],
                "explanation": "The spike is most consistent with a longer-than-usual aircon session, with dryer use as a secondary possibility.",
            }
        ],
        "forecast_results": {
            "forecast_month": f"{target_date.year}-{target_date.month + 1:02d}" if target_date.month < 12 else f"{target_date.year + 1}-01",
            "predicted_bill_sgd": {"min": 98.0, "max": 112.0},
            "confidence": "medium",
            "context": "April is typically warmer than February in Singapore, so cooling load is likely to rise during late afternoons and early evenings.",
            "drivers": [
                "Warmer evenings increase aircon runtime.",
                "Weekday afternoon occupancy has been higher than your recent baseline.",
                "Your household remains more efficient than similar 4-room HDB homes.",
            ],
            "top_tip": "Raising the aircon to 25C could lower the next bill by about SGD 14.",
        },
        "disaggregation_attributions": {
            "top_appliances": [
                {
                    "name": "Aircon",
                    "share_pct": 34,
                    "monthly_cost_sgd": 38.0,
                    "monthly_kwh": 136.0,
                    "tip": "Limit afternoon cooling bursts and use sleep mode overnight.",
                },
                {
                    "name": "Water heater",
                    "share_pct": 18,
                    "monthly_cost_sgd": 19.5,
                    "monthly_kwh": 70.0,
                    "tip": "Shorten shower heater runtime by a few minutes each day.",
                },
                {
                    "name": "Fridge",
                    "share_pct": 14,
                    "monthly_cost_sgd": 15.2,
                    "monthly_kwh": 54.0,
                    "tip": "Check the door seal and avoid overfilling the shelves.",
                },
                {
                    "name": "Dryer",
                    "share_pct": 12,
                    "monthly_cost_sgd": 13.0,
                    "monthly_kwh": 46.0,
                    "tip": "Shift full dryer cycles to off-peak hours.",
                },
                {
                    "name": "Lighting",
                    "share_pct": 10,
                    "monthly_cost_sgd": 11.1,
                    "monthly_kwh": 40.0,
                    "tip": "Turn off hallway lighting earlier on weeknights.",
                },
            ],
            "upgrade_opportunities": [
                {
                    "appliance": "Fridge",
                    "current_issue": "Overnight baseline suggests an older compressor profile.",
                    "recommended_model": "5-tick inverter fridge",
                    "annual_savings_sgd": 58.0,
                    "points_bonus": 80,
                },
                {
                    "appliance": "Aircon",
                    "current_issue": "Cooling runs are longer than comparable households.",
                    "recommended_model": "Serviced inverter aircon with smart timer",
                    "annual_savings_sgd": 74.0,
                    "points_bonus": 120,
                },
            ],
        },
        "percentile_rankings": {
            "neighbourhood_percentile": 63,
            "streak_days": streak_days,
            "tree_status": _tree_status_for_streak(streak_days),
            "points": points,
            "leaderboard": [
                {"alias": "HDB_Hero_99", "points": 420},
                {"alias": "GridGuardian", "points": 396},
                {"alias": "WeiLing_EcoHome", "points": points},
            ],
            "next_reward": "SGD 5 SP bill rebate at 400 points",
        },
        "grid_status": {
            "current_level": "Moderate",
            "stress_score": 72,
            "current_demand_mw": 6940,
            "peak_window": "18:30-21:30",
            "analogy": "The grid at 7:30 PM feels like the MRT at rush hour: everyone wants capacity at the same time.",
            "timeline": grid_timeline,
        },
        "optimiser": {
            "monthly_savings_potential_sgd": 41.0,
            "recommended_actions": [
                {
                    "rank": 1,
                    "title": "Enroll fully in Time-of-Use habits",
                    "savings_sgd": 18.0,
                    "difficulty": "Moderate",
                    "rationale": "Your current usage pattern still leaves savings on the table during late-evening laundry and dryer sessions.",
                    "schedule_hint": "Shift laundry, dryer, and dishwasher use after 11:00 PM.",
                },
                {
                    "rank": 2,
                    "title": "Shift dryer cycles off-peak",
                    "savings_sgd": 9.0,
                    "difficulty": "Easy",
                    "rationale": "The dryer is one of your highest-impact appliances and is simple to reschedule.",
                    "schedule_hint": "Queue one full dryer cycle after 11:00 PM twice a week.",
                },
                {
                    "rank": 3,
                    "title": "Raise afternoon aircon temperature",
                    "savings_sgd": 14.0,
                    "difficulty": "Easy",
                    "rationale": "The weekday 2:00 PM spike is the clearest savings opportunity in your current routine.",
                    "schedule_hint": "Set the living-room aircon to 25C from 1:00 PM to 4:00 PM.",
                },
            ],
            "savings_report_headline": "You could save up to SGD 41 next month with three routine changes.",
        },
        "generated_with": "fallback",
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }
    return DemoPayload.model_validate(payload).model_dump()


def _openai_prompt(journey_date: str) -> str:
    target_date = date.fromisoformat(journey_date)
    yesterday = target_date - timedelta(days=1)
    next_month = f"{target_date.year}-{target_date.month + 1:02d}" if target_date.month < 12 else f"{target_date.year + 1}-01"
    return f"""
Generate one synthetic JSON document for a hackathon demo called SP Energy Pulse.

Return valid JSON only. Do not wrap it in markdown. Do not add commentary.

Context:
- Household is in Singapore.
- Persona is Wei Ling, a working mother in a 4-room HDB household of 4 people.
- Tariff is Time-of-Use.
- The app explains energy using relatable analogies like bubble tea, MRT trips, and aircon hours.
- journey_date must be "{journey_date}".
- There must be one clear weekday spike on "{yesterday.isoformat()}" at 14:00, mainly caused by aircon.

Precision rules:
- Use fake but realistic values only.
- All currency must be SGD.
- dashboard_timeseries must contain exactly 48 half-hour slots from 00:00 to 23:30 inclusive.
- Each dashboard_timeseries item must have: time, kwh, estimated_cost_sgd, bubble_tea_equivalent, peak_flag.
- kwh per dashboard slot must stay between 0.10 and 2.80.
- The 14:00 dashboard slot should be the day's highest kWh value.
- spike_events must contain at least 1 item and the first item must describe the 14:00 spike.
- grid_status.timeline must contain exactly 48 half-hour slots from 00:00 to 23:30 inclusive.
- grid_status timeline demand_mw must be between 4800 and 7600.
- percentile_rankings.tree_status must match streak_days using this logic:
  Thriving if streak_days >= 5
  Healthy if streak_days is 2-4
  Wilting if streak_days is 1
  Dormant if streak_days is 0
- optimiser.monthly_savings_potential_sgd should approximately equal the sum of recommended_actions.savings_sgd.
- Keep titles short, explanations concrete, and all text suitable for a product demo.

Return exactly this JSON structure:
{{
  "user": {{
    "name": "string",
    "persona": "string",
    "home_type": "string",
    "household_size": 4,
    "tariff_plan": "string",
    "city": "Singapore",
    "analogy_preferences": ["string", "string", "string"]
  }},
  "journey_date": "{journey_date}",
  "dashboard_timeseries": [
    {{
      "time": "HH:MM",
      "kwh": 0.0,
      "estimated_cost_sgd": 0.0,
      "bubble_tea_equivalent": 0,
      "peak_flag": false
    }}
  ],
  "insights": [
    {{
      "id": "string",
      "title": "string",
      "summary": "string",
      "analogy": "string",
      "impact": {{
        "cost_sgd": 0.0,
        "carbon_kg": 0.0,
        "savings_if_shifted_sgd": 0.0
      }},
      "action": "string"
    }}
  ],
  "spike_events": [
    {{
      "date": "{yesterday.isoformat()}",
      "spike_time": "14:00",
      "display_time": "2:00 PM",
      "reading_kwh": 0.0,
      "baseline_kwh": 0.0,
      "stddev_kwh": 0.0,
      "z_score": 0.0,
      "estimated_cost_sgd": 0.0,
      "bubble_tea_equivalent": 0,
      "likely_appliances": ["Aircon", "Dryer", "Oven", "Other"],
      "recommended_actions": ["string", "string", "string"],
      "explanation": "string"
    }}
  ],
  "forecast_results": {{
    "forecast_month": "{next_month}",
    "predicted_bill_sgd": {{
      "min": 0.0,
      "max": 0.0
    }},
    "confidence": "low | medium | high",
    "context": "string",
    "drivers": ["string", "string", "string"],
    "top_tip": "string"
  }},
  "disaggregation_attributions": {{
    "top_appliances": [
      {{
        "name": "string",
        "share_pct": 0,
        "monthly_cost_sgd": 0.0,
        "monthly_kwh": 0.0,
        "tip": "string"
      }}
    ],
    "upgrade_opportunities": [
      {{
        "appliance": "string",
        "current_issue": "string",
        "recommended_model": "string",
        "annual_savings_sgd": 0.0,
        "points_bonus": 0
      }}
    ]
  }},
  "percentile_rankings": {{
    "neighbourhood_percentile": 0,
    "streak_days": 0,
    "tree_status": "Thriving | Healthy | Wilting | Dormant",
    "points": 0,
    "leaderboard": [
      {{
        "alias": "string",
        "points": 0
      }}
    ],
    "next_reward": "string"
  }},
  "grid_status": {{
    "current_level": "Low | Moderate | High",
    "stress_score": 0,
    "current_demand_mw": 0,
    "peak_window": "string",
    "analogy": "string",
    "timeline": [
      {{
        "time": "HH:MM",
        "demand_mw": 0,
        "stress_level": "Low | Moderate | High"
      }}
    ]
  }},
  "optimiser": {{
    "monthly_savings_potential_sgd": 0.0,
    "recommended_actions": [
      {{
        "rank": 1,
        "title": "string",
        "savings_sgd": 0.0,
        "difficulty": "Easy | Moderate | High",
        "rationale": "string",
        "schedule_hint": "string"
      }}
    ],
    "savings_report_headline": "string"
  }}
}}
""".strip()


def generate_demo_payload(journey_date: str | None = None) -> dict:
    target_date = journey_date or date.today().isoformat()
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        return _fallback_payload(target_date)

    try:
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            temperature=0.3,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You generate strictly structured synthetic demo data as JSON.",
                },
                {"role": "user", "content": _openai_prompt(target_date)},
            ],
        )
        message = response.choices[0].message.content
        if not message:
            raise ValueError("OpenAI returned an empty response.")

        payload = DemoPayload.model_validate_json(message).model_dump()
        payload["generated_with"] = "openai"
        payload["generated_at"] = datetime.now(timezone.utc).isoformat()
        return DemoPayload.model_validate(payload).model_dump()
    except (ValidationError, ValueError, KeyError, IndexError, TypeError, OSError):
        return _fallback_payload(target_date)
    except Exception:
        return _fallback_payload(target_date)


def save_demo_payload(payload: dict, destination: Path | None = None) -> Path:
    target = destination or DATA_FILE
    validated = DemoPayload.model_validate(payload).model_dump()
    target.write_text(json.dumps(validated, indent=2), encoding="utf-8")
    return target


def load_demo_payload(force_refresh: bool = False) -> dict:
    if not force_refresh and DATA_FILE.exists():
        try:
            raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            return DemoPayload.model_validate(raw).model_dump()
        except (json.JSONDecodeError, ValidationError):
            pass

    payload = generate_demo_payload()
    save_demo_payload(payload)
    return payload


def generate_data() -> dict:
    payload = generate_demo_payload()
    save_demo_payload(payload)
    return payload


if __name__ == "__main__":
    generated = generate_data()
    print(f"Generated demo payload using {generated['generated_with']}.")
