module.exports = {
  content: ["./index.html", "./script.js"],
  theme: {
    extend: {
      animation: {
        'pulse-glow': 'pulse-glow 1.5s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
