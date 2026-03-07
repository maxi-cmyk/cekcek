from fastapi import APIRouter

router = APIRouter(prefix="/api/grid", tags=["grid"])

@router.get("/")
def get_grid_demand():
    return {"demand": []}
