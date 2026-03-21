import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ClubList from './components/ClubList'

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ClubList />
      </main>
      <footer className="text-center py-10 text-gray-500 border-t mt-16">
        © 2026 Padel Connect Hackathon MVP
      </footer>
    </div>
  )
}

export default App