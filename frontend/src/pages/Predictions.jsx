import React, { useEffect, useState } from 'react';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Brain, Trophy, AlertCircle, CheckCircle, XCircle, ChevronDown, Calendar, ArrowRight } from 'lucide-react';

const Predictions = () => {
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Race List for Season
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const res = await f1Service.getAllRaces(selectedSeason);
        setRaces(res.data);
        if (res.data.length > 0) {
            setSelectedRace(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching races:", error);
      }
    };
    fetchRaces();
  }, [selectedSeason]);

  // 2. Fetch Predictions when Race Changes
  useEffect(() => {
    if (!selectedRace) return;

    const fetchPreds = async () => {
      setLoading(true);
      try {
        const res = await f1Service.getRacePredictions(selectedRace.id);
        setPredictions(res.data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPreds();
  }, [selectedRace]);

  // SUB COMPONENTS ---------------------------------------------------

  const ProbabilityBar = ({ label, value, color }) => (
    <div className="flex items-center text-xs mt-1">
        <span className="w-16 text-gray-500 font-bold uppercase">{label}</span>
        <div className="flex-1 h-2 bg-[#2A2A35] rounded-full overflow-hidden mx-2">
            <div 
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${value * 100}%`, backgroundColor: color }}
            ></div>
        </div>
        <span className="w-8 text-right font-mono text-white">{(value * 100).toFixed(0)}%</span>
    </div>
  );

  const PredictionRow = ({ item, index }) => {
    const isComparison = item.actual_position !== null;
    const diff = isComparison ? item.actual_position - item.predicted_position : 0;
    const isAccurate = Math.abs(diff) <= 3;
    const teamColor = getTeamColor(item.team_name);

    return (
      <div className="group bg-[#1F1F27] border border-[#38383F] p-4 rounded-xl hover:border-gray-500 transition-all flex flex-col md:flex-row items-center gap-4 mb-3 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: teamColor }}></div>

        <div className="flex flex-col items-center justify-center w-12 border-r border-[#38383F] pr-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Pred</span>
          <span className="text-2xl font-black text-white italic">P{item.predicted_position}</span>
        </div>

        <div className="flex-1 flex items-center gap-4">
          <img 
            src={`/images/drivers/${item.driver_code}.png`} 
            className="w-12 h-12 rounded-full border-2 object-cover bg-[#2A2A35]"
            style={{ borderColor: teamColor }}
            onError={(e) => e.target.src = "https://media.formula1.com/image/upload/v1678240723/fom-website/2023/Drivers/placeholder.jpg.transform/2col/image.jpg"}
          />
          <div>
            <h3 className="font-bold text-white text-lg leading-none">{item.driver_name}</h3>
            <p className="text-xs text-gray-400 uppercase mt-1">{item.team_name}</p>
          </div>
        </div>

        {isComparison ? (
          <div className="flex items-center gap-6 px-4 py-2 bg-[#15151E] rounded-lg border border-[#38383F]">
            <div className="text-center">
              <span className="block text-[10px] text-gray-500 uppercase">Actual</span>
              <span className={`text-xl font-bold ${item.actual_position === 1 ? 'text-yellow-500' : 'text-white'}`}>
                P{item.actual_position}
              </span>
            </div>
            <div className="text-center w-16">
              <span className="block text-[10px] text-gray-500 uppercase">Diff</span>
              <span className={`font-mono font-bold ${diff === 0 ? 'text-green-500' : diff > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {diff === 0 ? "=" : diff > 0 ? `-${diff}` : `+${Math.abs(diff)}`}
              </span>
            </div>
            {isAccurate ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <AlertCircle className="text-orange-500" size={24} />
            )}
          </div>
        ) : (
          <div className="w-full md:w-1/3">
            <ProbabilityBar label="Win" value={item.prob_win} color="#FFD700" />
            <ProbabilityBar label="Podium" value={item.prob_podium} color="#C0C0C0" />
            <ProbabilityBar label="Points" value={item.prob_points} color="#22C55E" />
          </div>
        )}
      </div>
    );
  };

  // MAIN RENDER ------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#101014] animate-fade-in pb-20">
      
      {/* Header */}
      <div className="bg-[#15151E] border-b border-[#38383F] py-8">
        <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-[#FF1801] mb-2">
                <Brain size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">AI Strategy Room</span>
            </div>
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-6">
                Race <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1801] to-orange-500">Forecast</span>
            </h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-4">
                
                {/* Season Select */}
                <div className="relative">
                    <select 
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                        className="appearance-none bg-[#1F1F27] text-white font-bold pl-4 pr-10 py-3 rounded-xl border border-[#38383F] focus:border-[#FF1801] focus:outline-none cursor-pointer"
                    >
                        {/* REMOVED 2026 */}
                        <option value={2025}>2025 Season (Live)</option>
                        <option value={2024}>2024 Season (History)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {/* Race Select */}
                <div className="relative flex-1 max-w-md">
                    <select 
                        value={selectedRace?.id || ""}
                        onChange={(e) => {
                            const r = races.find(r => r.id === parseInt(e.target.value));
                            setSelectedRace(r);
                        }}
                        className="w-full appearance-none bg-[#1F1F27] text-white font-bold pl-4 pr-10 py-3 rounded-xl border border-[#38383F] focus:border-[#FF1801] focus:outline-none cursor-pointer"
                    >
                        {races.map(race => (
                            <option key={race.id} value={race.id}>
                                R{race.round_number}: {race.race_name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF1801]"></div>
                <p className="text-gray-500 font-mono text-sm animate-pulse">Running Monte Carlo Simulations...</p>
            </div>
        ) : (
            <div className="max-w-5xl mx-auto">
                {predictions.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Calendar size={14} />
                                <span>{selectedRace?.race_date}</span>
                                <span>•</span>
                                <span className="text-white font-bold">{selectedRace?.circuit_name}</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${selectedRace?.is_completed ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {selectedRace?.is_completed ? "Comparison Mode" : "Forecast Mode"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {predictions.map((pred, idx) => (
                                <PredictionRow key={idx} item={pred} index={idx} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 bg-[#1F1F27] rounded-xl border border-dashed border-[#38383F]">
                        <Brain size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Predictions Found</h3>
                        <p className="text-gray-400">Our models haven't run for this race yet.</p>
                    </div>
                )}
            </div>
        )}
      </div>

    </div>
  );
};

export default Predictions;
