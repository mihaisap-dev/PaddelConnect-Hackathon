import React, { useState } from 'react';
import padelBgImage from '../assets/padel.jpg';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(''); // Folosit ca username în Django
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // ATENȚIE: Folosim 'register/' pentru că așa am pus în api/urls.py
    const endpoint = isLogin ? 'login/' : 'register/';
    const url = `http://127.0.0.1:8000/api/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: email, 
          password: password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Luăm token-ul (Django poate trimite 'token' sau 'key')
        const tokenValue = data.token || data.key;
        
        if (tokenValue) {
          localStorage.setItem('token', tokenValue);
          window.location.href = "/"; // Logare reușită -> Home
        } else if (!isLogin) {
          // Dacă register-ul nu dă token direct (depinde de setup), îl punem să se logheze
          setIsLogin(true);
          alert("Cont creat cu succes! Te poți loga acum.");
        }
      } else {
        // Afișăm eroarea specifică de la Django (ex: "User deja existent")
        setError(data.error || data.detail || "Date incorecte. Încearcă din nou.");
      }
    } catch (err) {
      console.error(err);
      setError("Serverul nu răspunde. Verifică dacă Django e pornit.");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${padelBgImage})` }}
    >
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#ccff00]"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {isLogin ? 'Bine ai revenit' : 'Creează cont nou'}
          </h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold mt-4">
              {error}
            </div>
          )}
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Username</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-all bg-gray-50"
              placeholder="Ex: mihai_padel"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Parolă</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-all bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold text-lg py-4 rounded-full mt-6 hover:bg-[#ccff00] hover:text-black transition-all shadow-lg"
          >
            {isLogin ? 'Intră în cont' : 'Înregistrează-te'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
            }} 
            className="text-gray-600 text-sm font-medium hover:text-black"
          >
            {isLogin ? 'Nu ai cont? Înregistrează-te aici' : 'Ai deja cont? Loghează-te'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;