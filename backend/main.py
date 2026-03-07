from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import (
    insights,
    spike,
    optimiser,
    forecast,
    grid,
    appliances,
    gamification,
)

app = FastAPI(title="Demo Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(insights.router)
app.include_router(spike.router)
app.include_router(optimiser.router)
app.include_router(forecast.router)
app.include_router(grid.router)
app.include_router(appliances.router)
app.include_router(gamification.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is running"}
