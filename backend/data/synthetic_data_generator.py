import json
import random
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field, ValidationError

DATA_DIR = Path(__file__).resolve().parent
DATA_FILE = DATA_DIR / "demo_outputs.json"


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
    generated_with: Literal["hardcoded"]
    generated_at: str
    scenario_id: str
    scenario_label: str


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


def _next_month(target_date: date) -> str:
    if target_date.month == 12:
        return f"{target_date.year + 1}-01"
    return f"{target_date.year}-{target_date.month + 1:02d}"


def _build_timeseries(spike_time: str, spike_kwh: float, pattern: str) -> list[dict]:
    adjustments = {
        "aircon": {"morning": 0.00, "midday": 0.12, "evening": 0.08, "night": 0.00},
        "laundry": {"morning": 0.03, "midday": 0.04, "evening": 0.18, "night": 0.02},
        "cooking": {"morning": 0.06, "midday": 0.10, "evening": 0.24, "night": 0.00},
    }[pattern]
    points: list[dict] = []

    for slot in _half_hour_slots():
        hour = int(slot[:2])
        minute = int(slot[3:])
        if hour < 6:
            kwh = 0.18 if minute == 0 else 0.16
            kwh += adjustments["night"]
        elif hour < 8:
            kwh = 0.42 if minute == 0 else 0.56
            kwh += adjustments["morning"]
        elif hour < 12:
            kwh = 0.68 if minute == 0 else 0.74
            kwh += adjustments["morning"]
        elif hour < 15:
            kwh = 1.02 if minute == 0 else 1.12
            kwh += adjustments["midday"]
        elif hour < 18:
            kwh = 0.96 if minute == 0 else 0.88
            kwh += adjustments["midday"]
        elif hour < 22:
            kwh = 1.12 if minute == 0 else 1.24
            kwh += adjustments["evening"]
        else:
            kwh = 0.48 if minute == 0 else 0.42
            kwh += adjustments["night"]

        if slot == spike_time:
            kwh = spike_kwh
        elif slot == "14:30" and spike_time == "14:00":
            kwh = max(kwh, round(spike_kwh - 0.56, 2))
        elif slot == "19:30" and spike_time == "19:00":
            kwh = max(kwh, round(spike_kwh - 0.42, 2))
        elif slot == "12:30" and spike_time == "12:00":
            kwh = max(kwh, round(spike_kwh - 0.36, 2))

        kwh = round(kwh, 2)
        points.append(
            {
                "time": slot,
                "kwh": kwh,
                "estimated_cost_sgd": round(kwh * 0.27, 2),
                "bubble_tea_equivalent": max(1, round(kwh * 2)),
                "peak_flag": 18 <= hour <= 21,
            }
        )
    return points


def _build_grid_timeline(level: str) -> list[dict]:
    config = {
        "Low": {"base": 4950, "morning_step": 150, "day_step": 40, "evening_step": 90},
        "Moderate": {"base": 5100, "morning_step": 170, "day_step": 55, "evening_step": 125},
        "High": {"base": 5250, "morning_step": 200, "day_step": 70, "evening_step": 165},
    }[level]
    points: list[dict] = []

    for slot in _half_hour_slots():
        hour = int(slot[:2])
        minute = int(slot[3:])
        if hour < 6:
            demand = config["base"] + (45 if minute == 30 else 0)
        elif hour < 9:
            demand = config["base"] + 500 + ((hour - 6) * config["morning_step"]) + (65 if minute == 30 else 0)
        elif hour < 17:
            demand = config["base"] + 980 + ((hour - 9) * config["day_step"]) + (25 if minute == 30 else 0)
        elif hour < 21:
            demand = config["base"] + 1450 + ((hour - 17) * config["evening_step"]) + (40 if minute == 30 else 0)
        else:
            demand = config["base"] + 950 - ((hour - 21) * 180) - (30 if minute == 30 else 0)

        stress = "Low" if demand < 5800 else "Moderate" if demand < 7000 else "High"
        points.append({"time": slot, "demand_mw": demand, "stress_level": stress})
    return points


def _base_user() -> dict:
    return {
        "name": "Wei Ling",
        "persona": "Working mother optimising weekday energy use for her family.",
        "home_type": "4-room HDB",
        "household_size": 4,
        "tariff_plan": "Time-of-Use",
        "city": "Singapore",
        "analogy_preferences": ["Bubble tea", "MRT trips", "Aircon hours"],
    }


def _scenario_payloads(journey_date: str | None = None) -> list[dict]:
    target_date = date.fromisoformat(journey_date) if journey_date else date.today()
    yesterday = target_date - timedelta(days=1)
    next_month = _next_month(target_date)
    generated_at = datetime.now(timezone.utc).isoformat()

    scenarios = [
        {
            "scenario_id": "aircon-afternoon-spike",
            "scenario_label": "Afternoon Aircon Spike",
            "dashboard_timeseries": _build_timeseries("14:00", 2.48, "aircon"),
            "insights": [
                {
                    "id": "weekday-aircon-spike",
                    "title": "Afternoon aircon spike detected",
                    "summary": "Yesterday at 2:00 PM your usage climbed well above the weekday baseline, which strongly suggests a longer cooling session than usual.",
                    "analogy": "That extra burst was like buying 4 bubble teas in one afternoon.",
                    "impact": {"cost_sgd": 0.67, "carbon_kg": 0.92, "savings_if_shifted_sgd": 14.0},
                    "action": "Raise the aircon to 25C after lunch or delay the cooling cycle by 30 minutes.",
                },
                {
                    "id": "peak-cooling-window",
                    "title": "Cooling overlaps with grid peak",
                    "summary": "Your highest cooling usage now lands close to the grid ramp-up period, which makes that routine more expensive and less efficient.",
                    "analogy": "It is like boarding the MRT just before the biggest rush starts.",
                    "impact": {"cost_sgd": 0.51, "carbon_kg": 0.31, "savings_if_shifted_sgd": 9.0},
                    "action": "Use the fan first and start the aircon later on warmer days.",
                },
                {
                    "id": "forest-streak",
                    "title": "Your streak is still strong",
                    "summary": "Six efficient days in a row keep your tree thriving even after one hotter afternoon.",
                    "analogy": "That streak is like powering a laptop for most of a workday.",
                    "impact": {"cost_sgd": 1.2, "carbon_kg": 0.55, "savings_if_shifted_sgd": 18.0},
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
                        "Pre-cool the room for 30 minutes instead of running it for the full afternoon.",
                        "Close blinds before noon to reduce cooling load.",
                    ],
                    "explanation": "The spike profile is most consistent with a longer-than-usual aircon run.",
                }
            ],
            "forecast_results": {
                "forecast_month": next_month,
                "predicted_bill_sgd": {"min": 98.0, "max": 112.0},
                "confidence": "medium",
                "context": "The next month is expected to stay warm in late afternoons, so aircon usage is likely to remain your main bill driver.",
                "drivers": [
                    "Warm afternoons increase cooling runtime.",
                    "Your weekday midday occupancy is above the recent baseline.",
                    "You still perform better than similar 4-room HDB homes overall.",
                ],
                "top_tip": "Raising the aircon to 25C could lower the next bill by about SGD 14.",
            },
            "disaggregation_attributions": {
                "top_appliances": [
                    {"name": "Aircon", "share_pct": 34, "monthly_cost_sgd": 38.0, "monthly_kwh": 136.0, "tip": "Limit afternoon cooling bursts and use sleep mode overnight."},
                    {"name": "Water heater", "share_pct": 18, "monthly_cost_sgd": 19.5, "monthly_kwh": 70.0, "tip": "Shorten shower heater runtime by a few minutes each day."},
                    {"name": "Fridge", "share_pct": 14, "monthly_cost_sgd": 15.2, "monthly_kwh": 54.0, "tip": "Check the door seal and avoid overfilling the shelves."},
                ],
                "upgrade_opportunities": [
                    {"appliance": "Fridge", "current_issue": "Overnight baseline suggests an older compressor profile.", "recommended_model": "5-tick inverter fridge", "annual_savings_sgd": 58.0, "points_bonus": 80},
                    {"appliance": "Aircon", "current_issue": "Cooling runs are longer than comparable households.", "recommended_model": "Serviced inverter aircon with smart timer", "annual_savings_sgd": 74.0, "points_bonus": 120},
                ],
            },
            "percentile_rankings": {
                "neighbourhood_percentile": 63,
                "streak_days": 6,
                "tree_status": _tree_status_for_streak(6),
                "points": 358,
                "leaderboard": [
                    {"alias": "HDB_Hero_99", "points": 420},
                    {"alias": "GridGuardian", "points": 396},
                    {"alias": "WeiLing_EcoHome", "points": 358},
                ],
                "next_reward": "SGD 5 SP bill rebate at 400 points",
            },
            "grid_status": {
                "current_level": "Moderate",
                "stress_score": 72,
                "current_demand_mw": 6940,
                "peak_window": "18:30-21:30",
                "analogy": "The grid at 7:30 PM feels like the MRT at rush hour.",
                "timeline": _build_grid_timeline("Moderate"),
            },
            "optimiser": {
                "monthly_savings_potential_sgd": 41.0,
                "recommended_actions": [
                    {"rank": 1, "title": "Raise afternoon aircon temperature", "savings_sgd": 14.0, "difficulty": "Easy", "rationale": "The 2:00 PM spike is the clearest savings opportunity in your routine.", "schedule_hint": "Set the living-room aircon to 25C from 1:00 PM to 4:00 PM."},
                    {"rank": 2, "title": "Pre-cool for shorter bursts", "savings_sgd": 11.0, "difficulty": "Easy", "rationale": "A shorter cooling window preserves comfort while trimming peak usage.", "schedule_hint": "Run the aircon for 30 minutes, then switch to fan mode."},
                    {"rank": 3, "title": "Move dryer use off-peak", "savings_sgd": 16.0, "difficulty": "Moderate", "rationale": "Laundry still overlaps with your costlier evening period.", "schedule_hint": "Run dryer cycles after 11:00 PM twice a week."},
                ],
                "savings_report_headline": "You could save up to SGD 41 next month by cooling smarter and shifting laundry later.",
            },
        },
        {
            "scenario_id": "laundry-night-shift",
            "scenario_label": "Off-Peak Laundry Shift",
            "dashboard_timeseries": _build_timeseries("19:00", 2.34, "laundry"),
            "insights": [
                {
                    "id": "laundry-peak-cost",
                    "title": "Laundry is landing in the expensive window",
                    "summary": "Your dryer and washer usage clusters around 7:00 PM, which is one of the least efficient times to run heavy appliances.",
                    "analogy": "It is like joining the longest hawker queue instead of going later.",
                    "impact": {"cost_sgd": 0.58, "carbon_kg": 0.26, "savings_if_shifted_sgd": 12.0},
                    "action": "Shift full laundry cycles to after 11:00 PM on weekdays.",
                },
                {
                    "id": "tou-win",
                    "title": "Your tariff can work harder",
                    "summary": "You are on a Time-of-Use plan but the biggest flexible loads still sit inside the peak tariff band.",
                    "analogy": "That misses the same kind of discount as buying early instead of during surge pricing.",
                    "impact": {"cost_sgd": 0.44, "carbon_kg": 0.22, "savings_if_shifted_sgd": 10.0},
                    "action": "Batch dryer loads for the late-night off-peak period.",
                },
                {
                    "id": "habit-momentum",
                    "title": "One scheduling tweak keeps the streak alive",
                    "summary": "You are close to another reward tier and laundry timing is the simplest lever to get there.",
                    "analogy": "It is the energy version of taking one less paid ride every week.",
                    "impact": {"cost_sgd": 0.35, "carbon_kg": 0.18, "savings_if_shifted_sgd": 8.0},
                    "action": "Use a nightly reminder at 10:45 PM for queued laundry loads.",
                },
            ],
            "spike_events": [
                {
                    "date": yesterday.isoformat(),
                    "spike_time": "19:00",
                    "display_time": "7:00 PM",
                    "reading_kwh": 2.34,
                    "baseline_kwh": 1.18,
                    "stddev_kwh": 0.38,
                    "z_score": 3.05,
                    "estimated_cost_sgd": 0.63,
                    "bubble_tea_equivalent": 4,
                    "likely_appliances": ["Dryer", "Washer", "Aircon", "Other"],
                    "recommended_actions": [
                        "Move dryer cycles to after 11:00 PM.",
                        "Combine smaller loads into one full load.",
                        "Use high-spin mode to shorten dryer runtime.",
                    ],
                    "explanation": "The spike is consistent with a dryer-led laundry block during the peak tariff window.",
                }
            ],
            "forecast_results": {
                "forecast_month": next_month,
                "predicted_bill_sgd": {"min": 91.0, "max": 105.0},
                "confidence": "high",
                "context": "Your overall usage is stable, but peak-hour laundry is adding avoidable cost to the next bill range.",
                "drivers": [
                    "Evening dryer sessions occur several times per week.",
                    "Cooling load is steady rather than rising sharply.",
                    "Flexible appliances can move into off-peak hours.",
                ],
                "top_tip": "Moving two weekly dryer cycles off-peak could cut the next bill by about SGD 12.",
            },
            "disaggregation_attributions": {
                "top_appliances": [
                    {"name": "Dryer", "share_pct": 22, "monthly_cost_sgd": 24.0, "monthly_kwh": 86.0, "tip": "Run full loads after 11:00 PM and clean the lint filter often."},
                    {"name": "Aircon", "share_pct": 28, "monthly_cost_sgd": 31.5, "monthly_kwh": 113.0, "tip": "Use a slightly higher temperature at night."},
                    {"name": "Washer", "share_pct": 10, "monthly_cost_sgd": 11.2, "monthly_kwh": 40.0, "tip": "Batch smaller weekday loads into one cycle."},
                ],
                "upgrade_opportunities": [
                    {"appliance": "Dryer", "current_issue": "The current pattern suggests long heating cycles.", "recommended_model": "Heat-pump dryer", "annual_savings_sgd": 96.0, "points_bonus": 110},
                    {"appliance": "Washer", "current_issue": "Loads are frequent and short.", "recommended_model": "Eco-mode front loader", "annual_savings_sgd": 42.0, "points_bonus": 65},
                ],
            },
            "percentile_rankings": {
                "neighbourhood_percentile": 58,
                "streak_days": 4,
                "tree_status": _tree_status_for_streak(4),
                "points": 332,
                "leaderboard": [
                    {"alias": "NightSaver88", "points": 401},
                    {"alias": "GridGuardian", "points": 386},
                    {"alias": "WeiLing_EcoHome", "points": 332},
                ],
                "next_reward": "NTUC voucher unlocks at 360 points",
            },
            "grid_status": {
                "current_level": "High",
                "stress_score": 81,
                "current_demand_mw": 7155,
                "peak_window": "18:00-21:00",
                "analogy": "This is the grid equivalent of a full food court at dinner rush.",
                "timeline": _build_grid_timeline("High"),
            },
            "optimiser": {
                "monthly_savings_potential_sgd": 33.0,
                "recommended_actions": [
                    {"rank": 1, "title": "Shift dryer cycles off-peak", "savings_sgd": 12.0, "difficulty": "Easy", "rationale": "Laundry is your most flexible high-cost load.", "schedule_hint": "Queue two dryer loads after 11:00 PM each week."},
                    {"rank": 2, "title": "Batch washer loads", "savings_sgd": 8.0, "difficulty": "Easy", "rationale": "Fewer partial loads reduce both washer and dryer runtime.", "schedule_hint": "Combine weekday laundry into larger full loads."},
                    {"rank": 3, "title": "Run eco drying mode", "savings_sgd": 13.0, "difficulty": "Moderate", "rationale": "Your current heating profile suggests the dryer runs longer than needed.", "schedule_hint": "Use eco mode and high-spin washing before drying."},
                ],
                "savings_report_headline": "Laundry timing alone could free up about SGD 33 next month.",
            },
        },
        {
            "scenario_id": "weekend-cooking-surge",
            "scenario_label": "Weekend Cooking Surge",
            "dashboard_timeseries": _build_timeseries("12:00", 2.21, "cooking"),
            "insights": [
                {
                    "id": "midday-cooking-load",
                    "title": "Lunch prep is your standout load",
                    "summary": "Your kitchen appliances are creating a strong noon surge, especially on heavier meal-prep days.",
                    "analogy": "It is like using several hawker stalls at once instead of one at a time.",
                    "impact": {"cost_sgd": 0.49, "carbon_kg": 0.24, "savings_if_shifted_sgd": 9.0},
                    "action": "Stagger rice cooker, oven, and induction hob use during lunch prep.",
                },
                {
                    "id": "fridge-efficiency",
                    "title": "Kitchen load amplifies fridge demand",
                    "summary": "Long cooking blocks warm the kitchen and make the fridge cycle harder than usual afterwards.",
                    "analogy": "That extra drag is like taking one extra MRT stop on every trip.",
                    "impact": {"cost_sgd": 0.22, "carbon_kg": 0.12, "savings_if_shifted_sgd": 6.0},
                    "action": "Keep the fridge door closed during meal prep and cool leftovers before storing them.",
                },
                {
                    "id": "reward-path",
                    "title": "Small kitchen changes can unlock the next badge",
                    "summary": "You are close to the next point threshold and kitchen efficiency is the most realistic route to get there this week.",
                    "analogy": "It is the same as saving a few bubble teas over the month.",
                    "impact": {"cost_sgd": 0.3, "carbon_kg": 0.15, "savings_if_shifted_sgd": 7.0},
                    "action": "Use batch cooking once instead of several short appliance runs.",
                },
            ],
            "spike_events": [
                {
                    "date": yesterday.isoformat(),
                    "spike_time": "12:00",
                    "display_time": "12:00 PM",
                    "reading_kwh": 2.21,
                    "baseline_kwh": 1.09,
                    "stddev_kwh": 0.36,
                    "z_score": 3.11,
                    "estimated_cost_sgd": 0.6,
                    "bubble_tea_equivalent": 4,
                    "likely_appliances": ["Oven", "Rice Cooker", "Induction Hob", "Other"],
                    "recommended_actions": [
                        "Stagger oven and hob usage during meal prep.",
                        "Use residual heat where possible before reheating.",
                        "Batch cook once instead of multiple short sessions.",
                    ],
                    "explanation": "The noon spike matches overlapping kitchen appliance usage rather than cooling load.",
                }
            ],
            "forecast_results": {
                "forecast_month": next_month,
                "predicted_bill_sgd": {"min": 94.0, "max": 108.0},
                "confidence": "medium",
                "context": "Your bill range is stable, but concentrated kitchen appliance use is pushing up midday usage more than expected.",
                "drivers": [
                    "Weekend meal prep creates overlapping kitchen loads.",
                    "Cooling demand is moderate compared with similar homes.",
                    "Fridge and cooking appliances are now the biggest variable loads.",
                ],
                "top_tip": "Staggering lunch prep appliances could trim the next bill by about SGD 9.",
            },
            "disaggregation_attributions": {
                "top_appliances": [
                    {"name": "Cooking appliances", "share_pct": 24, "monthly_cost_sgd": 26.5, "monthly_kwh": 95.0, "tip": "Avoid overlapping oven, hob, and rice cooker sessions."},
                    {"name": "Aircon", "share_pct": 25, "monthly_cost_sgd": 28.0, "monthly_kwh": 100.0, "tip": "Use fan mode during cooler evenings."},
                    {"name": "Fridge", "share_pct": 16, "monthly_cost_sgd": 17.0, "monthly_kwh": 61.0, "tip": "Allow food to cool before storing it."},
                ],
                "upgrade_opportunities": [
                    {"appliance": "Rice cooker", "current_issue": "Long keep-warm windows add silent baseline load.", "recommended_model": "Efficient induction rice cooker", "annual_savings_sgd": 28.0, "points_bonus": 45},
                    {"appliance": "Fridge", "current_issue": "Kitchen heat is increasing compressor workload.", "recommended_model": "5-tick inverter fridge", "annual_savings_sgd": 51.0, "points_bonus": 85},
                ],
            },
            "percentile_rankings": {
                "neighbourhood_percentile": 61,
                "streak_days": 3,
                "tree_status": _tree_status_for_streak(3),
                "points": 341,
                "leaderboard": [
                    {"alias": "LunchShiftHero", "points": 389},
                    {"alias": "EcoCookSG", "points": 356},
                    {"alias": "WeiLing_EcoHome", "points": 341},
                ],
                "next_reward": "Cold Storage voucher unlocks at 375 points",
            },
            "grid_status": {
                "current_level": "Low",
                "stress_score": 54,
                "current_demand_mw": 6120,
                "peak_window": "18:30-20:30",
                "analogy": "The grid is calmer now, more like mid-morning train traffic than rush hour.",
                "timeline": _build_grid_timeline("Low"),
            },
            "optimiser": {
                "monthly_savings_potential_sgd": 24.0,
                "recommended_actions": [
                    {"rank": 1, "title": "Stagger lunch prep appliances", "savings_sgd": 9.0, "difficulty": "Easy", "rationale": "Overlapping kitchen loads are creating the sharpest spikes in your profile.", "schedule_hint": "Run the rice cooker first, then the oven or hob instead of all together."},
                    {"rank": 2, "title": "Shorten keep-warm time", "savings_sgd": 6.0, "difficulty": "Easy", "rationale": "The rice cooker likely stays in keep-warm mode longer than needed.", "schedule_hint": "Turn off keep-warm mode within 20 minutes after lunch."},
                    {"rank": 3, "title": "Cool leftovers before refrigerating", "savings_sgd": 9.0, "difficulty": "Moderate", "rationale": "Hot food storage forces the fridge compressor to work harder.", "schedule_hint": "Let cooked food cool briefly before placing it in the fridge."},
                ],
                "savings_report_headline": "Kitchen scheduling could cut about SGD 24 from next month's bill.",
            },
        },
    ]

    payloads: list[dict] = []
    for scenario in scenarios:
        payload = {
            "user": _base_user(),
            "journey_date": target_date.isoformat(),
            "generated_with": "hardcoded",
            "generated_at": generated_at,
            **scenario,
        }
        payloads.append(DemoPayload.model_validate(payload).model_dump())
    return payloads


def generate_demo_payload(journey_date: str | None = None) -> dict:
    return random.choice(_scenario_payloads(journey_date))


def get_random_demo_payload(journey_date: str | None = None, save: bool = False) -> dict:
    payload = generate_demo_payload(journey_date)
    if save:
        save_demo_payload(payload)
    return payload


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
    return get_random_demo_payload(save=True)


def generate_data() -> dict:
    return get_random_demo_payload(save=True)


if __name__ == "__main__":
    generated = generate_data()
    print(f"Generated {generated['scenario_label']} using {generated['generated_with']} data.")
