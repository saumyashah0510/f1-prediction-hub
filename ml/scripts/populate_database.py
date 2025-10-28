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
                    'engine' : 'Honda RBFT' 
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
                '' : {
                    'full_name' : ,
                    'nationality' : ,
                    'base' : ,
                    'engine' : 
                },
                '' : {
                    'full_name' : ,
                    'nationality' : ,
                    'base' : ,
                    'engine' : 
                },
                '' : {
                    'full_name' : ,
                    'nationality' : ,
                    'base' : ,
                    'engine' : 
                },
                '' : {
                    'full_name' : ,
                    'nationality' : ,
                    'base' : ,
                    'engine' : 
                }
            }