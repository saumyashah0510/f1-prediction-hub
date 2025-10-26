from pydantic import BaseModel
from typing import Optional

class DriverStandingResponse(BaseModel):
    id: int
    season: int
    driver_id: int
    position: int
    points: float
    wins: int
    
    driver_name: Optional[str] = None
    driver_code: Optional[str] = None
    team_name: Optional[str] = None

    class Config:
        from_attributes = True


class ConstructorStandingResponse(BaseModel):

    id: int
    season: int
    team_id: int
    position: int
    points: float
    wins: int
    
    team_name: Optional[str] = None
    team_color: Optional[str] = None

    class Config:
        from_attributes = True