# backend/app/models/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from urllib.parse import urlparse, urlunparse
import os
import ssl as ssl_module

# Read from settings or environment
from backend.app.core.config import settings

_raw_db = os.environ.get("DATABASE_URL") or getattr(settings, "DATABASE_URL", None)

if not _raw_db:
    raise RuntimeError("DATABASE_URL is missing")

def mask_db(url: str) -> str:
    """Mask credentials in database URL for logging"""
    try:
        if "@" not in url:
            return "****"
        parts = url.split("@")
        head = parts[0]
        if "://" in head:
            head_proto, creds = head.split("://", 1)
            return f"{head_proto}://****:****@{parts[1]}"
        return "****"
    except Exception:
        return "****"

# Parse URL
parsed = urlparse(_raw_db)

# Validate required URL components
if not parsed.netloc:
    raise ValueError(f"Invalid DATABASE_URL: missing host/netloc in '{mask_db(_raw_db)}'")

# Convert scheme to asyncpg
scheme = parsed.scheme
if scheme in ("postgres", "postgresql"):
    scheme = "postgresql+asyncpg"
elif not scheme.startswith("postgresql+asyncpg"):
    scheme = "postgresql+asyncpg"

# Build clean URL WITHOUT any query parameters
# We'll handle SSL via connect_args instead
clean_url = urlunparse((
    scheme,
    parsed.netloc,
    parsed.path or "",
    "",  # No params
    "",  # No query string
    ""   # No fragment
))

# Ensure asyncpg is in the scheme
if "asyncpg" not in clean_url:
    clean_url = clean_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    clean_url = clean_url.replace("postgres://", "postgresql+asyncpg://", 1)

# Debug logging (masked)
print("=" * 60)
print("DATABASE CONNECTION INFO")
print("=" * 60)
print(f"Masked URL: {mask_db(clean_url)}")
print(f"SSL Mode: require (via connect_args)")
print("=" * 60)

# Create SSL context for secure connection
ssl_context = ssl_module.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl_module.CERT_NONE

# Create engine with SSL configured via connect_args
# This bypasses the sslmode parameter issue entirely
engine = create_async_engine(
    clean_url,
    echo=True,  # Set to False in production
    future=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={
        "ssl": ssl_context,  # Pass SSL context directly to asyncpg
    }
)

# Create session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

class Base(DeclarativeBase):
    pass

async def get_db():
    """Dependency for getting database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()