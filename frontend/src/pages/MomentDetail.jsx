import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { MOMENTS } from '../utils/momentsData';

const MomentDetail = () => {
  const { id } = useParams();
  const moment = MOMENTS.find(m => m.id === parseInt(id));

  if (!moment) {
    return (
      <div className="min-h-screen bg-[#101014] flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Moment Not Found</h2>
          <Link to="/" className="text-[#FF1801] hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleImageError = (e) => {
    e.target.src = "https://www.transparenttextures.com/patterns/carbon-fibre.png";
    e.target.style.opacity = "0.2";
  };

  return (
    <div className="min-h-screen bg-[#101014] animate-fade-in relative">
      {/* Back Button */}
      <Link to="/" className="absolute top-6 left-6 z-50 bg-black/50 hover:bg-[#FF1801] text-white p-3 rounded-full backdrop-blur-md transition-all">
        <ArrowLeft size={24} />
      </Link>

      <div className="flex flex-col lg:flex-row h-screen">
        
        {/* Left: Image (Full height on desktop) */}
        <div className="lg:w-3/5 h-1/2 lg:h-full relative bg-[#15151E] overflow-hidden group">
          <img 
            src={moment.image} 
            alt={moment.title} 
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-[20s] ease-linear transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#101014]"></div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-2/5 h-1/2 lg:h-full overflow-y-auto bg-[#101014] p-8 lg:p-16 flex flex-col justify-center relative">
          
          {/* Decorative Team Stripe */}
          <div className="absolute top-0 left-0 w-full lg:w-2 h-2 lg:h-full" style={{ backgroundColor: moment.color }}></div>

          <div className="mb-6 flex items-center space-x-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-sm border border-white/10 flex items-center">
              <Calendar size={14} className="mr-2" /> {moment.year}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-sm border border-white/10 flex items-center">
              <MapPin size={14} className="mr-2" /> {moment.circuit}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black italic text-white uppercase leading-none mb-8">
            {moment.title}
          </h1>

          <div className="prose prose-invert prose-lg">
            <p className="text-gray-300 leading-relaxed text-lg border-l-4 border-white/20 pl-6 italic">
              {moment.description}
            </p>
          </div>

          <div className="mt-12">
             <Link to="/" className="text-sm font-bold uppercase tracking-widest text-[#FF1801] hover:text-white transition-colors flex items-center">
               Back to Archives
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentDetail;