from fastapi import APIRouter

router = APIRouter(prefix="/api/forecast", tags=["forecast"])

@router.get("/")
def get_forecast():
    return {"forecast": {}}
