import React, { useState, useEffect } from 'react';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Trimitem Token-ul în Header ca Django să știe CINE cere datele
    fetch('http://127.0.0.1:8000/api/bookings/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Eroare la încărcarea rezervărilor:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-20 italic text-gray-400">Se încarcă rezervările tale...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-black mb-8 italic">REZERVĂRILE MELE</h1>
      
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white border-l-8 border-[#ccff00] rounded-2xl p-6 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{booking.court_name || "Teren Padel"}</h3>
                <p className="text-gray-500 font-medium">{booking.date} | {booking.time_slot}</p>
              </div>
              <div className="text-right">
                <span className="bg-gray-100 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Confirmat
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
            <p className="text-lg">Nu ai nicio rezervare activă momentan.</p>
            <button 
              onClick={() => window.location.href='/'}
              className="mt-4 text-black font-bold underline hover:text-[#ccff00]"
            >
              Rezervă primul tău teren acum
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;