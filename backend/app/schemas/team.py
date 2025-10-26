from pydantic import BaseModel
from typing import Optional

class TeamBase(BaseModel):
    
    name: str
    full_name: Optional[str] = None
    nationality: Optional[str] = None
    base: Optional[str] = None
    team_color: Optional[str] = None
    logo_url: Optional[str] = None
    car_image_url: Optional[str] = None
    engine: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):

    name: Optional[str] = None
    full_name: Optional[str] = None
    total_points: Optional[float] = None
    race_wins: Optional[int] = None


class TeamResponse(TeamBase):

    id: int
    total_points: float
    championships: int
    race_wins: int
    pole_positions: int
    fastest_laps: int
    is_active: int

    class Config:
        from_attributes = True