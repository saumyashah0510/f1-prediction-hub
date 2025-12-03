# backend/app/models/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
import os

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

# Parse and normalize
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

# Parse query parameters
qs = parse_qs(parsed.query, keep_blank_values=True)

# Remove unsupported/problematic parameters
unsupported_params = [
    "channel_binding", 
    "application_name", 
    "fallback_application_name",
    "sslmode"  # Remove sslmode entirely - we'll use ssl parameter instead
]

for param in unsupported_params:
    qs.pop(param, None)

# Always use ssl=true for Neon and most managed Postgres
# Only set to false if explicitly told to disable
if "ssl" not in qs:
    qs["ssl"] = ["true"]
else:
    # Normalize ssl parameter to 'true' or 'false'
    ssl_val = qs["ssl"][0] if isinstance(qs["ssl"], list) else qs["ssl"]
    qs["ssl"] = ["true" if str(ssl_val).lower() in ("true", "1", "yes") else "false"]

# Build cleaned query string
clean_qs = urlencode({k: v[0] if isinstance(v, list) else v for k, v in qs.items()}) if qs else ""

# Rebuild URL
normalized = urlunparse((
    scheme,
    parsed.netloc,
    parsed.path or "",
    parsed.params or "",
    clean_qs,
    parsed.fragment or ""
))

# Ensure asyncpg is in the scheme
if "asyncpg" not in normalized:
    normalized = normalized.replace("postgresql://", "postgresql+asyncpg://", 1)
    normalized = normalized.replace("postgres://", "postgresql+asyncpg://", 1)

# Debug logging (masked)
print("=" * 60)
print("DATABASE CONNECTION INFO")
print("=" * 60)
print(f"Masked URL: {mask_db(normalized)}")
if "?" in normalized:
    print(f"Query params: {normalized.split('?', 1)[1]}")
print("=" * 60)

# Create engine with appropriate pool settings
engine = create_async_engine(
    normalized,
    echo=True,  # Set to False in production
    future=True,
    pool_pre_ping=True,  # Verify connections before using them
    pool_size=5,  # Adjust based on your needs
    max_overflow=10,  # Additional connections if pool is exhausted
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