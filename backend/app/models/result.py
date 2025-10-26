from sqlalchemy import Column, Integer, String, Float, ForeignKey, Time
from app.models.database import Base

class RaceResult(Base):
    __tablename__ = "race_results"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    position = Column(Integer)  # Final position
    grid_position = Column(Integer)  # Starting grid position
    points = Column(Float, default=0.0)
    laps_completed = Column(Integer)
    
    race_time = Column(String(50), nullable=True)  # e.g., "1:32:15.123"
    fastest_lap = Column(String(50), nullable=True)
    fastest_lap_rank = Column(Integer, nullable=True)
    
    status = Column(String(50))  
    
    def __repr__(self):
        return f"<RaceResult P{self.position} - Driver {self.driver_id}>"


class QualifyingResult(Base):
    __tablename__ = "qualifying_results"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    position = Column(Integer)
    q1_time = Column(String(50), nullable=True)
    q2_time = Column(String(50), nullable=True)
    q3_time = Column(String(50), nullable=True)
    
    def __repr__(self):
        return f"<QualifyingResult P{self.position} - Driver {self.driver_id}>"