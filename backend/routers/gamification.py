from fastapi import APIRouter

router = APIRouter(prefix="/api/gamification", tags=["gamification"])

@router.get("/")
def get_gamification():
    return {"points": 0}
