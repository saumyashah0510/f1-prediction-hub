import React, { useEffect, useState } from 'react';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { Trophy, Medal, Flag, Users, ChevronDown, Filter } from 'lucide-react';

const Standings = () => {
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' or 'constructors'
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [driverStandings, setDriverStandings] = useState([]);
  const [constructorStandings, setConstructorStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data when Season changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [driversRes, constructorsRes] = await Promise.all([
          f1Service.getDriverStandings(selectedSeason),
          f1Service.getConstructorStandings(selectedSeason)
        ]);
        setDriverStandings(driversRes.data);
        setConstructorStandings(constructorsRes.data);
      } catch (error) {
        console.error("Error fetching standings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedSeason]);

  // --- SUB-COMPONENTS ---

  // 1. The Podium (Top 3 Display)
  const Podium = ({ data, type }) => {
    if (data.length < 3) return null;

    // Reorder for visual podium: 2nd (Left), 1st (Center), 3rd (Right)
    const podiumOrder = [data[1], data[0], data[2]];

    return (
      <div className="flex justify-center items-end gap-4 mb-12 px-4 h-64 md:h-80">
        {podiumOrder.map((item, idx) => {
          const isWinner = idx === 1; // Center item is 1st place
          const rank = isWinner ? 1 : idx === 0 ? 2 : 3;
          const heightClass = isWinner ? 'h-full' : idx === 0 ? 'h-4/5' : 'h-3/4';
          const name = type === 'drivers' ? item.driver_name : item.team_name;
          const team = type === 'drivers' ? item.team_name : null;
          const color = getTeamColor(type === 'drivers' ? item.team_name : item.team_name);

          return (
            <div key={item.id} className={`relative flex flex-col justify-end w-1/3 max-w-[200px] ${heightClass} transition-all duration-500 hover:-translate-y-2`}>

              {/* Avatar / Icon Placeholder */}
              <div className="mx-auto mb-4 relative">
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full border-4 shadow-lg overflow-hidden bg-[#1F1F27] flex items-center justify-center`} style={{ borderColor: color }}>
                  {type === 'drivers' ? (
                    <img
                      src={`/images/drivers/${item.driver_code}.png`}
                      alt={name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://media.formula1.com/image/upload/v1678240723/fom-website/2023/Drivers/placeholder.jpg.transform/2col/image.jpg";
                      }}
                    />
                  ) : (
                    <img
                      src={`/images/constructors/${item.team_name}.png`}
                      alt={item.team_name}
                      className="w-10 h-10 md:w-14 md:h-14 object-contain"
                      onError={(e) => {
                        e.target.src =
                          "https://upload.wikimedia.org/wikipedia/commons/3/3f/F1_logo.svg";
                      }}
                    />
                  )}

                </div>
                {isWinner && <Trophy className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-md" size={32} />}
              </div>

              {/* The Podium Step */}
              <div className="bg-[#1F1F27] border-t-4 rounded-t-lg shadow-2xl flex flex-col items-center justify-start pt-4 pb-2 h-full w-full relative overflow-hidden" style={{ borderColor: color }}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                <span className={`text-3xl md:text-5xl font-black italic text-white/10 absolute bottom-0`}>{rank}</span>

                <div className="text-center z-10 px-2">
                  <h3 className="font-bold text-white text-sm md:text-lg leading-tight mb-1 truncate w-full">{name}</h3>
                  {team && <p className="text-[10px] md:text-xs text-gray-400 uppercase">{team}</p>}
                  <div className="mt-2 bg-[#101014] px-3 py-1 rounded-full text-xs font-mono font-bold text-white inline-block border border-white/10">
                    {item.points} <span className="text-gray-500">PTS</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 2. The Table Row
  const StandingRow = ({ item, rank, type }) => {
    const color = getTeamColor(type === 'drivers' ? item.team_name : item.team_name);
    const name = type === 'drivers' ? item.driver_name : item.team_name;
    const subtext = type === 'drivers' ? item.team_name : null;

    return (
      <div className="group flex items-center p-4 bg-[#1F1F27] border border-[#38383F] rounded-lg mb-3 hover:border-gray-500 hover:bg-[#25252D] transition-all hover:-translate-x-1 duration-200">
        <div className="w-12 text-center font-black text-xl italic text-gray-500 group-hover:text-white transition-colors">
          {rank}
        </div>

        <div className="h-10 w-1 rounded-full mx-4" style={{ backgroundColor: color }}></div>

        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="font-bold text-white text-lg">{name}</h4>
            {type === 'drivers' && <span className="ml-3 text-xs font-black italic text-gray-600 bg-black/30 px-2 py-0.5 rounded uppercase">{item.driver_code}</span>}
          </div>
          {subtext && <p className="text-xs text-gray-400 uppercase tracking-wider">{subtext}</p>}
        </div>

        {/* Stats Columns */}
        <div className="flex space-x-4 md:space-x-12 text-right">
          <div className="hidden md:block">
            <span className="block text-[10px] text-gray-500 uppercase font-bold">Wins</span>
            <span className="text-white font-bold">{item.wins}</span>
          </div>
          <div className="w-24">
            <span className="block text-[10px] text-gray-500 uppercase font-bold">Points</span>
            <span className="text-[#FF1801] font-mono font-black text-xl">{item.points}</span>
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---

  const currentData = activeTab === 'drivers' ? driverStandings : constructorStandings;

  return (
    <div className="min-h-screen bg-[#101014] animate-fade-in pb-20">

      {/* Header Section */}
      <div className="bg-[#15151E] border-b border-[#38383F] py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">

          <div>
            <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter mb-2">
              Championship <span className="text-[#FF1801]">Standings</span>
            </h1>
            <p className="text-gray-400 max-w-lg">
              Official points tally for the {selectedSeason} Formula 1 World Championship.
            </p>
          </div>

          {/* Controls */}
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

            <div className="h-8 w-px bg-[#38383F]"></div>

            <div className="flex bg-[#1F1F27] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('drivers')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold uppercase transition-all ${activeTab === 'drivers' ? 'bg-[#FF1801] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Drivers
              </button>
              <button
                onClick={() => setActiveTab('constructors')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold uppercase transition-all ${activeTab === 'constructors' ? 'bg-[#FF1801] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                Constructors
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8">

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF1801]"></div>
          </div>
        ) : (
          <>
            {/* 1. Visual Podium */}
            <div className="mb-8">
              <Podium data={currentData} type={activeTab} />
            </div>

            {/* 2. Full Table (Starting from P4) */}
            <div className="max-w-4xl mx-auto">
              {/* Label Row */}
              <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 px-6 mb-2 tracking-widest">
                <span>Position / Driver</span>
                <span className="pr-8">Stats</span>
              </div>

              {/* Render P4 onwards (Podium handles top 3) */}
              {currentData.slice(3).map((item, index) => (
                <StandingRow
                  key={item.id}
                  item={item}
                  rank={index + 4} // +4 because we skipped top 3
                  type={activeTab}
                />
              ))}

              {/* If less than 3 drivers, show them all in table instead? 
                   (Edge case handling for start of season) */}
              {currentData.length < 3 && <div className="text-center text-gray-500 py-10">Not enough data to display podium yet.</div>}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Standings;