/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#171717', // Neutral 900
                secondary: '#525252', // Neutral 600
                background: '#ffffff', // White
                surface: '#fafafa', // Neutral 50
                border: '#e5e5e5', // Neutral 200
            }
        }
    },
    plugins: [],
}
