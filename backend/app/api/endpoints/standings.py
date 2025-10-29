from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from backend.app.models.database import get_db
from backend.app.models.standing import DriverStanding, ConstructorStanding
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.driver_season import DriverSeason  # ✨ NEW
from backend.app.schemas.standing import DriverStandingResponse, ConstructorStandingResponse


router = APIRouter()


@router.get("/drivers", response_model=List[DriverStandingResponse])
async def get_driver_standings(
    season: int = 2025,
    db: AsyncSession = Depends(get_db)
):
    """Get driver championship standings"""
    
    # ✨ UPDATED: Join with driver_seasons to get correct team per season
    result = await db.execute(
        select(DriverStanding, Driver, DriverSeason, Team)
        .join(Driver, DriverStanding.driver_id == Driver.id)
        .join(
            DriverSeason,
            (DriverSeason.driver_id == Driver.id) & 
            (DriverSeason.season == season)
        )
        .join(Team, DriverSeason.team_id == Team.id)
        .where(DriverStanding.season == season)
        .order_by(DriverStanding.position)
    )
    
    standings = []
    for standing, driver, driver_season, team in result:
        standing_dict = {
            "id": standing.id,
            "season": standing.season,
            "driver_id": standing.driver_id,
            "position": standing.position,
            "points": standing.points,
            "wins": standing.wins,
            "driver_name": f"{driver.first_name} {driver.last_name}",
            "driver_code": driver.code,
            "team_name": team.name  # ✅ Now gets correct team from driver_seasons!
        }
        standings.append(DriverStandingResponse(**standing_dict))
    
    return standings


@router.get("/constructors", response_model=List[ConstructorStandingResponse])
async def get_constructor_standings(
    season: int = 2025,
    db: AsyncSession = Depends(get_db)
):
    """Get constructor championship standings"""
    result = await db.execute(
        select(ConstructorStanding, Team)
        .join(Team, ConstructorStanding.team_id == Team.id)
        .where(ConstructorStanding.season == season)
        .order_by(ConstructorStanding.position)
    )
    
    standings = []
    for standing, team in result:
        standing_dict = {
            "id": standing.id,
            "season": standing.season,
            "team_id": standing.team_id,
            "position": standing.position,
            "points": standing.points,
            "wins": standing.wins,
            "team_name": team.name,
            "team_color": team.team_color
        }
        standings.append(ConstructorStandingResponse(**standing_dict))
    
    return standings