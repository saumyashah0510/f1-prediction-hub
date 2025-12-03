from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from backend.app.models.database import get_db
from backend.app.models.race import Race
from backend.app.models.result import RaceResult, QualifyingResult
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.schemas.race import RaceResponse, RaceCreate, RaceUpdate
from backend.app.schemas.result import RaceWeekendResponse, RaceResultResponse, QualifyingResultResponse

router = APIRouter()

@router.get("/", response_model=List[RaceResponse])
async def get_all_races(season: int = 2025, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Race).where(Race.season == season).order_by(Race.round_number)
    )
    races = result.scalars().all() 
    return races

@router.get("/upcoming", response_model=RaceResponse)
async def get_next_race(season: int = 2025, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Race).where(Race.season == season, Race.is_completed == 0).order_by(Race.round_number).limit(1)
    )
    race = result.scalar_one_or_none()
    if not race:
        # Fallback to next season if current is done, or return 404
        raise HTTPException(status_code=404, detail="No upcoming races found")
    return race

@router.get("/{race_id}", response_model=RaceResponse)
async def get_race(race_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Race).where(Race.id == race_id))
    race = result.scalar_one_or_none()
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")
    return race

# ✨ NEW ENDPOINT: Get Full Results for a specific race
@router.get("/{race_id}/results", response_model=RaceWeekendResponse)
async def get_race_results(race_id: int, db: AsyncSession = Depends(get_db)):
    # 1. Fetch Race Results (Top 10 + Fastest Lap)
    race_query = (
        select(RaceResult, Driver, Team)
        .join(Driver, RaceResult.driver_id == Driver.id)
        .join(Team, RaceResult.team_id == Team.id)
        .where(RaceResult.race_id == race_id, RaceResult.is_sprint == False)
        .order_by(RaceResult.position)
    )
    race_rows = await db.execute(race_query)
    
    formatted_race_results = []
    fastest_lap_entry = None

    for res, driver, team in race_rows:
        entry = RaceResultResponse(
            position=res.position if res.position else 0,
            driver_name=f"{driver.first_name} {driver.last_name}",
            driver_code=driver.code,
            team_name=team.name,
            points=res.points,
            time=res.race_time,
            status=res.status
        )
        formatted_race_results.append(entry)
        
        # Check for fastest lap (rank 1)
        if res.fastest_lap_rank == 1:
            fastest_lap_entry = entry

    # 2. Fetch Qualifying Results (Top 3 for Pole/Podium context)
    quali_query = (
        select(QualifyingResult, Driver, Team)
        .join(Driver, QualifyingResult.driver_id == Driver.id)
        .join(Team, QualifyingResult.team_id == Team.id)
        .where(QualifyingResult.race_id == race_id)
        .order_by(QualifyingResult.position)
    )
    quali_rows = await db.execute(quali_query)
    
    formatted_quali_results = []
    pole_entry = None

    for res, driver, team in quali_rows:
        entry = QualifyingResultResponse(
            position=res.position if res.position else 0,
            driver_name=f"{driver.first_name} {driver.last_name}",
            driver_code=driver.code,
            team_name=team.name,
            q1=res.q1_time,
            q2=res.q2_time,
            q3=res.q3_time
        )
        formatted_quali_results.append(entry)
        if res.position == 1:
            pole_entry = entry

    return RaceWeekendResponse(
        race_results=formatted_race_results,
        qualifying_results=formatted_quali_results,
        fastest_lap=fastest_lap_entry,
        pole_position=pole_entry
    )

@router.post("/", response_model=RaceResponse, status_code=status.HTTP_201_CREATED)
async def create_race(race: RaceCreate, db: AsyncSession = Depends(get_db)):
    db_race = Race(**race.model_dump())
    db.add(db_race)
    await db.commit()
    await db.refresh(db_race)
    return db_race

@router.put("/{race_id}", response_model=RaceResponse)
async def update_race(race_id: int, race_update: RaceUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Race).where(Race.id == race_id))
    db_race = result.scalar_one_or_none()
    if not db_race:
        raise HTTPException(status_code=404, detail="Race not found")
    
    update_data = race_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_race, field, value)
    
    await db.commit()
    await db.refresh(db_race)
    return db_race

@router.delete("/{race_id}")
async def delete_race(race_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Race).where(Race.id == race_id))
    db_race = result.scalar_one_or_none()
    if not db_race:
        raise HTTPException(status_code=404, detail="Race not found")
    await db.delete(db_race)
    await db.commit()
    return {"message": f"Race {db_race.race_name} deleted successfully"}