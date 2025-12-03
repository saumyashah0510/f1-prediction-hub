# backend/app/models/database.py  (or backend/app/db/database.py)
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
import os

# read from settings if you have it, otherwise from env
from backend.app.core.config import settings
_raw_db = os.environ.get("DATABASE_URL") or getattr(settings, "DATABASE_URL", None)

if not _raw_db:
    raise RuntimeError("DATABASE_URL is missing")

def mask_db(url: str) -> str:
    try:
        parts = url.split("@")
        head = parts[0]
        head_proto, creds = head.split("://", 1)
        return head_proto + "://****:****@" + parts[1]
    except Exception:
        return "****"

# Parse and normalize
parsed = urlparse(_raw_db)

# Ensure scheme -> asyncpg style
scheme = parsed.scheme
if scheme == "postgres":
    scheme = "postgresql+asyncpg"
elif scheme == "postgresql":
    # if already 'postgresql+asyncpg' keep it, else convert
    if not parsed.scheme.startswith("postgresql+asyncpg"):
        scheme = "postgresql+asyncpg"
else:
    # leave other schemes intact (but we expect postgres*)
    if not parsed.scheme.startswith("postgresql+asyncpg"):
        scheme = parsed.scheme

# Query params cleanup
qs = parse_qs(parsed.query, keep_blank_values=True)

# Remove unsupported params
for bad in ["channel_binding", "application_name", "fallback_application_name"]:
    if bad in qs:
        qs.pop(bad, None)

# Handle sslmode -> convert to ssl=true if value is acceptable
# Acceptable sslmode values for libpq: disable, allow, prefer, require, verify-ca, verify-full
sslmode = None
if "sslmode" in qs:
    sslmode_val = qs.pop("sslmode", [None])[0]
    if sslmode_val and sslmode_val.lower() in {"disable", "allow", "prefer", "require", "verify-ca", "verify-full"}:
        # if sslmode == 'disable' -> do not set ssl param
        if sslmode_val.lower() != "disable":
            qs["ssl"] = ["true"]
        # else disable -> do nothing (no ssl param)
    else:
        # malformed value — map to ssl=true as fallback
        qs["ssl"] = ["true"]

# If explicit ssl=true present, keep it
if "ssl" in qs:
    # ensure it's the string 'true'
    qs["ssl"] = ["true"]

# Build cleaned query string
clean_qs = urlencode({k: v[0] for k, v in qs.items()}) if qs else ""

# Rebuild URL
netloc = parsed.netloc
# If original URL had no username:password (rare), leave as-is
normalized = urlunparse((scheme, netloc, parsed.path or "", parsed.params or "", clean_qs, parsed.fragment or ""))

# Final safety: ensure scheme contains asyncpg
if "asyncpg" not in normalized:
    normalized = normalized.replace("postgresql://", "postgresql+asyncpg://", 1).replace("postgres://", "postgresql+asyncpg://", 1)

# If nothing in query, add ssl=true as default (Neon requires ssl)
if "?" not in normalized or normalized.endswith("?"):
    # Only add if it's a postgres URL
    if normalized.startswith("postgresql+asyncpg://"):
        normalized = normalized + "?ssl=true"

# Print masked debug line (appears in logs)
print("DEBUG: using DATABASE_URL (masked):", mask_db(normalized))
if "?" in normalized:
    print("DEBUG: final query params:", normalized.split("?",1)[1])

# Create engine
engine = create_async_engine(
    normalized,
    echo=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False,
    class_=AsyncSession
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
