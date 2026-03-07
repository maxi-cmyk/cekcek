from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/spike", tags=["spike"])

@router.get("/")
def get_spike_events(refresh: bool = Query(default=False)):
    payload = get_random_demo_payload(save=refresh)
    spike_events = payload["spike_events"]
    return {
        "spike_events": spike_events,
        "latest": spike_events[0] if spike_events else None,
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
