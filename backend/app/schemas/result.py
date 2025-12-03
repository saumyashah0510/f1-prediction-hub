from pydantic import BaseModel
from typing import Optional

class RaceResultResponse(BaseModel):
    position: int
    driver_name: str
    driver_code: str
    team_name: str
    points: float
    time: Optional[str] = None
    status: str
    
    class Config:
        from_attributes = True

class QualifyingResultResponse(BaseModel):
    position: int
    driver_name: str
    driver_code: str
    team_name: str
    q1: Optional[str] = None
    q2: Optional[str] = None
    q3: Optional[str] = None

    class Config:
        from_attributes = True

class RaceWeekendResponse(BaseModel):
    race_results: list[RaceResultResponse]
    qualifying_results: list[QualifyingResultResponse]
    fastest_lap: Optional[RaceResultResponse] = None
    pole_position: Optional[QualifyingResultResponse] = None