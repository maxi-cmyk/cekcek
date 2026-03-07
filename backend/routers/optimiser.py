from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/optimiser", tags=["optimiser"])

@router.get("/")
def get_optimiser_status(refresh: bool = Query(default=False)):
    payload = get_random_demo_payload(save=refresh)
    optimiser = payload["optimiser"]
    return {
        "status": "active",
        "optimiser": optimiser,
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
