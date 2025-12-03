import React from 'react';

const Footer = () => (
  <footer className="bg-[#15151E] border-t border-[#38383F] py-12 mt-auto">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold tracking-tighter uppercase">
            Prediction<span className="text-[#FF1801]">Hub</span>
          </span>
          <p className="text-gray-500 text-xs mt-2">
            Not associated with Formula 1 companies. Data provided by FastF1.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;