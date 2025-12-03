import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Activity, List, Sliders } from 'lucide-react';
import { MODELS } from '../utils/modelsData';

const ModelDetail = () => {
  const { id } = useParams();
  const model = MODELS.find(m => m.id === id);

  if (!model) return <div className="text-white text-center py-20">Model not found</div>;

  return (
    <div className="min-h-screen bg-[#101014] p-8 animate-fade-in">
      <Link to="/models" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Models
      </Link>

      {/* Header */}
      <div className="bg-[#1F1F27] border border-[#38383F] p-8 rounded-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Cpu size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${model.type === 'Regression' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'}`}>
              {model.type}
            </span>
            <span className="text-gray-500 text-sm font-mono">v3.0.0</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase mb-4">{model.name}</h1>
          <p className="text-xl text-gray-400 max-w-3xl">{model.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Metrics Column */}
        <div className="bg-[#15151E] border border-[#38383F] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center">
            <Activity size={18} className="mr-2 text-[#FF1801]" /> Performance Metrics
          </h3>
          <div className="space-y-4">
            {Object.entries(model.metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-[#1F1F27] rounded-lg">
                <span className="text-gray-400 uppercase text-xs font-bold">{key.replace(/_/g, ' ')}</span>
                <span className="text-white font-mono font-bold text-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Column */}
        <div className="bg-[#15151E] border border-[#38383F] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center">
            <List size={18} className="mr-2 text-[#FF1801]" /> Top Predictors
          </h3>
          <ul className="space-y-3">
            {model.top_features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-gray-300">
                <span className="w-6 h-6 rounded-full bg-[#1F1F27] flex items-center justify-center text-xs font-bold text-gray-500 mr-3">
                  {idx + 1}
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Hyperparams Column */}
        <div className="bg-[#15151E] border border-[#38383F] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center">
            <Sliders size={18} className="mr-2 text-[#FF1801]" /> Hyperparameters
          </h3>
          <div className="font-mono text-sm text-green-400 bg-black p-4 rounded-lg overflow-x-auto">
            <pre>{JSON.stringify(model.params, null, 2)}</pre>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelDetail;