from fastapi import APIRouter

router = APIRouter(prefix="/api/spike", tags=["spike"])

@router.get("/")
def get_spike_events():
    return {"spike_events": []}
