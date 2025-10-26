from pydantic import BaseModel
from typing import Optional
from datetime import date, time

class RaceBase(BaseModel):
    
    season: int
    round_number: int
    race_name: str
    circuit_name: Optional[str] = None
    circuit_location: Optional[str] = None
    country: Optional[str] = None
    circuit_length: Optional[float] = None
    laps: Optional[int] = None
    circuit_type: Optional[str] = None
    race_date: Optional[date] = None


class RaceCreate(RaceBase):
    pass


class RaceUpdate(BaseModel):
    season: Optional[int] = None
    round_number: Optional[int] = None
    race_name: Optional[str] = None
    circuit_name: Optional[str] = None
    race_date: Optional[date] = None
    is_completed: Optional[int] = None


class RaceResponse(RaceBase):

    id: int
    circuit_map_url: Optional[str] = None
    country_flag_url: Optional[str] = None
    race_time: Optional[time] = None
    qualifying_date: Optional[date] = None
    has_sprint: int
    is_completed: int

    class Config:
        from_attributes = True