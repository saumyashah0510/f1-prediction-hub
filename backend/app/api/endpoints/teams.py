from fastapi import APIRouter, Depends, HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from backend.app.models.database import get_db
from backend.app.models.team import Team
from backend.app.schemas.team import TeamResponse, TeamCreate, TeamUpdate


router = APIRouter()


@router.get("/",response_model=List[TeamResponse])
async def get_teams(active_only: bool = True, db:AsyncSession = Depends(get_db)):

    query = select(Team)
    if active_only:
        query = query.where(Team.is_active == 1)

    result = await db.execute(query)
    teams  = result.scalars().all()
    return teams


@router.get("/{team_id}",response_model=TeamResponse)
async def get_team(team_id : int, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    team = result.scalar_one_or_none()

    if not team:
        raise HTTPException(status_code=404,detail = "Team not found")
    
    return team


@router.post("/",response_model=TeamResponse,status_code=status.HTTP_201_CREATED)
async def create_team(team : TeamCreate, db:AsyncSession = Depends(get_db)):

    db_team = Team(**team.model_dump())
    db.add(db_team)
    await db.commit()
    await db.refresh(db_team)
    return db_team


@router.put("/{team_id}",response_model=TeamResponse)
async def update_team(team_id:int,team_update:TeamUpdate,db:AsyncSession=Depends(get_db)):

    result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    db_team = result.scalar_one_or_none()

    if not db_team:
        raise HTTPException(status_code=404,detail="Team not found")
    
    update_data = team_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_team, field, value)
    
    await db.commit()
    await db.refresh(db_team)
    return db_team


# Doesnt actually delete but marks inactive
@router.delete("/{team_id}")
async def delete_team(team_id:int, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    db_team = result.scalar_one_or_none()

    if not db_team:
        raise HTTPException(status_code=404,detail="Team not found")
    
    db_team.is_active = 0
    await db.commit()

    return {"message" : f"Team {db_team.name} deleted successfully"}


@router.delete("/{team_id}/permanent")
async def permanently_delete_team(team_id : int, db :AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Team).where(Team.id == team_id)
    )
    db_team = result.scalar_one_or_none()

    if not db_team:
        raise HTTPException(status_code=404,detail="Team not found")
    
    await db.delete(db_team)
    await db.commit()
    return {"message" : "Team permanently deleted"}


