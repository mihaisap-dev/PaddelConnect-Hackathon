import React, { useState, useEffect } from 'react';
import CancelTransition from './CancelTransition'; 
import { useNavigate } from 'react-router-dom'; // Importăm pentru navigare

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate(); // Inițializăm navigarea

  const fetchBookings = () => {
    const token = localStorage.getItem('token');
    fetch('https://padel-hackathon.onrender.com/api/bookings/', {
      headers: { 'Authorization': `Token ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const canCancel = (startTime) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diffInMs = eventTime - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours >= 4; 
  };

  const handleCancel = async (bookingId, startTime) => {
    const token = localStorage.getItem('token');
    
    if (!canCancel(startTime)) {
      alert("⚠️ Prea târziu! Rezervările pot fi anulate cu cel târziu 4 ore înainte de meci.");
      return;
    }

    if (window.confirm("Ești sigur că vrei să anulezi această rezervare?")) {
      try {
        const response = await fetch(`https://padel-hackathon.onrender.com/api/bookings/${bookingId}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` }
        });

        if (response.ok) {
          setIsCancelling(true);
          setTimeout(() => {
            setIsCancelling(false);
            fetchBookings(); 
          }, 3000);
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Eroare la anulare.");
        }
      } catch (err) {
        alert("Eroare de rețea la anulare.");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20 bg-[#F8FAFC] min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ccff00]"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen bg-[#F8FAFC] relative">
      
      {isCancelling && <CancelTransition />}

      <div className="flex justify-between items-end mb-10">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Rezervările Mele</h1>
        <p className="text-[10px] font-black uppercase text-gray-400 italic mb-2 tracking-widest">
           Politică anulare: 4H
        </p>
      </div>
      
      <div className="space-y-6">
        {bookings.length > 0 ? bookings.map(b => {
          const allowable = canCancel(b.start_time);
          
          return (
            <div key={b.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden transition-all hover:shadow-lg">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#ccff00]"></div>
              
              <div>
                <h3 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter leading-none mb-1">
                  {b.club_name || "Club Padel"}
                </h3>
                <p className="text-gray-400 font-bold text-sm uppercase mb-4 tracking-widest">📍 {b.court_name}</p>
                <div className="flex gap-4">
                  <p className="font-black text-[10px] uppercase italic text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    📅 {new Date(b.start_time).toLocaleDateString('ro-RO')}
                  </p>
                  <p className="font-black text-[10px] uppercase italic text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    🕒 {new Date(b.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="bg-black text-[#ccff00] px-4 py-2 rounded-xl font-black text-[10px] italic shadow-md uppercase tracking-widest">
                  {b.duration_minutes} min
                </div>

                {allowable ? (
                  <button 
                    onClick={() => handleCancel(b.id, b.start_time)}
                    className="text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-50 px-4 py-2.5 rounded-2xl transition-all border border-transparent hover:border-red-100 active:scale-95"
                  >
                    ✕ Anulează
                  </button>
                ) : (
                  <span className="text-gray-300 font-black uppercase text-[9px] tracking-widest bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 flex items-center gap-1 cursor-not-allowed">
                    🔒 Blocat (&lt; 4h)
                  </span>
                )}
              </div>
            </div>
          );
        }) : (
          /* --- CALL TO ACTION PENTRU REZERVARE NOUĂ --- */
          <div className="text-center py-20 bg-white rounded-[3.5rem] border-2 border-dashed border-gray-100 shadow-inner flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl shadow-sm">🎾</div>
            <div>
              <p className="italic text-gray-400 font-black uppercase text-sm tracking-widest mb-1">
                Nu ai nicio rezervare activă
              </p>
              <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                Terenurile te așteaptă!
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="bg-[#ccff00] text-black font-black px-12 py-5 rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-[#ccff00]/30 italic uppercase text-sm tracking-tight border-2 border-black/5"
            >
              Căută teren acum
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;