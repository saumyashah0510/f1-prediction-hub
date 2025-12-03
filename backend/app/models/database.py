from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from backend.app.core.config import settings


# ---------------------------
# 1. Clean + correct URL
# ---------------------------
database_url = settings.DATABASE_URL

# Ensure it uses asyncpg
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif database_url.startswith("postgresql://"):
    database_url = database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Remove unsupported query params (important)
if "channel_binding" in database_url:
    # keep only the base before '?'
    base = database_url.split("?", 1)[0]
    database_url = base + "?ssl=true"

# Ensure final query param is only ssl=true
if "?" not in database_url:
    database_url += "?ssl=true"


# ---------------------------
# 2. Create engine
# ---------------------------
engine = create_async_engine(
    database_url,
    echo=True,
    future=True
)

# ---------------------------
# 3. Async session
# ---------------------------
AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)


class Base(DeclarativeBase):
    pass


# ---------------------------
# 4. FastAPI DB dependency
# ---------------------------
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
