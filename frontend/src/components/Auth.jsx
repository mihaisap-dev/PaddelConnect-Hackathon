import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isManagerSignup, setIsManagerSignup] = useState(false);
  const [username, setUsername] = useState(''); // Schimbat din email în username pt claritate
  const [email, setEmail] = useState('');       // <--- NOU: State pentru Email
  const [phone, setPhone] = useState('');       // <--- NOU: State pentru Telefon
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Stabilim endpoint-ul
    let endpoint = isLogin ? 'login/' : 'register-user/';
    if (!isLogin && isManagerSignup) {
      endpoint = 'register-manager/';
    }
    
    const url = `https://padel-hackathon.onrender.com/api/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username, 
          password: password,
          email: email,    // <--- TRIMITEM EMAIL
          phone: phone     // <--- TRIMITEM TELEFON
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          const tokenValue = data.token || data.key;
          localStorage.setItem('token', tokenValue);
          localStorage.setItem('is_manager', data.is_manager ? 'true' : 'false');
          window.location.href = "/"; 
        } else {
          // Dacă e înregistrare, îl trimitem la login
          setIsLogin(true);
          alert("Cont creat! Verifică email-ul pentru activare înainte de login.");
        }
      } else {
        setError(data.error || data.detail || "Date incorecte.");
      }
    } catch (err) {
      setError("Serverul nu răspunde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] px-4 py-12">
      <div className="bg-white max-w-md w-full rounded-[3rem] shadow-2xl p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#ccff00]"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
            {isLogin ? 'Login' : 'Cont Nou'}
          </h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest italic">
            {isLogin ? 'Intră în arena Padel.Connect' : 'Alătură-te comunității noastre'}
          </p>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] font-black uppercase mt-6 border border-red-100 italic">
              ⚠️ {error}
            </div>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* USERNAME - Apare și la login și la register */}
          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-[#ccff00] font-bold transition-all text-sm"
              placeholder="nume_utilizator"
            />
          </div>

          {/* CÂMPURI NOI: EMAIL ȘI TELEFON (DOAR LA ÎNREGISTRARE) */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Email Oficial</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-[#ccff00] font-bold transition-all text-sm"
                  placeholder="contact@email.com"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Telefon</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-[#ccff00] font-bold transition-all text-sm"
                  placeholder="07xx xxx xxx"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ml-1">Parolă</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-none bg-gray-50 focus:ring-2 focus:ring-[#ccff00] font-bold transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="flex items-center gap-3 p-4 bg-[#ccff00]/10 rounded-2xl border border-[#ccff00]/20 mt-2 cursor-pointer" 
                 onClick={() => setIsManagerSignup(!isManagerSignup)}>
              <input 
                type="checkbox" 
                checked={isManagerSignup}
                readOnly
                className="w-4 h-4 accent-black rounded"
              />
              <span className="text-[9px] font-black uppercase text-gray-700 tracking-tight italic">
                Vreau să înregistrez un club (Manager)
              </span>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-black text-[#ccff00] font-black italic uppercase text-lg py-5 rounded-2xl mt-6 hover:scale-[1.01] active:scale-[0.98] transition-all shadow-xl shadow-black/20 tracking-tighter"
          >
            {isLogin ? 'Intră în cont' : 'Creează Contul'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setIsManagerSignup(false);
            }} 
            className="text-gray-400 text-[9px] font-black uppercase tracking-widest hover:text-black transition-colors italic"
          >
            {isLogin ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Loghează-te'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;