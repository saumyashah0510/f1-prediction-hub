import React, { useEffect, useState } from 'react';
import { f1Service } from '../services/api';
import { getCircuitMap } from '../utils/circuitMaps';
import { getCircuitDetails, formatLapTime } from '../utils/formatters'; // Import new helpers
import { Calendar, MapPin, Flag, Timer, ChevronRight, X, Filter, ChevronDown, Trophy } from 'lucide-react';

const Races = () => {
  const [races, setRaces] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [selectedRace, setSelectedRace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [raceDetails, setRaceDetails] = useState(null); 

  // Fetch Race List
  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      try {
        const response = await f1Service.getAllRaces(selectedSeason);
        setRaces(response.data);
      } catch (error) {
        console.error("Error fetching races:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, [selectedSeason]);

  // Fetch Race Details (Results)
  const handleRaceClick = async (race) => {
    setSelectedRace(race);
    setRaceDetails(null); 
    
    if (race.is_completed) {
        setDetailsLoading(true);
        try {
            const res = await f1Service.getRaceResults(race.id);
            setRaceDetails(res.data);
        } catch (error) {
            console.error("Failed to load race details", error);
        } finally {
            setDetailsLoading(false);
        }
    } else {
        setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101014] animate-fade-in pb-20">
      
      {/* Header & Filter */}
      <div className="bg-[#15151E] border-b border-[#38383F] py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-2">
              Race <span className="text-[#FF1801]">Calendar</span>
            </h1>
            <p className="text-gray-400">Official Schedule & Results for {selectedSeason}</p>
          </div>

          <div className="flex items-center gap-4 bg-[#101014] p-2 rounded-xl border border-[#38383F]">
             <div className="relative">
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  className="appearance-none bg-[#1F1F27] text-white font-bold pl-4 pr-10 py-2 rounded-lg focus:outline-none hover:bg-[#2A2A35] transition-colors cursor-pointer"
                >
                  {[2025, 2024, 2023, 2022].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
             </div>
          </div>
        </div>
      </div>

      {/* Race Grid */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF1801]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {races.map((race) => {
              const isDone = race.is_completed === 1;
              return (
                <div 
                  key={race.id} 
                  onClick={() => handleRaceClick(race)}
                  className={`bg-[#1F1F27] border border-[#38383F] rounded-xl overflow-hidden hover:border-gray-500 transition-all cursor-pointer group relative ${isDone ? '' : 'opacity-80'}`}
                >
                  <div className="absolute top-4 right-4 z-10">
                      {isDone ? (
                          <span className="bg-green-500/20 text-green-500 text-xs font-bold px-2 py-1 rounded uppercase border border-green-500/30">Completed</span>
                      ) : (
                          <span className="bg-blue-500/20 text-blue-500 text-xs font-bold px-2 py-1 rounded uppercase border border-blue-500/30">Upcoming</span>
                      )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-[#FF1801] text-xs font-bold uppercase tracking-widest mb-2">
                      <span className="mr-2">Round {race.round_number}</span>
                      <span>•</span>
                      <span className="ml-2">{race.race_date}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white italic uppercase leading-none mb-1 group-hover:text-[#FF1801] transition-colors">
                      {race.country}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{race.circuit_name}</p>

                    <div className="h-24 w-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity my-4">
                        <img 
                            src={getCircuitMap(race.country)} 
                            alt="Map"
                            className="h-full w-auto object-contain invert"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#38383F]">
                       <div className="flex items-center text-xs text-gray-500 font-mono">
                          <MapPin size={12} className="mr-1" /> {race.circuit_location}
                       </div>
                       <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedRace && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedRace(null)}>
          <div className="bg-[#15151E] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#38383F] shadow-2xl" onClick={e => e.stopPropagation()}>
            
            <div className="relative h-48 bg-[#1F1F27] overflow-hidden flex items-end p-8 border-b border-[#38383F]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="relative z-10 w-full flex justify-between items-end">
                    <div>
                        <div className="text-[#FF1801] font-bold uppercase tracking-widest text-sm mb-1">Round {selectedRace.round_number}</div>
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase leading-none">{selectedRace.race_name}</h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="text-2xl font-mono font-bold text-white">{selectedRace.race_date}</div>
                        <div className="text-gray-500 text-sm">{selectedRace.circuit_location}</div>
                    </div>
                </div>
                <button onClick={() => setSelectedRace(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-[#FF1801] text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="p-8">
                {detailsLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1801]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* Left: Circuit Stats */}
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase border-b border-[#38383F] pb-2 mb-6">Circuit Data</h3>
                            <div className="bg-[#101014] p-6 rounded-xl border border-[#38383F] mb-6 flex items-center justify-center">
                                <img 
                                    src={getCircuitMap(selectedRace.country)} 
                                    alt="Circuit Map" 
                                    className="w-full h-auto object-contain invert"
                                />
                            </div>
                            
                            {/* Circuit Details (Filled using Helper) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#1F1F27] p-3 rounded border border-[#38383F]">
                                    <span className="block text-gray-500 text-xs uppercase font-bold">Laps</span>
                                    <span className="text-xl text-white font-mono font-bold">
                                        {/* Use DB laps if available, else use fallback from helper */}
                                        {selectedRace.laps || getCircuitDetails(selectedRace.country).laps}
                                    </span>
                                </div>
                                <div className="bg-[#1F1F27] p-3 rounded border border-[#38383F]">
                                    <span className="block text-gray-500 text-xs uppercase font-bold">Length</span>
                                    <span className="text-xl text-white font-mono font-bold">
                                        {selectedRace.circuit_length || getCircuitDetails(selectedRace.country).length} km
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Results */}
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase border-b border-[#38383F] pb-2 mb-6">Race Results</h3>
                            
                            {selectedRace.is_completed && raceDetails?.race_results?.length > 0 ? (
                                <div className="space-y-4 animate-fade-in">
                                    {/* Winner Card */}
                                    <div className="bg-gradient-to-r from-[#1F1F27] to-[#15151E] p-4 rounded-lg border-l-4 border-[#FF1801] flex items-center justify-between shadow-lg">
                                        <div>
                                            <span className="text-[#FF1801] text-xs font-bold uppercase">Winner</span>
                                            <div className="text-xl font-bold text-white">{raceDetails.race_results[0].driver_name}</div>
                                            <div className="text-xs text-gray-400">{raceDetails.race_results[0].team_name}</div>
                                        </div>
                                        <Trophy className="text-yellow-500 drop-shadow-md" size={32} />
                                    </div>

                                    {/* Top 5 List */}
                                    <div className="bg-[#1F1F27] rounded-lg border border-[#38383F] overflow-hidden">
                                        {raceDetails.race_results.slice(0, 5).map((pos) => (
                                            <div key={pos.position} className="flex justify-between items-center px-4 py-3 border-b border-[#38383F] last:border-0 hover:bg-[#2A2A35] transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className={`font-mono font-bold w-6 ${pos.position === 1 ? 'text-yellow-500' : pos.position === 2 ? 'text-gray-400' : pos.position === 3 ? 'text-orange-700' : 'text-gray-600'}`}>{pos.position}</span>
                                                    <span className="font-bold text-white text-sm">{pos.driver_name}</span>
                                                </div>
                                                <span className="text-xs font-mono text-gray-400">{formatLapTime(pos.time)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Fast Lap & Pole */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {raceDetails.fastest_lap && (
                                            <div className="bg-[#1F1F27] p-3 rounded border border-[#38383F]">
                                                <div className="flex items-center gap-2 text-purple-400 mb-1">
                                                    <Timer size={14} />
                                                    <span className="text-[10px] font-bold uppercase">Fastest Lap</span>
                                                </div>
                                                <div className="text-sm font-bold text-white leading-tight">{raceDetails.fastest_lap.driver_name}</div>
                                                <div className="text-[10px] font-mono text-gray-500">
                                                    {/* Apply Formatter */}
                                                    {formatLapTime(raceDetails.fastest_lap.time)}
                                                </div>
                                            </div>
                                        )}
                                        {raceDetails.pole_position && (
                                            <div className="bg-[#1F1F27] p-3 rounded border border-[#38383F]">
                                                <div className="flex items-center gap-2 text-blue-400 mb-1">
                                                    <Flag size={14} />
                                                    <span className="text-[10px] font-bold uppercase">Pole Position</span>
                                                </div>
                                                <div className="text-sm font-bold text-white leading-tight">{raceDetails.pole_position.driver_name}</div>
                                                <div className="text-[10px] font-mono text-gray-500">
                                                    {/* Apply Formatter */}
                                                    {formatLapTime(raceDetails.pole_position.q3 || raceDetails.pole_position.q1)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-500 opacity-50 border-2 border-dashed border-[#38383F] rounded-xl">
                                    <Flag size={48} className="mb-4" />
                                    <p className="uppercase font-bold tracking-widest">Results Pending</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Races;