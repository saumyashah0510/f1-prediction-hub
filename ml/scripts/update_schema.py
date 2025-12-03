import sys
import os
from sqlalchemy import create_engine, text

# Add path to access backend config
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from backend.app.core.config import settings

def update_db_schema():
    print("🔄 Updating Database Schema for Detailed Predictions...")
    
    # Sync connection string
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg", "postgresql")
    engine = create_engine(db_url)
    
    with engine.connect() as conn:
        try:
            # Add new columns if they don't exist
            conn.execute(text("ALTER TABLE driver_predictions ADD COLUMN IF NOT EXISTS prob_win FLOAT DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE driver_predictions ADD COLUMN IF NOT EXISTS prob_podium FLOAT DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE driver_predictions ADD COLUMN IF NOT EXISTS prob_top5 FLOAT DEFAULT 0.0"))
            conn.execute(text("ALTER TABLE driver_predictions ADD COLUMN IF NOT EXISTS prob_points FLOAT DEFAULT 0.0"))
            
            conn.commit()
            print("✅ Schema updated successfully! Ready for v3 Predictions.")
        except Exception as e:
            print(f"❌ Error updating schema: {e}")

if __name__ == "__main__":
    update_db_schema()