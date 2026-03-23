import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ClubList from './components/ClubList'
import Auth from './components/Auth'
import MyBookings from './components/MyBookings';
import ClubDetail from './components/ClubDetail';
import AddClub from './components/AddClub'; 
import ClubTable from './components/ClubTable';
import Profile from './components/Profile';
import ManagerDashboard from './components/ManagerDashboard';
const HomePage = () => {
  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ClubList />
      </main>
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans">
        {/* Navbar-ul ramane mereu sus, pe orice pagina */}
        <Navbar />
        
        {/* Aici se schimba continutul in functie de link */}
        <Routes>
          {/* Calea implicita (Acasa) */}
          <Route path="/" element={<HomePage />} />
          
          {/* Calea pentru Login / Register */}
          <Route path="/auth" element={<Auth />} />

          {/* Calea pentru Rezervarile Mele (doar daca e logat) */}
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Calea pentru Detaliile Clubului */}
          <Route path="/club/:id" element={<ClubDetail />} />

          {/* Calea pentru manageri */}
          <Route path="/add-club" element={<AddClub />} />

          {/* Calea pentru vizualizarea tabelara a cluburilor */}
          <Route path="/clubs" element={<ClubTable />} />
          
          <Route path="/profile" element={<Profile />} />

          <Route path="/dashboard" element={<ManagerDashboard />} />
        </Routes>
        
        {/* Footer-ul */}
        <footer className="text-center py-10 text-gray-500 border-t mt-16">
          © 2026 Padel Connect Hackathon MVP
        </footer>
      </div>
    </Router>
  )
}

export default App