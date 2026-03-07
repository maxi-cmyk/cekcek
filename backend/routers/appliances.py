from fastapi import APIRouter, Query

from data.synthetic_data_generator import get_random_demo_payload

router = APIRouter(prefix="/api/appliances", tags=["appliances"])

@router.get("/")
def get_appliances(refresh: bool = Query(default=False)):
    payload = get_random_demo_payload(save=refresh)
    appliance_data = payload["disaggregation_attributions"]
    return {
        "appliances": appliance_data["top_appliances"],
        "upgrade_opportunities": appliance_data["upgrade_opportunities"],
        "scenario_id": payload["scenario_id"],
        "scenario_label": payload["scenario_label"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
