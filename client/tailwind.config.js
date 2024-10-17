/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Indigo for primary elements
        secondary: '#818cf8', // Light indigo for secondary elements
        background: '#f3f4f6', // Light gray background for the chat area
        accent: '#38bdf8', // Sky blue for accents like buttons or notifications
        dark: '#111827', // Dark color for text or headers
        light: '#ffffff', // White for card backgrounds and message bubbles
        success: '#10b981', // Green for success messages
        error: '#ef4444', // Red for error messages
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern sans-serif font
        mono: ['Fira Code', 'monospace'], // For code snippets or special formatting
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'chat-bubble': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
