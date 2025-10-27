import fastf1
import pandas as pd
import os

cache_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'cache')
os.makedirs(cache_dir, exist_ok=True)
fastf1.Cache.enable_cache(cache_dir)

class F1DataFetcher: 

    def __init__(self):
        self.cache_enabled = True


    def get_season_schedule(self,year):

        try:
            schedule = fastf1.get_event_schedule(year)
            return schedule
        except Exception as e: 
            print(f"Error fetching {year} schedule: {e}")
            return None


    def get_race_results(self,year,race_round):        

        try:
            race = fastf1.get_session(year,race_round,'R')
            race.load()

            return {
                'event' : race.event,
                'results' : race.results,
                'session' : race
            }
        except Exception as e:
            print(f"Error fetching race {year} R{race_round}: {e}")
            return None
        

    def get_qualifying_results(self,year,race_round):        

        try:
            qualifying = fastf1.get_session(year,race_round,'Q')
            qualifying.load()

            return {
                'results' : qualifying.results,
                'session' : qualifying
            }
        except Exception as e:
            print(f"Error fetching qualifying {year} R{race_round}: {e}")
            return None    
        

    def get_completed_and_upcoming_races(self,year):

        try:
            schedule = fastf1.get_event_schedule(year)
            today = pd.Timestamp.now()

            completed = []
            upcoming = []

            for idx,event in schedule.iterrows():
                event_date = pd.Timestamp(event['EventDate'])

                race_info = {
                    'round' : event['RoundNumber'],
                    'name' : event['EventName'],
                    'date' : event['EventDate'],
                    'location' : event['Location'],
                    'country' : event['Country']
                }    

                if event_date < today:
                    completed.append(race_info)
                else:
                    upcoming.append(race_info)  

            return completed,upcoming   
        except Exception as e:
            print(f"Error checking {year} races: {e}")
            return [],[]         


    def get_all_drivers(self,year,race_round=1):

        try:
            race = fastf1.get_session(year,race_round,'R')
            race.load()

            drivers = []

            for idx,driver in race.results.iterrows():
                drivers.append({
                    'abbreviation' : driver['Abbreviation'],
                    'full_name' : driver['FullName'],
                    'team' : driver['TeamName'],
                    'number' : driver['DriverNumber']
                })
            return drivers
        except Exception as e:
            print(f"Error fetching drivers: {e}")
            return []


    def get_all_teams(self,year,race_round=1):

        try:
            race = fastf1.get_session(year,race_round,'R')
            race.load()

            teams = race.results[['TeamName','TeamColor']].drop_duplicates()
            team_list = []

            for idx,team in teams.iterrows():
                team_list.append({
                    'name' : team['TeamName'],
                    'color' : f"#{team['TeamColor']}" if pd.notna(team['TeamColor']) else None
                })
            return team_list
        except Exception as e:
            print(f"Error fetching teams: {e}")
            return []    