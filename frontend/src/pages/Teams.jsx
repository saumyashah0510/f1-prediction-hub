import React, { useEffect, useState } from 'react';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Users, Filter } from 'lucide-react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(2025);

  // Fetch Drivers grouped by team for the selected season
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        // Fetch standings because it contains the driver-team relationship for that season
        const standingsRes = await f1Service.getDriverStandings(selectedSeason);
        
        // Group drivers by team
        const teamMap = {};
        standingsRes.data.forEach(driver => {
          if (!teamMap[driver.team_name]) {
            teamMap[driver.team_name] = {
              name: driver.team_name,
              color: getTeamColor(driver.team_name),
              drivers: [],
              totalPoints: 0
            };
          }
          teamMap[driver.team_name].drivers.push(driver);
          teamMap[driver.team_name].totalPoints += driver.points;
        });

        // Convert to array and sort by points
        const sortedTeams = Object.values(teamMap).sort((a, b) => b.totalPoints - a.totalPoints);
        setTeams(sortedTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [selectedSeason]);

  // Image Helper (Fallback to placeholder if local file missing)
  const getDriverImage = (code) => {
    // You can replace this with a real path if you add images to /public/images/drivers/
    return `/images/drivers/${code}.png`; 
  };

  const handleImageError = (e) => {
    // Fallback to a generic helmet or silhouette
    e.target.src = "https://media.formula1.com/image/upload/v1678240723/fom-website/2023/Drivers/placeholder.jpg.transform/2col/image.jpg";
  };

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black italic uppercase mb-2">Teams & Drivers</h2>
          <p className="text-gray-400">Driver lineups and constructor details for the season.</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0 bg-[#1F1F27] p-2 rounded-lg border border-[#38383F]">
          <Filter size={18} className="text-[#FF1801] ml-2" />
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4"
          >
            <option value={2025}>2025 Season</option>
            <option value={2024}>2024 Season</option>
            <option value={2023}>2023 Season</option>
            <option value={2022}>2022 Season</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1801]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {teams.map((team) => (
            <div 
              key={team.name} 
              className="bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden hover:border-gray-500 transition-colors"
            >
              {/* Team Header */}
              <div 
                className="p-4 flex justify-between items-center"
                style={{ borderLeft: `6px solid ${team.color}` }}
              >
                <div>
                  <h3 className="text-2xl font-black italic text-white uppercase">{team.name}</h3>
                  <span className="text-gray-400 text-sm font-mono">{team.totalPoints} PTS</span>
                </div>
                {/* Placeholder for Team Logo if you have it */}
                {/* <img src={`/images/teams/${team.name}.png`} className="h-10 opacity-80" /> */}
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#38383F]">
                {team.drivers.map((driver) => (
                  <div key={driver.driver_id} className="bg-[#15151E] p-6 flex items-center space-x-6 hover:bg-[#1A1A23] transition-colors group">
                    
                    {/* Driver Image */}
                    <div className="relative">
                      <div 
                        className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-white transition-colors"
                        style={{ borderColor: team.color }} // Dynamic border color
                      >
                        <img 
                          src={getDriverImage(driver.driver_code)} 
                          onError={handleImageError}
                          alt={driver.driver_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#38383F] text-white text-xs font-bold px-2 py-1 rounded border border-gray-600">
                        {driver.driver_code}
                      </div>
                    </div>

                    {/* Driver Stats */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-white">{driver.driver_name}</h4>
                          <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                            Rank P{driver.position}
                          </div>
                        </div>
                        <span className="text-2xl font-black italic text-[#FF1801] opacity-20 group-hover:opacity-100 transition-opacity">
                          #{driver.driver_code}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex space-x-4">
                        <div>
                          <span className="block text-gray-500 text-[10px] uppercase">Points</span>
                          <span className="font-mono font-bold">{driver.points}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500 text-[10px] uppercase">Wins</span>
                          <span className="font-mono font-bold">{driver.wins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;