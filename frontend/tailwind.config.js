/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- CULORILE TALE SPORTIVE ---
      colors: {
        'sport-neon': '#D4F01C', 
        'sport-dark': '#0A0A0A',
        'sport-gray': '#1F1F1F',
      },

      // --- LOGICA PENTRU TOATE ANIMAȚIILE (REZERVĂRI + ANULĂRI) ---
      keyframes: {
        // 1. Animații REZERVARE (Paleta lovește mingea)
        'paddle-swing': {
          '0%': { transform: 'rotate(45deg) translateX(-100px)' },
          '30%': { transform: 'rotate(0deg) translateX(0px)' },
          '100%': { transform: 'rotate(-45deg) translateX(100px)', opacity: '0' },
        },
        'ball-bounce': {
          '0%': { transform: 'translateX(200px) translateY(100px)', opacity: '0' },
          '30%': { transform: 'translateX(0px) translateY(0px)', opacity: '1' },
          '60%': { transform: 'translateX(-150px) translateY(-200px)', opacity: '1' },
          '100%': { transform: 'translateX(-300px) translateY(-400px)', opacity: '0' },
        },

        // 2. Animații ANULARE (Paleta tristă + Lacrima neon)
        'paddle-sad': {
          '0%, 100%': { transform: 'rotate(-3deg) translateY(0px)' },
          '50%': { transform: 'rotate(3deg) translateY(5px)' },
        },
        'ball-leave': {
          '0%': { transform: 'scale(1) translateX(0px) translateY(0px)', opacity: '0.8' },
          '100%': { transform: 'scale(0.2) translateX(300px) translateY(-100px)', opacity: '0' },
        },
        'tear-drop': {
          '0%': { transform: 'translateY(0px) scale(1) rotate(45deg)', opacity: '1' },
          '80%': { transform: 'translateY(60px) scale(1.2) rotate(45deg)', opacity: '1' },
          '100%': { transform: 'translateY(80px) scale(0) rotate(45deg)', opacity: '0' },
        },
      },

      animation: {
        // Animări Rezervare
        'paddle-swing': 'paddle-swing 1.5s ease-out infinite',
        'ball-bounce': 'ball-bounce 1.5s ease-out infinite',
        
        // Animări Anulare
        'paddle-sad': 'paddle-sad 3s ease-in-out infinite',
        'ball-leave': 'ball-leave 2.5s ease-in-out infinite',
        'tear-drop': 'tear-drop 2s ease-in infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), 
  ],
}