from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from backend.app.models.database import Base

class DriverSeason(Base):
    
    __tablename__ = "driver_seasons"

    id = Column(Integer, primary_key=True, index=True)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=False)
    season = Column(Integer, nullable=False)
    
    __table_args__ = (
        UniqueConstraint('driver_id', 'season', name='uq_driver_season'),
    )
    
    def __repr__(self):
        return f"<DriverSeason driver={self.driver_id} team={self.team_id} season={self.season}>"