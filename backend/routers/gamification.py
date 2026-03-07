from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/gamification", tags=["gamification"])

@router.get("/")
def get_gamification(
    refresh: bool = Query(default=False),
    force_fallback: bool = Query(default=False),
):
    payload = get_random_demo_payload(save=refresh, force_fallback=force_fallback)
    gamification = payload["percentile_rankings"]
    return {
        "points": gamification["points"],
        "streak_days": gamification["streak_days"],
        "tree_status": gamification["tree_status"],
        "leaderboard": gamification["leaderboard"],
        "next_reward": gamification["next_reward"],
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
