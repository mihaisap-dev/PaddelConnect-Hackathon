import React from 'react';

const LoadingTransition = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-10">
        
        {/* CONTAINER PENTRU PALETĂ ȘI MINGE */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          
          {/* 1. MINGEA (Tenis/Padel) */}
          <div className="absolute w-12 h-12 bg-[#ccff00] rounded-full shadow-lg z-20 shadow-[#ccff00]/30 animate-ball-bounce">
            {/* Linii Mingii (pentru detalii) */}
            <div className="absolute inset-0 border-4 border-black/10 rounded-full scale-90 rotate-45"></div>
            <div className="absolute inset-0 border-4 border-black/10 rounded-full scale-90 -rotate-45"></div>
          </div>

          {/* 2. PALETA DE PADEL */}
          <div className="absolute w-32 h-44 z-10 animate-paddle-swing origin-bottom-right">
            {/* Capul Paletei */}
            <div className="w-full h-32 bg-gray-900 border-8 border-gray-800 rounded-[3rem] p-4 flex flex-wrap gap-1.5 shadow-xl">
              {/* Găuri Paletă (6 bucăți) */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-700 rounded-full"></div>
              ))}
            </div>
            {/* Mânerul Paletei */}
            <div className="w-8 h-20 bg-gray-950 rounded-b-xl mx-auto -mt-2 shadow-inner"></div>
          </div>
        </div>

        {/* TEXT ÎNCĂRCARE */}
        <p className="font-black italic uppercase text-2xl text-[#ccff00] tracking-widest animate-pulse">
          Se procesează...
        </p>
      </div>
    </div>
  );
};

export default LoadingTransition;