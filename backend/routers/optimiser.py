from fastapi import APIRouter

router = APIRouter(prefix="/api/optimiser", tags=["optimiser"])

@router.get("/")
def get_optimiser_status():
    return {"status": "active"}
