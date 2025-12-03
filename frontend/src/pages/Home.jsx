import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { MOMENTS } from '../utils/momentsData'; // Import centralized data
import { Activity, BarChart2, Zap, MapPin, Users, Brain, Flag, Trophy, Terminal } from 'lucide-react';

// --- COMPONENTS ---

const IconicMomentsMarquee = () => {
  const handleImageError = (e) => {
    e.target.src = "https://www.transparenttextures.com/patterns/carbon-fibre.png";
    e.target.style.opacity = "0.2"; 
  };

  return (
    <div className="py-12 bg-[#0A0A0C] border-y border-[#38383F] overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C] via-transparent to-[#0A0A0C] z-10 pointer-events-none"></div>
      
      <div className="absolute left-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center bg-[#0A0A0C]/80 backdrop-blur-sm border-r border-[#38383F]">
        <span className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs -rotate-90 whitespace-nowrap">
          The Archives
        </span>
      </div>

      <div className="flex animate-marquee hover:[animation-play-state:paused] ml-16 items-center w-max">
        {[...MOMENTS, ...MOMENTS, ...MOMENTS, ...MOMENTS].map((moment, idx) => (
          <Link 
            to={`/moment/${moment.id}`}
            key={`${moment.id}-${idx}`} 
            className="flex-shrink-0 w-96 h-64 mx-4 bg-[#15151E] border border-[#38383F] rounded-2xl relative overflow-hidden group/card cursor-pointer transition-transform hover:scale-[1.02] duration-300 shadow-xl"
          >
            <div className="absolute inset-0">
                <img 
                    src={moment.image} 
                    alt={moment.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full p-6 z-10">
              <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 rounded bg-black/60 backdrop-blur text-[10px] font-bold uppercase text-white tracking-wider border border-white/20">
                      {moment.year}
                  </span>
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider drop-shadow-md">{moment.circuit}</span>
              </div>
              <h3 className="text-2xl font-black italic text-white leading-tight uppercase mb-1 drop-shadow-lg">
                {moment.title}
              </h3>
              <div className="h-1 w-12 mt-3 rounded-full shadow-sm transition-all group-hover/card:w-24" style={{ backgroundColor: moment.color }}></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const SystemStatusBar = () => (
  <div className="bg-[#0f0f13] border-b border-[#38383F] py-2 px-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-gray-500">
    <div className="flex items-center space-x-6">
        <div className="flex items-center text-green-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-2"></div>
            System Online
        </div>
        <div className="hidden md:block">Latency: 24ms</div>
        <div className="hidden md:block">Database: PostgreSQL 16</div>
    </div>
    <div className="flex items-center space-x-2">
        <Terminal size={12} />
        <span>v1.2.0-stable</span>
    </div>
  </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-[#1F1F27] border border-[#38383F] p-6 rounded-lg hover:border-[#FF1801] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
    <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white italic">{value}</h3>
      </div>
      <div className={`p-3 rounded-md bg-opacity-10 ${color === 'red' ? 'bg-red-500 text-red-500' : 'bg-blue-500 text-blue-500'} group-hover:bg-opacity-20 transition-all`}>
        <Icon size={24} />
      </div>
    </div>
    <p className="text-sm text-gray-500 relative z-10">{subtext}</p>
  </div>
);

const Home = () => {
  const [nextRace, setNextRace] = useState(null);
  const [topDrivers, setTopDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [lastWinner, setLastWinner] = useState({
    name: "Max Verstappen",
    team: "Red Bull Racing",
    time: "1:56:48.894", 
    image: "/images/drivers/VER.png" 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raceRes, standingsRes] = await Promise.all([
          f1Service.getNextRace(),
          f1Service.getDriverStandings(2025)
        ]);

        if (raceRes.data) {
            raceRes.data.circuit_map_url = "https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png.transform/7col/image.png";
        }

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
    <div className="animate-fade-in bg-[#101014]">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
      `}</style>

      <SystemStatusBar />

      <div className="relative bg-[#15151E] border-b border-[#38383F] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(45deg, #1F1F27 25%, transparent 25%, transparent 50%, #1F1F27 50%, #1F1F27 75%, transparent 75%, transparent)', 
               backgroundSize: '40px 40px' 
             }}>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-gray-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#FF1801] rounded-full animate-pulse"></span>
              <span>2025 Season Live Data</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-6 leading-[0.9]">
              PREDICT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-600">
                THE UNPREDICTABLE
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
              Experience the next generation of F1 analytics. 
              Powered by <span className="text-white font-bold border-b-2 border-[#FF1801]">XGBoost</span> & 
              <span className="text-white font-bold border-b-2 border-blue-500 ml-1">LightGBM</span> models.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/predictions" className="bg-[#FF1801] hover:bg-red-600 text-white px-8 py-4 rounded font-black uppercase tracking-widest transition-all transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(255,24,1,0.2)] flex items-center">
                <Zap className="mr-2" /> View Forecasts
              </Link>
              <Link to="/models" className="bg-[#1F1F27] border border-[#38383F] hover:border-white text-white px-8 py-4 rounded font-black uppercase tracking-widest transition-all hover:bg-[#2A2A35] flex items-center">
                <Brain className="mr-2" /> Model Stats
              </Link>
            </div>
          </div>
        </div>
      </div>

      <IconicMomentsMarquee />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Model Accuracy" value="89.4%" subtext="Tested on 2024 season data" icon={Activity} color="red" />
          <StatCard title="Data Points" value="2.5M+" subtext="Processed via FastF1 API" icon={BarChart2} color="blue" />
          <StatCard title="Active Drivers" value="20" subtext="Tracking career stats & form" icon={Users} color="red" />
          <StatCard title="Predictions" value="150+" subtext="Generated for upcoming season" icon={Brain} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Next Race Card */}
          <div className="lg:col-span-2 bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden shadow-2xl group flex flex-col md:flex-row relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

            <div className="p-8 flex-1 relative z-10 flex flex-col justify-center">
              <div className="flex items-center space-x-2 text-[#FF1801] mb-2">
                <Flag size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Next Grand Prix</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-2 leading-none">
                {nextRace?.race_name || "Season Finished"}
              </h2>
              <div className="flex items-center text-gray-400 text-sm mb-8">
                <MapPin size={16} className="mr-1 text-[#FF1801]" />
                <span className="font-medium">{nextRace?.circuit_name}</span>
              </div>

              <div className="bg-[#15151E] p-4 rounded-lg border-l-4 border-[#FF1801] shadow-lg">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">Reigning Winner (2024)</p>
                <div className="flex items-center">
                   <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden border-2 border-[#3671C6] shadow-md">
                      <img src={lastWinner.image} alt={lastWinner.name} className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                   </div>
                   <div>
                      <p className="font-bold text-white text-xl leading-none">{lastWinner.name}</p>
                      <p className="text-xs text-gray-400 mt-1 font-mono" style={{ color: getTeamColor(lastWinner.team) }}>{lastWinner.team}</p>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative w-full md:w-1/2 bg-[#1A1A20] flex items-center justify-center p-6 border-t md:border-t-0 md:border-l border-[#38383F]">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#FF1801 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {nextRace?.circuit_map_url ? (
                  <img 
                    src={nextRace.circuit_map_url} 
                    alt="Circuit Map" 
                    className="w-full h-auto max-h-64 object-contain invert drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transform group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="text-center text-gray-600">
                    <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs uppercase font-bold">Map Unavailable</p>
                  </div>
                )}
                
                <div className="absolute bottom-4 right-4 text-right">
                   <p className="text-[10px] text-gray-500 uppercase font-bold">Laps</p>
                   <p className="text-2xl font-mono font-black text-white leading-none tracking-tighter">{nextRace?.laps || "71"}</p>
                </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-[#38383F] flex justify-between items-center bg-[#15151E]">
              <div className="flex items-center gap-2">
                <Trophy size={16} className="text-[#FF1801]" />
                <h3 className="font-bold text-white uppercase tracking-wider text-sm">Leaderboard</h3>
              </div>
              <Link to="/standings" className="text-xs text-gray-400 hover:text-white uppercase font-bold transition-colors">View All</Link>
            </div>
            <div className="divide-y divide-[#2A2A35] flex-grow">
              {topDrivers.map((driver) => (
                <div key={driver.driver_id} className="flex items-center p-4 hover:bg-[#2A2A35] transition-colors group cursor-default">
                  <span className={`font-mono font-bold w-6 text-center ${driver.position === 1 ? 'text-white text-lg' : 'text-gray-500'}`}>
                    {driver.position}
                  </span>
                  <div 
                    className="w-1 h-8 mx-3 rounded-full transition-all group-hover:h-10" 
                    style={{ backgroundColor: getTeamColor(driver.team_name) }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-[#FF1801] transition-colors">{driver.driver_name}</div>
                    <div className="text-xs text-gray-400 font-mono">{driver.team_name}</div>
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