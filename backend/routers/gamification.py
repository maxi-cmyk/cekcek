from fastapi import APIRouter, Query

from data.synthetic_data_generator import load_demo_payload

router = APIRouter(prefix="/api/gamification", tags=["gamification"])

@router.get("/")
def get_gamification(refresh: bool = Query(default=False)):
    payload = load_demo_payload(force_refresh=refresh)
    gamification = payload["percentile_rankings"]
    return {
        "points": gamification["points"],
        "streak_days": gamification["streak_days"],
        "tree_status": gamification["tree_status"],
        "leaderboard": gamification["leaderboard"],
        "next_reward": gamification["next_reward"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
