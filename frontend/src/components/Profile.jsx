import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Verificăm dacă URL-ul este cel din urls.py (fără / la final sau cu /, depinde de Django)
    fetch('https://padel-hackathon.onrender.com/api/auth/user/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
    .then(res => {
      if (!res.ok) throw new Error(`Serverul a răspuns cu status: ${res.status}`);
      return res.json();
    })
    .then(data => setUser(data))
    .catch(err => setError(err.message));
  }, []);

  if (error) return <div className="p-20 text-red-500 font-bold">EROARE: {error} (Verifică dacă serverul Django e pornit)</div>;
  if (!user) return <div className="p-20 font-bold">Se încarcă datele din Admin...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-10 bg-black text-white rounded-[3rem] shadow-2xl border-4 border-[#ccff00]">
      <h1 className="text-3xl font-black italic uppercase mb-6 text-[#ccff00]">Profil Jucător</h1>
      <div className="space-y-4 font-bold uppercase italic tracking-tighter">
        <p className="border-b border-gray-800 pb-2">👤 Username: {user.username}</p>
        <p className="border-b border-gray-800 pb-2">📧 Email: {user.profile_email || user.email}</p>
        <p className="border-b border-gray-800 pb-2">📞 Telefon: {user.phone || "Nespecificat"}</p>
        <div className="bg-[#ccff00] text-black p-4 rounded-2xl mt-4">
           <p className="text-xs font-black">LOYALTY POINTS</p>
           <p className="text-5xl font-black">{user.loyalty_points}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;