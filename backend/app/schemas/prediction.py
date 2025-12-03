from pydantic import BaseModel
from typing import Optional

class PredictionRow(BaseModel):
    driver_name: str
    driver_code: str
    team_name: str
    
    predicted_position: int
    actual_position: Optional[int] = None # For past races
    
    # Probabilities
    prob_win: float
    prob_podium: float
    prob_top5: float
    prob_points: float
    
    class Config:
        from_attributes = True