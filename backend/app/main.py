from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from backend.app.core.config import settings
from backend.app.models.database import engine

from backend.app.api.endpoints import drivers, races, teams, standings


# 👉 Custom CORS middleware to handle Vercel preview URLs
class CustomCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        
        # Check if origin is allowed
        is_allowed = False
        
        # Check explicit allowed origins
        if origin in settings.BACKEND_CORS_ORIGINS:
            is_allowed = True
        
        # Check if it's a Vercel deployment
        if settings.ALLOW_ALL_VERCEL_ORIGINS and origin:
            if "vercel.app" in origin:
                is_allowed = True
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            if is_allowed:
                return Response(
                    status_code=200,
                    headers={
                        "Access-Control-Allow-Origin": origin,
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                        "Access-Control-Allow-Headers": "*",
                        "Access-Control-Allow-Credentials": "true",
                        "Access-Control-Max-Age": "600",
                    }
                )
            else:
                return Response(status_code=400)
        
        # Process actual request
        response = await call_next(request)
        
        # Add CORS headers to response
        if is_allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"] = "*"
        
        return response


# 👉 Modern FastAPI lifespan handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting FastAPI... Checking database connection...")

    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ DATABASE CONNECTED SUCCESSFULLY")
    except Exception as e:
        print("❌ DATABASE CONNECTION FAILED:", e)

    yield

    print("🛑 FastAPI shutting down...")


# 👉 Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    lifespan=lifespan
)


# ✅ Add custom CORS middleware
app.add_middleware(CustomCORSMiddleware)


# Routers
app.include_router(drivers.router, prefix="/api/v1/drivers", tags=["Drivers"])
app.include_router(teams.router, prefix="/api/v1/teams", tags=["Teams"])
app.include_router(races.router, prefix="/api/v1/races", tags=["Races"])
app.include_router(standings.router, prefix="/api/v1/standings", tags=["Standings"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to F1 Prediction Hub API",
        "version": settings.VERSION
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}