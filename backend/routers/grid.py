from fastapi import APIRouter, Query

from data.synthetic_data_generator import load_demo_payload

router = APIRouter(prefix="/api/grid", tags=["grid"])

@router.get("/")
def get_grid_demand(refresh: bool = Query(default=False)):
    payload = load_demo_payload(force_refresh=refresh)
    grid_status = payload["grid_status"]
    return {
        "grid_status": grid_status,
        "demand": grid_status["timeline"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
