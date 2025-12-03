import React, { useState, useEffect } from 'react';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Trophy, Flag, Zap, BarChart2, Swords, ChevronDown, AlertCircle, Calendar } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const HeadToHead = () => {
  const [drivers, setDrivers] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  
  const [driverA, setDriverA] = useState(null);
  const [driverB, setDriverB] = useState(null);
  
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Initial Data
  useEffect(() => {
    const init = async () => {
      try {
        const [driversRes, racesRes] = await Promise.all([
          f1Service.getDrivers(),
          f1Service.getAllRaces(2025) // Get 2025 Calendar
        ]);
        
        // Sort drivers by points
        const sortedDrivers = driversRes.data.sort((a, b) => b.total_points - a.total_points);
        setDrivers(sortedDrivers);
        
        // Setup Races
        setRaces(racesRes.data);
        // Select next upcoming race by default
        const upcoming = racesRes.data.find(r => !r.is_completed) || racesRes.data[racesRes.data.length - 1];
        setSelectedRace(upcoming);

        // Default Drivers (P1 vs P2)
        if (sortedDrivers.length > 1) {
            setDriverA(sortedDrivers[0]); // Verstappen
            setDriverB(sortedDrivers[1]); // Norris
        }

      } catch (error) {
        console.error("Error initializing Head-to-Head:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Fetch Predictions when Race Changes
  useEffect(() => {
      if (!selectedRace) return;
      const fetchPreds = async () => {
          try {
              const res = await f1Service.getRacePredictions(selectedRace.id);
              setPredictions(res.data);
          } catch (e) {
              console.warn("No predictions found for this race");
              setPredictions([]);
          }
      };
      fetchPreds();
  }, [selectedRace]);

  // --- HELPER: Calculate Smart Ratings (0-100) ---
  const calculateStats = (d) => {
    if (!d) return { speed: 0, consistency: 0, experience: 0, form: 0, craft: 0 };
    
    // Calibration Constants (Adjust these to tune the chart)
    // Max Points Reference: ~400 for a dominant season
    // Max Career Points: ~3000+ (Hamilton)
    
    // 1. Speed (Qualifying Pace)
    // Boosted by Pole Positions and recent Fastest Laps
    let speed = (d.pole_positions * 2) + (d.fastest_laps * 1.5) + 60;
    speed = Math.min(99, speed); 

    // 2. Experience (Career Length)
    // This is where Alonso/Hamilton will naturally be high.
    // Normalized against ~1000 points as a "Veteran" benchmark
    let experience = (d.total_points / 1500) * 100;
    experience = Math.min(100, Math.max(40, experience)); 

    // 3. Racecraft (Wins & Podiums)
    // Ability to convert good starts into results
    let craft = (d.race_wins * 3) + (d.podiums) + 50;
    craft = Math.min(98, craft);

    // 4. Consistency (Points Scoring Rate)
    // Using total points as a proxy for finishing high often
    let consistency = (d.total_points / 1000) * 100 + 50;
    consistency = Math.min(95, consistency);
    
    // 5. Current Form (The critical "Norris Factor")
    // We infer form from their current championship standing (index in the sorted list)
    const rank = drivers.findIndex(drv => drv.id === d.id);
    // Top 3 get 90+, Midfield 70-80
    let form = 95 - (rank * 3); 
    form = Math.max(50, form);
    
    return {
        subject: d.code,
        A: speed, 
        B: experience,
        C: craft,
        D: consistency,
        E: form,
        full: 100
    };
  };

  const getRadarData = () => {
    if (!driverA || !driverB) return [];
    
    const statsA = calculateStats(driverA);
    const statsB = calculateStats(driverB);

    return [
      { subject: 'Pure Speed', A: statsA.A, B: statsB.A, full: 100 },
      { subject: 'Experience', A: statsA.B, B: statsB.B, full: 100 },
      { subject: 'Racecraft', A: statsA.C, B: statsB.C, full: 100 },
      { subject: 'Consistency', A: statsA.D, B: statsB.D, full: 100 },
      { subject: 'Current Form', A: statsA.E, B: statsB.E, full: 100 },
    ];
  };

  // --- HELPER: Get AI Prediction ---
  const getPredictedWinner = () => {
      if (!predictions.length || !driverA || !driverB) return null;
      
      const predA = predictions.find(p => p.driver_code === driverA.code);
      const predB = predictions.find(p => p.driver_code === driverB.code);
      
      if (!predA || !predB) return null;
      
      // Lower position is better
      return predA.predicted_position < predB.predicted_position ? driverA : driverB;
  };

  const predictionWinner = getPredictedWinner();

  // --- SUB-COMPONENT: Compact Driver Selector ---
  const DriverSelect = ({ selected, onChange, label, align }) => (
    <div className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} w-full`}>
        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-widest">{label}</label>
        <div className="relative w-full max-w-[200px]">
            <select 
                value={selected?.code || ""} 
                onChange={(e) => onChange(drivers.find(d => d.code === e.target.value))}
                className={`w-full appearance-none bg-[#1F1F27] text-white font-bold text-sm py-2 px-3 rounded-lg border focus:outline-none cursor-pointer transition-colors truncate ${align === 'right' ? 'text-right pr-8' : 'text-left pl-3'}`}
                style={{ borderColor: selected ? getTeamColor(selected.team_name) : '#38383F' }} 
            >
                {drivers.map(d => <option key={d.id} value={d.code}>{d.first_name} {d.last_name}</option>)}
            </select>
            <ChevronDown size={14} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${align === 'right' ? 'right-2' : 'right-2'}`} />
        </div>
    </div>
  );

  // --- SUB-COMPONENT: Driver Card ---
  const DriverCard = ({ driver, align }) => {
    if (!driver) return null;
    const color = getTeamColor(driver.team_name);

    return (
      <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'} relative z-10`}>
         <div className="relative mb-4 group w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-xl z-10"></div>
            <img 
                src={`/images/drivers/${driver.code}.png`} 
                alt={driver.code}
                className="w-full h-full object-cover rounded-xl border-2 shadow-xl transition-transform duration-500 group-hover:scale-105 bg-[#2A2A35]"
                style={{ borderColor: color }}
                onError={(e) => e.target.src = "https://media.formula1.com/image/upload/v1678240723/fom-website/2023/Drivers/placeholder.jpg.transform/2col/image.jpg"}
            />
            <div className={`absolute bottom-2 ${align === 'right' ? 'right-3' : 'left-3'} z-20`}>
                <span className="text-4xl font-black text-white italic drop-shadow-lg">{driver.code}</span>
            </div>
         </div>
         
         <div className="space-y-2 w-full max-w-[200px]">
            <div className="bg-[#1F1F27] px-3 py-2 rounded border border-[#38383F] flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Points</span>
                <span className="font-mono font-bold text-white">{driver.total_points}</span>
            </div>
            <div className="bg-[#1F1F27] px-3 py-2 rounded border border-[#38383F] flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Wins</span>
                <span className="font-mono font-bold text-[#FF1801]">{driver.race_wins}</span>
            </div>
            <div className="bg-[#1F1F27] px-3 py-2 rounded border border-[#38383F] flex justify-between items-center">
                <span className="text-[10px] text-gray-500 uppercase font-bold">Podiums</span>
                <span className="font-mono font-bold text-white">{driver.podiums}</span>
            </div>
         </div>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen bg-[#101014] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1801]"></div></div>;

  return (
    <div className="min-h-screen bg-[#101014] animate-fade-in pb-20 overflow-x-hidden">
      
      {/* Header */}
      <div className="bg-[#15151E] border-b border-[#38383F] py-8">
         <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
             <div>
                <div className="inline-flex items-center space-x-2 text-[#FF1801] mb-1 bg-[#FF1801]/10 px-3 py-0.5 rounded-full">
                    <Swords size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Head to Head</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
                    Driver <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-500">Comparison</span>
                </h1>
             </div>

             {/* Race Selector */}
             <div className="mt-4 md:mt-0">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <select 
                        value={selectedRace?.id || ""}
                        onChange={(e) => setSelectedRace(races.find(r => r.id === parseInt(e.target.value)))}
                        className="bg-[#101014] text-white font-bold text-sm pl-9 pr-8 py-2 rounded-lg border border-[#38383F] focus:border-[#FF1801] focus:outline-none cursor-pointer appearance-none"
                    >
                        {races.map(r => (
                            <option key={r.id} value={r.id}>
                                {r.round_number}. {r.race_name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
             </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        
        {/* Controls */}
        <div className="flex justify-between items-center max-w-4xl mx-auto mb-12">
            <DriverSelect label="Select Driver A" selected={driverA} onChange={setDriverA} align="left" />
            <div className="flex flex-col items-center px-4">
                <div className="w-10 h-10 rounded-full bg-[#1F1F27] border-2 border-[#38383F] flex items-center justify-center text-sm font-black italic text-gray-500">VS</div>
            </div>
            <DriverSelect label="Select Driver B" selected={driverB} onChange={setDriverB} align="right" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
            
            {/* Left Driver Stats */}
            <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                <DriverCard driver={driverA} align="left" />
            </div>

            {/* Center: Radar & Verdict */}
            <div className="order-1 lg:order-2 flex flex-col items-center">
                
                {/* Radar Chart */}
                <div className="w-full h-64 relative mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                            <PolarGrid stroke="#38383F" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name={driverA?.code} dataKey="A" stroke="#FF1801" strokeWidth={2} fill="#FF1801" fillOpacity={0.4} />
                            <Radar name={driverB?.code} dataKey="B" stroke="#3671C6" strokeWidth={2} fill="#3671C6" fillOpacity={0.4} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Verdict */}
                <div className="w-full bg-gradient-to-b from-[#1F1F27] to-[#15151E] border border-[#38383F] rounded-xl p-4 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF1801] to-transparent"></div>
                    
                    <div className="flex items-center justify-center space-x-2 text-[#FF1801] mb-2">
                        <Zap size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Predicted Winner</span>
                    </div>
                    
                    <p className="text-gray-500 text-[10px] mb-3 uppercase">
                        At {selectedRace?.circuit_name || "Next Circuit"}
                    </p>

                    {predictionWinner ? (
                        <div className="bg-[#101014] p-3 rounded border border-[#38383F] flex items-center justify-between px-6">
                             <div className="text-left">
                                <span className="block text-[10px] text-gray-500 uppercase font-bold">Forecast</span>
                                <span className="text-xl font-black italic text-white leading-none">{predictionWinner.code}</span>
                             </div>
                             <img src={`/images/drivers/${predictionWinner.code}.png`} className="w-10 h-10 rounded-full border border-gray-600 object-cover bg-[#2A2A35]" onError={(e) => e.target.style.display = 'none'} />
                        </div>
                    ) : (
                        <div className="text-gray-500 text-xs italic flex items-center justify-center gap-2 py-2">
                            <AlertCircle size={14} /> Awaiting Model Data
                        </div>
                    )}
                </div>

            </div>

            {/* Right Driver Stats */}
            <div className="order-3 flex justify-center lg:justify-end">
                <DriverCard driver={driverB} align="right" />
            </div>

        </div>

      </div>
    </div>
  );
};

export default HeadToHead;