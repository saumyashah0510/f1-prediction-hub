import React from 'react';

const Models = () => (
  <div className="container mx-auto px-4 py-12 animate-fade-in">
    <div className="mb-12">
      <h2 className="text-4xl font-black italic uppercase mb-4">Our Models</h2>
      <p className="text-gray-400 max-w-2xl">
        We utilize a hybrid approach combining Regression and Classification models to provide the most accurate forecasts possible.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* XGBoost Card */}
      <div className="bg-[#1F1F27] border border-[#38383F] rounded-lg overflow-hidden hover:border-green-500 transition-colors">
        <div className="h-2 bg-green-500 w-full"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">XGBoost Regressor</h3>
            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded text-xs font-bold uppercase">Position Prediction</span>
          </div>
          <p className="text-gray-400 mb-6">
            Optimized for minimizing error distance. This model predicts the exact finishing position of a driver (e.g., P4, P12).
          </p>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#38383F] pb-2">
              <span className="text-gray-500 text-sm">MAE (Mean Absolute Error)</span>
              <span className="font-mono font-bold text-white">2.989</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#38383F] pb-2">
              <span className="text-gray-500 text-sm">R² Score</span>
              <span className="font-mono font-bold text-white">0.46</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-500 text-sm">Accuracy (±2 Positions)</span>
              <span className="font-mono font-bold text-white">49.1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* LightGBM Card */}
      <div className="bg-[#1F1F27] border border-[#38383F] rounded-lg overflow-hidden hover:border-blue-500 transition-colors">
        <div className="h-2 bg-blue-500 w-full"></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">LightGBM Classifier</h3>
            <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded text-xs font-bold uppercase">Probability Scoring</span>
          </div>
          <p className="text-gray-400 mb-6">
            Specializes in binary outcomes. Used to calculate the percentage chance of achieving specific tiers.
          </p>
          <div className="space-y-4">
            {/* Added WIN Metric */}
            <div className="flex justify-between items-center border-b border-[#38383F] pb-2">
              <span className="text-gray-500 text-sm">Win (P1) F1-Score</span>
              <span className="font-mono font-bold text-white">0.615</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#38383F] pb-2">
              <span className="text-gray-500 text-sm">Podium F1-Score</span>
              <span className="font-mono font-bold text-white">0.794</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#38383F] pb-2">
              <span className="text-gray-500 text-sm">Top 5 F1-Score</span>
              <span className="font-mono font-bold text-white">0.805</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-gray-500 text-sm">Points Finish F1-Score</span>
              <span className="font-mono font-bold text-white">0.796</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Models;