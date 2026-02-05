/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#0f172a', // Slate 900
                'secondary': '#1e293b', // Slate 800 (Cards)
                'accent-cyan': '#22d3ee', // Cyan 400
                'accent-green': '#34d399', // Emerald 400
                'accent-pink': '#f472b6', // Pink 400
                'text-main': '#f8fafc', // Slate 50
                'text-muted': '#94a3b8', // Slate 400
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(34, 211, 238, 0.15)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
