import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { f1Service } from '../services/api';
import { getTeamColor } from '../utils/f1Colors';
import { DRIVER_DETAILS } from '../utils/driverData';
import { Trophy, Flag, Timer, BarChart2, ArrowLeft, MapPin, Users } from 'lucide-react';

const DriverDetail = () => {
    const { code } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get static info (Bio, Gallery, Stats) or fallback
    const details = DRIVER_DETAILS[code] || DRIVER_DETAILS["DEFAULT"];

    useEffect(() => {
        const fetchDriverData = async () => {
            setLoading(true);
            try {
                // We still attempt to fetch live profile for name/team/number; but stats displayed come from DRIVER_DETAILS
                const res = await f1Service.getDriverByCode(code);
                setDriver(res.data);
            } catch (error) {
                console.error("Error fetching driver (non-fatal):", error);
                // If backend fails, build a minimal driver object from details
                setDriver({
                    first_name: code,
                    last_name: '',
                    driver_number: details.stats?.number || '--',
                    team_id: details.team_id || null
                });
            } finally {
                setLoading(false);
            }
        };
        fetchDriverData();
    }, [code, details]);

    if (loading) return (
        <div className="min-h-screen bg-[#101014] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF1801]"></div>
        </div>
    );

    if (!driver) return <div className="text-white p-10">Driver not found</div>;

    // teamColor: if backend provides team name/id you can map; fallback to a neutral color via getTeamColor with team_id/name
    const teamColor = driver.team_name ? getTeamColor(driver.team_name) : (details.team_color || '#FF1801');

    // read stats from details.stats (hard-coded)
    const stats = details.stats || {
        wins: 0, podiums: 0, poles: 0, fastest_laps: 0, career_points: 0
    };

    return (
        <div className="min-h-screen bg-[#101014] flex flex-col lg:flex-row animate-fade-in overflow-hidden">

            {/* LEFT: Immersive Gallery (Auto Scroll) */}
            <div className="lg:w-1/2 h-[50vh] lg:h-screen relative overflow-hidden bg-black">
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#101014] via-transparent to-transparent lg:bg-gradient-to-r"></div>

                {/* Horizontal Infinite Carousel */}
                <div className="absolute inset-0 overflow-hidden bg-black">
                    <div className="carousel-track flex h-full animate-scroll-horizontal">
                        {[...details.photos, ...details.photos].map((photo, idx) => (
                            <img
                                key={idx}
                                src={photo}
                                alt=""
                                className="h-full object-cover flex-shrink-0 carousel-image opacity-60"
                                onError={(e) => (e.target.src =
                                    'https://media.formula1.com/image/upload/content/dam/fom-website/manual/Misc/2021-Master-Folder/GettyImages-1357632386.jpg'
                                )}
                            />
                        ))}
                    </div>
                </div>



                {/* Back Button */}
                <Link to="/teams" className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-[#FF1801] text-white p-3 rounded-full backdrop-blur-md transition-all">
                    <ArrowLeft size={24} />
                </Link>

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 p-8 z-30">
                    <h1 className="text-6xl md:text-8xl font-black italic text-white uppercase leading-none tracking-tighter mb-2">
                        {driver.first_name}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            {driver.last_name}
                        </span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-4xl font-mono font-bold text-[#FF1801]">#{driver.driver_number}</span>
                        <div className="h-8 w-px bg-white/30"></div>
                        <span className="text-xl uppercase tracking-widest text-gray-300">{details.country}</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Stats & Bio */}
            <div className="lg:w-1/2 h-auto lg:h-screen overflow-y-auto bg-[#101014] p-8 lg:p-16 relative">

                {/* Bio Section */}
                <div className="mb-12">
                    <h3 className="text-[#FF1801] font-bold uppercase tracking-widest mb-4 flex items-center">
                        <Users size={18} className="mr-2" /> Driver Profile
                    </h3>
                    <p className="text-xl text-gray-300 leading-relaxed font-light border-l-4 border-[#38383F] pl-6">
                        {details.bio}
                    </p>
                </div>

                {/* Career Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-[#1F1F27] p-6 rounded-xl border border-[#38383F] hover:border-[#FF1801] transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Race Wins</span>
                            <Trophy className="text-yellow-500 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <span className="text-4xl font-mono font-bold text-white">{stats.wins}</span>
                    </div>

                    <div className="bg-[#1F1F27] p-6 rounded-xl border border-[#38383F] hover:border-[#FF1801] transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Podiums</span>
                            <BarChart2 className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <span className="text-4xl font-mono font-bold text-white">{stats.podiums}</span>
                    </div>

                    <div className="bg-[#1F1F27] p-6 rounded-xl border border-[#38383F] hover:border-[#FF1801] transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Pole Positions</span>
                            <Flag className="text-green-500 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <span className="text-4xl font-mono font-bold text-white">{stats.poles}</span>
                    </div>

                    <div className="bg-[#1F1F27] p-6 rounded-xl border border-[#38383F] hover:border-[#FF1801] transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-xs font-bold uppercase">Fastest Laps</span>
                            <Timer className="text-purple-500 group-hover:scale-110 transition-transform" size={24} />
                        </div>
                        <span className="text-4xl font-mono font-bold text-white">{stats.fastest_laps}</span>
                    </div>
                </div>

                {/* Total Points Big Card */}
                <div className="bg-gradient-to-r from-[#1F1F27] to-[#15151E] p-8 rounded-xl border border-[#38383F] flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-bold uppercase mb-1">Career Points</p>
                        <h2 className="text-5xl font-mono font-black text-white">{stats.career_points}</h2>
                    </div>
                    <div className="h-16 w-16 rounded-full border-4 border-[#FF1801] flex items-center justify-center bg-black">
                        <span className="font-bold text-white text-xl">PTS</span>
                    </div>
                </div>

            </div>

            {/* Animation Styles */}
            <style>{`
  .carousel-track {
    width: 200%;         /* 2× original list */
  }

  .carousel-image {
    width: calc(100% / ${details.photos.length}); /* Each image takes equal space */
  }

  @keyframes scrollHorizontal {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Scroll exactly one full set */
  }

  .animate-scroll-horizontal {
    animation: scrollHorizontal 12s linear infinite;
  }
`}</style>


        </div>
    );
};

export default DriverDetail;
