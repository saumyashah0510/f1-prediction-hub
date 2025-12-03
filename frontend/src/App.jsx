import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail'; // New Import
import Standings from './pages/Standings';
import Predictions from './pages/Predictions';
import Teams from './pages/Teams';
import MomentDetail from './pages/MomentDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#101014] text-white flex flex-col font-sans selection:bg-[#FF1801] selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/moment/:id" element={<MomentDetail />} />
            
            {/* Model Routes */}
            <Route path="/models" element={<Models />} />
            <Route path="/models/:id" element={<ModelDetail />} /> {/* New Route */}
            
            <Route path="/standings" element={<Standings />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/predictions" element={<Predictions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;