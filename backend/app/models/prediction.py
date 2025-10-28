from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Text,String
from datetime import datetime
from backend.app.models.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    race_id = Column(Integer, ForeignKey("races.id"), nullable=False)
    
    model_version = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    model_accuracy = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    
    # Feature importance (stored as JSON string)
    feature_importance = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<Prediction for Race {self.race_id}>"


class DriverPrediction(Base):
    __tablename__ = "driver_predictions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=False)
    
    predicted_position = Column(Integer)
    probability = Column(Float)  
    predicted_points = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<DriverPrediction P{self.predicted_position} - Driver {self.driver_id}>"