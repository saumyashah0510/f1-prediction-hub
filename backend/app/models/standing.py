from sqlalchemy import Column, Integer, Float, ForeignKey, String
from app.models.database import Base

class DriverStanding(Base):
    __tablename__ = "driver_standings"

    id = Column(Integer, primary_key=True, index=True)
    season = Column(Integer, nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    
    position = Column(Integer)
    points = Column(Float, default=0.0)
    wins = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<DriverStanding {self.season} - P{self.position}>"


class ConstructorStanding(Base):
    __tablename__ = "constructor_standings"

    id = Column(Integer, primary_key=True, index=True)
    season = Column(Integer, nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    
    position = Column(Integer)
    points = Column(Float, default=0.0)
    wins = Column(Integer, default=0)
    
    def __repr__(self):
        return f"<ConstructorStanding {self.season} - P{self.position}>"