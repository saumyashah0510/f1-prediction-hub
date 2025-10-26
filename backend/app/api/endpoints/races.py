from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.database import get_db
from app.models.race import Race
from app.schemas.race import RaceResponse, RaceCreate, RaceUpdate


router = APIRouter()


@router.get("/",response_model=List[RaceResponse])
async def get_all_races(season: int=2025, db:AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Race).where(Race.season == season).order_by(Race.round_number)
    )
    races = result.scalars().all() 
    return races


@router.get("/upcoming",response_model=RaceResponse)
async def get_next_race(season:int = 2025, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Race).where(Race.season == season,Race.is_completed == 0).order_by(Race.round_number).limit(1)
    )
    race = result.scalar_one_or_none()

    if not race:
        raise HTTPException(status_code=404,detail = "No upcoming races found")
    
    return race

@router.get("/{race_id}", response_model=RaceResponse)
async def get_race(race_id: int,db: AsyncSession = Depends(get_db)):
   
    result = await db.execute(
        select(Race).where(Race.id == race_id)
    )
    race = result.scalar_one_or_none()
    
    if not race:
        raise HTTPException(status_code=404, detail="Race not found")
    
    return race


@router.post("/",response_model=RaceResponse,status_code=status.HTTP_201_CREATED)
async def create_race(race : RaceCreate, db:AsyncSession = Depends(get_db)):

    db_race = Race(**race.model_dump())
    db.add(db_race)
    await db.commit()
    await db.refresh(db_race)
    return db_race


@router.put("/{race_id}",response_model=RaceResponse)
async def update_race(race_id:int,race_update:RaceUpdate,db:AsyncSession=Depends(get_db)):

    result = await db.execute(
        select(Race).where(Race.id == race_id)
    )
    db_race = result.scalar_one_or_none()

    if not db_race:
        raise HTTPException(status_code=404,detail="Race not found")
    
    update_data = race_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_race, field, value)
    
    await db.commit()
    await db.refresh(db_race)
    return db_race


@router.delete("/{race_id}")
async def delete_race(race_id : int, db :AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Race).where(Race.id == race_id)
    )
    db_race = result.scalar_one_or_none()

    if not db_race:
        raise HTTPException(status_code=404,detail="Race not found")
    
    await db.delete(db_race)
    await db.commit()
    return {"message" : f"Race {db_race.race_name} deleted successfully"}
