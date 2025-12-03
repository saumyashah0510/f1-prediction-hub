import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EDA_IMAGES } from '../utils/modelsData';
import { BarChart2, ZoomIn, X, ChevronRight } from 'lucide-react';

const Models = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container mx-auto px-4 py-12 animate-fade-in">
      
      {/* Introduction */}
      <div className="mb-16">
        <h2 className="text-5xl font-black italic uppercase mb-6 text-white">The Brains</h2>
        <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">
          Our prediction engine runs on a hybrid architecture. We combine <span className="text-white font-bold">XGBoost</span> for precise position regression with <span className="text-white font-bold">LightGBM</span> for robust probability classification.
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {/* XGBoost */}
        <Link to="/models/xgboost-reg" className="group bg-[#1F1F27] border border-[#38383F] rounded-2xl p-8 hover:border-green-500 transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart2 size={120} />
          </div>
          <div className="h-1 w-24 bg-green-500 mb-6"></div>
          <h3 className="text-3xl font-black italic text-white uppercase mb-2">XGBoost Regressor</h3>
          <p className="text-gray-400 mb-6">Position Prediction • MAE Optimization</p>
          <div className="flex items-center text-green-500 font-bold uppercase tracking-widest text-xs">
            View Architecture <ChevronRight size={14} className="ml-1" />
          </div>
        </Link>

        {/* LightGBM */}
        <Link to="/models/lgbm-class" className="group bg-[#1F1F27] border border-[#38383F] rounded-2xl p-8 hover:border-blue-500 transition-all hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <BarChart2 size={120} />
          </div>
          <div className="h-1 w-24 bg-blue-500 mb-6"></div>
          <h3 className="text-3xl font-black italic text-white uppercase mb-2">LightGBM Classifier</h3>
          <p className="text-gray-400 mb-6">Win Probability • Podium Chances</p>
          <div className="flex items-center text-blue-500 font-bold uppercase tracking-widest text-xs">
            View Architecture <ChevronRight size={14} className="ml-1" />
          </div>
        </Link>
      </div>

      {/* EDA Gallery Section */}
      <div className="border-t border-[#38383F] pt-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-black italic uppercase text-white">Data Analysis</h3>
          <span className="text-sm text-gray-500 font-mono hidden md:inline">EXPLORATORY DATA ANALYSIS (EDA)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EDA_IMAGES.map((img) => (
            <div 
              key={img.id} 
              className="bg-[#15151E] rounded-xl overflow-hidden border border-[#38383F] group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://www.transparenttextures.com/patterns/carbon-fibre.png";
                    e.target.style.opacity = "0.2";
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white" size={32} />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-1">{img.title}</h4>
                <p className="text-xs text-gray-500">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-[#FF1801] transition-colors">
            <X size={32} />
          </button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.src} 
              alt={selectedImage.title} 
              className="w-full h-auto rounded-lg shadow-2xl border border-[#38383F]" 
            />
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white">{selectedImage.title}</h3>
              <p className="text-gray-400 mt-2">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Models;