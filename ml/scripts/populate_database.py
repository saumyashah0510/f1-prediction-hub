import sys
import os
import asyncio
from datetime import datetime

from ml.scripts.f1_data_fetcher import F1DataFetcher
from backend.app.models.database import AsyncSessionLocal
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.race import Race
from backend.app.models.result import RaceResult,QualifyingResult
from backend.app.models.standing import DriverStanding,ConstructorStanding


class F1DatabasePopulator:

    def __init__(self):
        self.fetcher = F1DataFetcher()
        self.team_mapping = {}    # FastF1 team name -> our team_id
        self.driver_mapping = {}  # FastF1 driver code -> our driver_id


    async def populate_teams(self,year=2024):

        print(f"Populating teams (from {year} data)") 

        teams_data = self.fetcher.get_all_teams(year)   

        if not teams_data:
            print("No team data found")
            return
        
        async with AsyncSessionLocal() as db:

            team_details = {
                'Red Bull Racing' : {
                    'full_name' : 'Oracle Red Bull Racing',
                    'nationality' : 'Austrian',
                    'base' : 'Milton Keynes, United Kingdom',
                    'engine' : 'Honda RBPT' 
                },
                'Ferrari' : {
                    'full_name' : 'Scuderia Ferrari HP',
                    'nationality' : 'Italian',
                    'base' : 'Maranello, Italy',
                    'engine' : 'Ferrari' 
                },
                'Mercedes' : {
                    'full_name' : 'Mercedes-AMG PETRONAS Formula One Team',
                    'nationality' : 'German',
                    'base' : 'Brackley, United Kingdom',
                    'engine' : 'Mercedes'
                },
                'McLaren' : {
                    'full_name' : 'McLaren Formula 1 Team',
                    'nationality' : 'British',
                    'base' : 'Woking, United Kingdom',
                    'engine' : 'Mercedes' 
                },
                'Aston Martin' : {
                    'full_name' : 'Aston Martin Aramco Formula One Team',
                    'nationality' : 'British',
                    'base' : 'Silverstone, United Kingdom',
                    'engine' : 'Mercedes' 
                },
                'Alpine' : {
                    'full_name' : 'BWT Alpine Formula One Team',
                    'nationality' : 'French',
                    'base' : 'Enstone, United Kingdom',
                    'engine' : 'Renault'
                },
                'Williams' : {
                    'full_name' : 'Williams Racing',
                    'nationality' : 'British',
                    'base' : 'Grove, United Kingdom',
                    'engine' : 'Mercedes'
                },
                'RB' : {
                    'full_name' : 'Visa Cash App RB Formula One Team',
                    'nationality' : 'Italian',
                    'base' : 'Faenza, Italy',
                    'engine' : 'Honda RBPT' 
                },
                'Kick Sauber' : {
                    'full_name' : 'Stake F1 Team Kick Sauber',
                    'nationality' : 'Swiss',
                    'base' : 'Hinwil, Switzerland',
                    'engine' : 'Ferrari'
                },
                'Haas F1 Team' : {
                    'full_name' : 'MoneyGram Haas F1 Team',
                    'nationality' : 'American',
                    'base' : 'Kannapolis, United States',
                    'engine' : 'Ferrari'
                }
            }

            for team_data in teams_data:

                team_name = team_data['name']

                details = team_details.get(team_name,{
                    'full_name' : team_name,
                    'nationality' : 'unknown',
                    'base' : 'unknown',
                    'engine' : 'unknown'
                })

                team = Team(
                    name = team_name,
                    full_name = details['full_name'],
                    nationality = details['nationality'],
                    base = details['base'],
                    engine = details['engine'],
                    team_color = team_data['color'],
                    is_active = 1
                )

                db.add(team)
                await db.flush() #adds id

                self.team_mapping[team_name] = team.id
                print(f"   ✅ {team_name} (ID: {team.id})")

            await db.commit()
            print(f"✅ Added {len(teams_data)} teams")


    async def populate_drivers(self,year=2024):


        print(f"Populating Drivers (from {year} data)")

        drivers_data = self.fetcher.get_all_drivers(year)
        
        if not drivers_data:
            print("No driver data found")
            return
        
        async with AsyncSessionLocal() as db:

            for driver_data in drivers_data:

                name_parts = driver_data['full_name'].split()
                first_name = name_parts[0] if name_parts else "Unknown"
                last_name = " ".join(name_parts[1:]) if len(name_parts)>1 else "Unknown"

                team_id = self.team_mapping.get(driver_data['team'])

                driver = Driver(
                    driver_number = int(driver_data['number']),
                    code = driver_data['abbreviation'],
                    first_name = first_name,
                    last_name = last_name,
                    team_id = team_id,
                    is_active = 1
                )

                db.add(driver)
                await db.flush()

                self.driver_mapping[driver_data['abbreviation']] = driver.id
                print(f"   ✅ {driver_data['abbreviation']}: {driver_data['full_name']} (ID: {driver.id})")
            
            await db.commit()
            print(f"✅ Added {len(drivers_data)} drivers")


    async def populate_races(self, year):
    
        print(f"\n🏁 Populating Races for {year}...")
    
        schedule = self.fetcher.get_season_schedule(year)
    
        if schedule is None:
            print(f"❌ No schedule found for {year}")
            return
    
        async with AsyncSessionLocal() as db:
            race_count = 0
        
            for idx, event in schedule.iterrows():
            
                if 'Testing' in event['EventName']:
                    continue
            
            
                try:
                    test_session = self.fetcher.get_race_results(year, event['RoundNumber'])
                
                    if test_session and 'session' in test_session:
                        session = test_session['session']
                    
                        circuit_length = None
                        if hasattr(session, 'event') and 'Circuit' in session.event:
                            circuit_info = session.event.get('Circuit', {})
                            if 'Length' in circuit_info:
                                circuit_length = float(circuit_info['Length']) / 1000  
                    
                   
                        laps = session.total_laps if hasattr(session, 'total_laps') else None
                    
                        race = Race(
                            season=year,
                            round_number=event['RoundNumber'],
                            race_name=event['EventName'],
                            circuit_name=event.get('OfficialEventName', event['EventName']),
                            circuit_location=event['Location'],
                            country=event['Country'],
                            circuit_length=circuit_length,
                            laps=laps,
                            race_date=event['EventDate'],
                            is_completed=0
                        )
                    else:
                        race = Race(
                            season=year,
                            round_number=event['RoundNumber'],
                            race_name=event['EventName'],
                            circuit_name=event.get('OfficialEventName', event['EventName']),
                            circuit_location=event['Location'],
                            country=event['Country'],
                            race_date=event['EventDate'],
                            is_completed=0
                        )
                except:
                    race = Race(
                        season=year,
                        round_number=event['RoundNumber'],
                        race_name=event['EventName'],
                        circuit_name=event.get('OfficialEventName', event['EventName']),
                        circuit_location=event['Location'],
                        country=event['Country'],
                        race_date=event['EventDate'],
                        is_completed=0
                    )
            
                db.add(race)
                race_count += 1
                print(f"   ✅ Round {event['RoundNumber']}: {event['EventName']}")
        
            await db.commit()
            print(f"✅ Added {race_count} races for {year}")


    async def populate_race_results(self, year, race_round):

        print(f"\n🏆 Populating Results: {year} Round {race_round}...")
        
        race_data = self.fetcher.get_race_results(year, race_round)
        
        if not race_data:
            print(f"❌ No results found")
            return
        
        async with AsyncSessionLocal() as db:
            from sqlalchemy import select
            import pandas as pd
            
            # Get race from database
            result = await db.execute(
                select(Race).where(
                    Race.season == year,
                    Race.round_number == race_round
                )
            )
            race = result.scalar_one_or_none()
            
            if not race:
                print(f"❌ Race not found in database")
                return
            
            # Mark race as completed
            race.is_completed = 1
            
            # Check for sprint
            session = race_data['session']
            if hasattr(session, 'event') and hasattr(session.event, 'EventFormat'):
                race.has_sprint = 1 if 'Sprint' in str(session.event.get('EventFormat', '')) else 0
            
            # Get results dataframe
            results_df = race_data['results']
            
            # ✨ NEW: Extract fastest laps from lap data
            print(f"   Extracting fastest laps from lap data...")
            fastest_laps_dict = {}
            fastest_ranks_dict = {}
            
            try:
                laps = session.laps
                
                # Get fastest lap per driver
                for driver_code in laps['Driver'].unique():
                    driver_laps = laps[laps['Driver'] == driver_code]
                    # Filter valid laps (has time and not pit lap)
                    valid_laps = driver_laps[
                        (driver_laps['LapTime'].notna()) & 
                        (driver_laps['PitOutTime'].isna())
                    ]
                    
                    if len(valid_laps) > 0:
                        fastest = valid_laps['LapTime'].min()
                        fastest_laps_dict[driver_code] = fastest
                
                # Rank fastest laps
                sorted_laps = sorted(fastest_laps_dict.items(), key=lambda x: x[1])
                for rank, (driver_code, _) in enumerate(sorted_laps, 1):
                    fastest_ranks_dict[driver_code] = rank
                
                print(f"   ✅ Extracted {len(fastest_laps_dict)} fastest laps")
            
            except Exception as e:
                print(f"   ⚠️  Could not extract fastest laps: {e}")
            
            # Process each driver result
            print(f"   Processing {len(results_df)} drivers...")
            
            for idx, driver_result in results_df.iterrows():
                driver_id = self.driver_mapping.get(driver_result['Abbreviation'])
                team_id = self.team_mapping.get(driver_result['TeamName'])
                
                if not driver_id or not team_id:
                    print(f"   ⚠️  Skipping {driver_result['Abbreviation']} - missing mapping")
                    continue
                
                # Position (finishing position)
                position = None
                if 'Position' in driver_result and pd.notna(driver_result['Position']):
                    position = int(driver_result['Position'])
                
                # Grid Position (starting position)
                grid_position = None
                if 'GridPosition' in driver_result and pd.notna(driver_result['GridPosition']):
                    grid_position = int(driver_result['GridPosition'])
                
                # Points
                points = 0.0
                if 'Points' in driver_result and pd.notna(driver_result['Points']):
                    points = float(driver_result['Points'])
                
                # Laps Completed ✅
                laps_completed = 0
                if 'Laps' in driver_result and pd.notna(driver_result['Laps']):
                    laps_completed = int(driver_result['Laps'])
                
                # Race Time ✅
                race_time = None
                if 'Time' in driver_result:
                    time_value = driver_result['Time']
                    if pd.notna(time_value):
                        try:
                            if isinstance(time_value, pd.Timedelta):
                                total_seconds = time_value.total_seconds()
                                
                                if position == 1:
                                    # Winner gets full time
                                    hours = int(total_seconds // 3600)
                                    minutes = int((total_seconds % 3600) // 60)
                                    seconds = total_seconds % 60
                                    race_time = f"{hours}:{minutes:02d}:{seconds:06.3f}"
                                else:
                                    # Others get delta
                                    race_time = f"+{total_seconds:.3f}"
                            else:
                                race_time = str(time_value)
                        except Exception as e:
                            print(f"   ⚠️  Error processing time for {driver_result['Abbreviation']}: {e}")
                
                # Fastest Lap Time ✨ NEW - from lap data
                fastest_lap = None
                driver_code = driver_result['Abbreviation']
                
                if driver_code in fastest_laps_dict:
                    try:
                        lap_time = fastest_laps_dict[driver_code]
                        if isinstance(lap_time, pd.Timedelta):
                            total_seconds = lap_time.total_seconds()
                            minutes = int(total_seconds // 60)
                            seconds = total_seconds % 60
                            fastest_lap = f"{minutes}:{seconds:06.3f}"
                    except Exception as e:
                        print(f"   ⚠️  Error formatting fastest lap for {driver_code}: {e}")
                
                # Fastest Lap Rank ✨ NEW - from lap data
                fastest_lap_rank = None
                if driver_code in fastest_ranks_dict:
                    fastest_lap_rank = fastest_ranks_dict[driver_code]
                
                # Status
                status = 'Unknown'
                if 'Status' in driver_result and driver_result['Status']:
                    status = str(driver_result['Status'])
                
                # Create race result
                race_result = RaceResult(
                    race_id=race.id,
                    driver_id=driver_id,
                    team_id=team_id,
                    position=position,
                    grid_position=grid_position,
                    points=points,
                    laps_completed=laps_completed,
                    race_time=race_time,
                    fastest_lap=fastest_lap,
                    fastest_lap_rank=fastest_lap_rank,
                    status=status
                )
                
                db.add(race_result)
            
            await db.commit()
            
            # Show summary
            winner = results_df.iloc[0]
            print(f"✅ Results added - Winner: {winner['Abbreviation']} ({winner['TeamName']})")
            
            # Show fastest lap info
            if fastest_laps_dict:
                fastest_driver = min(fastest_laps_dict.items(), key=lambda x: x[1])
                print(f"   🏎️  Fastest Lap: {fastest_driver[0]} - {fastest_driver[1]}")
            
            print(f"   📊 Captured: Position, Grid, Points, Laps, Time, Fastest Lap, Status")


    async def populate_qualifying_results(self, year, race_round):
        """Populate qualifying results"""
        print(f"⏱️  Populating Qualifying: {year} Round {race_round}...")
        
        quali_data = self.fetcher.get_qualifying_results(year, race_round)
        
        if not quali_data:
            print(f"❌ No qualifying results found")
            return
        
        async with AsyncSessionLocal() as db:
            # Get race from database
            from sqlalchemy import select
            result = await db.execute(
                select(Race).where(
                    Race.season == year,
                    Race.round_number == race_round
                )
            )
            race = result.scalar_one_or_none()
            
            if not race:
                return
            
            # Add qualifying results
            quali_df = quali_data['results']
            
            for idx, driver_quali in quali_df.iterrows():
                driver_id = self.driver_mapping.get(driver_quali['Abbreviation'])
                team_id = self.team_mapping.get(driver_quali['TeamName'])
                
                if not driver_id or not team_id:
                    continue
                
                quali_result = QualifyingResult(
                    race_id=race.id,
                    driver_id=driver_id,
                    team_id=team_id,
                    position=int(driver_quali['Position']) if driver_quali['Position'] > 0 else None,
                    q1_time=str(driver_quali['Q1']) if driver_quali['Q1'] else None,
                    q2_time=str(driver_quali['Q2']) if driver_quali['Q2'] else None,
                    q3_time=str(driver_quali['Q3']) if driver_quali['Q3'] else None
                )
                
                db.add(quali_result)
            
            await db.commit()
            print(f"✅ Qualifying results added")


    async def populate_sprint_results(self, year, race_round):
        
            print(f"\n⚡ Populating Sprint Results: {year} Round {race_round}...")

            sprint_data = self.fetcher.get_sprint_results(year, race_round)

            if not sprint_data:
                print(f"❌ No sprint data found for {year} Round {race_round}")
                return

            from sqlalchemy import select
            import pandas as pd
            from backend.app.models.result import RaceResult
            from backend.app.models.race import Race

            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(Race).where(
                        Race.season == year,
                        Race.round_number == race_round
                    )
                )
                race = result.scalar_one_or_none()

                if not race:
                    print("❌ Race not found in DB")
                    return

                sprint_df = sprint_data["results"]
                print(f"   Found {len(sprint_df)} sprint results")

                for _, row in sprint_df.iterrows():
                    driver_id = self.driver_mapping.get(row['Abbreviation'])
                    team_id = self.team_mapping.get(row['TeamName'])

                    if not driver_id or not team_id:
                        print(f"⚠️ Missing mapping for {row['Abbreviation']}")
                        continue

                    position = int(row['Position']) if 'Position' in row and pd.notna(row['Position']) else None
                    points = float(row['Points']) if 'Points' in row and pd.notna(row['Points']) else 0.0
                    laps = int(row['Laps']) if 'Laps' in row and pd.notna(row['Laps']) else None
                    time = str(row['Time']) if 'Time' in row and pd.notna(row['Time']) else None
                    status = str(row['Status']) if 'Status' in row and pd.notna(row['Status']) else 'Finished'

                    result_entry = RaceResult(
                        race_id=race.id,
                        driver_id=driver_id,
                        team_id=team_id,
                        position=position,
                        points=points,
                        laps_completed=laps,
                        race_time=time,
                        status=status,
                        is_sprint=True  # <— Important
                    )

                    db.add(result_entry)

                await db.commit()
                print(f"✅ Added sprint results for {year} Round {race_round}")
        


async def main():
    """Main population workflow"""
    print("=" * 70)
    print("🏎️  F1 DATABASE POPULATOR")
    print("=" * 70)
    
    populator = F1DatabasePopulator()
    
    # Step 1: Populate teams and drivers (from 2024 data)
    await populator.populate_teams(2024)
    await populator.populate_drivers(2024)
    
    # Step 2: Populate 2024 races (full season)
    await populator.populate_races(2024)
    
    # Step 3: Ask user what to populate
    print("\n" + "=" * 70)
    print("📊 What would you like to populate?")
    print("=" * 70)
    print("1. Single race (test)")
    print("2. Full 2024 season")
    print("3. 2025 completed races")
    print("4. Everything (2024 + 2025)")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == "1":
        # 🧪 Test single race
        print("\n🧪 Populating single race (2024 Bahrain GP)...")
        await populator.populate_qualifying_results(2024, 1)
        await populator.populate_sprint_results(2024, 1)      # ⚡ Sprint results (if available)
        await populator.populate_race_results(2024, 1)
        
    elif choice == "2":
        # 📅 Full 2024 season
        print("\n📅 Populating FULL 2024 season (24 races)...")
        print("⚠️  This will take 15-20 minutes!")
        confirm = input("Continue? (yes/no): ").strip().lower()
        
        if confirm == "yes":
            for race_round in range(1, 25):
                print(f"\n🏁 ROUND {race_round} ============================")
                await populator.populate_qualifying_results(2024, race_round)
                await populator.populate_sprint_results(2024, race_round)  # ⚡ Add sprint
                await populator.populate_race_results(2024, race_round)
        
    elif choice == "3":
        # 🏆 2025 completed races
        await populator.populate_races(2025)
        
        completed, upcoming = populator.fetcher.get_completed_and_upcoming_races(2025)
        print(f"\n📅 Populating {len(completed)} completed 2025 races...")
        
        for race in completed:
            round_num = race['round']
            print(f"\n🏁 ROUND {round_num} ============================")
            await populator.populate_qualifying_results(2025, round_num)
            await populator.populate_sprint_results(2025, round_num)
            await populator.populate_race_results(2025, round_num)
    
    elif choice == "4":
        # 🚀 Everything (2024 + 2025)
        print("\n🚀 Populating EVERYTHING!")
        print("⚠️  This will take 30-40 minutes!")
        confirm = input("Continue? (yes/no): ").strip().lower()
        
        if confirm == "yes":
            # ---- 2024 ----
            for race_round in range(1, 25):
                print(f"\n🏁 2024 ROUND {race_round} ============================")
                await populator.populate_qualifying_results(2024, race_round)
                await populator.populate_sprint_results(2024, race_round)
                await populator.populate_race_results(2024, race_round)
            
            # ---- 2025 ----
            await populator.populate_races(2025)
            completed, _ = populator.fetcher.get_completed_and_upcoming_races(2025)
            
            for race in completed:
                round_num = race['round']
                print(f"\n🏁 2025 ROUND {round_num} ============================")
                await populator.populate_qualifying_results(2025, round_num)
                await populator.populate_sprint_results(2025, round_num)
                await populator.populate_race_results(2025, round_num)
    
    print("\n" + "=" * 70)
    print("✅ DATABASE POPULATION COMPLETE!")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())