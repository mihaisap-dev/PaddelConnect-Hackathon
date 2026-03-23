import React from 'react'
import { useNavigate } from 'react-router-dom';
import padelBgImage from '../assets/padel.jpg' 

const Hero = () => {
  const navigate = useNavigate();

  const handleStartSearching = () => {
    const element = document.getElementById('club-table-section');
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/clubs'); 
      
      setTimeout(() => {
        document.getElementById('club-table-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div 
      className="py-16 md:py-24 border-b border-gray-100 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${padelBgImage})` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center text-white relative z-10">
        <div className="space-y-6 relative z-10">
          {}
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight tracking-tighter">
            Rezervă Terenul tău de <span className="text-sport-neon bg-sport-dark px-3 rounded-md">Padel</span> instant.
          </h1>
          <p className="text-xl max-w-lg font-medium text-gray-200 leading-relaxed">
            Găsește cele mai bune cluburi din oraș, verifică disponibilitatea și rezervă în 30 de secunde.
          </p>
          <div className="pt-4">
            <button 
              onClick={handleStartSearching}
              className="bg-sport-dark text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-sport-neon hover:text-sport-dark transition-all transform hover:scale-105 shadow-lg border border-transparent hover:border-sport-neon"
            >
              Găsește un Teren Acum
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero