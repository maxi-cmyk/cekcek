from fastapi import APIRouter, Query

from data.synthetic_data_generator import load_demo_payload

router = APIRouter(prefix="/api/optimiser", tags=["optimiser"])

@router.get("/")
def get_optimiser_status(refresh: bool = Query(default=False)):
    payload = load_demo_payload(force_refresh=refresh)
    optimiser = payload["optimiser"]
    return {
        "status": "active",
        "optimiser": optimiser,
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
