from pydantic import BaseModel
from typing import Optional
from datetime import date

class DriverBase(BaseModel):

    driver_number : int
    code : str
    first_name : str
    last_name : str
    nationality : Optional[str] = None
    date_of_birth : Optional[date] = None
    team_id : Optional[int] = None
    image_url: Optional[str] = None
    helmet_image_url: Optional[str] = None


class DriverCreate(DriverBase):
    pass


class DriverUpdate(BaseModel):

    driver_number: Optional[int] = None
    code: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    nationality: Optional[str] = None
    team_id: Optional[int] = None
    image_url: Optional[str] = None
    total_points: Optional[float] = None
    race_wins: Optional[int] = None


class DriverResponse(DriverBase):
    id: int
    total_points: float
    championships: int
    race_wins: int
    podiums: int
    pole_positions: int
    fastest_laps: int
    is_active: int

    class Config:
        from_attributes = True