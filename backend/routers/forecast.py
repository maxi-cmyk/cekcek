from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.get("/")
def get_forecast(refresh: bool = Query(default=False)):
    payload = get_random_demo_payload(save=refresh)
    return {
        "forecast": payload["forecast_results"],
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
