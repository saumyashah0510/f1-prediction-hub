import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Zap, Brain, Flag, Users, Calendar, Sliders, Swords } from 'lucide-react'; // Added Swords

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-white bg-[#38383F]' : 'text-gray-400 hover:text-white hover:bg-[#38383F]/50';
  };

  return (
    <nav className="bg-[#15151E] border-b border-[#38383F] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-[#FF1801] rounded-md flex items-center justify-center transform -skew-x-12 group-hover:bg-red-600 transition-colors">
              <span className="text-white font-bold text-lg italic pr-1">F1</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase hidden md:block">
              Prediction<span className="text-[#FF1801]">Hub</span>
            </span>
          </Link>

          <div className="flex space-x-1 md:space-x-2 lg:space-x-4 overflow-x-auto no-scrollbar">
            <Link to="/" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/')}`}>
              <Flag size={16} />
              <span className="hidden lg:inline">Home</span>
            </Link>
            
            <Link to="/races" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/races')}`}>
              <Calendar size={16} />
              <span className="hidden lg:inline">Races</span>
            </Link>

            <Link to="/standings" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/standings')}`}>
              <Trophy size={16} />
              <span className="hidden lg:inline">Standings</span>
            </Link>

            <Link to="/teams" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/teams')}`}>
              <Users size={16} />
              <span className="hidden lg:inline">Teams</span>
            </Link>
            
            <Link to="/predictions" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/predictions')}`}>
              <Zap size={16} />
              <span className="hidden lg:inline">Predictions</span>
            </Link>
            
            {/* Updated: Changed Strategy to Compare */}
            <Link to="/compare" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/compare')}`}>
              <Swords size={16} />
              <span className="hidden lg:inline">Compare</span>
            </Link>

            <Link to="/models" className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-all text-sm uppercase tracking-wider font-medium ${isActive('/models')}`}>
              <Brain size={16} />
              <span className="hidden lg:inline">Models</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;