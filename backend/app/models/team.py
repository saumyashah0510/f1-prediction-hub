from sqlalchemy import Column, Integer, String, Float
from backend.app.models.database import Base

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(200))
    nationality = Column(String(100))
    base = Column(String(200))   # Team headquarters location
    
    team_color = Column(String(7)) # Hex color code
    logo_url = Column(String(500))
    car_image_url = Column(String(500))
    
    total_points = Column(Float, default=0.0)
    championships = Column(Integer, default=0)
    race_wins = Column(Integer, default=0)
    pole_positions = Column(Integer, default=0)
    fastest_laps = Column(Integer, default=0)
    
    is_active = Column(Integer, default=1)
    
    engine = Column(String(100))  
    
    def __repr__(self):
        return f"<Team {self.name}>"