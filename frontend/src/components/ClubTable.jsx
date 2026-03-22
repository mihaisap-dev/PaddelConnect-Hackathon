import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClubTable = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const API_URL = "https://padel-hackathon.onrender.com/api/clubs/";
    fetch(API_URL)
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
    <div className="flex justify-center items-center py-20 font-black italic text-[#2323FF] uppercase tracking-widest animate-pulse">
        Se încarcă lista de cluburi...
    </div>
  );

  return (
    // FUNDAL CU GRADIENT ALBASTRU ȘI PETE DE LUMINĂ
    <div id="club-table-section" className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-white min-h-screen scroll-mt-20">
      
      {/* DECORAȚIUNI ALBASTRE (BLURRED GLOWS) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#2323FF]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
        {/* HEADER PAGINĂ */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
              Arena <span className="text-[#2323FF]">Cluburilor</span>
            </h1>
            <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 ml-1">
              Lista completă a locațiilor partenere Padel.Connect
            </p>
          </div>
          <div className="bg-[#2323FF] text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest inline-block self-start shadow-xl shadow-blue-200">
              {clubs.length} Locații Disponibile
          </div>
        </div>

        {/* TABELUL */}
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border border-blue-100 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-[#ccff00] uppercase text-[10px] tracking-[0.2em] font-black">
                  <th className="p-8">Logo</th>
                  <th className="p-8 border-l border-white/10">Denumire</th>
                  <th className="p-8 border-l border-white/10">Oraș</th>
                  <th className="p-8 border-l border-white/10">Adresă</th>
                  <th className="p-8 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {clubs.map((club) => (
                  <tr 
                    key={club.id} 
                    onClick={() => navigate(`/club/${club.id}`)}
                    className="group hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <td className="p-6">
                      <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300 border border-gray-100">
                        <img src={club.image_url || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="" />
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-black text-xl uppercase italic text-gray-800 group-hover:text-[#2323FF] transition-colors duration-300">
                        {club.name}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                          {club.city || "București"}
                      </span>
                    </td>
                    <td className="p-6 text-gray-400 font-bold text-sm italic max-w-[250px] truncate">
                      {club.address}
                    </td>
                    <td className="p-6 text-right">
                      <button className="bg-black text-[#ccff00] px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase italic transition-all group-hover:bg-[#2323FF] group-hover:text-white shadow-lg group-hover:shadow-blue-200">
                        Vezi Terenuri
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubTable;