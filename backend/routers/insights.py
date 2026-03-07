from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/insights", tags=["insights"])


@router.get("/")
def get_insights(refresh: bool = Query(default=False)):
    payload = get_random_demo_payload(save=refresh)
    return {
        "data": {
            "scenario_id": payload["scenario_id"],
            "scenario_label": payload["scenario_label"],
            "user": payload["user"],
            "dashboard_timeseries": payload["dashboard_timeseries"],
            "insights": payload["insights"],
        },
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
