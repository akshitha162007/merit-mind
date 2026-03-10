export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0B1E',
        'bg-secondary': '#13102B',
        'bg-card': '#1A1535',
        'accent-pink': '#E91E8C',
        'accent-purple': '#7B2FFF',
        'accent-cyan': '#00D4FF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B8A9D9'
      },
      fontFamily: {
        'syne': ['Syne', 'sans-serif'],
        'dm': ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
