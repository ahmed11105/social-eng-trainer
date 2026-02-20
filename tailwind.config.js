/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'twitter-blue': '#1DA1F2',
        'twitter-dark': '#15202B',
        'twitter-light': '#F7F9F9',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-out': {
          '0%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
        },
        'confetti': {
          '0%': {
            transform: 'translateY(0) rotateZ(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100vh) rotateZ(360deg)',
            opacity: '0',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.8',
          },
        },
        'float-up': {
          '0%': {
            transform: 'translateY(0) scale(0)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateY(-50px) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-100px) scale(0)',
            opacity: '0',
          },
        },
        'particle-burst': {
          '0%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(var(--tx), var(--ty)) scale(0)',
            opacity: '0',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'fade-out': 'fade-out 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'confetti': 'confetti linear infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'float-up': 'float-up 1.5s ease-out forwards',
        'particle-burst': 'particle-burst 1s ease-out forwards',
      },
    },
  },
  plugins: [],
}
