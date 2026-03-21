import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Verificăm dacă userul are un token salvat
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []); // Se execută când se încarcă Navbar-ul

  // Funcția de Logout (Ștergem token-ul și reîncărcăm)
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/'); // Îl trimitem pe prima pagină
    window.location.reload(); // Refresh rapid ca să se actualizeze toată starea aplicației
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        <Link to="/" className="text-3xl font-bold text-sport-dark">
          Padel<span className="text-sport-neon">.</span>Connect
        </Link>
        
        <div className="space-x-8 text-gray-700 font-medium hidden md:block">
          <Link to="/" className="hover:text-sport-neon transition-colors">Acasă</Link>
          <a href="#" className="hover:text-sport-neon transition-colors">Cluburi</a>
          
          {/* LOGICA CONDITIOANLĂ: Afișăm Rezervări DOAR dacă e logat */}
          {isLoggedIn && (
            <Link to="/my-bookings" className="text-sport-dark font-bold border-b-2 border-sport-neon">
              Rezervările Mele
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            // Dacă e LOGAT: Arătăm buton de Logout sau Profil
            <button 
              onClick={handleLogout}
              className="bg-gray-100 text-sport-dark px-6 py-2.5 rounded-full font-semibold hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Ieșire
            </button>
          ) : (
            // Dacă e DELOGAT: Arătăm butonul de Login
            <Link 
              to="/auth" 
              className="bg-sport-dark text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all shadow-md"
            >
              Intră în Cont
            </Link>
          )}
        </div>
        
      </div>
    </nav>
  )
}

export default Navbar