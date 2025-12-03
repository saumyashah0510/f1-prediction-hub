import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Activity, BarChart2, Zap, MapPin, Users, Brain, Flag, Trophy } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-[#1F1F27] border border-[#38383F] p-6 rounded-lg hover:border-[#FF1801] transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white italic">{value}</h3>
      </div>
      <div className={`p-3 rounded-md bg-opacity-10 ${color === 'red' ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'} group-hover:bg-opacity-20 transition-all`}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-sm text-gray-500">{subtext}</p>
  </div>
);

const Home = () => {
  const [nextRace, setNextRace] = useState(null);
  const [topDrivers, setTopDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded for now, but in a real app you'd fetch "previous race results"
  // You can extend your API to add /races/last-completed
  const [lastWinner, setLastWinner] = useState({
    name: "Max Verstappen",
    team: "Red Bull Racing",
    time: "1:31:44.742",
    image: "/images/drivers/VER.png" 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raceRes, standingsRes] = await Promise.all([
          f1Service.getNextRace(),
          f1Service.getDriverStandings(2025)
        ]);
        setNextRace(raceRes.data);
        setTopDrivers(standingsRes.data.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#101014]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1801]"></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-[#15151E] border-b border-[#38383F] py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
           <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
             <path d="M0 100 L100 0 L100 100 Z" fill="#FF1801" />
           </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest mb-4 border border-red-500/20">
              Season 2025 Live
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-6 leading-tight">
              DATA DRIVEN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-500">
                VICTORY
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl">
              Advanced ML models predicting Formula 1 outcomes with high precision. 
              Powered by XGBoost Regression and LightGBM Classification.
            </p>
            <div className="flex gap-4">
              <Link to="/predictions" className="bg-[#FF1801] hover:bg-red-600 text-white px-8 py-3 rounded font-bold uppercase tracking-wide transition-all transform hover:-translate-y-1">
                View Forecasts
              </Link>
              <Link to="/models" className="border border-[#38383F] hover:border-white text-white px-8 py-3 rounded font-bold uppercase tracking-wide transition-all">
                Model Stats
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Model Accuracy" value="89.4%" subtext="Tested on 2024 season data" icon={Activity} color="red" />
          <StatCard title="Data Points" value="2.5M+" subtext="Processed via FastF1 API" icon={BarChart2} color="blue" />
          <StatCard title="Active Drivers" value="20" subtext="Tracking career stats & form" icon={Users} color="red" />
          <StatCard title="Predictions" value="150+" subtext="Generated for upcoming season" icon={Brain} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Next Race Card - UPDATED */}
          <div className="lg:col-span-2 bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden shadow-2xl group flex flex-col md:flex-row">
            
            {/* Left Side: Info */}
            <div className="p-8 flex-1 relative z-10 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-[#FF1801] mb-2">
                <Flag size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Next Grand Prix</span>
              </div>
              <h2 className="text-4xl font-black text-white italic uppercase mb-2 leading-none">
                {nextRace?.race_name || "Season Finished"}
              </h2>
              <div className="flex items-center text-gray-400 text-sm mb-8">
                <MapPin size={16} className="mr-1 text-[#FF1801]" />
                <span className="font-medium">{nextRace?.circuit_name}</span>
              </div>

              {/* Last Winner Section */}
              <div className="bg-[#15151E] p-4 rounded-lg border-l-4 border-[#FF1801]">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Previous Winner (2024)</p>
                <div className="flex items-center">
                   {/* Placeholder for Winner Image */}
                   <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 overflow-hidden">
                      <img src={lastWinner.image} alt={lastWinner.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                   </div>
                   <div>
                      <p className="font-bold text-white text-lg leading-none">{lastWinner.name}</p>
                      <p className="text-xs text-gray-400" style={{ color: getTeamColor(lastWinner.team) }}>{lastWinner.team}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Side: Circuit Map */}
            <div className="relative w-full md:w-1/2 bg-[#1A1A20] flex items-center justify-center p-6 border-t md:border-t-0 md:border-l border-[#38383F]">
                {/* Fallback pattern if no map */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#FF1801 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {nextRace?.circuit_map_url ? (
                  <img 
                    src={nextRace.circuit_map_url} 
                    alt="Circuit Map" 
                    className="w-full h-auto max-h-64 object-contain invert drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transform group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="text-center text-gray-600">
                    <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs uppercase font-bold">Map Unavailable</p>
                  </div>
                )}
                
                {/* Circuit Info Overlay */}
                <div className="absolute bottom-4 right-4 text-right">
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Laps</p>
                   <p className="text-xl font-mono font-bold text-white leading-none">{nextRace?.laps || "58"}</p>
                </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#38383F] flex justify-between items-center bg-[#15151E]">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#FF1801]" />
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Leaderboard</h3>
              </div>
              <Link to="/standings" className="text-xs text-gray-400 hover:text-white uppercase font-bold transition-colors">View All</Link>
            </div>
            <div className="divide-y divide-[#2A2A35] flex-grow">
              {topDrivers.map((driver) => (
                <div key={driver.driver_id} className="flex items-center p-4 hover:bg-[#2A2A35] transition-colors group">
                  <span className={`font-mono font-bold w-6 text-center ${driver.position === 1 ? 'text-[#FF1801] text-lg' : 'text-gray-500'}`}>
                    {driver.position}
                  </span>
                  {/* Team Stripe */}
                  <div 
                    className="w-1 h-8 mx-3 rounded-full" 
                    style={{ backgroundColor: getTeamColor(driver.team_name) }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-[#FF1801] transition-colors">{driver.driver_name}</div>
                    <div className="text-xs text-gray-400">{driver.team_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-white text-sm">{driver.points}</div>
                    <div className="text-[10px] text-gray-600 uppercase">PTS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;