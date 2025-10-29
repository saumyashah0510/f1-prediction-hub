import asyncio
import sys
import os

from backend.app.models.database import Base, engine


from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.race import Race
from backend.app.models.result import RaceResult, QualifyingResult
from backend.app.models.standing import DriverStanding, ConstructorStanding
from backend.app.models.prediction import Prediction, DriverPrediction
from backend.app.models.driver_season import DriverSeason 

async def create_tables():
    """Drop and recreate all database tables"""
    print("🗑️  Dropping all existing tables...")
    
    async with engine.begin() as conn:
        # Drop all tables
        await conn.run_sync(Base.metadata.drop_all)
        print("✅ All tables dropped")
        
        # Create all tables
        print("\n🏗️  Creating tables...")
        await conn.run_sync(Base.metadata.create_all)
    
    print("\n✅ All tables created successfully!")
    print("\n📋 Tables created:")
    print("   1. drivers")
    print("   2. teams")
    print("   3. races")
    print("   4. race_results")
    print("   5. qualifying_results")
    print("   6. driver_standings")
    print("   7. constructor_standings")
    print("   8. predictions")
    print("   9. driver_predictions")
    print("  10. driver_seasons ← NEW!")

if __name__ == "__main__":
    asyncio.run(create_tables())