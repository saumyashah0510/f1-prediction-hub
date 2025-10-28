import sys
import os
import asyncio
from sqlalchemy import and_, select, func

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from backend.app.models.database import AsyncSessionLocal
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.race import Race
from backend.app.models.result import RaceResult
from backend.app.models.standing import DriverStanding, ConstructorStanding


class F1StatsCalculator:
    """Calculate F1 statistics and standings"""

    def __init__(self):
        pass

    # -------------------------------------------------------------------
    # DRIVER STATISTICS
    # -------------------------------------------------------------------
    async def calculate_driver_stats(self, season=None):
        """Calculate career or seasonal statistics for drivers"""
        print(f"\n📊 Calculating driver statistics...")

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Driver))
            drivers = result.scalars().all()

            for driver in drivers:
                query = select(RaceResult).where(RaceResult.driver_id == driver.id)

                if season:
                    query = query.join(Race).where(Race.season == season)

                result = await db.execute(query)
                results = result.scalars().all()

                if not results:
                    continue

                # Include both main and sprint race results
                total_points = sum(r.points for r in results)
                race_wins = sum(1 for r in results if r.position == 1 and not r.is_sprint)
                sprint_wins = sum(1 for r in results if r.position == 1 and r.is_sprint)
                podiums = sum(1 for r in results if r.position and r.position <= 3 and not r.is_sprint)
                pole_positions = sum(1 for r in results if r.grid_position == 1)
                fastest_laps = sum(1 for r in results if r.fastest_lap_rank == 1)

                driver.total_points = total_points
                driver.race_wins = race_wins
                driver.sprint_wins = sprint_wins if hasattr(driver, "sprint_wins") else sprint_wins
                driver.podiums = podiums
                driver.pole_positions = pole_positions
                driver.fastest_laps = fastest_laps

                print(f"   ✅ {driver.code}: {total_points} pts, {race_wins} race wins, {sprint_wins} sprint wins")

            await db.commit()
            print(f"✅ Updated {len(drivers)} drivers")

    # -------------------------------------------------------------------
    # TEAM STATISTICS
    # -------------------------------------------------------------------
    async def calculate_team_stats(self, season=None):
        """Calculate career or seasonal statistics for teams"""
        print(f"\n🏁 Calculating team statistics...")

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Team))
            teams = result.scalars().all()

            for team in teams:
                query = select(RaceResult).where(RaceResult.team_id == team.id)

                if season:
                    query = query.join(Race).where(Race.season == season)

                result = await db.execute(query)
                results = result.scalars().all()

                if not results:
                    continue

                total_points = sum(r.points for r in results)
                race_wins = sum(1 for r in results if r.position == 1 and not r.is_sprint)
                sprint_wins = sum(1 for r in results if r.position == 1 and r.is_sprint)
                pole_positions = sum(1 for r in results if r.grid_position == 1)
                fastest_laps = sum(1 for r in results if r.fastest_lap_rank == 1)

                team.total_points = total_points
                team.race_wins = race_wins
                team.sprint_wins = sprint_wins if hasattr(team, "sprint_wins") else sprint_wins
                team.pole_positions = pole_positions
                team.fastest_laps = fastest_laps

                print(f"   ✅ {team.name}: {total_points} pts, {race_wins} race wins, {sprint_wins} sprint wins")

            await db.commit()
            print(f"✅ Updated {len(teams)} teams")

    # -------------------------------------------------------------------
    # DRIVER STANDINGS
    # -------------------------------------------------------------------
    async def generate_driver_standings(self, season):
        """Generate driver championship standings for a season"""
        print(f"\n🏆 Generating driver standings for {season}...")

        async with AsyncSessionLocal() as db:
            # Delete existing standings for this season
            existing = await db.execute(select(DriverStanding).where(DriverStanding.season == season))
            for standing in existing.scalars():
                await db.delete(standing)

            # Include both sprint + race points
            query = (
                select(
                    RaceResult.driver_id,
                    func.sum(RaceResult.points).label("total_points"),
                    func.count(func.nullif(and_(RaceResult.position == 1, RaceResult.is_sprint == False), False)).label("race_wins"),
                    func.count(func.nullif(and_(RaceResult.position == 1, RaceResult.is_sprint == True), False)).label("sprint_wins"),
                )
                .join(Race, RaceResult.race_id == Race.id)
                .where(Race.season == season)
                .group_by(RaceResult.driver_id)
                .order_by(func.sum(RaceResult.points).desc())
            )

            result = await db.execute(query)
            standings_data = result.all()

            for position, (driver_id, points, race_wins, sprint_wins) in enumerate(standings_data, 1):
                standing = DriverStanding(
                    season=season,
                    driver_id=driver_id,
                    position=position,
                    points=float(points or 0),
                    wins=int(race_wins or 0),
                )
                db.add(standing)

                driver_result = await db.execute(select(Driver).where(Driver.id == driver_id))
                driver = driver_result.scalar_one()
                print(f"   P{position}: {driver.code} - {points} pts ({race_wins} race wins, {sprint_wins} sprint wins)")

            await db.commit()
            print(f"✅ Generated standings for {len(standings_data)} drivers")

    # -------------------------------------------------------------------
    # CONSTRUCTOR STANDINGS
    # -------------------------------------------------------------------
    async def generate_constructor_standings(self, season):
        print(f"\n🏁 Generating constructor standings for {season}...")

        async with AsyncSessionLocal() as db:
            existing = await db.execute(select(ConstructorStanding).where(ConstructorStanding.season == season))
            for standing in existing.scalars():
                await db.delete(standing)

            query = (
                select(
                    RaceResult.team_id,
                    func.sum(RaceResult.points).label("total_points"),
                    func.count(func.nullif(and_(RaceResult.position == 1, RaceResult.is_sprint == False), False)).label("race_wins"),
                    func.count(func.nullif(and_(RaceResult.position == 1, RaceResult.is_sprint == True), False)).label("sprint_wins"),
                )
                .join(Race, RaceResult.race_id == Race.id)
                .where(Race.season == season)
                .group_by(RaceResult.team_id)
                .order_by(func.sum(RaceResult.points).desc())
            )

            result = await db.execute(query)
            standings_data = result.all()

            for position, (team_id, points, race_wins, sprint_wins) in enumerate(standings_data, 1):
                standing = ConstructorStanding(
                    season=season,
                    team_id=team_id,
                    position=position,
                    points=float(points or 0),
                    wins=int(race_wins or 0),
                )
                db.add(standing)

                team_result = await db.execute(select(Team).where(Team.id == team_id))
                team = team_result.scalar_one()
                print(f"   P{position}: {team.name} - {points} pts ({race_wins} race wins, {sprint_wins} sprint wins)")

            await db.commit()
            print(f"✅ Generated standings for {len(standings_data)} teams")


# -------------------------------------------------------------------
# MAIN SCRIPT
# -------------------------------------------------------------------
# -------------------------------------------------------------------
# MAIN SCRIPT
# -------------------------------------------------------------------
async def main():
    """Main calculation workflow"""
    print("=" * 70)
    print("📊 F1 STATISTICS CALCULATOR")
    print("=" * 70)

    calculator = F1StatsCalculator()

    print("\n📋 What would you like to calculate?")
    print("=" * 70)
    print("1. Calculate stats for 2024 season only")
    print("2. Calculate stats for ALL data (career totals)")
    print("3. Generate standings for 2024 season only")
    print("4. Full calculation (stats + standings for 2024)")
    print("5. Full calculation for both 2024 and 2025 seasons")  # NEW OPTION

    choice = input("\nEnter choice (1-5): ").strip()

    if choice == "1":
        await calculator.calculate_driver_stats(season=2024)
        await calculator.calculate_team_stats(season=2024)

    elif choice == "2":
        await calculator.calculate_driver_stats()
        await calculator.calculate_team_stats()

    elif choice == "3":
        await calculator.generate_driver_standings(2024)
        await calculator.generate_constructor_standings(2024)

    elif choice == "4":
        await calculator.calculate_driver_stats(season=2024)
        await calculator.calculate_team_stats(season=2024)
        await calculator.generate_driver_standings(2024)
        await calculator.generate_constructor_standings(2024)

    elif choice == "5":
        # Full calculation for both 2024 and 2025
        for year in [2024, 2025]:
            print("\n" + "=" * 70)
            print(f"📅 PROCESSING {year} SEASON DATA")
            print("=" * 70)

            await calculator.calculate_driver_stats(season=year)
            await calculator.calculate_team_stats(season=year)
            await calculator.generate_driver_standings(year)
            await calculator.generate_constructor_standings(year)

        print("\n✅ Completed calculations for both 2024 and 2025!")

    else:
        print("\n❌ Invalid choice. Please select 1–5.")
        return

    print("\n" + "=" * 70)
    print("✅ CALCULATIONS COMPLETE!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())

