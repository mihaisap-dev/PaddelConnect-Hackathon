import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingTransition from './LoadingTransition'; 

const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [courts, setCourts] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [openCourtId, setOpenCourtId] = useState(null);
  const [openDay, setOpenDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState({ court: null, hour: null });
  const [duration, setDuration] = useState(60);

  const getNextSevenDays = () => {
    const days = [];
    const numeZile = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        label: i === 0 ? "Azi" : numeZile[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        displayDate: d.toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }),
      });
    }
    return days;
  };
  const zileDisponibile = getNextSevenDays();

  const hours = [];
  for (let h = 9; h <= 23; h++) {
    const hh = h.toString().padStart(2, '0');
    hours.push(`${hh}:00`, `${hh}:30`);
  }
  hours.push("00:00", "00:30");

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch(`http://127.0.0.1:8000/api/clubs/${id}/`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/courts/`).then(res => res.json()),
      fetch(`http://127.0.0.1:8000/api/bookings/`, {
        headers: token ? { 'Authorization': `Token ${token}` } : {}
      }).then(res => res.ok ? res.json() : [])
    ]).then(([clubData, courtsData, bookingsData]) => {
      setClub(clubData);
      setCourts(courtsData.filter(c => String(c.club) === String(id)));
      setExistingBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setLoading(false);
    }).catch(err => console.error("Eroare la încărcare:", err));
  }, [id]);

  const handleOpenMap = () => {
    const query = encodeURIComponent(`${club.name} ${club.address} ${club.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const isSlotTaken = (courtId, hour, dateStr) => {
    if (!existingBookings.length) return false;
    return existingBookings.some(b => {
      if (String(b.court) !== String(courtId)) return false;
      const bStart = new Date(b.start_time);
      const bEnd = new Date(b.end_time);
      const [h, m] = hour.split(':');
      const slotTime = new Date(dateStr);
      slotTime.setHours(parseInt(h), parseInt(m), 0, 0);
      return slotTime >= bStart && slotTime < bEnd;
    });
  };

  const confirmBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) { alert("Te rugăm să te loghezi!"); navigate('/auth'); return; }

    setIsProcessing(true);
    setShowModal(false);

    const [h, m] = selectedSlot.hour.split(':');
    const finalDate = new Date(openDay.dateStr);
    finalDate.setHours(parseInt(h), parseInt(m), 0, 0);

    const bookingData = { court: selectedSlot.court.id, start_time: finalDate.toISOString(), duration_minutes: duration };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/bookings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) {
        setTimeout(() => { setIsProcessing(false); navigate('/my-bookings'); }, 2500);
      } else {
        const error = await response.json();
        setIsProcessing(false); setShowModal(true);
        alert(error.error || "Eroare la rezervare");
      }
    } catch (e) { setIsProcessing(false); setShowModal(true); alert("Eroare de conexiune!"); }
  };

  if (loading) return <div className="p-20 text-center font-black italic animate-pulse tracking-tighter text-4xl">SE ÎNCARCĂ...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {isProcessing && <LoadingTransition />}

      {/* HERO */}
      <div className="h-[45vh] w-full relative">
        <img src={club?.image_url} className="w-full h-full object-cover shadow-2xl" alt={club?.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-black/40"></div>
        <div className="absolute bottom-12 left-8 right-8 max-w-6xl mx-auto">
            <h1 className="text-7xl font-black italic uppercase text-gray-900 tracking-tighter drop-shadow-2xl leading-none">
              {club?.name}
            </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        {/* INFO & MAP */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center mb-10 gap-8 border border-gray-50">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black uppercase text-[#ccff00] tracking-[0.3em] bg-black px-4 py-2 rounded-full inline-block mb-2 shadow-lg">Locație Oficială</h3>
            <p className="text-2xl font-bold text-gray-800 tracking-tight italic">📍 {club?.address}, {club?.city}</p>
          </div>
          <button 
            onClick={handleOpenMap}
            className="w-full md:w-auto bg-gray-100 hover:bg-black hover:text-white p-6 rounded-[2rem] transition-all flex items-center justify-center gap-4 font-black uppercase text-xs tracking-widest shadow-sm"
          >
             Harta Google Maps
          </button>
        </div>

        {/* --- DESCRIERE TABELARA --- */}
        <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#ccff00]/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-[#ccff00] rounded-full"></div>
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-[0.3em] italic">Informații Club</h3>
          </div>
          
          <p className="text-gray-600 leading-relaxed font-semibold text-xl mb-10 italic px-2">
            "{club?.description || "Informațiile despre acest club vor fi actualizate în curând. Vă așteptăm la joc!"}"
          </p>

          <div className="flex flex-wrap gap-4 px-2">
            {['Indoor', 'Vestiare Moderne', 'Dușuri', 'Cafenea', 'Închiriere Rachete'].map((feature) => (
              <div key={feature} className="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
                <span className="text-[#ccff00] font-black">✓</span>
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REZERVARE */}
        <h2 className="text-3xl font-black italic uppercase mb-8 tracking-tighter flex items-center gap-4">
           Alege Terenul <span className="h-[2px] flex-grow bg-gray-200"></span>
        </h2>
        
        <div className="space-y-6">
          {courts.map((court) => (
            <div key={court.id} className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100 transition-all hover:border-[#ccff00]/30 hover:shadow-xl">
              <button 
                onClick={() => {setOpenCourtId(openCourtId === court.id ? null : court.id); setOpenDay(null);}}
                className="w-full p-10 flex items-center justify-between hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-6 text-3xl font-black italic uppercase tracking-tighter">
                  <span className={`text-[#ccff00] text-xl transition-transform duration-500 ${openCourtId === court.id ? 'rotate-90' : ''}`}>▶</span>
                  {court.name}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Preț/h</p>
                    <span className="text-black font-black text-2xl tracking-tighter uppercase">{court.price_per_hour} RON</span>
                </div>
              </button>

              {openCourtId === court.id && (
                <div className="px-10 pb-10 space-y-4 animate-in slide-in-from-top-4 duration-500">
                  {zileDisponibile.map((zi) => (
                    <div key={zi.dateStr} className="rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => setOpenDay(openDay?.dateStr === zi.dateStr ? null : zi)}
                        className={`w-full p-6 flex justify-between items-center transition-all ${openDay?.dateStr === zi.dateStr ? 'bg-black text-[#ccff00]' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
                      >
                        <span className="font-black uppercase italic text-xs tracking-[0.2em]">{zi.label} — {zi.displayDate}</span>
                        <span className={`text-[10px] transition-transform ${openDay?.dateStr === zi.dateStr ? 'rotate-90' : ''}`}>▶</span>
                      </button>

                      {openDay?.dateStr === zi.dateStr && (
                        <div className="p-8 grid grid-cols-3 sm:grid-cols-6 gap-3 bg-white">
                          {hours.map(hour => {
                            const taken = isSlotTaken(court.id, hour, zi.dateStr);
                            const isPastTime = () => {
                              const now = new Date();
                              const [h, m] = hour.split(':');
                              const slotDate = new Date(zi.dateStr);
                              slotDate.setHours(parseInt(h), parseInt(m), 0, 0);
                              return slotDate < now;
                            };
                            const isDisabled = taken || isPastTime();
                            return (
                              <button 
                                key={hour} 
                                disabled={isDisabled}
                                onClick={() => {setSelectedSlot({court, hour}); setShowModal(true);}}
                                className={`py-4 rounded-2xl font-black text-[10px] transition-all uppercase italic tracking-tighter ${
                                  isDisabled 
                                    ? 'bg-gray-100 text-gray-300 line-through opacity-50 cursor-not-allowed' 
                                    : 'bg-gray-50 hover:bg-[#ccff00] text-black border-2 border-transparent hover:border-black shadow-sm'
                                }`}
                              >
                                {hour}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[4rem] p-12 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border-4 border-white">
            <h2 className="text-4xl font-black italic uppercase mb-4 tracking-tighter">Confirmare</h2>
            <div className="bg-gray-50 p-6 rounded-[2.5rem] mb-10 border border-gray-100">
                <p className="text-black font-black text-sm uppercase tracking-widest leading-relaxed">
                  🎾 {selectedSlot.court?.name} <br/>
                  📅 {openDay?.label}, {openDay?.displayDate} <br/>
                  🕒 ORA {selectedSlot.hour}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-10">
              {[60, 90, 120].map(val => (
                <button key={val} onClick={() => setDuration(val)} className={`py-5 rounded-2xl font-black text-[10px] transition-all ${duration === val ? 'bg-[#ccff00] text-black shadow-xl scale-105' : 'bg-gray-100 text-gray-400 opacity-50'}`}>
                  {val === 60 ? '1H' : val === 90 ? '1.5H' : '2H'}
                </button>
              ))}
            </div>

            <button onClick={confirmBooking} className="w-full bg-black text-[#ccff00] py-6 rounded-3xl font-black uppercase italic text-lg shadow-2xl hover:bg-[#ccff00] hover:text-black transition-all active:scale-95 mb-4">
              Confirmă Rezervarea
            </button>
            <button onClick={() => setShowModal(false)} className="w-full font-black text-gray-300 text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors">Renunță</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubDetail;