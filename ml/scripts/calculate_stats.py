import sys
import os
import asyncio

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.app.models.database import AsyncSessionLocal
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.race import Race
from backend.app.models.result import RaceResult
from backend.app.models.standing import DriverStanding, ConstructorStanding
from sqlalchemy import select, func, and_

class F1StatsCalculator:
    """Calculate F1 statistics and standings"""
    
    def __init__(self):
        pass
    
    async def calculate_driver_stats(self, season=None):
        """Calculate career statistics for drivers"""
        print(f"\n📊 Calculating driver statistics...")
        
        async with AsyncSessionLocal() as db:
            # Get all drivers
            result = await db.execute(select(Driver))
            drivers = result.scalars().all()
            
            for driver in drivers:
                # Build query - optionally filter by season
                query = select(RaceResult).where(RaceResult.driver_id == driver.id)
                
                if season:
                    # Join with races to filter by season
                    query = query.join(Race).where(Race.season == season)
                
                result = await db.execute(query)
                results = result.scalars().all()
                
                if not results:
                    continue
                
                # Calculate stats
                total_points = sum(r.points for r in results)
                race_wins = sum(1 for r in results if r.position == 1)
                podiums = sum(1 for r in results if r.position and r.position <= 3)
                pole_positions = sum(1 for r in results if r.grid_position == 1)
                fastest_laps = sum(1 for r in results if r.fastest_lap_rank == 1)
                
                # Update driver
                driver.total_points = total_points
                driver.race_wins = race_wins
                driver.podiums = podiums
                driver.pole_positions = pole_positions
                driver.fastest_laps = fastest_laps
                
                print(f"   ✅ {driver.code}: {total_points} pts, {race_wins} wins, {podiums} podiums")
            
            await db.commit()
            print(f"✅ Updated {len(drivers)} drivers")
    
    async def calculate_team_stats(self, season=None):
        """Calculate statistics for teams"""
        print(f"\n🏁 Calculating team statistics...")
        
        async with AsyncSessionLocal() as db:
            # Get all teams
            result = await db.execute(select(Team))
            teams = result.scalars().all()
            
            for team in teams:
                # Build query
                query = select(RaceResult).where(RaceResult.team_id == team.id)
                
                if season:
                    query = query.join(Race).where(Race.season == season)
                
                result = await db.execute(query)
                results = result.scalars().all()
                
                if not results:
                    continue
                
                # Calculate stats
                total_points = sum(r.points for r in results)
                race_wins = sum(1 for r in results if r.position == 1)
                pole_positions = sum(1 for r in results if r.grid_position == 1)
                fastest_laps = sum(1 for r in results if r.fastest_lap_rank == 1)
                
                # Update team
                team.total_points = total_points
                team.race_wins = race_wins
                team.pole_positions = pole_positions
                team.fastest_laps = fastest_laps
                
                print(f"   ✅ {team.name}: {total_points} pts, {race_wins} wins")
            
            await db.commit()
            print(f"✅ Updated {len(teams)} teams")
    
    async def generate_driver_standings(self, season):
        """Generate driver championship standings for a season"""
        print(f"\n🏆 Generating driver standings for {season}...")
        
        async with AsyncSessionLocal() as db:
            # Delete existing standings for this season
            await db.execute(
                select(DriverStanding).where(DriverStanding.season == season)
            )
            existing = await db.execute(
                select(DriverStanding).where(DriverStanding.season == season)
            )
            for standing in existing.scalars():
                await db.delete(standing)
            
            # Get all race results for this season
            query = (
                select(
                    RaceResult.driver_id,
                    func.sum(RaceResult.points).label('total_points'),
                    func.count(func.nullif(RaceResult.position == 1, False)).label('wins')
                )
                .join(Race, RaceResult.race_id == Race.id)
                .where(Race.season == season)
                .group_by(RaceResult.driver_id)
                .order_by(func.sum(RaceResult.points).desc())
            )
            
            result = await db.execute(query)
            standings_data = result.all()
            
            # Create standings
            for position, (driver_id, points, wins) in enumerate(standings_data, 1):
                standing = DriverStanding(
                    season=season,
                    driver_id=driver_id,
                    position=position,
                    points=float(points or 0),
                    wins=int(wins or 0)
                )
                db.add(standing)
                
                # Get driver name for display
                driver_result = await db.execute(
                    select(Driver).where(Driver.id == driver_id)
                )
                driver = driver_result.scalar_one()
                print(f"   P{position}: {driver.code} - {points} pts")
            
            await db.commit()
            print(f"✅ Generated standings for {len(standings_data)} drivers")
    
    async def generate_constructor_standings(self, season):
        """Generate constructor championship standings for a season"""
        print(f"\n🏁 Generating constructor standings for {season}...")
        
        async with AsyncSessionLocal() as db:
            # Delete existing standings
            existing = await db.execute(
                select(ConstructorStanding).where(ConstructorStanding.season == season)
            )
            for standing in existing.scalars():
                await db.delete(standing)
            
            # Get all race results for this season grouped by team
            query = (
                select(
                    RaceResult.team_id,
                    func.sum(RaceResult.points).label('total_points'),
                    func.count(func.nullif(RaceResult.position == 1, False)).label('wins')
                )
                .join(Race, RaceResult.race_id == Race.id)
                .where(Race.season == season)
                .group_by(RaceResult.team_id)
                .order_by(func.sum(RaceResult.points).desc())
            )
            
            result = await db.execute(query)
            standings_data = result.all()
            
            # Create standings
            for position, (team_id, points, wins) in enumerate(standings_data, 1):
                standing = ConstructorStanding(
                    season=season,
                    team_id=team_id,
                    position=position,
                    points=float(points or 0),
                    wins=int(wins or 0)
                )
                db.add(standing)
                
                # Get team name for display
                team_result = await db.execute(
                    select(Team).where(Team.id == team_id)
                )
                team = team_result.scalar_one()
                print(f"   P{position}: {team.name} - {points} pts")
            
            await db.commit()
            print(f"✅ Generated standings for {len(standings_data)} teams")


async def main():
    """Main calculation workflow"""
    print("=" * 70)
    print("📊 F1 STATISTICS CALCULATOR")
    print("=" * 70)
    
    calculator = F1StatsCalculator()
    
    print("\n📋 What would you like to calculate?")
    print("=" * 70)
    print("1. Calculate stats for 2024 season only")
    print("2. Calculate stats for ALL data")
    print("3. Generate 2024 standings only")
    print("4. Full calculation (stats + standings for 2024)")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == "1":
        # Stats for 2024 only
        await calculator.calculate_driver_stats(season=2024)
        await calculator.calculate_team_stats(season=2024)
        
    elif choice == "2":
        # Stats for all data
        await calculator.calculate_driver_stats()
        await calculator.calculate_team_stats()
        
    elif choice == "3":
        # Standings only
        await calculator.generate_driver_standings(2024)
        await calculator.generate_constructor_standings(2024)
        
    elif choice == "4":
        # Everything for 2024
        await calculator.calculate_driver_stats(season=2024)
        await calculator.calculate_team_stats(season=2024)
        await calculator.generate_driver_standings(2024)
        await calculator.generate_constructor_standings(2024)
    
    print("\n" + "=" * 70)
    print("✅ CALCULATIONS COMPLETE!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())