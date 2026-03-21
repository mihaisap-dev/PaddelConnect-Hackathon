import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  const handleReserveClick = (clubId) => {
    const token = localStorage.getItem('token');
    if (!clubId) return;
    if (!token) {
      alert("Trebuie să fii logat pentru a face o rezervare!");
      navigate("/auth");
    } else {
      navigate(`/club/${clubId}`);
    }
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/clubs/')
      .then(res => res.json())
      .then(data => {
        setClubs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Eroare la preluarea cluburilor:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20 bg-gray-50 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ccff00]"></div>
        <span className="ml-4 font-black italic text-gray-400 uppercase tracking-tighter">Se caută terenuri...</span>
    </div>
  );

  return (
    <div className="relative group px-4 max-w-7xl mx-auto my-12">
      {/* TITLU SECȚIUNE */}
      <h2 className="text-4xl font-black mb-10 italic tracking-tighter uppercase text-gray-900 flex items-center gap-3">
        <span className="w-2 h-10 bg-[#ccff00]"></span> Cluburi Recomandate
      </h2>
      
      {/* CARUSEL ORIZONTAL */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-8 pb-10 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {clubs.map((club) => (
          <div 
            key={club.id} 
            className="flex-none w-[320px] sm:w-[400px] snap-center bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group/card"
          >
            {/* IMAGINE CLUB */}
            <div className="h-56 overflow-hidden relative bg-gray-100">
                <img 
                  src={club.image_url || "https://via.placeholder.com/600x400?text=Padel+Club"} 
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110 duration-700" 
                  alt={club.name} 
                />
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-[#ccff00] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
                  {club.city || "București"}
                </div>
            </div>

            {/* INFO CLUB */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-3xl font-black uppercase italic text-gray-900 tracking-tighter group-hover/card:text-[#ccff00] transition-colors">
                      {club.name}
                  </h3>
                  
                  {/* LOGICA DE AFISARE STELE (SINCRONIZATĂ CU FLOAT) */}
                  <div className="flex text-[#ccff00] text-sm mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} 
                        className={i < Math.round(club.rating || 5) ? "text-[#ccff00]" : "text-gray-200"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {/* AFISĂM ZECIMALA EXACTĂ (EX: 4.2) */}
                  <span className="text-[#ccff00] font-black italic text-xs bg-black px-2 py-0.5 rounded shadow-sm">
                    {club.rating ? parseFloat(club.rating).toFixed(1) : "5.0"}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Rating Arena
                  </span>
                </div>

                <p className="text-gray-400 text-sm font-bold uppercase tracking-tight flex items-center gap-2 mb-8">
                    <span className="text-xl">📍</span> {club.address}
                </p>

                <div className="flex justify-between items-center border-t border-gray-50 pt-6 mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Preț mediu</span>
                      <span className="font-black text-2xl text-black">
                        {club.average_price || "180"} <small className="text-xs">RON</small>
                      </span>
                    </div>

                    <button 
                      onClick={() => handleReserveClick(club.id)}
                      className="bg-[#ccff00] hover:bg-black hover:text-[#ccff00] text-black font-black px-10 py-4 rounded-2xl transition-all duration-300 text-xs uppercase italic shadow-lg active:scale-95"
                    >
                      Rezervă
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* BARA DE PROGRES */}
      <div className="flex justify-between items-center mt-4 px-4">
        <div className="h-[2px] flex-grow bg-gray-100 rounded-full mr-10 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${scrollProgress}%` }}
            ></div>
        </div>
        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] whitespace-nowrap">
           {scrollProgress > 98 ? "Final listă" : "Glisează →"}
        </span>
      </div>
    </div>
  );
};

export default ClubList;