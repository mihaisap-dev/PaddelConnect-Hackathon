import React from 'react'

const ClubList = () => {
  const dummyClubs = [
    { id: 1, name: "Padel Arena Ploiești", address: "Strada Sportului 10", rating: 4.8 },
    { id: 2, name: "Premium Padel Club", address: "Bulevardul Republicii 15", rating: 4.5 },
    { id: 3, name: "Padel Zone", address: "Strada Victoriei 2", rating: 4.9 },
  ];

  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-extrabold text-sport-dark tracking-tight">
        Cluburi Recomandate în <span className="text-sport-neon bg-sport-dark px-2 rounded">București</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {dummyClubs.map(club => (
          <div key={club.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
            <h3 className="text-2xl font-bold text-sport-dark group-hover:text-sport-neon transition-colors">
              {club.name}
            </h3>
            <p className="text-gray-600 mt-2 mb-4 h-12 overflow-hidden text-sm">{club.address}</p>
            <div className="flex items-center text-yellow-500 font-bold mb-5">
              ⭐ {club.rating.toFixed(1)} / 5.0
            </div>
            <button className="w-full bg-sport-dark text-white py-3 rounded-full font-semibold group-hover:bg-sport-neon group-hover:text-sport-dark transition-all">
              Vezi Terenuri
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ClubList