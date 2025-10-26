import fastf1
import os

cache_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'cache')
fastf1.Cache.enable_cache(cache_dir)

def explore_race_data():
    
    print("🔍 Exploring F1 Data Structure...\n")
    
    race = fastf1.get_session(2024, 1, 'R')
    race.load()
    
    print("📊 Race Results Columns:")
    print(race.results.columns.tolist())
    
    print("\n📋 Sample Driver Data:")
    driver = race.results.iloc[0]
    print(f"Position: {driver['Position']}")
    print(f"Driver: {driver['Abbreviation']} - {driver['FullName']}")
    print(f"Team: {driver['TeamName']}")
    print(f"Points: {driver['Points']}")
    print(f"Grid Position: {driver['GridPosition']}")
    print(f"Status: {driver['Status']}")
    print(f"Time: {driver['Time']}")
    
    print("\n🏁 Event Information:")
    print(f"Event Name: {race.event['EventName']}")
    print(f"Location: {race.event['Location']}")
    print(f"Country: {race.event['Country']}")
    print(f"Circuit: {race.event['OfficialEventName']}")
    print(f"Date: {race.event['EventDate']}")
    
    # Qualifying
    quali = fastf1.get_session(2024, 1, 'Q')
    quali.load()
    
    print("\n⏱️  Qualifying Columns:")
    print(quali.results.columns.tolist())
    
    print("\n✅ Data exploration complete!")

if __name__ == "__main__":
    explore_race_data()