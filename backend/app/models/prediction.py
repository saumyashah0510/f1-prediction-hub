from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, Text, String
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
    
    # The Core Regression Prediction
    predicted_position = Column(Integer)
    
    # ✨ NEW: Granular Probabilities from LightGBM
    prob_win = Column(Float, default=0.0)
    prob_podium = Column(Float, default=0.0)
    prob_top5 = Column(Float, default=0.0)
    prob_points = Column(Float, default=0.0)
    
    # Legacy/Generic field (optional, can store win prob here too)
    probability = Column(Float, default=0.0)  
    
    predicted_points = Column(Float, nullable=True)
    
    def __repr__(self):
        return f"<DriverPrediction P{self.predicted_position} - Driver {self.driver_id}>"