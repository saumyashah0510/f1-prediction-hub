import sys
import os
import asyncio
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from f1_data_fetcher import F1DataFetcher
from backend.app.models.database import AsyncSessionLocal
from backend.app.models.driver import Driver
from backend.app.models.team import Team
from backend.app.models.race import Race
from backend.app.models.result import RaceResult,QualifyingResult
from backend.app.models.standing import DriverStanding,ConstructorStanding


class F1DatabasePopulater:

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

                details = team_details(team_name,{
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