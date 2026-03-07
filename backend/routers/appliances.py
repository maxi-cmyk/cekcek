from fastapi import APIRouter, Query

from data.synthetic_data_generator import load_demo_payload

router = APIRouter(prefix="/api/appliances", tags=["appliances"])

@router.get("/")
def get_appliances(refresh: bool = Query(default=False)):
    payload = load_demo_payload(force_refresh=refresh)
    appliance_data = payload["disaggregation_attributions"]
    return {
        "appliances": appliance_data["top_appliances"],
        "upgrade_opportunities": appliance_data["upgrade_opportunities"],
        "generated_with": payload["generated_with"],
        "journey_date": payload["journey_date"],
    }
