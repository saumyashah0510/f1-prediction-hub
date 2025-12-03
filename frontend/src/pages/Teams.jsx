import React, { useEffect, useState, useRef } from 'react';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Users, Filter, ChevronRight, ChevronLeft } from 'lucide-react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const scrollContainerRef = useRef(null);

  // Fetch Drivers grouped by team for the selected season
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const standingsRes = await f1Service.getDriverStandings(selectedSeason);
        
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

  const getDriverImage = (code) => `/images/drivers/${code}.png`;
  
  const getCarImage = (teamName) => `/images/cars/${teamName.replace(/\s+/g, '')}.png`;

  const handleImageError = (e) => {
    e.target.src = "https://media.formula1.com/image/upload/v1678240723/fom-website/2023/Drivers/placeholder.jpg.transform/2col/image.jpg";
  };

  const handleCarImageError = (e) => {
      e.target.src = "https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png.transform/4col/image.png"; 
      e.target.style.opacity = "0.3"; 
      e.target.style.filter = "grayscale(100%)";
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = window.innerWidth * 0.7;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#101014] overflow-hidden flex flex-col animate-fade-in relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://media.formula1.com/content/dam/fom-website/2018-redesign-assets/texture/noise_texture_dark.png')] opacity-20 pointer-events-none"></div>

      {/* Header & Filter (Fixed at Top) */}
      <div className="container mx-auto px-4 py-8 z-20 relative flex flex-col md:flex-row justify-between items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 text-white drop-shadow-lg">
            Constructors <span className="text-[#FF1801]">{selectedSeason}</span>
          </h2>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
          <Filter size={18} className="text-[#FF1801] ml-2" />
          <select 
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-4 py-1 uppercase tracking-wider"
          >
            <option value={2025} className="bg-[#15151E]">2025 Season</option>
            <option value={2024} className="bg-[#15151E]">2024 Season</option>
            <option value={2023} className="bg-[#15151E]">2023 Season</option>
            <option value={2022} className="bg-[#15151E]">2022 Season</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF1801]"></div>
        </div>
      ) : (
        <div className="flex-1 relative flex items-center">
            
            {/* Scroll Buttons (Desktop) */}
            <button 
                onClick={() => scroll('left')} 
                className="hidden md:flex absolute left-4 z-30 bg-black/50 hover:bg-[#FF1801] text-white p-3 rounded-full backdrop-blur transition-all"
            >
                <ChevronLeft size={32} />
            </button>
            <button 
                onClick={() => scroll('right')} 
                className="hidden md:flex absolute right-4 z-30 bg-black/50 hover:bg-[#FF1801] text-white p-3 rounded-full backdrop-blur transition-all"
            >
                <ChevronRight size={32} />
            </button>

            {/* Horizontal Scroll Container */}
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory w-full h-[70vh] items-center px-4 md:px-12 gap-6 pb-8 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {teams.map((team, index) => (
                    <div 
                        key={team.name} 
                        className="snap-center shrink-0 w-[90vw] md:w-[70vw] lg:w-[60vw] h-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
                        style={{ background: `linear-gradient(135deg, #15151E 0%, ${team.color}20 100%)` }}
                    >
                        {/* 1. Team Branding & Rank */}
                        <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black italic text-white uppercase leading-none drop-shadow-md">
                                    {team.name}
                                </h2>
                                <div className="mt-2 inline-flex items-center space-x-2">
                                    <div className="h-1 w-12" style={{ backgroundColor: team.color }}></div>
                                    <span className="text-xl font-mono font-bold text-gray-300">{team.totalPoints} PTS</span>
                                </div>
                            </div>
                            <div className="text-8xl font-black text-white/5 font-mono select-none">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                        </div>

                        {/* 2. Car Background Image - UPDATED: No weird movement on hover */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl z-10 pointer-events-none">
                             <img 
                                src={getCarImage(team.name)} 
                                onError={handleCarImageError}
                                alt={`${team.name} Car`}
                                // CHANGED: Removed the -translate-y-[52%] on hover. Now it just subtly scales up.
                                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-out group-hover:scale-105"
                             />
                        </div>

                        {/* 3. Team Color Glow - UPDATED: Intensifies on hover */}
                        <div 
                            className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                            style={{ backgroundColor: team.color }}
                        ></div>

                        {/* 4. Drivers Sidebar */}
                        <div className="absolute bottom-0 right-0 w-full md:w-1/3 h-1/3 md:h-full bg-gradient-to-t md:bg-gradient-to-l from-black/90 via-black/60 to-transparent z-20 p-6 flex flex-row md:flex-col justify-end md:justify-center gap-4">
                            {team.drivers.map((driver) => (
                                <div 
                                    key={driver.driver_id} 
                                    className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors cursor-default group/driver"
                                >
                                    {/* Driver Headshot */}
                                    <div 
                                        className="w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg shrink-0"
                                        style={{ borderColor: team.color }}
                                    >
                                        <img 
                                            src={getDriverImage(driver.driver_code)} 
                                            onError={handleImageError}
                                            alt={driver.driver_name}
                                            className="w-full h-full object-cover transform group-hover/driver:scale-110 transition-transform"
                                        />
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-white text-lg truncate leading-none">{driver.driver_name}</h3>
                                            <span className="text-[#FF1801] font-black italic text-sm">{driver.driver_code}</span>
                                        </div>
                                        <div className="flex gap-3 mt-1 text-xs text-gray-400 font-mono">
                                            <span><strong className="text-white">{driver.points}</strong> PTS</span>
                                            {driver.wins > 0 && (
                                                <span className="text-[#FF1801]"><strong className="text-white">{driver.wins}</strong> WINS</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Teams;