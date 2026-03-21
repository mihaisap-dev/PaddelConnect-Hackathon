import React from 'react';

const CancelTransition = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-10">
        
        {/* CONTAINER PENTRU PALETĂ TRISTĂ ȘI MINGE CARE PLEACĂ */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* 1. MINGEA CARE PLEACĂ (Se îndepărtează trist) */}
          <div className="absolute w-10 h-10 bg-[#ccff00] rounded-full shadow-lg z-20 shadow-[#ccff00]/10 animate-ball-leave opacity-60">
            {/* Linii Mingii */}
            <div className="absolute inset-0 border-2 border-black/10 rounded-full scale-90 rotate-45"></div>
            <div className="absolute inset-0 border-2 border-black/10 rounded-full scale-90 -rotate-45"></div>
          </div>

          {/* 2. PALETA DE PADEL TRISTĂ */}
          <div className="absolute w-36 h-48 z-10 animate-paddle-sad origin-bottom">
            {/* Capul Paletei (Culoare mai ștearsă) */}
            <div className="w-full h-36 bg-gray-800 border-8 border-gray-700 rounded-[3rem] p-4 flex flex-wrap gap-1.5 shadow-xl relative">
              {/* Găuri Paletă */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-900 rounded-full"></div>
              ))}
              
              {/* OCHII TRIȘTI (Schițați din găuri) */}
              <div className="absolute top-12 left-10 w-3 h-1.5 bg-gray-950 rounded-t-full rotate-12"></div>
              <div className="absolute top-12 right-10 w-3 h-1.5 bg-gray-950 rounded-t-full -rotate-12"></div>
              
              {/* GURA TRISTĂ (Arcuită în jos) */}
              <div className="absolute bottom-10 left-1/2 -translateX-1/2 w-10 h-5 border-b-4 border-gray-950 rounded-full"></div>

              {/* LACRIMA (Animație separată) */}
              <div className="absolute top-16 right-10 w-2.5 h-2.5 bg-blue-400 rounded-full rounded-tr-none rotate-45 animate-tear-drop shadow-lg shadow-blue-400/30"></div>
            </div>
            {/* Mânerul Paletei */}
            <div className="w-8 h-20 bg-gray-900 rounded-b-xl mx-auto -mt-2 shadow-inner"></div>
          </div>
        </div>

        {/* TEXT ANULARE */}
        <div className="text-center">
          <p className="font-black italic uppercase text-3xl text-red-500 tracking-tighter animate-pulse mb-2">
            Rezervare Anulată
          </p>
          <p className="font-bold text-gray-400 text-sm uppercase tracking-widest">
            Ne pare rău să te vedem plecând...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelTransition;