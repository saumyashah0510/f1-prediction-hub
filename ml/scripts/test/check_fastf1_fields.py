import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', '..'))

import fastf1

cache_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'cache')
fastf1.Cache.enable_cache(cache_dir)

print("=" * 70)
print("🔍 CHECKING FASTF1 AVAILABLE FIELDS")
print("=" * 70)

# Load 2024 Bahrain GP
race = fastf1.get_session(2024, 1, 'R')
race.load()

# Show ALL available columns
print("\n📊 ALL COLUMNS in race.results:")
print("=" * 70)
for i, col in enumerate(race.results.columns, 1):
    print(f"{i:2d}. {col}")

print("\n" + "=" * 70)
print("🏆 WINNER (VER) DATA:")
print("=" * 70)

winner = race.results.iloc[0]

# Print every field for winner
for col in race.results.columns:
    value = winner[col]
    print(f"{col:30s} = {value}")

print("\n" + "=" * 70)
print("🔍 SEARCHING FOR FASTEST LAP FIELDS:")
print("=" * 70)

# Search for fastest lap related fields
for col in race.results.columns:
    if 'fast' in col.lower() or 'lap' in col.lower():
        print(f"✅ Found: {col}")
        # Show values for top 3
        print(f"   VER: {race.results.iloc[0][col]}")
        print(f"   PER: {race.results.iloc[1][col]}")
        print(f"   SAI: {race.results.iloc[2][col]}")
        print()