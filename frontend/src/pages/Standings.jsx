import React from 'react';
import { Trophy } from 'lucide-react';

const Standings = () => (
  <div className="container mx-auto px-4 py-24 text-center animate-fade-in">
    <div className="inline-flex p-6 rounded-full bg-[#1F1F27] border border-[#38383F] mb-6">
      <Trophy size={48} className="text-[#FF1801]" />
    </div>
    <h2 className="text-4xl font-black italic uppercase mb-4">Live Standings</h2>
    <p className="text-gray-400 max-w-md mx-auto mb-8">
      Full tables coming soon. Check the Home page for the top 5 preview.
    </p>
  </div>
);

export default Standings;