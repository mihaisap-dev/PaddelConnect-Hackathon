import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-3xl font-bold text-sport-dark">
          Padel<span className="text-sport-neon">.</span>Connect
        </div>
        <div className="space-x-8 text-gray-700 font-medium hidden md:block">
          <a href="#" className="hover:text-sport-neon">Acasă</a>
          <a href="#" className="hover:text-sport-neon">Rezervări</a>
          <a href="#" className="hover:text-sport-neon">Cluburi</a>
        </div>
        <a href="#" className="bg-sport-dark text-white px-6 py-2.5 rounded-full font-semibold hover:bg-gray-800 transition-all">
          Intră în Cont
        </a>
      </div>
    </nav>
  )
}
export default Navbar