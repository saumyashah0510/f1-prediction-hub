from sqlalchemy import Column, Integer, String, Date, Float
from sqlalchemy.orm import relationship
from app.models.database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True, index=True)
    driver_number = Column(Integer, unique=True, nullable=False)
    code = Column(String(3), unique=True, nullable=False)  
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    nationality = Column(String(100))
    date_of_birth = Column(Date)
    team_id = Column(Integer, nullable=True)
    
    image_url = Column(String(500))
    helmet_image_url = Column(String(500))
    
    total_points = Column(Float, default=0.0)
    championships = Column(Integer, default=0)
    race_wins = Column(Integer, default=0)
    podiums = Column(Integer, default=0)
    pole_positions = Column(Integer, default=0)
    fastest_laps = Column(Integer, default=0)
    
    is_active = Column(Integer, default=1) 

    def __repr__(self):
        return f"<Driver {self.first_name} {self.last_name} ({self.code})>"