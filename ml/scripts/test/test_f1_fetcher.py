from ml.scripts.f1_data_fetcher import F1DataFetcher

def test_basic_fetch():
    
    fetcher = F1DataFetcher()
    
    print("Testing F1 Data Fetcher...\n")
    
    schedule = fetcher.get_season_schedule(2024)
    print(f"2024 Schedule: {len(schedule)} events")
    

    race_data = fetcher.get_race_results(2024, 1)
    if race_data:
        print(f"Race data loaded: {race_data['event']['EventName']}")
    
    
    completed, upcoming = fetcher.get_completed_and_upcoming_races(2025)
    print(f"2025: {len(completed)} completed, {len(upcoming)} upcoming")
    
    return fetcher

def test_drivers_and_teams():
    
    fetcher = F1DataFetcher()
    
    drivers = fetcher.get_all_drivers(2024)
    teams = fetcher.get_all_teams(2024)
    
    print(f"\nDrivers in 2024: {len(drivers)}")
    for driver in drivers[:3]:
        print(f"   {driver['abbreviation']}: {driver['full_name']} ({driver['team']})")
    
    print(f"\nTeams in 2024: {len(teams)}")
    for team in teams[:3]:
        print(f"   {team['name']} - {team['color']}")

if __name__ == "__main__":
    print("=" * 60)
    print("F1 DATA FETCHER - TEST SUITE")
    print("=" * 60)
    
    fetcher = test_basic_fetch()
    test_drivers_and_teams()
    
    print("\n" + "=" * 60)
    print("All tests passed!")
    print("=" * 60)
