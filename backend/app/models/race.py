from sqlalchemy import Column, Integer, String, Date, Time, Float
from backend.app.models.database import Base

class Race(Base):
    __tablename__ = "races"

    id = Column(Integer, primary_key=True, index=True)
    season = Column(Integer, nullable=False)
    round_number = Column(Integer, nullable=False)
    race_name = Column(String(200), nullable=False)
    
    circuit_name = Column(String(200))
    circuit_location = Column(String(200))
    country = Column(String(100))
    circuit_length = Column(Float)  
    laps = Column(Integer)
    
    circuit_type = Column(String(50))  
    
    circuit_map_url = Column(String(500))
    country_flag_url = Column(String(500))
    
    race_date = Column(Date)
    race_time = Column(Time, nullable=True)
    
    fp1_date = Column(Date, nullable=True)
    fp1_time = Column(Time, nullable=True)
    fp2_date = Column(Date, nullable=True)
    fp2_time = Column(Time, nullable=True)
    fp3_date = Column(Date, nullable=True)
    fp3_time = Column(Time, nullable=True)
    
    qualifying_date = Column(Date, nullable=True)
    qualifying_time = Column(Time, nullable=True)
    
    has_sprint = Column(Integer, default=0)  
    sprint_date = Column(Date, nullable=True)
    sprint_time = Column(Time, nullable=True)
    
    is_completed = Column(Integer, default=0)  
    
    def __repr__(self):
        return f"<Race {self.season} - Round {self.round_number}: {self.race_name}>"