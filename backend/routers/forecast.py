from fastapi import APIRouter, Query

from data.synthetic_data_generator import load_demo_payload

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.get("/")
def get_forecast(refresh: bool = Query(default=False)):
    payload = load_demo_payload(force_refresh=refresh)
    return {
        "forecast": payload["forecast_results"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
