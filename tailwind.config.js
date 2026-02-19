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
    },
  },
  plugins: [],
}
