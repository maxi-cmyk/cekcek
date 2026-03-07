from fastapi import APIRouter

router = APIRouter(prefix="/api/appliances", tags=["appliances"])

@router.get("/")
def get_appliances():
    return {"appliances": []}
