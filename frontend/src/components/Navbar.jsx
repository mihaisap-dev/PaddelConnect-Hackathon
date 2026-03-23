import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const managerStatus = localStorage.getItem('is_manager') === 'true';
    
    if (token) {
      setIsLoggedIn(true);
      setIsManager(managerStatus);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_manager');
    setIsLoggedIn(false);
    setIsManager(false);
    setShowUserMenu(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
        
        {/* LOGO */}
        <Link to="/" className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 z-10">
          Padel<span className="text-[#2323FF]">.</span>Connect
        </Link>
        
        {/* LINK-URI CENTRATE */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-10 text-gray-700 font-bold uppercase text-[11px] tracking-[0.2em]">
          <Link to="/" className="hover:text-[#2323FF] transition-colors py-2">Acasă</Link>
          <Link to="/clubs" className="hover:text-[#2323FF] transition-colors py-2">Cluburi</Link>
          
          {/* TAB DASHBOARD */}
          {isLoggedIn && isManager && (
            <Link to="/dashboard" className="hover:text-[#2323FF] transition-colors py-2">
              Dashboard
            </Link>
          )}
        </div>

        {/* SECTIUNEA USER CU HOVER */}
        <div className="flex items-center space-x-4 z-10">
          {isLoggedIn ? (
            <div 
              className="relative py-2" 
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {/* ICONITA ROTUNDA */}
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                  isManager ? 'bg-[#2323FF]' : 'bg-black'
                } ${showUserMenu ? 'border-[#ccff00] scale-110' : 'border-transparent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </button>

              {/* DROPDOWN MENU */}
              {showUserMenu && (
                <div className="absolute right-0 mt-0 w-64 bg-white rounded-[2rem] shadow-2xl border border-blue-50 py-4 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right overflow-hidden">
                  <div className="px-6 py-2 border-b border-gray-50 mb-2">
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">
                      {isManager ? 'Meniu Manager' : 'Meniu Jucător'}
                    </p>
                  </div>

                  {/* DASHBOARD OPTION IN DROPDOWN */}
                  {isManager && (
                    <button 
                      onClick={() => { navigate('/dashboard'); setShowUserMenu(false); }}
                      className="w-full text-left px-6 py-3 text-[11px] font-black uppercase italic text-[#2323FF] hover:bg-blue-50 transition-all flex items-center gap-3"
                    >
                      <span className="text-lg">📊</span> Dashboard Control
                    </button>
                  )}

                  <button 
                    onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                    className="w-full text-left px-6 py-3 text-[11px] font-black uppercase italic text-gray-700 hover:bg-gray-50 hover:text-[#2323FF] transition-all flex items-center gap-3"
                  >
                    <span>👤</span> Profilul Meu
                  </button>

                  <button 
                    onClick={() => { navigate('/my-bookings'); setShowUserMenu(false); }}
                    className="w-full text-left px-6 py-3 text-[11px] font-black uppercase italic text-gray-700 hover:bg-gray-50 hover:text-[#2323FF] transition-all flex items-center gap-3"
                  >
                    <span>📅</span> Rezervări
                  </button>

                  {isManager && (
                    <button 
                      onClick={() => { navigate('/add-club'); setShowUserMenu(false); }}
                      className="w-full text-left px-6 py-3 text-[11px] font-black uppercase italic text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-3"
                    >
                      <span>➕</span> Adaugă Club Nou
                    </button>
                  )}
                  
                  <div className="h-[1px] bg-gray-50 my-2 mx-4"></div>

                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-3 text-[11px] font-black uppercase italic text-red-500 hover:bg-red-50 transition-all flex items-center gap-3"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="bg-black text-[#ccff00] px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl active:scale-95"
            >
              Intră în Cont
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;