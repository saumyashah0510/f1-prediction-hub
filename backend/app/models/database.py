from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from backend.app.core.config import settings

# ---------------------------
# 1. Ensure correct async URL
# ---------------------------
database_url = settings.DATABASE_URL

# Add SSL if missing
if "sslmode" not in database_url:
    database_url += "?sslmode=require"

# Convert to async URL
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# ---------------------------
# 2. Create engine with SSL
# ---------------------------
engine = create_async_engine(
    database_url,
    echo=True,
    future=True
)

# ---------------------------
# 3. Async session factory
# ---------------------------
AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

class Base(DeclarativeBase):
    pass

# ---------------------------
# 4. Dependency for FastAPI
# ---------------------------
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
