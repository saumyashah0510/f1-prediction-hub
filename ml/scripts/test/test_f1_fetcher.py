import fastf1
import pandas as pd
import os
from datetime import datetime

# Catching
cache_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'cache')
os.makedirs(cache_dir, exist_ok=True)
fastf1.Cache.enable_cache(cache_dir)


def fetch_season_schedule(year):

    print(f"\nFetching {year} season schedule...")

    try:
        schedule = fastf1.get_event_schedule(year)
        print(f"Found {len(schedule)} events for {year}")
        return schedule
    except Exception as e:
        print(f"Error fetching {year} schedule: {e}")
        return None
    

def fetch_race_results(year,race_round):

    print(f"\nFetching {year} Round {race_round} results...")

    try:
        race = fastf1.get_session(year,race_round,'R')
        race.load()

        results = race.results
        print(f"✅ Loaded race: {race.event['EventName']}")
        print(f"   Date: {race.event['EventDate']}")
        print(f"   Drivers: {len(results)}")

        return {
            'race_info' : race.event,
            'results' : results,
            'session' : race
        }
    except Exception as e:
        print(f"❌ Error fetching race: {e}")
        return None
    

def fetch_qualifying_results(year,race_round):

    print(f"Fetching {year} Round {race_round} qualifying...")
    
    try:
        qualifying = fastf1.get_session(year, race_round, 'Q')
        qualifying.load()
        
        results = qualifying.results
        print(f"✅ Loaded qualifying with {len(results)} drivers")
        
        return {
            'results': results,
            'session': qualifying
        }
    except Exception as e:
        print(f"❌ Error fetching qualifying: {e}")
        return None
    

def check_2025_completed_races():

    print("\n Checking 2025 completed races...")    

    try:
        schedule = fastf1.get_event_schedule(2025)
        today = pd.Timestamp.now()

        completed = []
        upcoming = []

        for idx, event in schedule.iterrows():
            event_date = pd.Timestamp(event['EventDate'])
            
            if event_date < today:
                completed.append({
                    'round': event['RoundNumber'],
                    'name': event['EventName'],
                    'date': event['EventDate'],
                    'location': event['Location']
                })
            else:
                upcoming.append({
                    'round': event['RoundNumber'],
                    'name': event['EventName'],
                    'date': event['EventDate'],
                    'location': event['Location']
                })

        print(f"\n✅ 2025 Season Status:")
        print(f"   Completed races: {len(completed)}")
        print(f"   Upcoming races: {len(upcoming)}")
        
        if completed:
            print(f"\n📊 Last completed race:")
            last_race = completed[-1]
            print(f"   Round {last_race['round']}: {last_race['name']}")
            print(f"   Date: {last_race['date']}")
        
        if upcoming:
            print(f"\n🔮 Next race to predict:")
            next_race = upcoming[0]
            print(f"   Round {next_race['round']}: {next_race['name']}")
            print(f"   Date: {next_race['date']}")
        
        return completed, upcoming
        
    except Exception as e:
        print(f"❌ Error checking 2025 races: {e}")
        return [], []
    

def test_fetch():
    """Test fetching a single race"""
    print("🧪 Testing FastF1 data fetching...\n")
    
    # Test 1: Fetch 2024 schedule
    schedule_2024 = fetch_season_schedule(2024)
    
    if schedule_2024 is not None:
        print(f"\n📋 2024 Season had {len(schedule_2024)} races")
        print(f"   First race: {schedule_2024.iloc[0]['EventName']}")
        print(f"   Last race: {schedule_2024.iloc[-1]['EventName']}")
    
    # Test 2: Fetch a specific race (2024 Bahrain GP - Round 1)
    race_data = fetch_race_results(2024, 1)
    
    if race_data:
        results = race_data['results']
        print(f"\n🏆 Race Results Preview:")
        print(f"   Winner: {results.iloc[0]['Abbreviation']} ({results.iloc[0]['TeamName']})")
        print(f"   P2: {results.iloc[1]['Abbreviation']} ({results.iloc[1]['TeamName']})")
        print(f"   P3: {results.iloc[2]['Abbreviation']} ({results.iloc[2]['TeamName']})")
    
    # Test 3: Check 2025 status
    completed, upcoming = check_2025_completed_races()
    
    return {
        'schedule_2024': schedule_2024,
        'race_data': race_data,
        'completed_2025': completed,
        'upcoming_2025': upcoming
    }

if __name__ == "__main__":
    print("=" * 60)
    print("🏎️  F1 DATA FETCHER - Testing")
    print("=" * 60)
    
    results = test_fetch()
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60)    