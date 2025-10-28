from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from backend.app.models.database import get_db
from backend.app.models.driver import Driver
from backend.app.schemas.driver import DriverResponse,DriverCreate,DriverUpdate

router = APIRouter()


@router.get("/",response_model=List[DriverResponse])
async def get_all_drivers(active_only : bool = True, db: AsyncSession = Depends(get_db)):

    query = select(Driver)
    if active_only:
        query = query.where(Driver.is_active == 1)

    result = await db.execute(query)
    drivers = result.scalars().all()
    return drivers    


@router.get("/{driver_id}",response_model=DriverResponse)
async def get_driver(driver_id : int, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Driver).where(Driver.id == driver_id)
    )
    driver = result.scalar_one_or_none()

    if not driver:
        raise HTTPException(status_code=404,detail = "Driver not found")
    
    return driver


@router.get("/code/{driver_code}", response_model=DriverResponse)
async def get_driver_by_code(driver_code: str,db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(
        select(Driver).where(Driver.code == driver_code.upper())
    )
    driver = result.scalar_one_or_none()
    
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    return driver


@router.post("/",response_model=DriverResponse,status_code=status.HTTP_201_CREATED)
async def create_driver(driver : DriverCreate, db:AsyncSession = Depends(get_db)):

    db_driver = Driver(**driver.model_dump())
    db.add(db_driver)
    await db.commit()
    await db.refresh(db_driver)
    return db_driver


@router.put("/{driver_id}",response_model=DriverResponse)
async def update_driver(driver_id:int,driver_update:DriverUpdate,db:AsyncSession=Depends(get_db)):

    result = await db.execute(
        select(Driver).where(Driver.id == driver_id)
    )
    db_driver = result.scalar_one_or_none()

    if not db_driver:
        raise HTTPException(status_code=404,detail="Driver not found")
    
    update_data = driver_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_driver, field, value)
    
    await db.commit()
    await db.refresh(db_driver)
    return db_driver


# Doesnt actually delete but marks inactive
@router.delete("/{driver_id}")
async def delete_driver(driver_id:int, db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Driver).where(Driver.id == driver_id)
    )
    db_driver = result.scalar_one_or_none()

    if not db_driver:
        raise HTTPException(status_code=404,detail="Driver not found")
    
    db_driver.is_active = 0
    await db.commit()

    return {"message" : f"Driver {db_driver.first_name} {db_driver.last_name} deleted successfully"}


@router.delete("/{driver_id}/permanent")
async def permanently_delete_driver(driver_id : int, db :AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(Driver).where(Driver.id == driver_id)
    )
    db_driver = result.scalar_one_or_none()

    if not db_driver:
        raise HTTPException(status_code=404,detail="Driver not found")
    
    await db.delete(db_driver)
    await db.commit()
    return {"message" : "Driver permanently deleted"}