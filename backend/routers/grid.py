from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/grid", tags=["grid"])

@router.get("/")
def get_grid_demand(
    refresh: bool = Query(default=False),
    force_fallback: bool = Query(default=False),
):
    payload = get_random_demo_payload(save=refresh, force_fallback=force_fallback)
    grid_status = payload["grid_status"]
    return {
        "grid_status": grid_status,
        "demand": grid_status["timeline"],
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
