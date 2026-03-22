import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. Definim funcția de fetch
  const fetchDashboard = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError("Nu ești logat.");
      setLoading(false);
      navigate('/auth');
      return;
    }

    try {
      // În ManagerDashboard.jsx, schimbă URL-ul de fetch:
        const res = await fetch('https://padel-hackathon.onrender.com/api/clubs/dashboard/', { // <--- Port 8000 și / la final!
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
    },
});

      const data = await res.json();
      console.log("DATE REZERVĂRI:", data);

      if (res.ok) {
        setDashboardData(data);
        setError('');
      } else {
        setError(data.error || data.detail || "Eroare de acces.");
      }
    } catch (err) {
      console.error("EROARE FETCH:", err);
      setError("Eroare de conexiune cu serverul.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // 2. !!! ACESTA ESTE MOTORUL CARE LIPSEA: Apelăm funcția la încărcare !!!
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard, refreshKey]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Ești sigur că vrei să anulezi această rezervare?")) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://padel-hackathon.onrender.com/api/bookings/${bookingId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
      });

      if (res.ok) {
        alert("Rezervare anulată!");
        setRefreshKey(old => old + 1); 
      } else {
        const data = await res.json();
        alert(data.error || "Eroare la anulare.");
      }
    } catch (err) {
      alert("Eroare de rețea.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8faff] flex items-center justify-center font-black italic text-[#2323FF] uppercase tracking-widest">
      <div className="animate-bounce">Se încarcă Arena Managerului...</div>
    </div>
  );

  const stats = dashboardData?.stats || { count_today: 0, revenue_today: 0 };
  const bookings = dashboardData?.today_bookings || [];
  const username = localStorage.getItem('username') || 'Manager';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200/40 blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12 flex justify-between items-start">
          <div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
              Salut, <span className="text-[#2323FF]">{username}</span>
            </h1>
            <p className="text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
              Control Panel • {new Date().toLocaleDateString('ro-RO')}
            </p>
          </div>
          <button 
            onClick={() => setRefreshKey(old => old + 1)}
            className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm hover:bg-blue-50 transition-all text-sm"
          >
            🔄 Refresh
          </button>
        </header>

        {error && (
          <div className="bg-red-500 text-white p-6 rounded-[2rem] mb-12 font-black uppercase italic shadow-xl">
            ⚠️ {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 shadow-2xl border border-blue-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Rezervări Înregistrate</p>
            <h2 className="text-7xl font-black italic text-gray-900">{stats.count_today}</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-10 shadow-2xl border border-blue-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Venit Total</p>
            <h2 className="text-7xl font-black italic text-[#2323FF]">{stats.revenue_today} <span className="text-xl not-italic">RON</span></h2>
          </div>
        </div>

        <div className="bg-black rounded-[3.5rem] p-8 md:p-12 shadow-2xl text-white">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ccff00] mb-10 border-b border-white/10 pb-6">
            Lista Rezervări
          </h3>
          
          <div className="space-y-4">
            {bookings.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[2rem]">
                   <p className="italic opacity-30 font-black uppercase tracking-widest text-xs">Nicio rezervare găsită</p>
                </div>
            ) : bookings.map((b) => (
              <div key={b.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col md:flex-row justify-between items-center group hover:bg-white/10 transition-all">
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-black italic uppercase text-[#ccff00] tracking-tighter">{b.court_name}</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mt-1">Client: {b.user_name}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 my-4 md:my-0">
                  <div className="bg-white/10 px-5 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-tighter">🕒 {b.start_time_display}</div>
                  <div className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase italic font-black">{b.price} RON</div>
                </div>

                <button 
                  onClick={() => handleCancelBooking(b.id)}
                  className="bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all"
                >
                  Anulează
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;