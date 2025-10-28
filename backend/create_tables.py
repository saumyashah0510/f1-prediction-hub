import asyncio
from backend.app.models import Base, engine

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ All tables created successfully!")

if __name__ == "__main__":
    asyncio.run(create_tables())